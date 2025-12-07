import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLaunchSites, useFilteredLaunchSites, useLaunchSiteStatistics } from '../hooks/useLaunchSites';

// Status colors
const STATUS_COLORS = {
  Active: 'bg-green-100 text-green-800 border-green-200',
  Inactive: 'bg-gray-100 text-gray-800 border-gray-200',
  Under_Construction: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Decommissioned: 'bg-red-100 text-red-800 border-red-200',
};

// Region colors for map dots
const REGION_COLORS = {
  'North America': '#3B82F6',
  'South America': '#10B981',
  'Europe': '#8B5CF6',
  'Asia': '#F59E0B',
  'Africa': '#EF4444',
  'Oceania': '#06B6D4',
};

// Launch site positions for simple map
const SITE_POSITIONS = {
  'Kennedy Space Center': { x: 22, y: 42 },
  'Cape Canaveral Space Force Station': { x: 22, y: 43 },
  'Vandenberg Space Force Base': { x: 12, y: 40 },
  'Baikonur Cosmodrome': { x: 57, y: 35 },
  'Plesetsk Cosmodrome': { x: 53, y: 25 },
  'Jiuquan Satellite Launch Center': { x: 70, y: 38 },
  'Wenchang Space Launch Center': { x: 73, y: 48 },
  'Satish Dhawan Space Centre': { x: 64, y: 50 },
  'Tanegashima Space Center': { x: 80, y: 42 },
  'Guiana Space Centre': { x: 30, y: 55 },
  'Starbase': { x: 18, y: 44 },
  'Naro Space Center': { x: 78, y: 40 },
};

function StatCard({ label, value, icon, color = 'indigo' }) {
  const colorClasses = {
    indigo: 'bg-indigo-50 text-indigo-600',
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg p-4`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

function LaunchSiteCard({ site }) {
  const statusClass = STATUS_COLORS[site.status?.replace(' ', '_')] || STATUS_COLORS.Active;

  return (
    <Link
      to={`/launch-sites/${site.id}`}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden group"
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-gray-800 group-hover:text-indigo-600 transition">
              {site.name}
            </h3>
            <p className="text-sm text-gray-500">{site.countryId} | {site.region}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusClass}`}>
            {site.status}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{site.operator}</p>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-gray-50 rounded p-2">
            <div className="font-bold text-indigo-600">{site.totalLaunches || 0}</div>
            <div className="text-gray-500">Launches</div>
          </div>
          <div className="bg-gray-50 rounded p-2">
            <div className="font-bold text-green-600">{site.successRate?.toFixed(1) || 0}%</div>
            <div className="text-gray-500">Success</div>
          </div>
          <div className="bg-gray-50 rounded p-2">
            <div className="font-bold text-blue-600">{site.established || '-'}</div>
            <div className="text-gray-500">Est.</div>
          </div>
        </div>

        {/* Capabilities */}
        <div className="flex gap-1 mt-3 flex-wrap">
          {site.humanRated && (
            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">Human Rated</span>
          )}
          {site.geoCapable && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">GEO</span>
          )}
          {site.polarCapable && (
            <span className="px-2 py-0.5 bg-cyan-100 text-cyan-700 rounded text-xs">Polar</span>
          )}
          {site.hasLanding && (
            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Landing</span>
          )}
        </div>
      </div>
    </Link>
  );
}

function SimpleWorldMap({ launchSites, onSiteHover, hoveredSite }) {
  return (
    <div className="bg-gray-900 rounded-lg p-4 relative overflow-hidden">
      <h3 className="text-white text-lg font-semibold mb-4">Launch Sites Worldwide</h3>

      {/* Simple World Map SVG */}
      <svg viewBox="0 0 100 60" className="w-full h-48">
        {/* Ocean background */}
        <rect width="100" height="60" fill="#1E3A5F" />

        {/* Simplified continents */}
        <g fill="#2D4A6A" stroke="#3D5A7A" strokeWidth="0.3">
          {/* North America */}
          <path d="M5,15 Q15,10 25,12 L28,20 Q30,28 25,35 L20,38 Q10,35 8,25 Z" />
          {/* South America */}
          <path d="M22,42 Q28,40 32,45 L30,58 Q25,60 22,55 L20,48 Z" />
          {/* Europe */}
          <path d="M42,18 Q50,15 55,18 L54,28 Q50,32 44,30 L42,24 Z" />
          {/* Africa */}
          <path d="M42,32 Q52,30 55,35 L52,52 Q45,55 42,50 L40,40 Z" />
          {/* Asia */}
          <path d="M55,15 Q75,10 85,18 L88,35 Q82,45 70,48 L60,42 Q55,35 55,25 Z" />
          {/* Australia */}
          <path d="M78,48 Q85,45 90,50 L88,55 Q82,58 78,54 Z" />
        </g>

        {/* Launch site markers */}
        {launchSites.map((site) => {
          const pos = SITE_POSITIONS[site.name];
          if (!pos) return null;

          const isHovered = hoveredSite?.id === site.id;
          const regionColor = REGION_COLORS[site.region] || '#F59E0B';

          return (
            <g key={site.id}>
              {/* Glow effect for hovered */}
              {isHovered && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={3}
                  fill={regionColor}
                  opacity={0.3}
                />
              )}
              {/* Main marker */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isHovered ? 2 : 1.5}
                fill={regionColor}
                stroke="#fff"
                strokeWidth={0.3}
                className="cursor-pointer transition-all"
                onMouseEnter={() => onSiteHover(site)}
                onMouseLeave={() => onSiteHover(null)}
              />
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredSite && (
        <div className="absolute top-16 right-4 bg-white rounded-lg shadow-lg p-3 min-w-[180px]">
          <div className="font-semibold text-gray-800">{hoveredSite.name}</div>
          <div className="text-sm text-gray-500">{hoveredSite.countryId}</div>
          <div className="text-sm text-gray-600 mt-1">
            {hoveredSite.totalLaunches} launches | {hoveredSite.successRate?.toFixed(1)}% success
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4">
        {Object.entries(REGION_COLORS).map(([region, color]) => (
          <div key={region} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
            <span className="text-xs text-gray-300">{region}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LaunchSiteListPage() {
  const { launchSites, loading, error } = useLaunchSites();
  const { statistics } = useLaunchSiteStatistics();
  const [viewMode, setViewMode] = useState('grid');
  const [hoveredSite, setHoveredSite] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    countryId: '',
    region: '',
    humanRated: undefined,
    polarCapable: undefined,
    geoCapable: undefined,
    search: '',
  });
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const filteredSites = useFilteredLaunchSites(launchSites, filters);

  // Sort the filtered sites
  const sortedSites = useMemo(() => {
    const sorted = [...filteredSites].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '');
          break;
        case 'totalLaunches':
          comparison = (b.totalLaunches || 0) - (a.totalLaunches || 0);
          break;
        case 'successRate':
          comparison = (b.successRate || 0) - (a.successRate || 0);
          break;
        case 'established':
          comparison = (a.established || 9999) - (b.established || 9999);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    return sorted;
  }, [filteredSites, sortBy, sortOrder]);

  // Get unique values for filters
  const uniqueCountries = useMemo(() =>
    [...new Set(launchSites.map(s => s.countryId).filter(Boolean))].sort(),
    [launchSites]
  );

  const uniqueRegions = useMemo(() =>
    [...new Set(launchSites.map(s => s.region).filter(Boolean))].sort(),
    [launchSites]
  );

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Launch Sites</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Launch Sites</h1>
          <p className="text-gray-600 mt-2">
            Explore spaceports and launch facilities around the world
          </p>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Total Sites"
              value={statistics.total}
              icon="🚀"
              color="indigo"
            />
            <StatCard
              label="Active Sites"
              value={statistics.active}
              icon="✅"
              color="green"
            />
            <StatCard
              label="Total Launches"
              value={statistics.totalLaunches?.toLocaleString() || 0}
              icon="📈"
              color="blue"
            />
            <StatCard
              label="Avg Success Rate"
              value={`${statistics.averageSuccessRate?.toFixed(1) || 0}%`}
              icon="🎯"
              color="purple"
            />
          </div>
        )}

        {/* World Map */}
        <div className="mb-6">
          <SimpleWorldMap
            launchSites={launchSites}
            onSiteHover={setHoveredSite}
            hoveredSite={hoveredSite}
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search launch sites..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Under Construction">Under Construction</option>
              </select>
            </div>

            {/* Country Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <select
                value={filters.countryId}
                onChange={(e) => handleFilterChange('countryId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Countries</option>
                {uniqueCountries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            {/* Region Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
              <select
                value={filters.region}
                onChange={(e) => handleFilterChange('region', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Regions</option>
                {uniqueRegions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Capability Filters */}
          <div className="flex flex-wrap gap-4 mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.humanRated === true}
                onChange={(e) => handleFilterChange('humanRated', e.target.checked ? true : undefined)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Human Rated</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.geoCapable === true}
                onChange={(e) => handleFilterChange('geoCapable', e.target.checked ? true : undefined)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">GEO Capable</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.polarCapable === true}
                onChange={(e) => handleFilterChange('polarCapable', e.target.checked ? true : undefined)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Polar Capable</span>
            </label>
          </div>
        </div>

        {/* Sort and View Controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600">
            Showing {sortedSites.length} of {launchSites.length} launch sites
          </div>
          <div className="flex items-center gap-4">
            {/* Sort */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500"
              >
                <option value="name">Name</option>
                <option value="totalLaunches">Total Launches</option>
                <option value="successRate">Success Rate</option>
                <option value="established">Year Established</option>
              </select>
              <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 text-sm ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 text-sm ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Launch Sites Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedSites.map(site => (
              <LaunchSiteCard key={site.id} site={site} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Country</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Launches</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">Success Rate</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">Capabilities</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedSites.map(site => {
                  const statusClass = STATUS_COLORS[site.status?.replace(' ', '_')] || STATUS_COLORS.Active;
                  return (
                    <tr key={site.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link to={`/launch-sites/${site.id}`} className="text-indigo-600 hover:text-indigo-800 font-medium">
                          {site.name}
                        </Link>
                        <div className="text-xs text-gray-500">{site.operator}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{site.countryId}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
                          {site.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600">{site.totalLaunches || 0}</td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600">{site.successRate?.toFixed(1) || 0}%</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-1">
                          {site.humanRated && <span title="Human Rated">👨‍🚀</span>}
                          {site.geoCapable && <span title="GEO Capable">🌍</span>}
                          {site.polarCapable && <span title="Polar Capable">❄️</span>}
                          {site.hasLanding && <span title="Landing Capable">🛬</span>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {sortedSites.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No launch sites found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
