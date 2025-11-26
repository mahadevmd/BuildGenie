import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { buildService, componentService } from '../services/api';

const SavedBuildGrid = ({ builds = [], onDeleted }) => {
  const navigate = useNavigate();
  const [list, setList] = useState(builds);

  useEffect(() => {
    setList(builds);
  }, [builds]);

  const handleEdit = (id) => {
    navigate(`/saved-builds/${id}?edit=1`);
  };

  const handleDuplicate = async (build) => {
    try {
      const ids = build.componentIds || {};
      const entries = Object.entries(ids);
      const selectedComponents = {};
      for (const [type, compId] of entries) {
        const comp = await componentService.getComponentById(compId);
        if (comp) selectedComponents[type] = comp;
      }
      navigate('/builder', {
        state: {
          duplicate: {
            selectedComponents,
            name: build.name || '',
            category: build.category || 'Custom',
          },
        },
      });
    } catch (err) {
      console.error('Failed to duplicate build', err);
      alert('Failed to duplicate build.');
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm('Delete this saved build? This cannot be undone.');
    if (!ok) return;
    try {
      await buildService.deleteBuild(id);
      setList((curr) => curr.filter((b) => b.id !== id));
      if (onDeleted) onDeleted(id);
    } catch (err) {
      console.error('Failed to delete build', err);
      alert('Failed to delete build.');
    }
  };

  if (!list || list.length === 0) {
    return (
      <div className="bg-card rounded-lg p-6 border text-center">
        <p className="text-muted-foreground">No saved builds in this category.</p>
        <Link
          to="/builder"
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground mt-4"
        >
          Go to Builder
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {list.map((build) => (
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
                Rs {Number(build.totalPrice || 0).toFixed(2)}
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-2">Category: {build.category || 'Custom'}</p>
            {build.totalWattage !== undefined && (
              <p className="text-gray-300 text-sm">Total Wattage: {build.totalWattage}W</p>
            )}
            {build.createdAt && (
              <p className="text-gray-400 text-xs mt-2">Created: {new Date(build.createdAt).toLocaleString()}</p>
            )}
            <div className="mt-4 flex gap-2 justify-end">
              <Link
                to={`/saved-builds/${build.id}`}
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
              >
                View
              </Link>
              <button
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleEdit(build.id)}
              >
                Edit
              </button>
              <button
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleDuplicate(build)}
              >
                Duplicate
              </button>
              <button
                className="inline-flex items-center justify-center rounded-md border border-destructive text-destructive px-3 py-2 text-sm hover:bg-destructive/10"
                onClick={() => handleDelete(build.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SavedBuildGrid;