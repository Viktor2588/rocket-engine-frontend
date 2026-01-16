import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLaunchSites, useLaunchSiteStatistics } from '../hooks/useLaunchSites';
import SortableHeader, { SortableGridHeader } from '../components/SortableHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import ViewToggle from '../components/ViewToggle';
import { FilterPanel, FilterSection, FilterToggle } from '../components/filters';
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
  Search,
  LocationOn,
} from '@mui/icons-material';

// World TopoJSON URL
const GEO_URL = 'https://unpkg.com/world-atlas@2.0.2/countries-110m.json';

// Status colors - glass styled
const STATUS_COLORS = {
  Active: 'glass-badge-success',
  Inactive: 'glass-badge',
  Under_Construction: 'glass-badge-warning',
  Decommissioned: 'glass-badge-error',
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
    indigo: 'glass-tinted-indigo text-indigo-600 dark:text-indigo-400',
    green: 'glass-tinted-green text-green-600 dark:text-green-400',
    blue: 'glass-tinted-blue text-blue-600 dark:text-blue-400',
    purple: 'glass-tinted-purple text-purple-600 dark:text-purple-400',
  };

  return (
    <div className={`${colorClasses[color]} p-4`}>
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
      className="glass-panel glass-float overflow-hidden group"
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-gray-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
              {site.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{site.countryId} | {site.region}</p>
          </div>
          <span className={statusClass}>
            {site.status}
          </span>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{site.operator}</p>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-gray-500/10 dark:bg-white/[0.06] rounded-[10px] p-2 border border-gray-200/30 dark:border-white/[0.08]">
            <div className="font-bold text-indigo-600 dark:text-indigo-400">{site.totalLaunches || 0}</div>
            <div className="text-gray-500 dark:text-gray-400">Launches</div>
          </div>
          <div className="bg-gray-500/10 dark:bg-white/[0.06] rounded-[10px] p-2 border border-gray-200/30 dark:border-white/[0.08]">
            <div className="font-bold text-green-600 dark:text-green-400">{site.successRate?.toFixed(1) || 0}%</div>
            <div className="text-gray-500 dark:text-gray-400">Success</div>
          </div>
          <div className="bg-gray-500/10 dark:bg-white/[0.06] rounded-[10px] p-2 border border-gray-200/30 dark:border-white/[0.08]">
            <div className="font-bold text-blue-600 dark:text-blue-400">{site.established || '-'}</div>
            <div className="text-gray-500 dark:text-gray-400">Est.</div>
          </div>
        </div>

        {/* Capabilities */}
        <div className="flex gap-1 mt-3 flex-wrap">
          {site.humanRated && (
            <span className="px-2 py-0.5 bg-purple-500/15 dark:bg-purple-500/25 text-purple-700 dark:text-purple-300 rounded-full text-xs border border-purple-400/20 backdrop-blur-sm">Human Rated</span>
          )}
          {site.geoCapable && (
            <span className="px-2 py-0.5 bg-blue-500/15 dark:bg-blue-500/25 text-blue-700 dark:text-blue-300 rounded-full text-xs border border-blue-400/20 backdrop-blur-sm">GEO</span>
          )}
          {site.polarCapable && (
            <span className="px-2 py-0.5 bg-cyan-500/15 dark:bg-cyan-500/25 text-cyan-700 dark:text-cyan-300 rounded-full text-xs border border-cyan-400/20 backdrop-blur-sm">Polar</span>
          )}
          {site.hasLanding && (
            <span className="px-2 py-0.5 bg-green-500/15 dark:bg-green-500/25 text-green-700 dark:text-green-300 rounded-full text-xs border border-green-400/20 backdrop-blur-sm">Landing</span>
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
    <div className="glass-panel p-4 relative overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-800 dark:text-white text-lg font-semibold">Launch Sites Worldwide</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-[10px] bg-gray-500/10 dark:bg-white/[0.08] hover:bg-gray-500/20 dark:hover:bg-white/[0.12] text-gray-700 dark:text-white transition border border-gray-200/30 dark:border-white/[0.08]"
            title="Zoom in"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-[10px] bg-gray-500/10 dark:bg-white/[0.08] hover:bg-gray-500/20 dark:hover:bg-white/[0.12] text-gray-700 dark:text-white transition border border-gray-200/30 dark:border-white/[0.08]"
            title="Zoom out"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-[10px] bg-gray-500/10 dark:bg-white/[0.08] hover:bg-gray-500/20 dark:hover:bg-white/[0.12] text-gray-700 dark:text-white transition border border-gray-200/30 dark:border-white/[0.08]"
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
            className="absolute glass-panel shadow-glass-lg p-3 z-20 pointer-events-none"
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
            <div className="flex gap-1 mt-2 pt-2 border-t border-gray-200/50 dark:border-white/[0.08]">
              {hoveredSite.humanRated && <PersonOutline titleAccess="Human Rated" className="text-purple-600 dark:text-purple-400" style={{ fontSize: '1rem' }} />}
              {hoveredSite.geoCapable && <Public titleAccess="GEO Capable" className="text-blue-600 dark:text-blue-400" style={{ fontSize: '1rem' }} />}
              {hoveredSite.polarCapable && <AcUnit titleAccess="Polar Capable" className="text-cyan-600 dark:text-cyan-400" style={{ fontSize: '1rem' }} />}
              {hoveredSite.hasLanding && <FlightLand titleAccess="Landing Capable" className="text-green-600 dark:text-green-400" style={{ fontSize: '1rem' }} />}
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

  // Multi-select filter states
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [selectedCapabilities, setSelectedCapabilities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Toggle functions
  const toggleStatus = useCallback((status) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
  }, []);

  const toggleCountry = useCallback((country) => {
    setSelectedCountries(prev =>
      prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]
    );
  }, []);

  const toggleRegion = useCallback((region) => {
    setSelectedRegions(prev =>
      prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]
    );
  }, []);

  const toggleCapability = useCallback((capability) => {
    setSelectedCapabilities(prev =>
      prev.includes(capability) ? prev.filter(c => c !== capability) : [...prev, capability]
    );
  }, []);

  // Calculate filter counts
  const filterCounts = useMemo(() => {
    const counts = {
      statuses: {},
      countries: {},
      regions: {},
      capabilities: { humanRated: 0, geoCapable: 0, polarCapable: 0, hasLanding: 0 }
    };

    launchSites.forEach(site => {
      if (site.status) counts.statuses[site.status] = (counts.statuses[site.status] || 0) + 1;
      if (site.countryId) counts.countries[site.countryId] = (counts.countries[site.countryId] || 0) + 1;
      if (site.region) counts.regions[site.region] = (counts.regions[site.region] || 0) + 1;
      if (site.humanRated) counts.capabilities.humanRated++;
      if (site.geoCapable) counts.capabilities.geoCapable++;
      if (site.polarCapable) counts.capabilities.polarCapable++;
      if (site.hasLanding) counts.capabilities.hasLanding++;
    });

    return counts;
  }, [launchSites]);

  // Get unique values for filters
  const uniqueStatuses = useMemo(() =>
    [...new Set(launchSites.map(s => s.status).filter(Boolean))].sort(),
    [launchSites]
  );

  const uniqueCountries = useMemo(() =>
    [...new Set(launchSites.map(s => s.countryId).filter(Boolean))].sort(),
    [launchSites]
  );

  const uniqueRegions = useMemo(() =>
    [...new Set(launchSites.map(s => s.region).filter(Boolean))].sort(),
    [launchSites]
  );

  // Filter and sort logic
  const filteredAndSorted = useMemo(() => {
    let result = [...launchSites];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(site =>
        site.name?.toLowerCase().includes(query) ||
        site.operator?.toLowerCase().includes(query) ||
        site.countryId?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (selectedStatuses.length > 0) {
      result = result.filter(site => selectedStatuses.includes(site.status));
    }

    // Apply country filter
    if (selectedCountries.length > 0) {
      result = result.filter(site => selectedCountries.includes(site.countryId));
    }

    // Apply region filter
    if (selectedRegions.length > 0) {
      result = result.filter(site => selectedRegions.includes(site.region));
    }

    // Apply capability filters
    if (selectedCapabilities.length > 0) {
      result = result.filter(site => {
        return selectedCapabilities.every(cap => {
          switch (cap) {
            case 'humanRated': return site.humanRated;
            case 'geoCapable': return site.geoCapable;
            case 'polarCapable': return site.polarCapable;
            case 'hasLanding': return site.hasLanding;
            default: return true;
          }
        });
      });
    }

    // Sort
    result.sort((a, b) => {
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

    return result;
  }, [launchSites, searchQuery, selectedStatuses, selectedCountries, selectedRegions, selectedCapabilities, sortBy, sortOrder]);

  // Build active filters array
  const activeFilters = useMemo(() => {
    const filters = [];

    if (searchQuery) {
      filters.push({
        key: 'search',
        label: `Search: "${searchQuery}"`,
        color: 'indigo',
        onRemove: () => setSearchQuery('')
      });
    }

    selectedStatuses.forEach(status => {
      filters.push({
        key: `status-${status}`,
        label: status,
        color: status === 'Active' ? 'green' : status === 'Inactive' ? 'orange' : 'blue',
        onRemove: () => toggleStatus(status)
      });
    });

    selectedCountries.forEach(country => {
      filters.push({
        key: `country-${country}`,
        label: country,
        color: 'purple',
        onRemove: () => toggleCountry(country)
      });
    });

    selectedRegions.forEach(region => {
      filters.push({
        key: `region-${region}`,
        label: region,
        color: 'cyan',
        onRemove: () => toggleRegion(region)
      });
    });

    selectedCapabilities.forEach(cap => {
      const labels = {
        humanRated: 'Human Rated',
        geoCapable: 'GEO Capable',
        polarCapable: 'Polar Capable',
        hasLanding: 'Landing'
      };
      const colors = {
        humanRated: 'purple',
        geoCapable: 'blue',
        polarCapable: 'cyan',
        hasLanding: 'green'
      };
      filters.push({
        key: `cap-${cap}`,
        label: labels[cap],
        color: colors[cap],
        onRemove: () => toggleCapability(cap)
      });
    });

    return filters;
  }, [searchQuery, selectedStatuses, selectedCountries, selectedRegions, selectedCapabilities, toggleStatus, toggleCountry, toggleRegion, toggleCapability]);

  const clearAllFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedStatuses([]);
    setSelectedCountries([]);
    setSelectedRegions([]);
    setSelectedCapabilities([]);
  }, []);

  // Sort handler for table/grid headers
  const handleSort = useCallback((key, order) => {
    setSortBy(key);
    setSortOrder(order);
  }, []);

  // Sort columns configuration
  const sortColumns = [
    { key: 'name', label: 'Name' },
    { key: 'totalLaunches', label: 'Launches' },
    { key: 'successRate', label: 'Success Rate' },
    { key: 'established', label: 'Established' },
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <LoadingSpinner message="Loading launch sites..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-panel p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Error Loading Launch Sites</h2>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <LocationOn style={{ fontSize: '2.5rem' }} className="text-gray-900 dark:text-white" /> Launch Sites
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore {launchSites.length} spaceports and launch facilities around the world
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

        {/* Filter Panel */}
        <FilterPanel
          activeFilters={activeFilters}
          onClearAll={clearAllFilters}
          headerActions={
            <div className="flex items-center gap-3">
              <ViewToggle
                viewMode={viewMode}
                setViewMode={setViewMode}
                options={['grid', 'table', 'map']}
              />
            </div>
          }
        >
          {/* Search */}
          <FilterSection title="Search">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" style={{ fontSize: '1.25rem' }} />
              <input
                type="text"
                placeholder="Search launch sites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass-input pl-10 w-full"
              />
            </div>
          </FilterSection>

          {/* Status */}
          <FilterSection title="Status">
            {uniqueStatuses.map(status => (
              <FilterToggle
                key={status}
                label={status}
                active={selectedStatuses.includes(status)}
                onClick={() => toggleStatus(status)}
                count={filterCounts.statuses[status]}
              />
            ))}
          </FilterSection>

          {/* Regions */}
          <FilterSection title="Region">
            {uniqueRegions.map(region => (
              <FilterToggle
                key={region}
                label={region}
                active={selectedRegions.includes(region)}
                onClick={() => toggleRegion(region)}
                count={filterCounts.regions[region]}
              />
            ))}
          </FilterSection>

          {/* Countries - limit to first 12 */}
          <FilterSection title="Country">
            {uniqueCountries.slice(0, 12).map(country => (
              <FilterToggle
                key={country}
                label={country}
                active={selectedCountries.includes(country)}
                onClick={() => toggleCountry(country)}
                count={filterCounts.countries[country]}
              />
            ))}
            {uniqueCountries.length > 12 && (
              <span className="text-xs text-gray-500 dark:text-gray-400 self-center">
                +{uniqueCountries.length - 12} more
              </span>
            )}
          </FilterSection>

          {/* Capabilities */}
          <FilterSection title="Capabilities">
            <FilterToggle
              label="Human Rated"
              active={selectedCapabilities.includes('humanRated')}
              onClick={() => toggleCapability('humanRated')}
              count={filterCounts.capabilities.humanRated}
            />
            <FilterToggle
              label="GEO Capable"
              active={selectedCapabilities.includes('geoCapable')}
              onClick={() => toggleCapability('geoCapable')}
              count={filterCounts.capabilities.geoCapable}
            />
            <FilterToggle
              label="Polar Capable"
              active={selectedCapabilities.includes('polarCapable')}
              onClick={() => toggleCapability('polarCapable')}
              count={filterCounts.capabilities.polarCapable}
            />
            <FilterToggle
              label="Landing"
              active={selectedCapabilities.includes('hasLanding')}
              onClick={() => toggleCapability('hasLanding')}
              count={filterCounts.capabilities.hasLanding}
            />
          </FilterSection>
        </FilterPanel>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredAndSorted.length} of {launchSites.length} launch sites
          </div>
        </div>

        {/* World Map - shown in map view */}
        {viewMode === 'map' && (
          <div className="mb-6">
            <LaunchSiteWorldMap
              launchSites={filteredAndSorted}
              onSiteHover={setHoveredSite}
              hoveredSite={hoveredSite}
              onSiteClick={(site) => window.location.href = `/launch-sites/${site.id}`}
            />
          </div>
        )}

        {/* Launch Sites Grid/Table */}
        {viewMode === 'grid' && (
          <div className="space-y-4">
            <SortableGridHeader
              columns={sortColumns}
              currentSort={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAndSorted.map(site => (
                <LaunchSiteCard key={site.id} site={site} />
              ))}
            </div>
          </div>
        )}

        {viewMode === 'table' && (
          <div className="glass-panel overflow-hidden">
            <table className="w-full">
              <thead className="glass-header-gradient">
                <tr>
                  <SortableHeader
                    label="Name"
                    sortKey="name"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <SortableHeader label="Country" sortKey={null} />
                  <SortableHeader label="Region" sortKey={null} />
                  <SortableHeader label="Status" sortKey={null} />
                  <SortableHeader
                    label="Launches"
                    sortKey="totalLaunches"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                    align="right"
                  />
                  <SortableHeader
                    label="Success Rate"
                    sortKey="successRate"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                    align="right"
                  />
                  <SortableHeader label="Capabilities" sortKey={null} align="center" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50 dark:divide-white/[0.08]">
                {filteredAndSorted.map((site, index) => {
                  const statusClass = STATUS_COLORS[site.status?.replace(' ', '_')] || STATUS_COLORS.Active;
                  return (
                    <tr key={site.id} className={`${index % 2 === 0 ? 'bg-transparent' : 'bg-gray-500/[0.03] dark:bg-white/[0.02]'} hover:bg-gray-500/[0.05] dark:hover:bg-white/[0.03] transition-colors`}>
                      <td className="px-4 py-3">
                        <Link to={`/launch-sites/${site.id}`} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">
                          {site.name}
                        </Link>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{site.operator}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{site.countryId}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{site.region}</td>
                      <td className="px-4 py-3">
                        <span className={statusClass}>
                          {site.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400">{site.totalLaunches || 0}</td>
                      <td className="px-4 py-3 text-right text-sm text-gray-600 dark:text-gray-400">{site.successRate?.toFixed(1) || 0}%</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-1">
                          {site.humanRated && <PersonOutline titleAccess="Human Rated" style={{ fontSize: '1.25rem' }} className="text-purple-600 dark:text-purple-400" />}
                          {site.geoCapable && <Public titleAccess="GEO Capable" style={{ fontSize: '1.25rem' }} className="text-blue-600 dark:text-blue-400" />}
                          {site.polarCapable && <AcUnit titleAccess="Polar Capable" style={{ fontSize: '1.25rem' }} className="text-cyan-600 dark:text-cyan-400" />}
                          {site.hasLanding && <FlightLand titleAccess="Landing Capable" style={{ fontSize: '1.25rem' }} className="text-green-600 dark:text-green-400" />}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filteredAndSorted.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No launch sites found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
