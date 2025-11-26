import React, { useMemo, useState } from 'react';
import { buildService } from '../services/api';
import { Button } from '../components/ui/button';

const categories = [
  'Gaming',
  'Budget',
  'workstation',
  'Office',
  'Custom'
];

const BuildRecommendations = () => {
  const [selectedCategory, setSelectedCategory] = useState('gaming');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState([]);

  const minBudgetNumber = useMemo(() => {
    if (minBudget === '' || minBudget == null) return null;
    const n = Number(minBudget);
    return Number.isNaN(n) ? null : n;
  }, [minBudget]);

  const maxBudgetNumber = useMemo(() => {
    if (maxBudget === '' || maxBudget == null) return null;
    const n = Number(maxBudget);
    return Number.isNaN(n) ? null : n;
  }, [maxBudget]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      // Try pre-built configurations first; if empty, fall back to all builds by category
      const prebuilt = await buildService.getPreBuiltConfigsByCategory(selectedCategory);
      let builds = Array.isArray(prebuilt) && prebuilt.length > 0
        ? prebuilt
        : await buildService.getBuildsByCategory(({ Gaming: 'Gaming', Budget: 'Budget', workstation: 'workstation', Office: 'Office', Custom: 'Custom' }[selectedCategory]) || selectedCategory);

      // Normalize price and filter by budget
      const normalized = (builds || []).map((b) => ({
        ...b,
        _price: b.totalPrice != null
          ? Number(b.totalPrice)
          : Array.isArray(b.components)
            ? b.components.reduce((sum, c) => sum + Number(c.price || 0), 0)
            : 0
      }));

      builds = normalized.filter((b) => {
        const p = Number(b._price || 0);
        if (minBudgetNumber != null && p < minBudgetNumber) return false;
        if (maxBudgetNumber != null && p > maxBudgetNumber) return false;
        return true;
      });

      setResults(builds);
    } catch (err) {
      console.error('Failed to fetch recommendations', err);
      setError('Failed to fetch recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Build Recommendations</h1>

      <div className="bg-card rounded-lg border p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="text-sm text-muted-foreground">Preferred Category</label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Min Budget</label>
          <input
            type="number"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={minBudget}
            onChange={(e) => setMinBudget(e.target.value)}
            placeholder="e.g. 50000"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Max Budget</label>
          <input
            type="number"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={maxBudget}
            onChange={(e) => setMaxBudget(e.target.value)}
            placeholder="e.g. 150000"
          />
        </div>
        <div className="flex items-end">
          <Button onClick={handleSearch} className="w-full" disabled={loading}>
            {loading ? 'Searching…' : 'Find Recommendations'}
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}

      {results.length === 0 ? (
        <div className="bg-card rounded-lg p-6 border text-center">
          <p className="text-muted-foreground">No build suggestions found. Please try a new combination.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((build) => (
            <div key={build.id || build.name} className="bg-dark-card/60 backdrop-blur-sm rounded-lg overflow-hidden border border-primary/10">
              <div className="h-40 bg-dark-card/80 border-b border-primary/10 flex items-center justify-center">
                {build.imageUrl ? (
                  <img src={build.imageUrl} alt={build.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-400 text-5xl">🛠️</div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-white">{build.name || 'Recommended Build'}</h2>
                  <span className="bg-primary text-white px-2 py-1 rounded text-sm font-medium">
                    Rs {Number(build._price || build.totalPrice || 0).toFixed(2)}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-2">Category: {build.category || selectedCategory}</p>
                <div className="mt-4 flex justify-end">
                  {build.id && (
                    <a
                      href={`/saved-builds/${build.id}`}
                      className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                    >
                      View Details
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BuildRecommendations;