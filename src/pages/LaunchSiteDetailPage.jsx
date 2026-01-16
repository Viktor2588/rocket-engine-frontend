import { useParams, Link } from 'react-router-dom';
import { useLaunchSite } from '../hooks/useLaunchSites';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';

// World TopoJSON URL
const GEO_URL = 'https://unpkg.com/world-atlas@2.0.2/countries-110m.json';

// Status colors
const STATUS_COLORS = {
  Active: 'glass-badge-success',
  Inactive: 'glass-badge',
  'Under Construction': 'glass-badge-warning',
  Decommissioned: 'glass-badge-error',
};

export default function LaunchSiteDetailPage() {
  const { id } = useParams();
  const { launchSite, loading, error } = useLaunchSite(id);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !launchSite) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-panel p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Launch Site Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error || 'The requested launch site could not be found.'}</p>
          <Link to="/launch-sites" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
            ← Back to Launch Sites
          </Link>
        </div>
      </div>
    );
  }

  const statusClass = STATUS_COLORS[launchSite.status] || STATUS_COLORS.Active;
  const successRate = launchSite.successRate ||
    (launchSite.totalLaunches && launchSite.successfulLaunches
      ? (launchSite.successfulLaunches / launchSite.totalLaunches * 100)
      : 0);

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link to="/launch-sites" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
            ← Back to Launch Sites
          </Link>
        </nav>

        {/* Header */}
        <div className="glass-panel p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{launchSite.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusClass}`}>
                  {launchSite.status}
                </span>
                <span className="text-gray-500 dark:text-gray-400">|</span>
                <span className="text-gray-600 dark:text-gray-400">{launchSite.countryId}</span>
                <span className="text-gray-500 dark:text-gray-400">|</span>
                <span className="text-gray-600 dark:text-gray-400">{launchSite.region}</span>
              </div>
            </div>
            {launchSite.countryId && (
              <Link
                to={`/countries/${launchSite.countryId}`}
                className="glass-tinted-indigo px-4 py-2 hover:bg-indigo-500/25 transition"
              >
                View Country
              </Link>
            )}
          </div>

          {/* Description */}
          {launchSite.description && (
            <p className="text-gray-600 dark:text-gray-400 mt-4">{launchSite.description}</p>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Launch Statistics */}
            <div className="glass-panel p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Launch Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-tinted-indigo p-4 text-center">
                  <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                    {launchSite.totalLaunches || 0}
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Launches</p>
                </div>
                <div className="glass-tinted-green p-4 text-center">
                  <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {launchSite.successfulLaunches || 0}
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Successful</p>
                </div>
                <div className="glass-tinted-red p-4 text-center">
                  <span className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {(launchSite.totalLaunches || 0) - (launchSite.successfulLaunches || 0)}
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Failed</p>
                </div>
                <div className="glass-tinted-purple p-4 text-center">
                  <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {successRate.toFixed(1)}%
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Success Rate</p>
                </div>
              </div>

              {/* Success Rate Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>Success Rate</span>
                  <span>{successRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-500/20 dark:bg-white/10 rounded-full h-3">
                  <div
                    className="bg-green-500 rounded-full h-3 transition-all duration-500"
                    style={{ width: `${successRate}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Orbital Capabilities */}
            <div className="glass-panel p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Orbital Capabilities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-500/10 dark:bg-white/[0.06] rounded-[12px] p-4 text-center border border-gray-200/30 dark:border-white/[0.08]">
                  <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {launchSite.minInclination ? `${launchSite.minInclination}°` : 'N/A'}
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Min Inclination</p>
                </div>
                <div className="bg-gray-500/10 dark:bg-white/[0.06] rounded-[12px] p-4 text-center border border-gray-200/30 dark:border-white/[0.08]">
                  <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {launchSite.maxInclination ? `${launchSite.maxInclination}°` : 'N/A'}
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Max Inclination</p>
                </div>
                <div className="bg-gray-500/10 dark:bg-white/[0.06] rounded-[12px] p-4 text-center border border-gray-200/30 dark:border-white/[0.08]">
                  <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {launchSite.latitude ? `${launchSite.latitude.toFixed(2)}°` : 'N/A'}
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Latitude</p>
                </div>
              </div>

              {/* Capability Badges */}
              <div className="flex flex-wrap gap-3 mt-4">
                <div className={`px-4 py-2 rounded-[12px] ${launchSite.humanRated ? 'bg-purple-500/15 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 border border-purple-500/20 dark:border-purple-400/20' : 'bg-gray-500/10 dark:bg-white/[0.06] text-gray-400 dark:text-gray-500 border border-gray-200/30 dark:border-white/[0.08]'}`}>
                  <span className="mr-2">👨‍🚀</span>
                  Human Rated
                </div>
                <div className={`px-4 py-2 rounded-[12px] ${launchSite.geoCapable ? 'bg-blue-500/15 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-500/20 dark:border-blue-400/20' : 'bg-gray-500/10 dark:bg-white/[0.06] text-gray-400 dark:text-gray-500 border border-gray-200/30 dark:border-white/[0.08]'}`}>
                  <span className="mr-2">🌍</span>
                  GEO Capable
                </div>
                <div className={`px-4 py-2 rounded-[12px] ${launchSite.polarCapable ? 'bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-500/20 dark:border-cyan-400/20' : 'bg-gray-500/10 dark:bg-white/[0.06] text-gray-400 dark:text-gray-500 border border-gray-200/30 dark:border-white/[0.08]'}`}>
                  <span className="mr-2">❄️</span>
                  Polar Capable
                </div>
                <div className={`px-4 py-2 rounded-[12px] ${launchSite.interplanetaryCapable ? 'bg-orange-500/15 dark:bg-orange-500/20 text-orange-800 dark:text-orange-300 border border-orange-500/20 dark:border-orange-400/20' : 'bg-gray-500/10 dark:bg-white/[0.06] text-gray-400 dark:text-gray-500 border border-gray-200/30 dark:border-white/[0.08]'}`}>
                  <span className="mr-2">🪐</span>
                  Interplanetary
                </div>
                <div className={`px-4 py-2 rounded-[12px] ${launchSite.hasLanding ? 'bg-green-500/15 dark:bg-green-500/20 text-green-800 dark:text-green-300 border border-green-500/20 dark:border-green-400/20' : 'bg-gray-500/10 dark:bg-white/[0.06] text-gray-400 dark:text-gray-500 border border-gray-200/30 dark:border-white/[0.08]'}`}>
                  <span className="mr-2">🛬</span>
                  Landing Pad
                </div>
              </div>
            </div>

            {/* Location Map */}
            <div className="glass-panel p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Location</h2>
              <div className="bg-gray-900/80 rounded-[12px] overflow-hidden relative border border-gray-700/50" style={{ height: '300px' }}>
                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={{
                    scale: 150,
                    center: [
                      launchSite.longitude || 0,
                      launchSite.latitude || 20
                    ],
                  }}
                  style={{ width: '100%', height: '100%', backgroundColor: '#1e3a5f' }}
                >
                  <ZoomableGroup
                    center={[launchSite.longitude || 0, launchSite.latitude || 20]}
                    zoom={1}
                  >
                    <Geographies geography={GEO_URL}>
                      {({ geographies }) =>
                        geographies.map((geo) => (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill="#374151"
                            stroke="#1f2937"
                            strokeWidth={0.5}
                            style={{
                              default: { outline: 'none' },
                              hover: { outline: 'none', fill: '#4b5563' },
                              pressed: { outline: 'none' },
                            }}
                          />
                        ))
                      }
                    </Geographies>

                    {/* Launch Site Marker */}
                    {launchSite.latitude && launchSite.longitude && (
                      <Marker coordinates={[launchSite.longitude, launchSite.latitude]}>
                        {/* Outer pulse ring */}
                        <circle
                          r={16}
                          fill="#EF4444"
                          opacity={0.2}
                          className="animate-ping"
                        />
                        {/* Middle ring */}
                        <circle
                          r={10}
                          fill="#EF4444"
                          opacity={0.4}
                        />
                        {/* Inner marker */}
                        <circle
                          r={6}
                          fill="#EF4444"
                          stroke="#fff"
                          strokeWidth={2}
                        />
                        {/* Label */}
                        <text
                          textAnchor="middle"
                          y={-20}
                          style={{
                            fontFamily: 'system-ui',
                            fontSize: '10px',
                            fill: '#fff',
                            fontWeight: 600,
                            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                          }}
                        >
                          {launchSite.name}
                        </text>
                      </Marker>
                    )}
                  </ZoomableGroup>
                </ComposableMap>

                {/* Coordinates Display */}
                <div className="absolute bottom-2 left-2 bg-gray-900/80 text-white text-sm px-2 py-1 rounded">
                  {launchSite.latitude?.toFixed(4)}° {launchSite.latitude >= 0 ? 'N' : 'S'}, {launchSite.longitude?.toFixed(4)}° {launchSite.longitude >= 0 ? 'E' : 'W'}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Info Cards */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="glass-panel p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Basic Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Operator</span>
                  <span className="font-semibold text-gray-800 dark:text-white">{launchSite.operator || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Established</span>
                  <span className="font-semibold text-gray-800 dark:text-white">{launchSite.established || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Country</span>
                  <span className="font-semibold text-gray-800 dark:text-white">{launchSite.countryId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Region</span>
                  <span className="font-semibold text-gray-800 dark:text-white">{launchSite.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status</span>
                  <span className={`px-2 py-1 rounded-full text-sm ${statusClass}`}>{launchSite.status}</span>
                </div>
              </div>
            </div>

            {/* Coordinates */}
            <div className="glass-panel p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Coordinates</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Latitude</span>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {launchSite.latitude?.toFixed(4) || 'N/A'}°
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Longitude</span>
                  <span className="font-semibold text-gray-800 dark:text-white">
                    {launchSite.longitude?.toFixed(4) || 'N/A'}°
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="glass-panel p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Operational Years</span>
                    <span className="font-semibold text-gray-800 dark:text-white">
                      {launchSite.established ? new Date().getFullYear() - launchSite.established : 'N/A'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-500/20 dark:bg-white/10 rounded-full h-2">
                    <div
                      className="bg-indigo-500 rounded-full h-2"
                      style={{
                        width: `${Math.min(100, (launchSite.established ? (new Date().getFullYear() - launchSite.established) / 70 * 100 : 0))}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Launches per Year (avg)</span>
                    <span className="font-semibold text-gray-800 dark:text-white">
                      {launchSite.established && launchSite.totalLaunches
                        ? (launchSite.totalLaunches / (new Date().getFullYear() - launchSite.established)).toFixed(1)
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Inclination Range */}
            {launchSite.minInclination && launchSite.maxInclination && (
              <div className="glass-panel p-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Inclination Range</h2>
                <div className="relative h-8 bg-gray-500/20 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="absolute h-full bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full"
                    style={{
                      left: `${(launchSite.minInclination / 180) * 100}%`,
                      width: `${((launchSite.maxInclination - launchSite.minInclination) / 180) * 100}%`,
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white mix-blend-difference">
                    {launchSite.minInclination}° - {launchSite.maxInclination}°
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>0°</span>
                  <span>90°</span>
                  <span>180°</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
