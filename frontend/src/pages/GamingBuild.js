import React, { useState, useEffect } from 'react';
import { buildService } from '../services/api';
import SavedBuildGrid from '../components/SavedBuildGrid';

const GamingBuild = () => {
  const [gamingBuilds, setGamingBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchGamingBuilds = async () => {
      try {
        setLoading(true);
        const builds = await buildService.getSavedBuilds();
        const filtered = (builds || []).filter(
          (b) => (b.category || '').toLowerCase() === 'gaming'
        );
        setGamingBuilds(filtered);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching saved gaming builds:', err);
        setError('Failed to load saved gaming builds. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchGamingBuilds();
  }, []);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Saved Gaming Builds</h1>
      <p className="text-lg text-gray-600 mb-8">
        Your saved gaming builds are listed here with the same actions available in Saved Builds.
      </p>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading gaming builds...</div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      ) : (
        <SavedBuildGrid builds={gamingBuilds} onDeleted={(id) => setGamingBuilds((curr) => curr.filter(b => b.id !== id))} />
      )}
      
      <div className="bg-gray-100 rounded-lg p-6 mt-8">
        <h2 className="text-2xl font-bold mb-4">Why Choose Our Gaming Builds?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-bold mb-2">Expert Selection</h3>
            <p className="text-gray-600">
              Our gaming builds are designed by PC gaming enthusiasts who understand what matters for performance.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Balanced Components</h3>
            <p className="text-gray-600">
              Each build features carefully matched components to eliminate bottlenecks and maximize performance.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Easy Customization</h3>
            <p className="text-gray-600">
              Start with one of our builds and customize it to your specific needs and preferences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamingBuild;