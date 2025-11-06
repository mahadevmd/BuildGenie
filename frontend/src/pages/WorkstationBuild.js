import React, { useState, useEffect } from 'react';
import { buildService } from '../services/api';
import SavedBuildGrid from '../components/SavedBuildGrid';

const WorkstationBuild = () => {
  const [workstationBuilds, setWorkstationBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch saved builds and filter by Workstation category
    const fetchWorkstationBuilds = async () => {
      try {
        setLoading(true);
        const builds = await buildService.getSavedBuilds();
        const filtered = (builds || []).filter(
          (b) => (b.category || '').toLowerCase() === 'workstation'
        );
        setWorkstationBuilds(filtered);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching saved workstation builds:', error);
        setError('Failed to load saved workstation builds. Please try again later.');
        setLoading(false);
      }
    };

    fetchWorkstationBuilds();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Saved Workstation Builds</h1>
        <p className="text-gray-600">
          Your saved workstation builds are listed here with the same actions available in Saved Builds.
        </p>
      </div>
      <SavedBuildGrid builds={workstationBuilds} onDeleted={(id) => setWorkstationBuilds((curr) => curr.filter(b => b.id !== id))} />
    </div>
  );
};

export default WorkstationBuild;