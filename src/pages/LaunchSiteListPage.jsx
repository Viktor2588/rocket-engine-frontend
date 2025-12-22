import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLaunchSites, useFilteredLaunchSites, useLaunchSiteStatistics } from '../hooks/useLaunchSites';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';
import {
  Rocket,
  CheckCircle,
  TrendingUp,
  GpsFixed,
  PersonOutline,
  Public,
  AcUnit,
  FlightLand,
} from '@mui/icons-material';

// World TopoJSON URL
const GEO_URL = 'https://unpkg.com/world-atlas@2.0.2/countries-110m.json';

// Status colors
const STATUS_COLORS = {
  Active: 'bg-green-100 text-green-800 border-green-200',
  Inactive: 'bg-gray-100 text-gray-800 border-gray-200 dark:border-gray-700',
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

function StatCard({ label, value, IconComponent, color = 'indigo' }) {
  const colorClasses = {
    indigo: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600',
    green: 'bg-green-50 dark:bg-green-900/30 text-green-600',
    blue: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600',
    purple: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600',
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg p-4`}>
      <div className="flex items-center gap-2 mb-1">
        <IconComponent style={{ fontSize: '1.25rem' }} />
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
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden group"
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-gray-800 group-hover:text-indigo-600 transition">
              {site.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-400">{site.countryId} | {site.region}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusClass}`}>
            {site.status}
          </span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{site.operator}</p>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
            <div className="font-bold text-indigo-600">{site.totalLaunches || 0}</div>
            <div className="text-gray-500 dark:text-gray-400 dark:text-gray-400">Launches</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
            <div className="font-bold text-green-600">{site.successRate?.toFixed(1) || 0}%</div>
            <div className="text-gray-500 dark:text-gray-400 dark:text-gray-400">Success</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
            <div className="font-bold text-blue-600">{site.established || '-'}</div>
            <div className="text-gray-500 dark:text-gray-400 dark:text-gray-400">Est.</div>
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

function LaunchSiteWorldMap({ launchSites, onSiteHover, hoveredSite, onSiteClick }) {
  const [position, setPosition] = useState({ coordinates: [0, 20], zoom: 1 });
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Filter sites that have coordinates
  const sitesWithCoords = useMemo(() => {
    return launchSites.filter(site => site.latitude && site.longitude);
  }, [launchSites]);

  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom * 1.5 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom / 1.5 }));
  };

  const handleReset = () => {
    setPosition({ coordinates: [0, 20], zoom: 1 });
  };

  const handleMouseMove = (e, site) => {
    const rect = e.currentTarget.closest('.map-container')?.getBoundingClientRect();
    if (rect) {
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top - 80,
      });
    }
    onSiteHover(site);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-4 relative overflow-hidden border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-800 dark:text-white text-lg font-semibold">Launch Sites Worldwide</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={handleZoomIn}
            className="p-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white transition"
            title="Zoom in"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white transition"
            title="Zoom out"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <button
            onClick={handleReset}
            className="p-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white transition"
            title="Reset view"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative map-container" style={{ height: '300px' }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 120,
            center: [0, 20],
          }}
          style={{ width: '100%', height: '100%', backgroundColor: '#1e3a5f' }}
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={(pos) => setPosition(pos)}
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

            {/* Launch site markers */}
            {sitesWithCoords.map((site) => {
              const isHovered = hoveredSite?.id === site.id;
              const regionColor = REGION_COLORS[site.region] || '#F59E0B';
              const isActive = site.status === 'Active';

              return (
                <Marker
                  key={site.id}
                  coordinates={[site.longitude, site.latitude]}
                  onMouseEnter={(e) => handleMouseMove(e, site)}
                  onMouseMove={(e) => handleMouseMove(e, site)}
                  onMouseLeave={() => onSiteHover(null)}
                  onClick={() => onSiteClick?.(site)}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Pulse effect for active sites */}
                  {isActive && (
                    <circle
                      r={isHovered ? 12 : 8}
                      fill={regionColor}
                      opacity={0.2}
                      className={isHovered ? '' : 'animate-ping'}
                    />
                  )}
                  {/* Main marker */}
                  <circle
                    r={isHovered ? 6 : 4}
                    fill={isActive ? regionColor : '#6B7280'}
                    stroke={isHovered ? '#fff' : 'rgba(255,255,255,0.5)'}
                    strokeWidth={isHovered ? 2 : 1}
                    className="transition-all duration-200"
                  />
                </Marker>
              );
            })}
          </ZoomableGroup>
        </ComposableMap>

        {/* Tooltip */}
        {hoveredSite && (
          <div
            className="absolute bg-white dark:bg-gray-900/95 rounded-lg shadow-xl p-3 z-20 pointer-events-none border border-gray-200 dark:border-gray-700"
            style={{
              left: `${Math.min(Math.max(tooltipPos.x, 100), 300)}px`,
              top: `${Math.max(tooltipPos.y, 10)}px`,
              minWidth: '200px',
            }}
          >
            <div className="font-semibold text-gray-800 dark:text-white">{hoveredSite.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{hoveredSite.countryId} | {hoveredSite.region}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300 mt-2 space-y-1">
              <div className="flex justify-between">
                <span>Total Launches:</span>
                <span className="font-medium text-gray-800 dark:text-white">{hoveredSite.totalLaunches || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Success Rate:</span>
                <span className="font-medium text-green-600 dark:text-green-400">{hoveredSite.successRate?.toFixed(1) || 0}%</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={`font-medium ${hoveredSite.status === 'Active' ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  {hoveredSite.status}
                </span>
              </div>
            </div>
            <div className="flex gap-1 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              {hoveredSite.humanRated && <PersonOutline titleAccess="Human Rated" style={{ fontSize: '1rem' }} />}
              {hoveredSite.geoCapable && <Public titleAccess="GEO Capable" style={{ fontSize: '1rem' }} />}
              {hoveredSite.polarCapable && <AcUnit titleAccess="Polar Capable" style={{ fontSize: '1rem' }} />}
              {hoveredSite.hasLanding && <FlightLand titleAccess="Landing Capable" style={{ fontSize: '1rem' }} />}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4">
        {Object.entries(REGION_COLORS).map(([region, color]) => (
          <div key={region} className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
            <span className="text-xs text-gray-600 dark:text-gray-300">{region}</span>
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Error Loading Launch Sites</h2>
          <p className="text-gray-600 dark:text-gray-400 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Launch Sites</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Explore spaceports and launch facilities around the world
          </p>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Total Sites"
              value={statistics.total}
              IconComponent={Rocket}
              color="indigo"
            />
            <StatCard
              label="Active Sites"
              value={statistics.active}
              IconComponent={CheckCircle}
              color="green"
            />
            <StatCard
              label="Total Launches"
              value={statistics.totalLaunches?.toLocaleString() || 0}
              IconComponent={TrendingUp}
              color="blue"
            />
            <StatCard
              label="Avg Success Rate"
              value={`${statistics.averageSuccessRate?.toFixed(1) || 0}%`}
              IconComponent={GpsFixed}
              color="purple"
            />
          </div>
        )}

        {/* World Map */}
        <div className="mb-6">
          <LaunchSiteWorldMap
            launchSites={launchSites}
            onSiteHover={setHoveredSite}
            hoveredSite={hoveredSite}
            onSiteClick={(site) => window.location.href = `/launch-sites/${site.id}`}
          />
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search launch sites..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Under Construction">Under Construction</option>
              </select>
            </div>

            {/* Country Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
              <select
                value={filters.countryId}
                onChange={(e) => handleFilterChange('countryId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Countries</option>
                {uniqueCountries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            {/* Region Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Region</label>
              <select
                value={filters.region}
                onChange={(e) => handleFilterChange('region', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
          <div className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-400">
            Showing {sortedSites.length} of {launchSites.length} launch sites
          </div>
          <div className="flex items-center gap-4">
            {/* Sort */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-400">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2 py-1 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded text-sm focus:ring-2 focus:ring-indigo-500"
              >
                <option value="name">Name</option>
                <option value="totalLaunches">Total Launches</option>
                <option value="successRate">Success Rate</option>
                <option value="established">Year Established</option>
              </select>
              <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm hover:bg-gray-100"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>

            {/* View Mode */}
            <div className="flex border border-gray-300 dark:border-gray-600 rounded overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 text-sm ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 text-sm ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 dark:text-gray-400">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 dark:text-gray-400">Country</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 dark:text-gray-400">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600 dark:text-gray-400 dark:text-gray-400">Launches</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600 dark:text-gray-400 dark:text-gray-400">Success Rate</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600 dark:text-gray-400 dark:text-gray-400">Capabilities</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {sortedSites.map(site => {
                  const statusClass = STATUS_COLORS[site.status?.replace(' ', '_')] || STATUS_COLORS.Active;
                  return (
                    <tr key={site.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-3">
                        <Link to={`/launch-sites/${site.id}`} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">
                          {site.name}
                        </Link>
                        <div className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-400">{site.operator}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 dark:text-gray-400">{site.countryId}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
                          {site.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400 dark:text-gray-400">{site.totalLaunches || 0}</td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400 dark:text-gray-400">{site.successRate?.toFixed(1) || 0}%</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-1">
                          {site.humanRated && <PersonOutline titleAccess="Human Rated" style={{ fontSize: '1.25rem' }} className="text-purple-600" />}
                          {site.geoCapable && <Public titleAccess="GEO Capable" style={{ fontSize: '1.25rem' }} className="text-blue-600" />}
                          {site.polarCapable && <AcUnit titleAccess="Polar Capable" style={{ fontSize: '1.25rem' }} className="text-cyan-600" />}
                          {site.hasLanding && <FlightLand titleAccess="Landing Capable" style={{ fontSize: '1.25rem' }} className="text-green-600" />}
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
            <p className="text-gray-500 dark:text-gray-400 dark:text-gray-400">No launch sites found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
