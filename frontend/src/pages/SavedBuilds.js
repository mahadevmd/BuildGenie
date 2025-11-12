import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { buildService } from '../services/api';
import { Button } from '../components/ui/button';

const SavedBuilds = () => {
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    const fetchBuilds = async () => {
      try {
        setLoading(true);
        const data = await buildService.getSavedBuilds();
        setBuilds(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load saved builds', err);
        setError('Failed to load saved builds. Please try again later.');
        setLoading(false);
      } 
    };
    fetchBuilds();
  }, []);

  // IMPORTANT: Hooks must be called unconditionally before any early returns
  const categories = useMemo(() => {
    const set = new Set(['All']);
    builds.forEach((b) => { if (b.category) set.add(b.category); });
    return Array.from(set);
  }, [builds]);

  const displayedBuilds = useMemo(() => {
    const enriched = builds.map((b) => {
      const price = b.totalPrice != null
        ? Number(b.totalPrice)
        : Array.isArray(b.components)
          ? b.components.reduce((sum, c) => sum + Number(c.price || 0), 0)
          : 0;
      return { ...b, _price: price, _date: b.createdAt ? new Date(b.createdAt) : null };
    });

    let filtered = enriched;
    if (filterCategory !== 'All') {
      filtered = filtered.filter((b) => (b.category || 'Custom') === filterCategory);
    }
    const min = minPrice !== '' ? Number(minPrice) : null;
    const max = maxPrice !== '' ? Number(maxPrice) : null;
    if (min != null) filtered = filtered.filter((b) => b._price >= min);
    if (max != null) filtered = filtered.filter((b) => b._price <= max);

    filtered.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'price') {
        cmp = a._price - b._price;
      } else {
        const ta = a._date ? a._date.getTime() : 0;
        const tb = b._date ? b._date.getTime() : 0;
        cmp = ta - tb;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return filtered;
  }, [builds, filterCategory, minPrice, maxPrice, sortBy, sortDir]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-xl">Loading saved builds...</p>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Saved Builds</h1>
      <div className="bg-card rounded-lg border p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="text-sm text-muted-foreground">Category</label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Min Price</label>
          <input
            type="number"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="0"
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground">Max Price</label>
          <input
            type="number"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder=""
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-sm text-muted-foreground">Sort By</label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Date</option>
              <option value="price">Price</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">Direction</label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={sortDir}
              onChange={(e) => setSortDir(e.target.value)}
            >
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </div>
        </div>
      </div>
      {displayedBuilds.length === 0 ? (
        <div className="bg-card rounded-lg p-6 border text-center">
          <p className="text-muted-foreground">No saved builds yet. Create one in the builder!</p>
          <Button className="mt-4" onClick={() => { window.location.href = '/builder'; }}>
            Go to Builder
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedBuilds.map((build) => (
            <div key={build.id} className="bg-dark-card/60 backdrop-blur-sm rounded-lg overflow-hidden border border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_15px_rgba(138,43,226,0.15)]">
              <div className="h-40 bg-dark-card/80 border-b border-primary/10 flex items-center justify-center">
                {build.imageUrl ? (
                  <img src={build.imageUrl} alt={build.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-gray-400 text-5xl">🖥️</div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold text-white">{build.name || 'Custom Build'}</h2>
                  <span className="bg-primary text-white px-2 py-1 rounded text-sm font-medium">
                    Rs {Number(build._price || 0).toFixed(2)}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-2">Category: {build.category || 'Custom'}</p>
                {build.totalWattage !== undefined && (
                  <p className="text-gray-300 text-sm">Total Wattage: {build.totalWattage}W</p>
                )}
                {build.createdAt && (
                  <p className="text-gray-400 text-xs mt-2">Created: {new Date(build.createdAt).toLocaleString()}</p>
                )}
                <div className="mt-4 flex justify-end">
                  <Link
                    to={`/saved-builds/${build.id}`}
                    className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedBuilds;