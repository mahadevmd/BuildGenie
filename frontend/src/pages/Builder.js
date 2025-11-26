import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { componentService, buildService } from '../services/api';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';

const componentImages = {
  CPU: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNwdSI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiB4PSI0IiB5PSI0IiByeD0iMiIvPjxyZWN0IHdpZHRoPSI2IiBoZWlnaHQ9IjYiIHg9IjkiIHk9IjkiIHJ4PSIxIi8+PHBhdGggZD0iTTkgMWg2Ii8+PHBhdGggZD0iTTkgMjN2LTMiLz48cGF0aCBkPSJNMTUgMjN2LTMiLz48cGF0aCBkPSJNMSA5djYiLz48cGF0aCBkPSJNMSAyM2gtMyIvPjwvc3ZnPg==',
  GPU: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWdwdSI+PHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjgiIHg9IjQiIHk9IjgiIHJ4PSIyIi8+PHBhdGggZD0iTTggMTZ2M2gtNiIvPjxwYXRoIGQ9Im0xNiAxNi41IDEuNS0xLjUgMi41IDAgMS41IDEuNSIvPjxwYXRoIGQ9Im0xNiAxNi41IDEuNSAxLjUgMi41IDAgMS41LTEuNSIvPjxwYXRoIGQ9Im0xMCAxMS41IDEgMSAxLjUtMS41Ii8+PHBhdGggZD0iTTE0IDhsMi0yIi8+PHBhdGggZD0iTTEwIDhsMi0yIi8+PC9zdmc+',
  RAM: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXJhbSI+PHBhdGggZD0iTTIgMTVoMjB2NGgtMjB6Ii8+PHBhdGggZD0iTTQgMTVWOWExLTEgMCAwIDEgMS0xaDE0YTEtMSAwIDAgMSAxIDEgdjYiLz48cGF0aCBkPSJtMTIgMTUgMCA0Ii8+PHBhdGggZD0iTTggMTVWOWExLTEgMCAwIDEgMS0xaDZ2N2gtOHoiLz48L3N2Zz4=',
  Storage: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXN0b3JhZ2UiPjxwYXRoIGQ9Ik0yIDh2MTJhMiAyIDAgMCAwIDIgMmgxNmEyIDIgMCAwIDAgMi0yVjhhMiAyIDAgMCAwLTItMkg0YTIgMiAwIDAgMC0yIDJ6Ii8+PHBhdGggZD0iTTQgOGwtMi0zIi8+PHBhdGggZD0iTTIwIDhsMi0zIi8+PHBhdGggZD0iTTggOGwtMi0zIi8+PHBhdGggZD0iTTEyIDhsLTItMyIvPjxwYXRoIGQ9Ik0xNiA4bC0yLTMiLz48L3N2Zz4=',
  Motherboard: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLW1vdGhlcmJvYXJkIj48cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PHJlY3Qgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiB4PSIzIiB5PSIzIiByeD0iMiIvPjxwYXRoIGQ9Ik0xMSA5aDJ2MmgtMnoiLz48cGF0aCBkPSJtNyAxNGgydjJoLTJ6Ii8+PHBhdGggZD0ibTE2IDdoMnYyaC0yeiIvPjxwYXRoIGQ9Im0xNiAxNWgydjJoLTJ6Ii8+PHBhdGggZD0iTTcgN2gydjJoLTJ6Ii8+PHBhdGggZD0iTTcgMTFoMnYyaC0yeiIvPjxwYXRoIGQ9Im0xMSA3aDJ2MmgtMnoiLz48cGF0aCBkPSJtMTYgMTFoMnYyaC0yeiIvPjxwYXRoIGQ9Im0xMSA0djIiLz48cGF0aG9kPSJtMTQgN2gyIi8+PHBhdGggZD0ibTE0IDExaDIiLz48cGF0aCBkPSJtMTQgMTVoMiIvPjxwYXRoIGQ9Im0xMSAyaDJ2MiIvPjxwYXRoIGQ9Im0xMSA MTdjMnYyIi8+PHBhdGggZD0ibTcgMTRoMiIvPjxwYXRoIGQ9Im03IDdoMiIvPjxwYXRoIGQ9Im0xMSA3aDIiLz48L3N2Zz4=',
  PSU: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXBzdSI+PHBhdGggZD0iTTIgN2gxOHYxMEgyeiIvPjxwYXRoIGQ9Ik0yMCAxN2gtM3YyaDN2LTJ6Ii8+PHBhdGggZD0iTTUgMTdoM3YyaC0zdjJ6Ii8+PHBhdGggZD0iTTIgN2wzLTNIMjFsMyAzIi8+PHBhdGggZD0iTTcgMTJoMnYyaC0yeiIvPjxwYXRoIGQ9Im0xNSAxMmgzdi0yaC0zeiIvPjwvc3ZnPg==',
  Case: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNhc2UiPjxwYXRoIGQ9Ik0yIDdoMjB2MTBoLTIwVjdoMHYwWiIvPjxwYXRoIGQ9Ik0yMCA3VjVhMiAyIDAgMCAwLTItMkg2YTIgMiAwIDAgMC0yIDJ2MiIvPjxwYXRoIGQ9Ik02IDE4djIiLz48cGF0aCBkPSJNMTggMTZ2NCIvPjwvc3ZnPg==',
};

const Builder = () => {
  const location = useLocation();
  const [components, setComponents] = useState({});
  const [selectedComponents, setSelectedComponents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalWattage, setTotalWattage] = useState(0);
  const [psuCapacity, setPsuCapacity] = useState(0);
  const [saveStatus, setSaveStatus] = useState(null);
  const [buildName, setBuildName] = useState('');
  const [buildCategory, setBuildCategory] = useState('Custom');
  const [savedId, setSavedId] = useState(null);
  
  const componentTypes = ['CPU', 'GPU', 'RAM', 'Storage', 'Motherboard', 'PSU', 'Case'];
  
  useEffect(() => {
    const fetchComponents = async () => {
      try {
        setLoading(true);
        const data = await componentService.getAllComponents();

        // Group components by type
        const groupedComponents = data.reduce((acc, component) => {
          if (!acc[component.type]) {
            acc[component.type] = [];
          }
          acc[component.type].push(component);
          return acc;
        }, {});
        
        setComponents(groupedComponents);
        setLoading(false);
      } catch (err) {
        setError('Failed to load components. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchComponents();
  }, []);

  // If navigated from saved build duplication, pre-populate state
  useEffect(() => {
    const dup = location.state && location.state.duplicate;
    if (dup && dup.selectedComponents) {
      setSelectedComponents(dup.selectedComponents);
      if (dup.name) setBuildName(dup.name);
      if (dup.category) setBuildCategory(dup.category);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);
  
  useEffect(() => {
    // Calculate total price whenever selected components change
    let total = 0;
    Object.values(selectedComponents).forEach(component => {
      if (component && component.price) {
        total += parseFloat(component.price);
      }
    });
    setTotalPrice(total);
    // Calculate wattage (exclude PSU capacity from draw)
    let wattageTotal = 0;
    Object.entries(selectedComponents).forEach(([type, component]) => {
      if (!component) return;
      if (type === 'PSU') return; // PSU wattage is capacity, not draw
      const w = parseInt(component.wattage || 0, 10);
      wattageTotal += isNaN(w) ? 0 : w;
    });
    setTotalWattage(wattageTotal);
    const psuW = parseInt(selectedComponents['PSU']?.wattage || 0, 10);
    setPsuCapacity(isNaN(psuW) ? 0 : psuW);
  }, [selectedComponents]);
  
  const handleComponentSelect = (type, component) => {
    // If component is null/undefined (e.g., "Select a..." option), remove it from the selection
    if (!component) {
      const { [type]: _, ...rest } = selectedComponents;
      setSelectedComponents(rest);
      return;
    }
    setSelectedComponents(prev => ({
      ...prev,
      [type]: component
    }));
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-xl text-gray-300">Loading components...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="bg-dark-card/60 backdrop-blur-sm border border-destructive/30 p-6 rounded-xl max-w-lg mx-auto">
          <p className="text-destructive text-xl mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Custom PC Builder</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Select Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {componentTypes.map((type) => (
              <div key={type}>
                <label className="block text-sm font-medium mb-2 text-gray-300">{type}</label>
                <Select
                  value={selectedComponents[type] ? JSON.stringify(selectedComponents[type]) : "placeholder"}
                  onValueChange={(value) => handleComponentSelect(type, value && value !== 'placeholder' ? JSON.parse(value) : null)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={`Select a ${type}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="placeholder">Select a {type}</SelectItem>
                    {(components[type] || []).map(component => (
                      <SelectItem key={component.id} value={JSON.stringify(component)}>
                        <div className="flex items-center">
                          <img src={componentImages[type] || component.imageUrl || 'https://via.placeholder.com/30'} alt={component.name} className="w-8 h-8 mr-4 object-cover rounded-md" />
                          <div className="flex flex-col">
                            <span className="font-medium">{component.name} - Rs {component.price}</span>
                            {component.description && (
                              <span className="text-xs text-gray-400 mt-1">{component.description}</span>
                            )}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedComponents[type]?.description && (
                  <p className="mt-2 text-xs text-gray-400">{selectedComponents[type].description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-dark-card/60 backdrop-blur-sm border border-primary/10 rounded-lg shadow-lg p-6 sticky top-4">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Your Build</h2>

            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Build Name</label>
                <Input
                  placeholder="e.g., My First Gaming Rig"
                  value={buildName}
                  onChange={(e) => setBuildName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Category</label>
                <select
                  className="flex h-10 w-full rounded-md border border-primary/30 bg-dark text-white px-3 py-2 text-sm focus:border-primary focus:ring-primary"
                  value={buildCategory}
                  onChange={(e) => setBuildCategory(e.target.value)}
                >
                  <option className="bg-dark text-white" value="Custom">Custom</option>
                  <option className="bg-dark text-white" value="Gaming">Gaming</option>
                  <option className="bg-dark text-white" value="Budget">Budget</option>
                  <option className="bg-dark text-white" value="Office">Office</option>
                  <option className="bg-dark text-white" value="Workstation">Workstation</option>
                </select>
              </div>
            </div>
            
            {componentTypes.map(type => (
              <div key={type} className="py-3 border-b border-primary/10 last:border-b-0">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-300">{type}:</span>
                  <span className="text-gray-400">
                    {selectedComponents[type] ? selectedComponents[type].name : 'Not selected'}
                  </span>
                </div>
                {selectedComponents[type] && (
                    <div className="flex justify-end mt-1">
                    <span className="text-primary font-bold">Rs {selectedComponents[type].price}</span>
                  </div>
                )}
                {selectedComponents[type]?.description && (
                  <div className="mt-1 text-xs text-gray-400">
                    {selectedComponents[type].description}
                  </div>
                )}
              </div>
            ))}
            
            <div className="mt-6 pt-4 border-t border-primary/10 space-y-2">
                <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-white">Total Price:</span>
                <span className="text-xl font-bold text-primary">Rs {totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-300">Estimated Wattage:</span>
                <span className="text-lg text-gray-300">{totalWattage}W</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-300">PSU Capacity:</span>
                <span className="text-lg text-gray-300">{psuCapacity}W</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-300">Headroom (20%):</span>
                <span className="text-lg text-gray-300">{Math.ceil(totalWattage * 1.2)}W required</span>
              </div>
              <div className={`mt-2 p-3 rounded-lg text-sm ${psuCapacity >= Math.ceil(totalWattage * 1.2) 
                ? 'bg-green-900/30 text-green-400 border border-green-500/30' 
                : 'bg-red-900/30 text-red-400 border border-red-500/30'}`}>
                {psuCapacity >= Math.ceil(totalWattage * 1.2) 
                  ? 'Power supply is sufficient for this build.' 
                  : 'Warning: Power supply may not be sufficient for this build.'}
              </div>
            </div>
            
            {saveStatus && (
              <div className={`mt-4 text-sm p-3 rounded-lg ${saveStatus.success ? 'bg-green-900/30 text-green-400 border border-green-500/30' : 'bg-red-900/30 text-red-400 border border-red-500/30'}`}>
                {saveStatus.message}
                {savedId && (
                  <span className="ml-2">
                    <Link to={`/saved-builds/${savedId}`} className="underline text-primary hover:text-primary/80">View build</Link>
                  </span>
                )}
              </div>
            )}

            <Button 
              className="w-full mt-6 bg-gradient-to-r from-primary to-primary/80 hover:shadow-[0_0_15px_rgba(138,43,226,0.4)] transition-all duration-300"
              disabled={Object.keys(selectedComponents).length === 0 || buildName.trim().length === 0}
              onClick={async () => {
                try {
                  const componentIds = Object.fromEntries(
                    Object.entries(selectedComponents)
                      .map(([type, comp]) => [type, comp.id])
                  );
                  const payload = {
                    name: buildName.trim(),
                    category: buildCategory,
                    description: 'Saved from Builder',
                    totalPrice: Number(totalPrice.toFixed(2)),
                    totalWattage: totalWattage,
                    componentIds,
                    isPreBuilt: false
                  };
                  const saved = await buildService.saveBuild(payload);
                  setSavedId(saved.id);
                  setSaveStatus({ success: true, message: `Build saved.` });
                } catch (err) {
                  console.error('Failed to save build', err);
                  setSaveStatus({ success: false, message: 'Failed to save build. Please try again.' });
                }
              }}
            >
              Save Build
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;