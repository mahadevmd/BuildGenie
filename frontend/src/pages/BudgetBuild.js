import React, { useState, useEffect } from 'react';
import { buildService } from '../services/api';
import SavedBuildGrid from '../components/SavedBuildGrid';

const BudgetBuild = () => {
  const [budgetBuilds, setBudgetBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch saved builds and filter by Budget category
    const fetchBudgetBuilds = async () => {
      try {
        setLoading(true);
        const builds = await buildService.getSavedBuilds();
        const filtered = (builds || []).filter(
          (b) => (b.category || '').toLowerCase() === 'budget'
        );
        setBudgetBuilds(filtered);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching saved budget builds:', error);
        setError('Failed to load saved budget builds. Please try again later.');
        setLoading(false);
      }
    };

    fetchBudgetBuilds();
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Saved Budget Builds</h1>
        <p className="text-gray-600">
          Your saved budget builds are listed here with the same actions available in Saved Builds.
        </p>
      </div>
      <SavedBuildGrid builds={budgetBuilds} onDeleted={(id) => setBudgetBuilds((curr) => curr.filter(b => b.id !== id))} />
    </div>
  );
};

export default BudgetBuild;