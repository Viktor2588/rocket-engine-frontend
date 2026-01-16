import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLaunchVehicles, useLaunchVehicleStatistics } from '../hooks/useLaunchVehicles';
import LaunchVehicleCard from '../components/LaunchVehicleCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import SortableHeader, { SortableGridHeader } from '../components/SortableHeader';
import { Rocket, Recycling, PersonOutline, Close, FilterList } from '@mui/icons-material';

const COUNTRIES = [
  { code: 'USA', name: 'United States' },
  { code: 'CHN', name: 'China' },
  { code: 'RUS', name: 'Russia' },
  { code: 'FRA', name: 'France/ESA' },
  { code: 'JPN', name: 'Japan' },
  { code: 'IND', name: 'India' },
  { code: 'GBR', name: 'United Kingdom' },
  { code: 'ISR', name: 'Israel' },
  { code: 'IRN', name: 'Iran' },
  { code: 'KOR', name: 'South Korea' },
  { code: 'PRK', name: 'North Korea' },
  { code: 'NZL', name: 'New Zealand' },
];

const STATUSES = ['Active', 'Retired', 'In Development', 'Cancelled'];

const CAPABILITIES = [
  { id: 'reusable', label: 'Reusable', icon: Recycling },
  { id: 'humanRated', label: 'Human-Rated', icon: PersonOutline },
];

const LIFT_CAPACITIES = [
  { id: 'small', label: 'Small Lift', description: '<2t', min: 0, max: 2000 },
  { id: 'medium', label: 'Medium Lift', description: '2-20t', min: 2000, max: 20000 },
  { id: 'heavy', label: 'Heavy Lift', description: '20-50t', min: 20000, max: 50000 },
  { id: 'superHeavy', label: 'Super Heavy', description: '50t+', min: 50000, max: Infinity },
];

// Helper to get lift capacity class for a vehicle
const getLiftCapacityClass = (payloadKg) => {
  if (!payloadKg) return null;
  for (const cap of LIFT_CAPACITIES) {
    if (payloadKg >= cap.min && payloadKg < cap.max) {
      return cap.id;
    }
  }
  return null;
};

// Filter tag component
function FilterTag({ label, onRemove, color = 'indigo' }) {
  const colorClasses = {
    indigo: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700',
    green: 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700',
    blue: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700',
    purple: 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700',
    orange: 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-700',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium border ${colorClasses[color]}`}>
      {label}
      <button
        onClick={onRemove}
        className="ml-0.5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5 transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <Close style={{ fontSize: '0.875rem' }} />
      </button>
    </span>
  );
}

// Filter toggle button component
function FilterToggle({ label, active, onClick, count }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium border backdrop-blur-sm transition-all ${
        active
          ? 'bg-indigo-500/90 text-white border-indigo-400/50 shadow-sm'
          : 'bg-white/60 dark:bg-white/[0.08] text-gray-700 dark:text-gray-300 border-gray-200/50 dark:border-white/[0.12] hover:border-indigo-400/50 dark:hover:border-indigo-400/30'
      }`}
    >
      {label}
      {count !== undefined && (
        <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${
          active ? 'bg-white/20' : 'bg-gray-500/10 dark:bg-white/10'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}

export default function LaunchVehicleListPage() {
  const { vehicles, loading, error } = useLaunchVehicles();
  const stats = useLaunchVehicleStatistics();
  const [sortBy, setSortBy] = useState('payload');
  const [sortOrder, setSortOrder] = useState('desc');

  // Multi-select filter states (arrays instead of single values)
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedCapabilities, setSelectedCapabilities] = useState([]);
  const [selectedLiftCapacities, setSelectedLiftCapacities] = useState([]);

  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [filtersExpanded, setFiltersExpanded] = useState(true);

  // Toggle functions for multi-select
  const toggleCountry = useCallback((code) => {
    setSelectedCountries(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
    setCurrentPage(1);
  }, []);

  const toggleStatus = useCallback((status) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
    setCurrentPage(1);
  }, []);

  const toggleCapability = useCallback((cap) => {
    setSelectedCapabilities(prev =>
      prev.includes(cap) ? prev.filter(c => c !== cap) : [...prev, cap]
    );
    setCurrentPage(1);
  }, []);

  const toggleLiftCapacity = useCallback((cap) => {
    setSelectedLiftCapacities(prev =>
      prev.includes(cap) ? prev.filter(c => c !== cap) : [...prev, cap]
    );
    setCurrentPage(1);
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedCountries([]);
    setSelectedStatuses([]);
    setSelectedCapabilities([]);
    setSelectedLiftCapacities([]);
    setCurrentPage(1);
  }, []);

  const hasActiveFilters = selectedCountries.length > 0 || selectedStatuses.length > 0 ||
    selectedCapabilities.length > 0 || selectedLiftCapacities.length > 0;

  // Sort handler for table/grid headers
  const handleSort = useCallback((key, order) => {
    setSortBy(key);
    setSortOrder(order);
  }, []);

  // Sort columns configuration
  const sortColumns = [
    { key: 'payload', label: 'Payload' },
    { key: 'name', label: 'Name' },
    { key: 'launches', label: 'Launches' },
    { key: 'successRate', label: 'Success Rate' },
    { key: 'cost', label: 'Cost' },
  ];

  // Count vehicles per filter option (for showing counts in toggles)
  const filterCounts = useMemo(() => {
    const counts = {
      countries: {},
      statuses: {},
      capabilities: {},
      liftCapacities: {},
    };

    vehicles.forEach(v => {
      // Country counts
      if (v.countryId) {
        counts.countries[v.countryId] = (counts.countries[v.countryId] || 0) + 1;
      }
      // Status counts
      if (v.status) {
        counts.statuses[v.status] = (counts.statuses[v.status] || 0) + 1;
      }
      // Capability counts
      if (v.reusable) counts.capabilities.reusable = (counts.capabilities.reusable || 0) + 1;
      if (v.humanRated) counts.capabilities.humanRated = (counts.capabilities.humanRated || 0) + 1;
      // Lift capacity counts
      const liftClass = getLiftCapacityClass(v.payloadToLeoKg);
      if (liftClass) {
        counts.liftCapacities[liftClass] = (counts.liftCapacities[liftClass] || 0) + 1;
      }
    });

    return counts;
  }, [vehicles]);

  // Filter and sort vehicles with AND logic across all filter categories
  const filteredAndSortedVehicles = useMemo(() => {
    let result = [...vehicles];

    // Filter by status (OR within category)
    if (selectedStatuses.length > 0) {
      result = result.filter(v => selectedStatuses.includes(v.status));
    }

    // Filter by country (OR within category)
    if (selectedCountries.length > 0) {
      result = result.filter(v => selectedCountries.includes(v.countryId));
    }

    // Filter by capabilities (AND - must have ALL selected capabilities)
    if (selectedCapabilities.includes('reusable')) {
      result = result.filter(v => v.reusable);
    }
    if (selectedCapabilities.includes('humanRated')) {
      result = result.filter(v => v.humanRated);
    }

    // Filter by lift capacity (OR within category)
    if (selectedLiftCapacities.length > 0) {
      result = result.filter(v => {
        const liftClass = getLiftCapacityClass(v.payloadToLeoKg);
        return liftClass && selectedLiftCapacities.includes(liftClass);
      });
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'payload':
          comparison = (a.payloadToLeoKg || 0) - (b.payloadToLeoKg || 0);
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'launches':
          comparison = (a.totalLaunches || 0) - (b.totalLaunches || 0);
          break;
        case 'successRate':
          comparison = (a.successRate || 0) - (b.successRate || 0);
          break;
        case 'cost':
          comparison = (a.costPerLaunchUsd || Infinity) - (b.costPerLaunchUsd || Infinity);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [vehicles, sortBy, sortOrder, selectedStatuses, selectedCountries, selectedCapabilities, selectedLiftCapacities]);

  // Paginate the filtered results
  const paginatedVehicles = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedVehicles.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedVehicles, currentPage, pageSize]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <LoadingSpinner message="Loading launch vehicles..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">Error Loading Data</h2>
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
            <Rocket style={{ fontSize: '2.5rem' }} className="text-gray-900 dark:text-white" /> Launch Vehicles
          </h1>
          <p className="text-gray-600 dark:text-gray-400 dark:text-gray-400">
            Explore {vehicles.length} launch vehicles from space agencies around the world
          </p>
        </div>

        {/* Quick Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            <div className="glass-tinted-indigo p-4 text-center">
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.total}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Vehicles</p>
            </div>
            <div className="glass-tinted-green p-4 text-center">
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.active}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
            </div>
            <div className="glass-panel p-4 text-center">
              <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">{stats.retired}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Retired</p>
            </div>
            <div className="glass-tinted-blue p-4 text-center">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.development}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">In Development</p>
            </div>
            <div className="glass-tinted-purple p-4 text-center">
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.reusable}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Reusable</p>
            </div>
            <div className="glass-tinted-orange p-4 text-center">
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.humanRated}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Human-Rated</p>
            </div>
          </div>
        )}

        {/* Filters & Controls */}
        <div className="glass-panel mb-8 overflow-hidden">
          {/* Filter Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/50 dark:border-white/[0.08]">
            <button
              onClick={() => setFiltersExpanded(!filtersExpanded)}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-semibold"
            >
              <FilterList />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="px-2 py-0.5 rounded-full text-xs bg-indigo-500 text-white">
                  {selectedCountries.length + selectedStatuses.length + selectedCapabilities.length + selectedLiftCapacities.length}
                </span>
              )}
              <svg
                className={`w-5 h-5 transition-transform ${filtersExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div className="flex items-center gap-3">
              {/* View toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'glass-button-primary' : 'glass-button'}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={viewMode === 'table' ? 'glass-button-primary' : 'glass-button'}
                >
                  Table
                </button>
              </div>

              <Link
                to="/compare/vehicles"
                className="glass-button-primary bg-green-500/80 hover:bg-green-500"
              >
                Compare
              </Link>
            </div>
          </div>

          {/* Expandable Filter Sections */}
          {filtersExpanded && (
            <div className="px-6 py-4 space-y-4">
              {/* Country Filters */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Country</h3>
                <div className="flex flex-wrap gap-2">
                  {COUNTRIES.map(country => (
                    <FilterToggle
                      key={country.code}
                      label={country.name}
                      active={selectedCountries.includes(country.code)}
                      onClick={() => toggleCountry(country.code)}
                      count={filterCounts.countries[country.code] || 0}
                    />
                  ))}
                </div>
              </div>

              {/* Status Filters */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Status</h3>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map(status => (
                    <FilterToggle
                      key={status}
                      label={status}
                      active={selectedStatuses.includes(status)}
                      onClick={() => toggleStatus(status)}
                      count={filterCounts.statuses[status] || 0}
                    />
                  ))}
                </div>
              </div>

              {/* Capability Filters */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Capabilities</h3>
                <div className="flex flex-wrap gap-2">
                  {CAPABILITIES.map(cap => (
                    <FilterToggle
                      key={cap.id}
                      label={cap.label}
                      active={selectedCapabilities.includes(cap.id)}
                      onClick={() => toggleCapability(cap.id)}
                      count={filterCounts.capabilities[cap.id] || 0}
                    />
                  ))}
                </div>
              </div>

              {/* Lift Capacity Filters */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Lift Capacity (LEO)</h3>
                <div className="flex flex-wrap gap-2">
                  {LIFT_CAPACITIES.map(cap => (
                    <FilterToggle
                      key={cap.id}
                      label={`${cap.label} (${cap.description})`}
                      active={selectedLiftCapacities.includes(cap.id)}
                      onClick={() => toggleLiftCapacity(cap.id)}
                      count={filterCounts.liftCapacities[cap.id] || 0}
                    />
                  ))}
                </div>
              </div>

              {/* Clear all button */}
              {hasActiveFilters && (
                <div className="pt-2 border-t border-gray-200/50 dark:border-white/[0.08]">
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Active Filters Tags (shown when collapsed or as summary) */}
          {hasActiveFilters && (
            <div className="px-6 py-3 glass-header-gradient border-t border-gray-200/50 dark:border-white/[0.08]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
                {selectedCountries.map(code => {
                  const country = COUNTRIES.find(c => c.code === code);
                  return (
                    <FilterTag
                      key={`country-${code}`}
                      label={country?.name || code}
                      onRemove={() => toggleCountry(code)}
                      color="indigo"
                    />
                  );
                })}
                {selectedStatuses.map(status => (
                  <FilterTag
                    key={`status-${status}`}
                    label={status}
                    onRemove={() => toggleStatus(status)}
                    color="green"
                  />
                ))}
                {selectedCapabilities.map(cap => {
                  const capability = CAPABILITIES.find(c => c.id === cap);
                  return (
                    <FilterTag
                      key={`cap-${cap}`}
                      label={capability?.label || cap}
                      onRemove={() => toggleCapability(cap)}
                      color="purple"
                    />
                  );
                })}
                {selectedLiftCapacities.map(cap => {
                  const liftCap = LIFT_CAPACITIES.find(c => c.id === cap);
                  return (
                    <FilterTag
                      key={`lift-${cap}`}
                      label={`${liftCap?.label} (${liftCap?.description})`}
                      onRemove={() => toggleLiftCapacity(cap)}
                      color="orange"
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Found {filteredAndSortedVehicles.length} vehicles
        </div>

        {/* Results */}
        {viewMode === 'grid' ? (
          <>
            <div className="space-y-4">
              <SortableGridHeader
                columns={sortColumns}
                currentSort={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedVehicles.map((vehicle) => (
                  <LaunchVehicleCard key={vehicle.id} vehicle={vehicle} />
                ))}
              </div>
            </div>
            <Pagination
              totalItems={filteredAndSortedVehicles.length}
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
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200/50 dark:divide-white/[0.08]">
                <thead className="glass-header-gradient">
                  <tr>
                    <SortableHeader
                      label="Vehicle"
                      sortKey="name"
                      currentSort={sortBy}
                      sortOrder={sortOrder}
                      onSort={handleSort}
                    />
                    <SortableHeader label="Manufacturer" sortKey={null} />
                    <SortableHeader label="Status" sortKey={null} />
                    <SortableHeader
                      label="Payload (LEO)"
                      sortKey="payload"
                      currentSort={sortBy}
                      sortOrder={sortOrder}
                      onSort={handleSort}
                      align="right"
                    />
                    <SortableHeader
                      label="Launches"
                      sortKey="launches"
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
                    <SortableHeader label="Capabilities" sortKey={null} />
                    <SortableHeader label="Actions" sortKey={null} />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200/50 dark:divide-white/[0.08]">
                  {paginatedVehicles.map((vehicle, index) => (
                    <tr key={vehicle.id} className={index % 2 === 0 ? 'bg-transparent' : 'bg-gray-500/[0.03] dark:bg-white/[0.02]'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 dark:text-white">{vehicle.name}</div>
                        {vehicle.variant && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">{vehicle.variant}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {vehicle.manufacturer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`glass-badge ${
                          vehicle.status === 'Active' ? 'glass-badge-success' :
                          vehicle.status === 'Retired' ? '' :
                          vehicle.status === 'In Development' ? 'glass-badge-info' :
                          'glass-badge-error'
                        }`}>
                          {vehicle.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-gray-200">
                        {vehicle.payloadToLeoKg ? `${vehicle.payloadToLeoKg.toLocaleString()} kg` : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-gray-200">
                        {vehicle.totalLaunches ?? '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-gray-200">
                        {vehicle.successRate ? `${vehicle.successRate.toFixed(1)}%` : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1 items-center">
                          {vehicle.reusable && <Recycling titleAccess="Reusable" className="text-purple-600 dark:text-purple-400" style={{ fontSize: '1.25rem' }} />}
                          {vehicle.humanRated && <PersonOutline titleAccess="Human-Rated" className="text-green-600 dark:text-green-400" style={{ fontSize: '1.25rem' }} />}
                          {(() => {
                            const liftClass = getLiftCapacityClass(vehicle.payloadToLeoKg);
                            const liftCap = LIFT_CAPACITIES.find(c => c.id === liftClass);
                            if (liftCap) {
                              const colorClass = liftClass === 'small' ? 'bg-gray-500/15 text-gray-700 dark:bg-gray-500/25 dark:text-gray-300 border-gray-400/20' :
                                liftClass === 'medium' ? 'bg-blue-500/15 text-blue-700 dark:bg-blue-500/25 dark:text-blue-300 border-blue-400/20' :
                                liftClass === 'heavy' ? 'bg-orange-500/15 text-orange-700 dark:bg-orange-500/25 dark:text-orange-300 border-orange-400/20' :
                                'bg-red-500/15 text-red-700 dark:bg-red-500/25 dark:text-red-300 border-red-400/20';
                              return (
                                <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm ${colorClass}`}>
                                  {liftCap.description}
                                </span>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          to={`/vehicles/${vehicle.id}`}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination
              totalItems={filteredAndSortedVehicles.length}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              className="mt-6"
            />
          </>
        )}

        {/* No results */}
        {filteredAndSortedVehicles.length === 0 && (
          <div className="text-center py-12">
            <Rocket style={{ fontSize: '3rem' }} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">No vehicles match your filters</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              Try removing some filters to see more results
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition text-sm font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Footer note */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 dark:text-gray-400">
          <p>
            Data includes orbital launch vehicles. Payload capacities are typical values.
          </p>
        </div>
      </div>
    </div>
  );
}
