import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useSatellites, useSatelliteStatistics } from '../hooks/useSatellites';
import SortableHeader, { SortableGridHeader } from '../components/SortableHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import ViewToggle from '../components/ViewToggle';
import { FilterPanel, FilterSection, FilterToggle } from '../components/filters';
import Pagination from '../components/Pagination';
import {
  SettingsInputAntenna,
  Explore,
  Science,
  Cloud,
  Public,
  Satellite,
  MilitaryTech,
  NightlightRound,
  SatelliteAlt,
} from '@mui/icons-material';

// Satellite type icons and colors
const SATELLITE_TYPE_CONFIG = {
  'Communication': { IconComponent: SettingsInputAntenna, color: 'bg-blue-500', textColor: 'text-blue-600' },
  'Navigation': { IconComponent: Explore, color: 'bg-green-500', textColor: 'text-green-600' },
  'Scientific': { IconComponent: Science, color: 'bg-purple-500', textColor: 'text-purple-600' },
  'Weather': { IconComponent: Cloud, color: 'bg-cyan-500', textColor: 'text-cyan-600' },
  'Earth Observation': { IconComponent: Public, color: 'bg-teal-500', textColor: 'text-teal-600' },
  'Space Station': { IconComponent: Satellite, color: 'bg-indigo-500', textColor: 'text-indigo-600' },
  'Military': { IconComponent: MilitaryTech, color: 'bg-red-500', textColor: 'text-red-600' },
  'Lunar Probe': { IconComponent: NightlightRound, color: 'bg-amber-500', textColor: 'text-amber-600' },
};

// Orbit type colors
const ORBIT_COLORS = {
  'LEO': 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300',
  'MEO': 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300',
  'GEO': 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300',
  'HEO': 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300',
  'L2': 'bg-pink-100 dark:bg-pink-900/40 text-pink-800 dark:text-pink-300',
  'Lunar': 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300',
};

// Status colors
const STATUS_COLORS = {
  'Active': 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300',
  'Inactive': 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
  'Decommissioned': 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300',
  'Completed': 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300',
};

function SatelliteCard({ satellite }) {
  const typeConfig = SATELLITE_TYPE_CONFIG[satellite.type] || { IconComponent: SatelliteAlt, color: 'bg-gray-500', textColor: 'text-gray-600' };
  const orbitColor = ORBIT_COLORS[satellite.orbitType] || 'bg-gray-500/15 dark:bg-gray-500/25 text-gray-700 dark:text-gray-300';
  const statusColor = STATUS_COLORS[satellite.status] || 'bg-gray-500/15 dark:bg-gray-500/25 text-gray-700 dark:text-gray-300';
  const IconComponent = typeConfig.IconComponent;

  return (
    <Link
      to={`/satellites/${satellite.id}`}
      className="block glass-panel glass-float overflow-hidden"
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${typeConfig.color} flex items-center justify-center text-white`}>
              <IconComponent style={{ fontSize: '1.75rem' }} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">{satellite.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{satellite.operator || 'Unknown operator'}</p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
            {satellite.status}
          </span>
        </div>

        {/* Type and Orbit badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeConfig.textColor} bg-opacity-10`} style={{ backgroundColor: `${typeConfig.color}20` }}>
            {satellite.type}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${orbitColor}`}>
            {satellite.orbitType}
          </span>
          {satellite.constellation && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300">
              {satellite.constellation}
            </span>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {satellite.altitude && (
            <div className="bg-gray-500/10 dark:bg-white/[0.06] rounded-[10px] p-2 border border-gray-200/30 dark:border-white/[0.08]">
              <span className="text-gray-500 dark:text-gray-400 text-xs">Altitude</span>
              <p className="font-semibold text-gray-800 dark:text-white">
                {satellite.altitude >= 1000
                  ? `${(satellite.altitude / 1000).toFixed(1)}K km`
                  : `${satellite.altitude} km`}
              </p>
            </div>
          )}
          {satellite.massKg && (
            <div className="bg-gray-500/10 dark:bg-white/[0.06] rounded-[10px] p-2 border border-gray-200/30 dark:border-white/[0.08]">
              <span className="text-gray-500 dark:text-gray-400 text-xs">Mass</span>
              <p className="font-semibold text-gray-800 dark:text-white">
                {satellite.massKg >= 1000
                  ? `${(satellite.massKg / 1000).toFixed(1)} t`
                  : `${satellite.massKg} kg`}
              </p>
            </div>
          )}
          {satellite.launchYear && (
            <div className="bg-gray-500/10 dark:bg-white/[0.06] rounded-[10px] p-2 border border-gray-200/30 dark:border-white/[0.08]">
              <span className="text-gray-500 dark:text-gray-400 text-xs">Launched</span>
              <p className="font-semibold text-gray-800 dark:text-white">{satellite.launchYear}</p>
            </div>
          )}
          {satellite.inclination && (
            <div className="bg-gray-500/10 dark:bg-white/[0.06] rounded-[10px] p-2 border border-gray-200/30 dark:border-white/[0.08]">
              <span className="text-gray-500 dark:text-gray-400 text-xs">Inclination</span>
              <p className="font-semibold text-gray-800 dark:text-white">{satellite.inclination}°</p>
            </div>
          )}
        </div>

        {/* Purpose */}
        {satellite.purpose && (
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{satellite.purpose}</p>
        )}

        {/* Country flag */}
        <div className="mt-3 pt-3 border-t border-gray-200/50 dark:border-white/[0.08] flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{satellite.countryId}</span>
          {satellite.noradId && (
            <span className="text-xs text-gray-400 dark:text-gray-500">NORAD: {satellite.noradId}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function SatelliteListPage() {
  const { satellites, loading, error } = useSatellites();
  const { statistics } = useSatelliteStatistics();

  // Multi-select filter states
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedOrbits, setSelectedOrbits] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedConstellations, setSelectedConstellations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Toggle functions for multi-select
  const toggleType = useCallback((type) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
    setCurrentPage(1);
  }, []);

  const toggleOrbit = useCallback((orbit) => {
    setSelectedOrbits(prev =>
      prev.includes(orbit) ? prev.filter(o => o !== orbit) : [...prev, orbit]
    );
    setCurrentPage(1);
  }, []);

  const toggleStatus = useCallback((status) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
    setCurrentPage(1);
  }, []);

  const toggleCountry = useCallback((country) => {
    setSelectedCountries(prev =>
      prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]
    );
    setCurrentPage(1);
  }, []);

  const toggleConstellation = useCallback((constellation) => {
    setSelectedConstellations(prev =>
      prev.includes(constellation) ? prev.filter(c => c !== constellation) : [...prev, constellation]
    );
    setCurrentPage(1);
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedTypes([]);
    setSelectedOrbits([]);
    setSelectedStatuses([]);
    setSelectedCountries([]);
    setSelectedConstellations([]);
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  const hasActiveFilters = selectedTypes.length > 0 || selectedOrbits.length > 0 ||
    selectedStatuses.length > 0 || selectedCountries.length > 0 ||
    selectedConstellations.length > 0 || searchQuery;

  // Sort handler for table/grid headers
  const handleSort = useCallback((key, order) => {
    setSortBy(key);
    setSortOrder(order);
  }, []);

  // Sort columns configuration
  const sortColumns = [
    { key: 'name', label: 'Name' },
    { key: 'launchYear', label: 'Launch Year' },
    { key: 'altitude', label: 'Altitude' },
    { key: 'mass', label: 'Mass' },
  ];

  // Get unique values for filters
  const filterOptions = useMemo(() => {
    return {
      types: [...new Set(satellites.map(s => s.type).filter(Boolean))].sort(),
      orbits: [...new Set(satellites.map(s => s.orbitType).filter(Boolean))].sort(),
      statuses: [...new Set(satellites.map(s => s.status).filter(Boolean))].sort(),
      countries: [...new Set(satellites.map(s => s.countryId).filter(Boolean))].sort(),
      constellations: [...new Set(satellites.map(s => s.constellation).filter(Boolean))].sort(),
    };
  }, [satellites]);

  // Count satellites per filter option
  const filterCounts = useMemo(() => {
    const counts = {
      types: {},
      orbits: {},
      statuses: {},
      countries: {},
      constellations: {},
    };

    satellites.forEach(s => {
      if (s.type) counts.types[s.type] = (counts.types[s.type] || 0) + 1;
      if (s.orbitType) counts.orbits[s.orbitType] = (counts.orbits[s.orbitType] || 0) + 1;
      if (s.status) counts.statuses[s.status] = (counts.statuses[s.status] || 0) + 1;
      if (s.countryId) counts.countries[s.countryId] = (counts.countries[s.countryId] || 0) + 1;
      if (s.constellation) counts.constellations[s.constellation] = (counts.constellations[s.constellation] || 0) + 1;
    });

    return counts;
  }, [satellites]);

  // Filter and sort satellites
  const filteredAndSortedSatellites = useMemo(() => {
    let result = [...satellites];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(s =>
        s.name?.toLowerCase().includes(query) ||
        s.operator?.toLowerCase().includes(query) ||
        s.purpose?.toLowerCase().includes(query)
      );
    }

    // Filter by type (OR within category)
    if (selectedTypes.length > 0) {
      result = result.filter(s => selectedTypes.includes(s.type));
    }

    // Filter by orbit (OR within category)
    if (selectedOrbits.length > 0) {
      result = result.filter(s => selectedOrbits.includes(s.orbitType));
    }

    // Filter by status (OR within category)
    if (selectedStatuses.length > 0) {
      result = result.filter(s => selectedStatuses.includes(s.status));
    }

    // Filter by country (OR within category)
    if (selectedCountries.length > 0) {
      result = result.filter(s => selectedCountries.includes(s.countryId));
    }

    // Filter by constellation (OR within category)
    if (selectedConstellations.length > 0) {
      result = result.filter(s => selectedConstellations.includes(s.constellation));
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '');
          break;
        case 'launchYear':
          comparison = (a.launchYear || 0) - (b.launchYear || 0);
          break;
        case 'altitude':
          comparison = (a.altitude || 0) - (b.altitude || 0);
          break;
        case 'mass':
          comparison = (a.massKg || 0) - (b.massKg || 0);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [satellites, searchQuery, selectedTypes, selectedOrbits, selectedStatuses, selectedCountries, selectedConstellations, sortBy, sortOrder]);

  // Paginate the filtered results
  const paginatedSatellites = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedSatellites.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedSatellites, currentPage, pageSize]);

  // Build active filters array for FilterPanel
  const activeFilters = useMemo(() => {
    const filters = [];

    selectedTypes.forEach(type => {
      filters.push({
        key: `type-${type}`,
        label: type,
        color: 'indigo',
        onRemove: () => toggleType(type),
      });
    });

    selectedOrbits.forEach(orbit => {
      filters.push({
        key: `orbit-${orbit}`,
        label: orbit,
        color: 'blue',
        onRemove: () => toggleOrbit(orbit),
      });
    });

    selectedStatuses.forEach(status => {
      filters.push({
        key: `status-${status}`,
        label: status,
        color: 'green',
        onRemove: () => toggleStatus(status),
      });
    });

    selectedCountries.forEach(country => {
      filters.push({
        key: `country-${country}`,
        label: country,
        color: 'purple',
        onRemove: () => toggleCountry(country),
      });
    });

    selectedConstellations.forEach(constellation => {
      filters.push({
        key: `constellation-${constellation}`,
        label: constellation,
        color: 'orange',
        onRemove: () => toggleConstellation(constellation),
      });
    });

    if (searchQuery) {
      filters.push({
        key: 'search',
        label: `"${searchQuery}"`,
        color: 'yellow',
        onRemove: () => setSearchQuery(''),
      });
    }

    return filters;
  }, [selectedTypes, selectedOrbits, selectedStatuses, selectedCountries, selectedConstellations, searchQuery, toggleType, toggleOrbit, toggleStatus, toggleCountry, toggleConstellation]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <LoadingSpinner message="Loading satellites..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
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
            <SatelliteAlt style={{ fontSize: '2.5rem' }} className="text-gray-900 dark:text-white" /> Satellites
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore satellites and space assets from around the world
          </p>
        </div>

        {/* Statistics */}
        {statistics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="glass-tinted-indigo p-4 text-center">
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{statistics.total}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Satellites</p>
            </div>
            <div className="glass-tinted-green p-4 text-center">
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{statistics.active}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
            </div>
            <div className="glass-tinted-purple p-4 text-center">
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{statistics.byType?.length || 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Types</p>
            </div>
            <div className="glass-tinted-yellow p-4 text-center">
              <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{statistics.byCountry?.length || 0}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Countries</p>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search satellites..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="glass-input w-full max-w-md"
          />
        </div>

        {/* Filters & Controls */}
        <FilterPanel
          activeFilters={activeFilters}
          onClearAll={clearAllFilters}
          headerActions={
            <ViewToggle
              viewMode={viewMode}
              setViewMode={setViewMode}
              options={['grid', 'list']}
            />
          }
        >
          {/* Type Filters */}
          <FilterSection title="Type">
            {filterOptions.types.map(type => (
              <FilterToggle
                key={type}
                label={type}
                active={selectedTypes.includes(type)}
                onClick={() => toggleType(type)}
                count={filterCounts.types[type] || 0}
              />
            ))}
          </FilterSection>

          {/* Orbit Filters */}
          <FilterSection title="Orbit">
            {filterOptions.orbits.map(orbit => (
              <FilterToggle
                key={orbit}
                label={orbit}
                active={selectedOrbits.includes(orbit)}
                onClick={() => toggleOrbit(orbit)}
                count={filterCounts.orbits[orbit] || 0}
              />
            ))}
          </FilterSection>

          {/* Status Filters */}
          <FilterSection title="Status">
            {filterOptions.statuses.map(status => (
              <FilterToggle
                key={status}
                label={status}
                active={selectedStatuses.includes(status)}
                onClick={() => toggleStatus(status)}
                count={filterCounts.statuses[status] || 0}
              />
            ))}
          </FilterSection>

          {/* Country Filters */}
          <FilterSection title="Country">
            {filterOptions.countries.slice(0, 12).map(country => (
              <FilterToggle
                key={country}
                label={country}
                active={selectedCountries.includes(country)}
                onClick={() => toggleCountry(country)}
                count={filterCounts.countries[country] || 0}
              />
            ))}
          </FilterSection>

          {/* Constellation Filters */}
          {filterOptions.constellations.length > 0 && (
            <FilterSection title="Constellation">
              {filterOptions.constellations.map(constellation => (
                <FilterToggle
                  key={constellation}
                  label={constellation}
                  active={selectedConstellations.includes(constellation)}
                  onClick={() => toggleConstellation(constellation)}
                  count={filterCounts.constellations[constellation] || 0}
                />
              ))}
            </FilterSection>
          )}
        </FilterPanel>

        {/* Results count */}
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Found {filteredAndSortedSatellites.length} satellites
        </div>

        {/* Satellite grid/list */}
        {filteredAndSortedSatellites.length === 0 ? (
          <div className="glass-panel p-12 text-center">
            <SatelliteAlt style={{ fontSize: '3rem' }} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">No satellites found matching your criteria</p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition text-sm font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <>
            <div className="space-y-4">
              <SortableGridHeader
                columns={sortColumns}
                currentSort={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedSatellites.map(satellite => (
                  <SatelliteCard key={satellite.id} satellite={satellite} />
                ))}
              </div>
            </div>
            <Pagination
              totalItems={filteredAndSortedSatellites.length}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              className="mt-6"
            />
          </>
        ) : (
          <>
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
                    <SortableHeader label="Type" sortKey={null} />
                    <SortableHeader label="Orbit" sortKey={null} />
                    <SortableHeader label="Status" sortKey={null} />
                    <SortableHeader label="Country" sortKey={null} />
                    <SortableHeader
                      label="Launch"
                      sortKey="launchYear"
                      currentSort={sortBy}
                      sortOrder={sortOrder}
                      onSort={handleSort}
                    />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50 dark:divide-white/[0.08]">
                  {paginatedSatellites.map((satellite, index) => (
                    <tr key={satellite.id} className={`${index % 2 === 0 ? 'bg-transparent' : 'bg-gray-500/[0.03] dark:bg-white/[0.02]'} hover:bg-gray-500/[0.05] dark:hover:bg-white/[0.03] transition-colors`}>
                      <td className="px-4 py-3">
                        <Link to={`/satellites/${satellite.id}`} className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                          {satellite.name}
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{satellite.operator}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{satellite.type}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${ORBIT_COLORS[satellite.orbitType] || 'bg-gray-500/15 dark:bg-gray-500/25 text-gray-700 dark:text-gray-300 border-gray-400/20'}`}>
                          {satellite.orbitType}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border backdrop-blur-sm ${STATUS_COLORS[satellite.status] || 'bg-gray-500/15 dark:bg-gray-500/25 text-gray-700 dark:text-gray-300 border-gray-400/20'}`}>
                          {satellite.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{satellite.countryId}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{satellite.launchYear || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              totalItems={filteredAndSortedSatellites.length}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              className="mt-6"
            />
          </>
        )}
      </div>
    </div>
  );
}
