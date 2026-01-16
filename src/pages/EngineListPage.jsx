import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useEngines, useEngineStatistics } from '../hooks/useEngines';
import EngineCard from '../components/EngineCard';
import EngineChart from '../components/EngineChart';
import Pagination from '../components/Pagination';
import SortableHeader, { SortableGridHeader } from '../components/SortableHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import ViewToggle from '../components/ViewToggle';
import { FilterPanel, FilterSection, FilterToggle } from '../components/filters';
import { Rocket, Bolt, Recycling, Tune, Refresh } from '@mui/icons-material';

const COUNTRIES = [
  { code: 'USA', name: 'United States' },
  { code: 'RUS', name: 'Russia' },
  { code: 'CHN', name: 'China' },
  { code: 'FRA', name: 'France/ESA' },
  { code: 'JPN', name: 'Japan' },
  { code: 'IND', name: 'India' },
  { code: 'GBR', name: 'United Kingdom' },
  { code: 'UKR', name: 'Ukraine' },
];

const STATUSES = ['Active', 'Retired', 'Development'];

const PROPELLANTS = [
  { id: 'lox-rp1', label: 'LOX/RP-1', match: 'lox/rp' },
  { id: 'lox-lh2', label: 'LOX/LH2', match: 'lox/lh' },
  { id: 'lox-ch4', label: 'LOX/CH4', match: 'lox/ch4' },
  { id: 'n2o4-udmh', label: 'N2O4/UDMH', match: 'n2o4' },
];

const POWER_CYCLES = [
  { id: 'gas-generator', label: 'Gas Generator', match: 'gas generator' },
  { id: 'staged-combustion', label: 'Staged Combustion', match: 'staged combustion' },
  { id: 'full-flow', label: 'Full-Flow', match: 'full-flow' },
  { id: 'expander', label: 'Expander', match: 'expander' },
  { id: 'electric', label: 'Electric Pump-Fed', match: 'electric' },
];

const CAPABILITIES = [
  { id: 'reusable', label: 'Reusable' },
  { id: 'advanced', label: 'Advanced Cycle' },
  { id: 'throttle', label: 'Throttleable' },
  { id: 'restart', label: 'Restartable' },
];

export default function EngineListPage() {
  const { engines, loading, error } = useEngines();
  const { statistics } = useEngineStatistics();
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('sophistication');
  const [sortOrder, setSortOrder] = useState('desc');

  // Multi-select filter states
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedPropellants, setSelectedPropellants] = useState([]);
  const [selectedCycles, setSelectedCycles] = useState([]);
  const [selectedCapabilities, setSelectedCapabilities] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Toggle functions for multi-select
  const toggleStatus = useCallback((status) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
    setCurrentPage(1);
  }, []);

  const toggleCountry = useCallback((code) => {
    setSelectedCountries(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
    setCurrentPage(1);
  }, []);

  const togglePropellant = useCallback((id) => {
    setSelectedPropellants(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
    setCurrentPage(1);
  }, []);

  const toggleCycle = useCallback((id) => {
    setSelectedCycles(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
    setCurrentPage(1);
  }, []);

  const toggleCapability = useCallback((id) => {
    setSelectedCapabilities(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
    setCurrentPage(1);
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedStatuses([]);
    setSelectedCountries([]);
    setSelectedPropellants([]);
    setSelectedCycles([]);
    setSelectedCapabilities([]);
    setCurrentPage(1);
  }, []);

  const hasActiveFilters = selectedStatuses.length > 0 || selectedCountries.length > 0 ||
    selectedPropellants.length > 0 || selectedCycles.length > 0 || selectedCapabilities.length > 0;

  // Sort handler for table/grid headers
  const handleSort = useCallback((key, order) => {
    setSortBy(key);
    setSortOrder(order);
  }, []);

  // Sort columns configuration
  const sortColumns = [
    { key: 'sophistication', label: 'Tech Score' },
    { key: 'name', label: 'Name' },
    { key: 'isp', label: 'ISP' },
    { key: 'thrust', label: 'Thrust' },
    { key: 'twr', label: 'T/W Ratio' },
    { key: 'reliability', label: 'Reliability' },
  ];

  // Count engines per filter option
  const filterCounts = useMemo(() => {
    const counts = {
      statuses: {},
      countries: {},
      propellants: {},
      cycles: {},
      capabilities: {},
    };

    engines.forEach(e => {
      // Status counts
      if (e.status) {
        counts.statuses[e.status] = (counts.statuses[e.status] || 0) + 1;
      }
      // Country counts
      if (e.countryId) {
        counts.countries[e.countryId] = (counts.countries[e.countryId] || 0) + 1;
      }
      // Propellant counts
      PROPELLANTS.forEach(p => {
        if (e.propellant?.toLowerCase().includes(p.match)) {
          counts.propellants[p.id] = (counts.propellants[p.id] || 0) + 1;
        }
      });
      // Cycle counts
      POWER_CYCLES.forEach(c => {
        if (e.powerCycle?.toLowerCase().includes(c.match)) {
          counts.cycles[c.id] = (counts.cycles[c.id] || 0) + 1;
        }
      });
      // Capability counts
      if (e.reusable) counts.capabilities.reusable = (counts.capabilities.reusable || 0) + 1;
      if (e.advancedCycle) counts.capabilities.advanced = (counts.capabilities.advanced || 0) + 1;
      if (e.throttleCapable) counts.capabilities.throttle = (counts.capabilities.throttle || 0) + 1;
      if (e.restartCapable) counts.capabilities.restart = (counts.capabilities.restart || 0) + 1;
    });

    return counts;
  }, [engines]);

  // Filter and sort engines
  const filteredAndSortedEngines = useMemo(() => {
    let result = Array.isArray(engines) ? [...engines] : [];

    // Filter by status (OR within category)
    if (selectedStatuses.length > 0) {
      result = result.filter(e => selectedStatuses.includes(e.status));
    }

    // Filter by country (OR within category)
    if (selectedCountries.length > 0) {
      result = result.filter(e => selectedCountries.includes(e.countryId));
    }

    // Filter by propellant (OR within category)
    if (selectedPropellants.length > 0) {
      result = result.filter(e => {
        return selectedPropellants.some(pId => {
          const prop = PROPELLANTS.find(p => p.id === pId);
          return prop && e.propellant?.toLowerCase().includes(prop.match);
        });
      });
    }

    // Filter by power cycle (OR within category)
    if (selectedCycles.length > 0) {
      result = result.filter(e => {
        return selectedCycles.some(cId => {
          const cycle = POWER_CYCLES.find(c => c.id === cId);
          return cycle && e.powerCycle?.toLowerCase().includes(cycle.match);
        });
      });
    }

    // Filter by capabilities (AND - must have ALL selected capabilities)
    if (selectedCapabilities.includes('reusable')) {
      result = result.filter(e => e.reusable);
    }
    if (selectedCapabilities.includes('advanced')) {
      result = result.filter(e => e.advancedCycle);
    }
    if (selectedCapabilities.includes('throttle')) {
      result = result.filter(e => e.throttleCapable);
    }
    if (selectedCapabilities.includes('restart')) {
      result = result.filter(e => e.restartCapable);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'sophistication':
          comparison = (a.sophisticationScore || 0) - (b.sophisticationScore || 0);
          break;
        case 'isp':
          comparison = (a.ispVacuum || a.isp || 0) - (b.ispVacuum || b.isp || 0);
          break;
        case 'thrust':
          comparison = (a.thrustKn || 0) - (b.thrustKn || 0);
          break;
        case 'twr':
          comparison = (a.calculateThrustToWeightRatio || a.twr || 0) - (b.calculateThrustToWeightRatio || b.twr || 0);
          break;
        case 'reliability':
          comparison = (a.reliabilityRate || 0) - (b.reliabilityRate || 0);
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [engines, sortBy, sortOrder, selectedStatuses, selectedCountries, selectedPropellants, selectedCycles, selectedCapabilities]);

  // Paginate the filtered results
  const paginatedEngines = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedEngines.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedEngines, currentPage, pageSize]);

  // Build active filters array for FilterPanel
  const activeFilters = useMemo(() => {
    const filters = [];

    selectedStatuses.forEach(status => {
      filters.push({
        key: `status-${status}`,
        label: status,
        color: 'green',
        onRemove: () => toggleStatus(status),
      });
    });

    selectedCountries.forEach(code => {
      const country = COUNTRIES.find(c => c.code === code);
      filters.push({
        key: `country-${code}`,
        label: country?.name || code,
        color: 'indigo',
        onRemove: () => toggleCountry(code),
      });
    });

    selectedPropellants.forEach(id => {
      const prop = PROPELLANTS.find(p => p.id === id);
      filters.push({
        key: `propellant-${id}`,
        label: prop?.label || id,
        color: 'blue',
        onRemove: () => togglePropellant(id),
      });
    });

    selectedCycles.forEach(id => {
      const cycle = POWER_CYCLES.find(c => c.id === id);
      filters.push({
        key: `cycle-${id}`,
        label: cycle?.label || id,
        color: 'purple',
        onRemove: () => toggleCycle(id),
      });
    });

    selectedCapabilities.forEach(id => {
      const cap = CAPABILITIES.find(c => c.id === id);
      filters.push({
        key: `cap-${id}`,
        label: cap?.label || id,
        color: 'orange',
        onRemove: () => toggleCapability(id),
      });
    });

    return filters;
  }, [selectedStatuses, selectedCountries, selectedPropellants, selectedCycles, selectedCapabilities, toggleStatus, toggleCountry, togglePropellant, toggleCycle, toggleCapability]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <LoadingSpinner message="Loading engines..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">Error Loading Engines</h2>
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
            <Rocket style={{ fontSize: '2.5rem' }} className="text-gray-900 dark:text-white" /> Rocket Engines
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore {engines.length} rocket engines from space agencies around the world
          </p>
        </div>

        {/* Quick Stats */}
        {statistics && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <div className="glass-tinted-indigo p-4 text-center">
              <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{statistics.total}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Engines</p>
            </div>
            <div className="glass-tinted-green p-4 text-center">
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{statistics.activeCount}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
            </div>
            <div className="glass-tinted-purple p-4 text-center">
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{statistics.reusableCount}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Reusable</p>
            </div>
            <div className="glass-tinted-blue p-4 text-center">
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{statistics.averageIsp}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg ISP (s)</p>
            </div>
            <div className="glass-tinted-orange p-4 text-center">
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{statistics.averageThrust}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg Thrust (kN)</p>
            </div>
            <div className="glass-panel p-4 text-center">
              <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">
                {statistics.byCountry?.length || 0}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Countries</p>
            </div>
          </div>
        )}

        {/* Filters & Controls */}
        <FilterPanel
          activeFilters={activeFilters}
          onClearAll={clearAllFilters}
          headerActions={
            <ViewToggle
              viewMode={viewMode}
              setViewMode={setViewMode}
              options={['grid', 'table', 'chart']}
              compareLink="/compare/engines"
            />
          }
        >
          {/* Status Filters */}
          <FilterSection title="Status">
            {STATUSES.map(status => (
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
            {COUNTRIES.map(country => (
              <FilterToggle
                key={country.code}
                label={country.name}
                active={selectedCountries.includes(country.code)}
                onClick={() => toggleCountry(country.code)}
                count={filterCounts.countries[country.code] || 0}
              />
            ))}
          </FilterSection>

          {/* Propellant Filters */}
          <FilterSection title="Propellant">
            {PROPELLANTS.map(prop => (
              <FilterToggle
                key={prop.id}
                label={prop.label}
                active={selectedPropellants.includes(prop.id)}
                onClick={() => togglePropellant(prop.id)}
                count={filterCounts.propellants[prop.id] || 0}
              />
            ))}
          </FilterSection>

          {/* Power Cycle Filters */}
          <FilterSection title="Power Cycle">
            {POWER_CYCLES.map(cycle => (
              <FilterToggle
                key={cycle.id}
                label={cycle.label}
                active={selectedCycles.includes(cycle.id)}
                onClick={() => toggleCycle(cycle.id)}
                count={filterCounts.cycles[cycle.id] || 0}
              />
            ))}
          </FilterSection>

          {/* Capability Filters */}
          <FilterSection title="Capabilities">
            {CAPABILITIES.map(cap => (
              <FilterToggle
                key={cap.id}
                label={cap.label}
                active={selectedCapabilities.includes(cap.id)}
                onClick={() => toggleCapability(cap.id)}
                count={filterCounts.capabilities[cap.id] || 0}
              />
            ))}
          </FilterSection>
        </FilterPanel>

        {/* Results count */}
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Found {filteredAndSortedEngines.length} engines
        </div>

        {/* Results */}
        {viewMode === 'grid' && (
          <>
            <div className="space-y-4">
              <SortableGridHeader
                columns={sortColumns}
                currentSort={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedEngines.map((engine) => (
                  <EngineCard key={engine.id} engine={engine} />
                ))}
              </div>
            </div>
            <Pagination
              totalItems={filteredAndSortedEngines.length}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              className="mt-6"
            />
          </>
        )}

        {viewMode === 'table' && (
          <>
            <div className="glass-panel overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200/50 dark:divide-white/[0.08]">
                  <thead className="glass-header-gradient">
                    <tr>
                      <SortableHeader
                        label="Engine"
                        sortKey="name"
                        currentSort={sortBy}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                      />
                      <SortableHeader label="Designer" sortKey={null} />
                      <SortableHeader label="Status" sortKey={null} />
                      <SortableHeader
                        label="ISP (Vac)"
                        sortKey="isp"
                        currentSort={sortBy}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                        align="right"
                      />
                      <SortableHeader
                        label="Thrust"
                        sortKey="thrust"
                        currentSort={sortBy}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                        align="right"
                      />
                      <SortableHeader
                        label="Reliability"
                        sortKey="reliability"
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
                    {paginatedEngines.map((engine, index) => (
                    <tr key={engine.id} className={index % 2 === 0 ? 'bg-transparent' : 'bg-gray-500/[0.03] dark:bg-white/[0.02]'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 dark:text-white">{engine.name}</div>
                        {engine.variant && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">{engine.variant}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {engine.designer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`glass-badge ${
                          engine.status === 'Active' ? 'glass-badge-success' :
                          engine.status === 'Retired' ? '' :
                          engine.status === 'Development' ? 'glass-badge-info' :
                          'glass-badge-warning'
                        }`}>
                          {engine.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-gray-200">
                        {engine.ispVacuum || engine.isp_s || engine.isp || '—'} s
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-gray-200">
                        {engine.thrustKn ? `${engine.thrustKn.toLocaleString()} kN` : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 dark:text-gray-200">
                        {engine.reliabilityRate ? `${engine.reliabilityRate.toFixed(1)}%` : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-1">
                          {engine.reusable && <Recycling titleAccess="Reusable" className="text-green-600 dark:text-green-400" style={{ fontSize: '1.25rem' }} />}
                          {engine.advancedCycle && <Bolt titleAccess="Advanced Cycle" className="text-purple-600 dark:text-purple-400" style={{ fontSize: '1.25rem' }} />}
                          {engine.throttleCapable && <Tune titleAccess="Throttle" className="text-blue-600 dark:text-blue-400" style={{ fontSize: '1.25rem' }} />}
                          {engine.restartCapable && <Refresh titleAccess="Restart" className="text-orange-600 dark:text-orange-400" style={{ fontSize: '1.25rem' }} />}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          to={`/engines/${engine.id}`}
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
              totalItems={filteredAndSortedEngines.length}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              className="mt-6"
            />
          </>
        )}

        {viewMode === 'chart' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EngineChart engines={filteredAndSortedEngines} type="isp" />
            <EngineChart engines={filteredAndSortedEngines} type="twr" />
          </div>
        )}

        {/* No results */}
        {filteredAndSortedEngines.length === 0 && (
          <div className="text-center py-12">
            <Rocket style={{ fontSize: '3rem' }} className="text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">No engines match your filters</p>
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
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Data includes liquid rocket engines from major space agencies and manufacturers.
          </p>
        </div>
      </div>
    </div>
  );
}
