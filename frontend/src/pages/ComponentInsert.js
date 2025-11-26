import React, { useState } from 'react';
import { componentService } from '../services/api';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const ComponentInsert = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('CPU');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [wattage, setWattage] = useState('');
  const [model, setModel] = useState('');
  const [speed, setSpeed] = useState('');
  const [description, setDescription] = useState('');

  // Predefined details keys commonly used across component types
  const [details, setDetails] = useState({
    socket: '',
    memoryType: '',
    formFactor: '',
    compatibility: '',
    specs: '',
    cache: '',
    speed: '',
    certification: '',
    modularity: '',
    interface: '',
    capacity: '',
  });

  const [extraDetails, setExtraDetails] = useState([{ key: '', value: '' }]);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleDetailChange = (key, value) => {
    setDetails((prev) => ({ ...prev, [key]: value }));
  };

  const handleExtraDetailChange = (index, field, value) => {
    setExtraDetails((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)));
  };

  const addExtraDetailRow = () => {
    setExtraDetails((prev) => [...prev, { key: '', value: '' }]);
  };

  const removeExtraDetailRow = (index) => {
    setExtraDetails((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setName('');
    setType('CPU');
    setBrand('');
    setPrice('');
    setImageUrl('');
    setWattage('');
    setModel('');
    setSpeed('');
    setDescription('');
    setDetails({
      socket: '',
      memoryType: '',
      formFactor: '',
      compatibility: '',
      specs: '',
      cache: '',
      speed: '',
      certification: '',
      modularity: '',
      interface: '',
      capacity: '',
    });
    setExtraDetails([{ key: '', value: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');
    setErrorMsg('');

    // Build details map, including only non-empty values
    const detailsMap = {};
    Object.entries(details).forEach(([k, v]) => {
      if (v != null && String(v).trim() !== '') {
        detailsMap[k] = String(v).trim();
      }
    });
    extraDetails.forEach(({ key, value }) => {
      const kk = String(key || '').trim();
      const vv = String(value || '').trim();
      if (kk) detailsMap[kk] = vv;
    });

    // Compose payload for backend
    const payload = {
      name: String(name).trim(),
      type: String(type).trim(),
      brand: String(brand).trim(),
      price: price !== '' ? Number(price) : null,
      imageUrl: String(imageUrl).trim(),
      wattage: wattage !== '' ? parseInt(wattage, 10) : null,
      model: String(model).trim() || null,
      speed: speed !== '' ? parseInt(speed, 10) : null,
      description: String(description).trim() || null,
      details: detailsMap,
    };

    if (!payload.name || !payload.type) {
      setSubmitting(false);
      setErrorMsg('Name and Type are required.');
      return;
    }

    try {
      const created = await componentService.saveComponent(payload);
      setSuccessMsg(`Component created successfully (ID: ${created?.id ?? 'unknown'})`);
      resetForm();
    } catch (err) {
      console.error('Failed to insert component', err);
      setErrorMsg('Failed to insert component. Please check logs and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin: Insert Component</h1>
      <p className="text-muted-foreground mb-4">Use this form to insert a component and its details in one request. Access via URL only.</p>
      <Card className="p-6 border">
        {successMsg && (
          <div className="mb-4 p-3 rounded border border-green-500/30 text-green-300 bg-green-900/20">{successMsg}</div>
        )}
        {errorMsg && (
          <div className="mb-4 p-3 rounded border border-red-500/30 text-red-300 bg-red-900/20">{errorMsg}</div>
        )}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic fields */}
        <div>
          <label className="text-sm text-muted-foreground">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., AMD Ryzen 5 5600X" />
        </div>

          <div>
            <label className="text-sm text-muted-foreground">Type</label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option>CPU</option>
              <option>GPU</option>
              <option>RAM</option>
              <option>Storage</option>
              <option>Motherboard</option>
              <option>PSU</option>
              <option>Case</option>
            </select>
          </div>

        <div>
          <label className="text-sm text-muted-foreground">Brand</label>
          <Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g., AMD" />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Model</label>
          <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g., 5600X, RTX 3080" />
        </div>

          <div>
            <label className="text-sm text-muted-foreground">Price</label>
            <Input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g., 199.99" />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Image URL</label>
            <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
          </div>

        <div>
          <label className="text-sm text-muted-foreground">Wattage</label>
          <Input type="number" value={wattage} onChange={(e) => setWattage(e.target.value)} placeholder="e.g., 65" />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">Speed (numeric)</label>
          <Input type="number" value={speed} onChange={(e) => setSpeed(e.target.value)} placeholder="e.g., 3600 (RAM MHz)" />
        </div>

        <div className="md:col-span-2">
          <label className="text-sm text-muted-foreground">Description</label>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" />
        </div>

          {/* Details section */}
          <div className="md:col-span-2 mt-4">
            <h2 className="text-xl font-semibold mb-3">Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Socket</label>
                <Input value={details.socket} onChange={(e) => handleDetailChange('socket', e.target.value)} placeholder="e.g., AM4, LGA1700" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Memory Type</label>
                <Input value={details.memoryType} onChange={(e) => handleDetailChange('memoryType', e.target.value)} placeholder="e.g., DDR4, DDR5" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Form Factor</label>
                <Input value={details.formFactor} onChange={(e) => handleDetailChange('formFactor', e.target.value)} placeholder="e.g., ATX, Micro-ATX" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Compatibility</label>
                <Input value={details.compatibility} onChange={(e) => handleDetailChange('compatibility', e.target.value)} placeholder="e.g., ATX, Micro-ATX, Mini-ITX" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Specs</label>
                <Input value={details.specs} onChange={(e) => handleDetailChange('specs', e.target.value)} placeholder="e.g., 6 cores, 4.6GHz" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Cache</label>
                <Input value={details.cache} onChange={(e) => handleDetailChange('cache', e.target.value)} placeholder="e.g., 32MB" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Speed</label>
                <Input value={details.speed} onChange={(e) => handleDetailChange('speed', e.target.value)} placeholder="e.g., DDR4-3200, DDR5-5200" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Certification</label>
                <Input value={details.certification} onChange={(e) => handleDetailChange('certification', e.target.value)} placeholder="e.g., 80+ Gold" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Modularity</label>
                <Input value={details.modularity} onChange={(e) => handleDetailChange('modularity', e.target.value)} placeholder="e.g., Fully Modular" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Interface</label>
                <Input value={details.interface} onChange={(e) => handleDetailChange('interface', e.target.value)} placeholder="e.g., NVMe, SATA" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Capacity</label>
                <Input value={details.capacity} onChange={(e) => handleDetailChange('capacity', e.target.value)} placeholder="e.g., 1TB" />
              </div>
            </div>

            <h3 className="text-lg font-medium mt-6 mb-2">Custom Details</h3>
            <div className="space-y-3">
              {extraDetails.map((row, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                  <Input
                    placeholder="Key (e.g., TDP)"
                    value={row.key}
                    onChange={(e) => handleExtraDetailChange(idx, 'key', e.target.value)}
                  />
                  <Input
                    placeholder="Value (e.g., 65W)"
                    value={row.value}
                    onChange={(e) => handleExtraDetailChange(idx, 'value', e.target.value)}
                  />
                  <Button type="button" variant="outline" onClick={() => removeExtraDetailRow(idx)}>Remove</Button>
                </div>
              ))}
              <Button type="button" variant="secondary" onClick={addExtraDetailRow}>Add Detail</Button>
            </div>
          </div>

          <div className="md:col-span-2 flex gap-2 mt-6">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Insert Component'}
            </Button>
            <Button type="button" variant="outline" onClick={resetForm}>Reset</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ComponentInsert;