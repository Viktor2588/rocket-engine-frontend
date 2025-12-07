import { useParams, Link } from 'react-router-dom';
import { useLaunchSite } from '../hooks/useLaunchSites';

// Status colors
const STATUS_COLORS = {
  Active: 'bg-green-100 text-green-800',
  Inactive: 'bg-gray-100 text-gray-800',
  'Under Construction': 'bg-yellow-100 text-yellow-800',
  Decommissioned: 'bg-red-100 text-red-800',
};

export default function LaunchSiteDetailPage() {
  const { id } = useParams();
  const { launchSite, loading, error } = useLaunchSite(id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !launchSite) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Launch Site Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The requested launch site could not be found.'}</p>
          <Link to="/launch-sites" className="text-indigo-600 hover:text-indigo-800">
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link to="/launch-sites" className="text-indigo-600 hover:text-indigo-800">
            ← Back to Launch Sites
          </Link>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{launchSite.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusClass}`}>
                  {launchSite.status}
                </span>
                <span className="text-gray-500">|</span>
                <span className="text-gray-600">{launchSite.countryId}</span>
                <span className="text-gray-500">|</span>
                <span className="text-gray-600">{launchSite.region}</span>
              </div>
            </div>
            {launchSite.countryId && (
              <Link
                to={`/countries/${launchSite.countryId}`}
                className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition"
              >
                View Country
              </Link>
            )}
          </div>

          {/* Description */}
          {launchSite.description && (
            <p className="text-gray-600 mt-4">{launchSite.description}</p>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Launch Statistics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Launch Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-indigo-50 rounded-lg p-4 text-center">
                  <span className="text-3xl font-bold text-indigo-600">
                    {launchSite.totalLaunches || 0}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">Total Launches</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <span className="text-3xl font-bold text-green-600">
                    {launchSite.successfulLaunches || 0}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">Successful</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <span className="text-3xl font-bold text-red-600">
                    {(launchSite.totalLaunches || 0) - (launchSite.successfulLaunches || 0)}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">Failed</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <span className="text-3xl font-bold text-purple-600">
                    {successRate.toFixed(1)}%
                  </span>
                  <p className="text-sm text-gray-600 mt-1">Success Rate</p>
                </div>
              </div>

              {/* Success Rate Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Success Rate</span>
                  <span>{successRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 rounded-full h-3 transition-all duration-500"
                    style={{ width: `${successRate}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Orbital Capabilities */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Orbital Capabilities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <span className="text-2xl font-bold text-indigo-600">
                    {launchSite.minInclination ? `${launchSite.minInclination}°` : 'N/A'}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">Min Inclination</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <span className="text-2xl font-bold text-indigo-600">
                    {launchSite.maxInclination ? `${launchSite.maxInclination}°` : 'N/A'}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">Max Inclination</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <span className="text-2xl font-bold text-indigo-600">
                    {launchSite.latitude ? `${launchSite.latitude.toFixed(2)}°` : 'N/A'}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">Latitude</p>
                </div>
              </div>

              {/* Capability Badges */}
              <div className="flex flex-wrap gap-3 mt-4">
                <div className={`px-4 py-2 rounded-lg ${launchSite.humanRated ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-400'}`}>
                  <span className="mr-2">👨‍🚀</span>
                  Human Rated
                </div>
                <div className={`px-4 py-2 rounded-lg ${launchSite.geoCapable ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-400'}`}>
                  <span className="mr-2">🌍</span>
                  GEO Capable
                </div>
                <div className={`px-4 py-2 rounded-lg ${launchSite.polarCapable ? 'bg-cyan-100 text-cyan-800' : 'bg-gray-100 text-gray-400'}`}>
                  <span className="mr-2">❄️</span>
                  Polar Capable
                </div>
                <div className={`px-4 py-2 rounded-lg ${launchSite.interplanetaryCapable ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-400'}`}>
                  <span className="mr-2">🪐</span>
                  Interplanetary
                </div>
                <div className={`px-4 py-2 rounded-lg ${launchSite.hasLanding ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-400'}`}>
                  <span className="mr-2">🛬</span>
                  Landing Pad
                </div>
              </div>
            </div>

            {/* Location Map */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Location</h2>
              <div className="bg-gray-900 rounded-lg p-4 h-64 relative overflow-hidden">
                {/* Simple location indicator */}
                <svg viewBox="0 0 100 50" className="w-full h-full">
                  {/* Ocean */}
                  <rect width="100" height="50" fill="#1E3A5F" />

                  {/* Simple world outline */}
                  <g fill="#2D4A6A" stroke="#3D5A7A" strokeWidth="0.3">
                    <ellipse cx="50" cy="25" rx="45" ry="22" />
                  </g>

                  {/* Grid lines */}
                  <g stroke="#3D5A7A" strokeWidth="0.2" opacity="0.5">
                    <line x1="0" y1="25" x2="100" y2="25" />
                    <line x1="50" y1="0" x2="50" y2="50" />
                  </g>

                  {/* Location marker */}
                  {launchSite.latitude && launchSite.longitude && (
                    <g>
                      <circle
                        cx={50 + (launchSite.longitude / 180) * 45}
                        cy={25 - (launchSite.latitude / 90) * 22}
                        r={3}
                        fill="#EF4444"
                        stroke="#fff"
                        strokeWidth={0.5}
                      />
                      <circle
                        cx={50 + (launchSite.longitude / 180) * 45}
                        cy={25 - (launchSite.latitude / 90) * 22}
                        r={5}
                        fill="#EF4444"
                        opacity={0.3}
                      />
                    </g>
                  )}
                </svg>

                {/* Coordinates Display */}
                <div className="absolute bottom-2 left-2 text-white text-sm">
                  {launchSite.latitude?.toFixed(4)}° N, {launchSite.longitude?.toFixed(4)}° E
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Info Cards */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Basic Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Operator</span>
                  <span className="font-semibold text-gray-800">{launchSite.operator || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Established</span>
                  <span className="font-semibold text-gray-800">{launchSite.established || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Country</span>
                  <span className="font-semibold text-gray-800">{launchSite.countryId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Region</span>
                  <span className="font-semibold text-gray-800">{launchSite.region}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-2 py-1 rounded text-sm ${statusClass}`}>{launchSite.status}</span>
                </div>
              </div>
            </div>

            {/* Coordinates */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Coordinates</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Latitude</span>
                  <span className="font-semibold text-gray-800">
                    {launchSite.latitude?.toFixed(4) || 'N/A'}°
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Longitude</span>
                  <span className="font-semibold text-gray-800">
                    {launchSite.longitude?.toFixed(4) || 'N/A'}°
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Operational Years</span>
                    <span className="font-semibold">
                      {launchSite.established ? new Date().getFullYear() - launchSite.established : 'N/A'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
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
                    <span className="text-gray-600">Launches per Year (avg)</span>
                    <span className="font-semibold">
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
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Inclination Range</h2>
                <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden">
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
                <div className="flex justify-between text-xs text-gray-500 mt-1">
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
