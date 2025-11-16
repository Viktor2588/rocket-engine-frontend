import { useState } from 'react';
import { useEngines } from '../hooks/useEngines';
import EngineCard from '../components/EngineCard';
import EngineChart from '../components/EngineChart';

export default function EngineListPage() {
  const { engines, loading, error } = useEngines();
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('name');

  const sortedEngines = [...engines].sort((a, b) => {
    if (sortBy === 'twr') {
      const twrA = a.calculateThrustToWeightRatio || 0;
      const twrB = b.calculateThrustToWeightRatio || 0;
      return twrB - twrA;
    }
    if (sortBy === 'isp') {
      const ispA = a.isp_s || 0;
      const ispB = b.isp_s || 0;
      return ispB - ispA;
    }
    return a.name.localeCompare(b.name);
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading engines...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Engines</h2>
          <p className="text-red-600">{error}</p>
          <p className="text-sm text-red-500 mt-2">
            Make sure the backend API is running on http://localhost:8080
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🚀 Rocket Engines</h1>
          <p className="text-gray-600">Browse and compare rocket engines from different manufacturers</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <span className="text-gray-700 font-semibold">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Name</option>
                  <option value="twr">T/W Ratio (High to Low)</option>
                  <option value="isp">ISP (High to Low)</option>
                </select>
              </label>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-md font-semibold transition ${
                  viewMode === 'grid'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Grid View
              </button>
              <button
                onClick={() => setViewMode('chart')}
                className={`px-4 py-2 rounded-md font-semibold transition ${
                  viewMode === 'chart'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Chart View
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedEngines.map((engine) => (
              <EngineCard key={engine.id} engine={engine} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EngineChart engines={sortedEngines} type="twr" />
            <EngineChart engines={sortedEngines} type="isp" />
          </div>
        )}

        {/* No results */}
        {sortedEngines.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No engines found</p>
          </div>
        )}
      </div>
    </div>
  );
}
