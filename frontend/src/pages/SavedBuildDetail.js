import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { buildService, componentService, forecastService } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const SavedBuildDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [build, setBuild] = useState(null);
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [computedWattage, setComputedWattage] = useState(0);
  const [psuCapacity, setPsuCapacity] = useState(0);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState('Custom');
  const [editDescription, setEditDescription] = useState('');
  const [aiPrediction, setAiPrediction] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [computedPrice, setComputedPrice] = useState(0);

  useEffect(() => {
    const fetchBuild = async () => {
      try {
        setLoading(true);
        const data = await buildService.getBuildById(id);
        setBuild(data);
        setEditName(data.name || '');
        setEditCategory(data.category || 'Custom');
        setEditDescription(data.description || '');
        setLoading(false);
      } catch (err) {
        console.error('Failed to load build', err);
        setError('Failed to load build. Please try again later.');
        setLoading(false);
      }
    };
    fetchBuild();
  }, [id]);

  // Enable edit mode if deep-linked with ?edit=1
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const shouldEdit = params.get('edit') === '1';
    if (shouldEdit) setEditing(true);
  }, [location.search]);

  useEffect(() => {
    const fetchComponents = async () => {
      if (!build || !build.componentIds) return;
      try {
        const entries = Object.entries(build.componentIds);
        const fetches = entries.map(async ([type, compId]) => {
          try {
            const comp = await componentService.getComponentById(compId);
            return { type, ...comp };
          } catch {
            return { type, id: compId, name: `Component #${compId}`, price: 0, wattage: 0 };
          }
        });
        const details = await Promise.all(fetches);
        setComponents(details);
        // Compute wattage excluding PSU
        let wattageTotal = 0;
        let psuW = 0;
        let priceTotal = 0;
        details.forEach((c) => {
          if (c.type === 'PSU') {
            psuW = parseInt(c.wattage || 0, 10);
          } else {
            const w = parseInt(c.wattage || 0, 10);
            wattageTotal += isNaN(w) ? 0 : w;
          }
          const p = parseFloat(c.price || 0);
          priceTotal += isNaN(p) ? 0 : p;
        });
        setComputedWattage(wattageTotal);
        setPsuCapacity(isNaN(psuW) ? 0 : psuW);
        setComputedPrice(priceTotal);
      } catch (err) {
        console.error('Failed to fetch component details', err);
      }
    };
    fetchComponents();
  }, [build]);

  useEffect(() => {
    const runForecast = async () => {
      if (!components || components.length === 0) return;
      try {
        setAiLoading(true);
        setAiError(null);

        const findByType = (t) => components.find((c) => c.type === t);
        const cpu = findByType('CPU');
        const gpu = findByType('GPU');
        const ram = findByType('RAM');
        const storage = findByType('Storage');

        const parseRamGb = (val) => {
          if (!val) return 16;
          const m = String(val).match(/(\d+)(TB|GB)?/i);
          if (m) {
            const num = parseInt(m[1], 10);
            const unit = (m[2] || 'GB').toUpperCase();
            return unit === 'TB' ? num * 1024 : num;
          }
          return 16;
        };

        const parseStorageGb = (val) => {
          if (!val) return 512;
          const m = String(val).match(/(\d+)(TB|GB)/i);
          if (m) {
            const num = parseInt(m[1], 10);
            const unit = m[2].toUpperCase();
            return unit === 'TB' ? num * 1024 : num;
          }
          return 512;
        };

        const parseCpuClockGhz = (specs) => {
          if (!specs) return 4.2;
          const m = String(specs).match(/([0-9]+(?:\.[0-9]+)?)\s*GHz/i);
          return m ? parseFloat(m[1]) : 4.2;
        };

        const parseGpuVramGb = (memory) => {
          if (!memory) return 8;
          const m = String(memory).match(/(\d+)\s*GB/i);
          return m ? parseInt(m[1], 10) : 8;
        };

        const parseRamSpeedMhz = (speed) => {
          if (!speed) return 3200;
          // Accept formats like "DDR5-5200" or "3200 MHz"
          const m = String(speed).match(/(\d{3,5})\s*(MHz)?/i);
          return m ? parseInt(m[1], 10) : 3200;
        };

        const inferStorageType = (iface, name) => {
          const s = (iface || name || '').toUpperCase();
          if (s.includes('NVME') || s.includes('PCIe')) return 'NVMe';
          if (s.includes('SATA')) return 'SSD';
          if (s.includes('HDD')) return 'HDD';
          return 'Unknown';
        };

        const request = {
          cpu_model: cpu?.model || cpu?.name || 'Unknown CPU',
          cpu_boost_clock_ghz: parseCpuClockGhz(cpu?.details?.specs || cpu?.details?.clockSpeed),
          gpu_model: gpu?.model || gpu?.name || 'Unknown GPU',
          gpu_vram_gb: parseGpuVramGb(gpu?.details?.memory),
          ram_size_gb: parseRamGb(ram?.details?.capacity),
          ram_speed_mhz: parseRamSpeedMhz(ram?.details?.speed),
          storage_type: inferStorageType(storage?.details?.interface, storage?.name),
        };

        const prediction = await forecastService.predict(request);
        setAiPrediction(prediction);
      } catch (err) {
        console.error('AI prediction failed', err);
        setAiError('Failed to fetch AI prediction');
      } finally {
        setAiLoading(false);
      }
    };
    runForecast();
  }, [components]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-xl">Loading build...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!build) {
    return null;
  }

  const requiredHeadroom = Math.ceil(computedWattage * 1.2);
  const psuOk = psuCapacity >= requiredHeadroom;

  const computeCompatibility = () => {
    const findByType = (t) => components.find((c) => c.type === t);
    const cpu = findByType('CPU');
    const mobo = findByType('Motherboard');
    const ram = findByType('RAM');
    const pcCase = findByType('Case');

    const rules = [];
    const cpuSocket = cpu?.details?.socket || cpu?.details?.Socket;
    const moboSocket = mobo?.details?.socket || mobo?.details?.Socket;
    if (cpu && mobo) {
      const ok = cpuSocket && moboSocket && cpuSocket === moboSocket;
      rules.push({ label: 'CPU ↔ Motherboard socket', ok, detail: ok ? `${cpuSocket}` : `CPU ${cpuSocket || '?'} vs MB ${moboSocket || '?'}` });
    }

    const moboMemType = mobo?.details?.memoryType || mobo?.details?.MemoryType;
    let ramType;
    if (ram?.details?.speed) {
      const speed = ram.details.speed.toUpperCase();
      ramType = speed.includes('DDR5') ? 'DDR5' : speed.includes('DDR4') ? 'DDR4' : undefined;
    }
    if (ram && mobo) {
      const ok = moboMemType && ramType && moboMemType.toUpperCase() === ramType;
      rules.push({ label: 'RAM ↔ Motherboard memory', ok, detail: ok ? `${ramType}` : `RAM ${ramType || '?'} vs MB ${moboMemType || '?'}` });
    }

    const moboForm = mobo?.details?.formFactor || mobo?.details?.FormFactor;
    const caseCompat = pcCase?.details?.compatibility || pcCase?.details?.Compatibility;
    if (pcCase && mobo) {
      const ok = moboForm && caseCompat && caseCompat.toUpperCase().includes(moboForm.toUpperCase());
      rules.push({ label: 'Case supports motherboard form factor', ok, detail: ok ? `${moboForm}` : `Case: ${caseCompat || '?'}; MB: ${moboForm || '?'}` });
    }

    rules.push({ label: 'PSU has 20% headroom', ok: psuOk, detail: `${psuCapacity}W vs need ${requiredHeadroom}W` });

    return rules;
  };
  const compatibility = computeCompatibility();

  const handleSaveEdit = async () => {
    try {
      const payload = {
        name: editName.trim() || build.name,
        category: editCategory || build.category,
        description: editDescription || build.description,
      };
      const updated = await buildService.updateBuild(build.id, payload);
      setBuild((prev) => ({ ...prev, ...updated }));
      setEditing(false);
    } catch (err) {
      console.error('Failed to update build', err);
      alert('Failed to save changes.');
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm('Delete this saved build? This cannot be undone.');
    if (!ok) return;
    try {
      await buildService.deleteBuild(build.id);
      navigate('/saved-builds');
    } catch (err) {
      console.error('Failed to delete build', err);
      alert('Failed to delete build.');
    }
  };

  const handleDuplicate = () => {
    const selectedComponents = {};
    components.forEach((c) => {
      selectedComponents[c.type] = c;
    });
    navigate('/builder', {
      state: {
        duplicate: {
          selectedComponents,
          name: build.name || '',
          category: build.category || 'Custom',
        },
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{build.name || 'Saved Build'}</h1>
        <div className="flex gap-2">
          <Link
            to="/saved-builds"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
          >
            Back
          </Link>
          <Button variant="outline" onClick={() => setEditing((e) => !e)}>
            {editing ? 'Cancel Edit' : 'Edit'}
          </Button>
          <Button variant="default" onClick={handleDuplicate}>Duplicate to Builder</Button>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg shadow-lg p-6 border">
            <h2 className="text-2xl font-bold mb-4">Components</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {components.map((c) => (
                <div key={`${c.type}-${c.id}`} className="border border-primary/10 rounded-lg p-4 bg-dark-card/60 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
                  <div className="flex justify-between">
                    <span className="font-medium text-white">{c.type}</span>
                    {c.wattage !== undefined && <span className="text-xs text-gray-400">{c.wattage}W</span>}
                  </div>
                  <div className="mt-1 text-gray-400">{c.brand} {c.name}</div>
                  {(c.model || c.speed || c.description) && (
                    <div className="mt-1 text-xs text-gray-400">
                      {c.model && <span>Model: {c.model} </span>}
                      {c.speed && <span>• Speed: {c.speed}</span>}
                      {c.description && <div className="mt-1">{c.description}</div>}
                    </div>
                  )}
                  <div className="mt-2 font-bold text-primary">${c.price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg shadow-lg p-6 border">
            <h2 className="text-2xl font-bold mb-4">Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Category:</span>
                <span>{build.category || 'Custom'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Saved Price:</span>
                <span>${build.totalPrice?.toFixed ? build.totalPrice.toFixed(2) : Number(build.totalPrice || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Computed Price:</span>
                <span>${computedPrice.toFixed(2)}</span>
              </div>
              {build.totalWattage !== undefined && (
                <div className="flex justify-between">
                  <span className="font-medium">Saved Wattage:</span>
                  <span>{build.totalWattage}W</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-medium">Computed Wattage:</span>
                <span>{computedWattage}W</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">PSU Capacity:</span>
                <span>{psuCapacity}W</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Headroom (20%):</span>
                <span>{requiredHeadroom}W required</span>
              </div>
              <div className={`mt-2 p-2 rounded text-sm ${psuOk ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-red-100 text-red-700 border border-red-300'}`}>
                {psuOk ? 'PSU is sufficient for this build.' : 'PSU may be insufficient. Consider a higher wattage PSU.'}
              </div>
              {build.createdAt && (
                <div className="text-xs text-muted-foreground mt-2">Created: {new Date(build.createdAt).toLocaleString()}</div>
              )}
            </div>

            <div className="mt-6 border-t pt-4">
              <h3 className="text-xl font-semibold mb-2">AI Predicted Performance</h3>
              {aiLoading && <div className="text-sm text-muted-foreground">Fetching prediction...</div>}
              {aiError && <div className="text-sm text-red-600">{aiError}</div>}
              {aiPrediction && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Predicted FPS:</span><span>{aiPrediction.predicted_fps?.toFixed ? aiPrediction.predicted_fps.toFixed(1) : aiPrediction.predicted_fps}</span></div>
                  <div className="flex justify-between"><span>Benchmark Score:</span><span>{aiPrediction.benchmark_score?.toFixed ? aiPrediction.benchmark_score.toFixed(0) : aiPrediction.benchmark_score}</span></div>
                  <div className="flex justify-between"><span>Performance Rating:</span><span>{aiPrediction.performance_rating}</span></div>
                </div>
              )}
            </div>

            {editing && (
              <div className="mt-6 border-t pt-4">
                <h3 className="text-xl font-semibold mb-2">Edit Build</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-muted-foreground">Name</label>
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Build name" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Category</label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                    >
                      <option value="Custom">Custom</option>
                      <option value="Gaming">Gaming</option>
                      <option value="Office">Office</option>
                      <option value="Workstation">Workstation</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Description</label>
                    <Input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} placeholder="Optional description" />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveEdit}>Save</Button>
                    <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 lg:mt-12 lg:col-span-2">
        <div className="bg-card rounded-lg shadow-lg p-6 border">
          <h2 className="text-2xl font-bold mb-4">Compatibility Checks</h2>
          <div className="space-y-3">
            {compatibility.map((rule, idx) => (
              <div
                key={idx}
                className={`p-3 rounded border text-sm ${
                  rule.ok
                    ? 'bg-green-900/20 border-green-500/30 text-green-300'
                    : 'bg-red-900/20 border-red-500/30 text-red-300'
                }`}
              >
                <div className="font-medium">{rule.label}</div>
                <div className="text-xs">{rule.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavedBuildDetail;