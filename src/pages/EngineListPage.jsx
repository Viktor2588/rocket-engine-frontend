import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useEngines, useEngineStatistics } from '../hooks/useEngines';
import EngineCard from '../components/EngineCard';
import EngineChart from '../components/EngineChart';
import Pagination from '../components/Pagination';
import SortableHeader, { SortableGridHeader } from '../components/SortableHeader';
import { Rocket, Bolt, Recycling, Tune, Refresh } from '@mui/icons-material';

const COUNTRIES = [
  { code: 'USA', name: 'United States' },
  { code: 'RUS', name: 'Russia' },
  { code: 'CHN', name: 'China' },
  { code: 'FRA', name: 'France/ESA' },
  { code: 'JPN', name: 'Japan' },
  { code: 'IND', name: 'India' },
];

const PROPELLANTS = [
  'LOX/RP-1',
  'LOX/LH2',
  'LOX/CH4',
  'N2O4/UDMH',
];

const POWER_CYCLES = [
  'Gas Generator',
  'Staged Combustion',
  'Full-Flow Staged Combustion',
  'Expander',
  'Expander Bleed',
  'Electric Pump-Fed',
];

export default function EngineListPage() {
  const { engines, loading, error } = useEngines();
  const { statistics } = useEngineStatistics();
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('sophistication');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterPropellant, setFilterPropellant] = useState('all');
  const [filterCycle, setFilterCycle] = useState('all');
  const [filterCapability, setFilterCapability] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Sort handler for table/grid headers
  const handleSort = (key, order) => {
    setSortBy(key);
    setSortOrder(order);
  };

  // Sort columns configuration
  const sortColumns = [
    { key: 'sophistication', label: 'Tech Score' },
    { key: 'name', label: 'Name' },
    { key: 'isp', label: 'ISP' },
    { key: 'thrust', label: 'Thrust' },
    { key: 'twr', label: 'T/W Ratio' },
    { key: 'reliability', label: 'Reliability' },
  ];

  // Filter and sort engines
  const filteredAndSortedEngines = useMemo(() => {
    // Safety check: ensure engines is an array before spreading
    let result = Array.isArray(engines) ? [...engines] : [];

    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter(e => e.status === filterStatus);
    }

    // Filter by country (check both countryId and origin)
    if (filterCountry !== 'all') {
      result = result.filter(e =>
        e.countryId === filterCountry ||
        e.origin?.toLowerCase().includes(filterCountry.toLowerCase())
      );
    }

    // Filter by propellant (case-insensitive partial match)
    if (filterPropellant !== 'all') {
      result = result.filter(e =>
        e.propellant?.toLowerCase().includes(filterPropellant.toLowerCase())
      );
    }

    // Filter by power cycle (case-insensitive partial match)
    if (filterCycle !== 'all') {
      result = result.filter(e =>
        e.powerCycle?.toLowerCase().includes(filterCycle.toLowerCase())
      );
    }

    // Filter by capability
    if (filterCapability !== 'all') {
      if (filterCapability === 'reusable') {
        result = result.filter(e => e.reusable);
      } else if (filterCapability === 'advanced') {
        result = result.filter(e => e.advancedCycle);
      } else if (filterCapability === 'throttle') {
        result = result.filter(e => e.throttleCapable);
      } else if (filterCapability === 'restart') {
        result = result.filter(e => e.restartCapable);
      }
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
  }, [engines, sortBy, sortOrder, filterStatus, filterCountry, filterPropellant, filterCycle, filterCapability]);

  // Paginate the filtered results
  const paginatedEngines = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedEngines.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedEngines, currentPage, pageSize]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading engines...</p>
        </div>
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
        <div className="glass-panel p-6 mb-8">
          <div className="flex flex-col gap-4">
            {/* First Row: Filters and View */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
              <div className="flex flex-wrap gap-4">
                {/* Status Filter */}
                <label className="flex items-center gap-2">
                  <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm">Status:</span>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="glass-select"
                  >
                    <option value="all">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Retired">Retired</option>
                    <option value="Development">Development</option>
                  </select>
                </label>

                {/* Country Filter */}
                <label className="flex items-center gap-2">
                  <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm">Country:</span>
                  <select
                    value={filterCountry}
                    onChange={(e) => setFilterCountry(e.target.value)}
                    className="glass-select"
                  >
                    <option value="all">All Countries</option>
                    {COUNTRIES.map(c => (
                      <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                    ))}
                  </select>
                </label>
              </div>

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
                <button
                  onClick={() => setViewMode('chart')}
                  className={viewMode === 'chart' ? 'glass-button-primary' : 'glass-button'}
                >
                  Chart
                </button>
                <Link
                  to="/compare/engines"
                  className="glass-button-primary bg-green-500/80 hover:bg-green-500"
                >
                  Compare
                </Link>
              </div>
            </div>

            {/* Second Row: Technical Filters */}
            <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200/50 dark:border-white/[0.08]">
              {/* Propellant Filter */}
              <label className="flex items-center gap-2">
                <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm">Propellant:</span>
                <select
                  value={filterPropellant}
                  onChange={(e) => setFilterPropellant(e.target.value)}
                  className="glass-select"
                >
                  <option value="all">All Propellants</option>
                  {PROPELLANTS.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </label>

              {/* Power Cycle Filter */}
              <label className="flex items-center gap-2">
                <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm">Cycle:</span>
                <select
                  value={filterCycle}
                  onChange={(e) => setFilterCycle(e.target.value)}
                  className="glass-select"
                >
                  <option value="all">All Cycles</option>
                  {POWER_CYCLES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>

              {/* Capability Filter */}
              <label className="flex items-center gap-2">
                <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm">Capability:</span>
                <select
                  value={filterCapability}
                  onChange={(e) => setFilterCapability(e.target.value)}
                  className="glass-select"
                >
                  <option value="all">All Capabilities</option>
                  <option value="reusable">Reusable</option>
                  <option value="advanced">Advanced Cycle</option>
                  <option value="throttle">Throttleable</option>
                  <option value="restart">Restartable</option>
                </select>
              </label>
            </div>
          </div>
        </div>

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
            <p className="text-gray-500 dark:text-gray-400 text-lg">No engines match your filters</p>
            <button
              onClick={() => {
                setFilterStatus('all');
                setFilterCountry('all');
                setFilterPropellant('all');
                setFilterCycle('all');
                setFilterCapability('all');
              }}
              className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
            >
              Clear filters
            </button>
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
