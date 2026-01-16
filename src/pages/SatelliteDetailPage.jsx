import { useParams, Link } from 'react-router-dom';
import { useSatellite } from '../hooks/useSatellites';

// Orbit type colors
const ORBIT_COLORS = {
  LEO: 'bg-blue-500/15 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-500/20 dark:border-blue-400/20',
  MEO: 'bg-green-500/15 dark:bg-green-500/20 text-green-800 dark:text-green-300 border border-green-500/20 dark:border-green-400/20',
  GEO: 'bg-purple-500/15 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 border border-purple-500/20 dark:border-purple-400/20',
  HEO: 'bg-orange-500/15 dark:bg-orange-500/20 text-orange-800 dark:text-orange-300 border border-orange-500/20 dark:border-orange-400/20',
  SSO: 'bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-500/20 dark:border-cyan-400/20',
  L2: 'bg-indigo-500/15 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 border border-indigo-500/20 dark:border-indigo-400/20',
  Lunar: 'bg-yellow-500/15 dark:bg-yellow-500/20 text-yellow-800 dark:text-yellow-300 border border-yellow-500/20 dark:border-yellow-400/20',
};

// Type icons
const TYPE_ICONS = {
  'Communication': '📡',
  'Navigation': '🧭',
  'Weather': '🌤️',
  'Scientific': '🔬',
  'Military': '🎖️',
  'Earth Observation': '🌍',
  'Space Station': '🏠',
  'Lunar Probe': '🌙',
};

// Status colors
const STATUS_COLORS = {
  Active: 'bg-green-500/15 dark:bg-green-500/20 text-green-800 dark:text-green-300 border border-green-500/20 dark:border-green-400/20',
  Inactive: 'bg-gray-500/15 dark:bg-gray-500/20 text-gray-800 dark:text-gray-300 border border-gray-500/20 dark:border-gray-400/20',
  Decommissioned: 'bg-red-500/15 dark:bg-red-500/20 text-red-800 dark:text-red-300 border border-red-500/20 dark:border-red-400/20',
  Completed: 'bg-blue-500/15 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-500/20 dark:border-blue-400/20',
};

export default function SatelliteDetailPage() {
  const { id } = useParams();
  const { satellite, loading, error } = useSatellite(id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !satellite) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-panel p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Satellite Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error || 'The requested satellite could not be found.'}</p>
          <Link to="/satellites" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
            ← Back to Satellites
          </Link>
        </div>
      </div>
    );
  }

  const orbitColorClass = ORBIT_COLORS[satellite.orbitType] || 'bg-gray-100 text-gray-800';
  const statusColorClass = STATUS_COLORS[satellite.status] || 'bg-gray-100 text-gray-800';
  const typeIcon = TYPE_ICONS[satellite.type] || '🛰️';

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link to="/satellites" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
            ← Back to Satellites
          </Link>
        </nav>

        {/* Header */}
        <div className="glass-panel p-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{typeIcon}</span>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{satellite.name}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${orbitColorClass}`}>
                    {satellite.orbitType}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColorClass}`}>
                    {satellite.status}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">|</span>
                  <span className="text-gray-600 dark:text-gray-400">{satellite.type}</span>
                </div>
              </div>
            </div>
            {satellite.countryId && (
              <Link
                to={`/countries/${satellite.countryId}`}
                className="glass-tinted-indigo px-4 py-2 hover:bg-indigo-500/25 transition"
              >
                View Country
              </Link>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="glass-panel p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Basic Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">NORAD ID</span>
                  <p className="font-semibold text-gray-800 dark:text-white">{satellite.noradId || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">COSPAR ID</span>
                  <p className="font-semibold text-gray-800 dark:text-white">{satellite.cosparId || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Country</span>
                  <p className="font-semibold text-gray-800 dark:text-white">{satellite.countryId || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">Operator</span>
                  <p className="font-semibold text-gray-800 dark:text-white">{satellite.operator || 'N/A'}</p>
                </div>
                {satellite.constellation && (
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Constellation</span>
                    <p className="font-semibold text-gray-800 dark:text-white">{satellite.constellation}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Orbital Parameters */}
            <div className="glass-panel p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Orbital Parameters</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="glass-tinted-indigo p-4 text-center">
                  <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {satellite.altitude ? satellite.altitude.toLocaleString() : 'N/A'}
                  </span>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Altitude (km)</p>
                </div>
                <div className="glass-tinted-indigo p-4 text-center">
                  <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {satellite.inclination ? `${satellite.inclination}°` : 'N/A'}
                  </span>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Inclination</p>
                </div>
                <div className="glass-tinted-indigo p-4 text-center">
                  <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {satellite.orbitType || 'N/A'}
                  </span>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Orbit Type</p>
                </div>
              </div>
            </div>

            {/* Purpose & Description */}
            {satellite.purpose && (
              <div className="glass-panel p-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Purpose</h2>
                <p className="text-gray-600 dark:text-gray-400">{satellite.purpose}</p>
              </div>
            )}
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-6">
            {/* Physical Characteristics */}
            <div className="glass-panel p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Physical Characteristics</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Mass</span>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {satellite.massKg ? `${satellite.massKg.toLocaleString()} kg` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Type</span>
                  <span className="font-semibold text-gray-800 dark:text-white">{satellite.type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Status</span>
                  <span className={`px-2 py-1 rounded-full text-sm ${statusColorClass}`}>
                    {satellite.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Launch Information */}
            <div className="glass-panel p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Launch Information</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Launch Date</span>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {satellite.launchDate || satellite.launchYear || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Launch Year</span>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {satellite.launchYear || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Orbit Visualization */}
            <div className="glass-panel p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Orbit Visualization</h2>
              <div className="relative w-full h-48 bg-gray-900/80 rounded-[12px] overflow-hidden border border-gray-700/50">
                {/* Earth */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-blue-500 rounded-full shadow-lg">
                  <div className="absolute inset-0 bg-green-500 rounded-full opacity-50" style={{ clipPath: 'polygon(20% 0%, 40% 30%, 60% 20%, 80% 40%, 100% 60%, 80% 100%, 20% 100%, 0% 60%)' }}></div>
                </div>

                {/* Orbit Ring */}
                <div
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-2 border-dashed border-indigo-400 rounded-full opacity-50"
                  style={{
                    width: satellite.orbitType === 'LEO' ? '100px' :
                           satellite.orbitType === 'MEO' ? '140px' :
                           satellite.orbitType === 'GEO' ? '180px' : '120px',
                    height: satellite.orbitType === 'LEO' ? '100px' :
                            satellite.orbitType === 'MEO' ? '140px' :
                            satellite.orbitType === 'GEO' ? '180px' : '120px',
                  }}
                ></div>

                {/* Satellite */}
                <div
                  className="absolute top-1/2 left-1/2 w-3 h-3 bg-yellow-400 rounded-full shadow-lg"
                  style={{
                    transform: `translate(${
                      satellite.orbitType === 'LEO' ? '50px' :
                      satellite.orbitType === 'MEO' ? '70px' :
                      satellite.orbitType === 'GEO' ? '90px' : '60px'
                    }, -50%)`,
                  }}
                ></div>

                {/* Labels */}
                <div className="absolute bottom-2 left-2 text-xs text-white">
                  {satellite.orbitType} Orbit
                </div>
                <div className="absolute bottom-2 right-2 text-xs text-white">
                  {satellite.altitude ? `${satellite.altitude.toLocaleString()} km` : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
