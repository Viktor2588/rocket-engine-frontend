import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useEngines, useEngineStatistics } from '../hooks/useEngines';
import EngineCard from '../components/EngineCard';
import EngineChart from '../components/EngineChart';
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
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterPropellant, setFilterPropellant] = useState('all');
  const [filterCycle, setFilterCycle] = useState('all');
  const [filterCapability, setFilterCapability] = useState('all');

  // Filter and sort engines
  const filteredAndSortedEngines = useMemo(() => {
    let result = [...engines];

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
      switch (sortBy) {
        case 'sophistication':
          return (b.sophisticationScore || 0) - (a.sophisticationScore || 0);
        case 'isp':
          return (b.ispVacuum || b.isp || 0) - (a.ispVacuum || a.isp || 0);
        case 'thrust':
          return (b.thrustKn || 0) - (a.thrustKn || 0);
        case 'twr':
          return (b.calculateThrustToWeightRatio || b.twr || 0) - (a.calculateThrustToWeightRatio || a.twr || 0);
        case 'reliability':
          return (b.reliabilityRate || 0) - (a.reliabilityRate || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return result;
  }, [engines, sortBy, filterStatus, filterCountry, filterPropellant, filterCycle, filterCapability]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading engines...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Engines</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Rocket style={{ fontSize: '2.5rem' }} className="text-blue-600" /> Rocket Engines
          </h1>
          <p className="text-gray-600">
            Explore {engines.length} rocket engines from space agencies around the world
          </p>
        </div>

        {/* Quick Stats */}
        {statistics && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-3xl font-bold text-indigo-600">{statistics.total}</p>
              <p className="text-sm text-gray-500">Total Engines</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-3xl font-bold text-green-600">{statistics.activeCount}</p>
              <p className="text-sm text-gray-500">Active</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-3xl font-bold text-purple-600">{statistics.reusableCount}</p>
              <p className="text-sm text-gray-500">Reusable</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">{statistics.averageIsp}</p>
              <p className="text-sm text-gray-500">Avg ISP (s)</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-3xl font-bold text-orange-600">{statistics.averageThrust}</p>
              <p className="text-sm text-gray-500">Avg Thrust (kN)</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <p className="text-3xl font-bold text-cyan-600">
                {statistics.byCountry?.length || 0}
              </p>
              <p className="text-sm text-gray-500">Countries</p>
            </div>
          </div>
        )}

        {/* Filters & Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col gap-4">
            {/* First Row: Sort and View */}
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
              <div className="flex flex-wrap gap-4">
                {/* Sort */}
                <label className="flex items-center gap-2">
                  <span className="text-gray-700 font-semibold text-sm">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  >
                    <option value="sophistication">Technology Score</option>
                    <option value="isp">ISP (High to Low)</option>
                    <option value="thrust">Thrust (High to Low)</option>
                    <option value="twr">T/W Ratio (High to Low)</option>
                    <option value="reliability">Reliability (High to Low)</option>
                    <option value="name">Name</option>
                  </select>
                </label>

                {/* Status Filter */}
                <label className="flex items-center gap-2">
                  <span className="text-gray-700 font-semibold text-sm">Status:</span>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  >
                    <option value="all">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Retired">Retired</option>
                    <option value="Development">Development</option>
                  </select>
                </label>

                {/* Country Filter */}
                <label className="flex items-center gap-2">
                  <span className="text-gray-700 font-semibold text-sm">Country:</span>
                  <select
                    value={filterCountry}
                    onChange={(e) => setFilterCountry(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
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
                  className={`px-4 py-2 rounded-md font-semibold transition text-sm ${
                    viewMode === 'grid'
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-2 rounded-md font-semibold transition text-sm ${
                    viewMode === 'table'
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode('chart')}
                  className={`px-4 py-2 rounded-md font-semibold transition text-sm ${
                    viewMode === 'chart'
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Chart
                </button>
                <Link
                  to="/compare/engines"
                  className="px-4 py-2 rounded-md font-semibold bg-green-500 text-white hover:bg-green-600 transition text-sm"
                >
                  Compare
                </Link>
              </div>
            </div>

            {/* Second Row: Technical Filters */}
            <div className="flex flex-wrap gap-4 pt-4 border-t">
              {/* Propellant Filter */}
              <label className="flex items-center gap-2">
                <span className="text-gray-700 font-semibold text-sm">Propellant:</span>
                <select
                  value={filterPropellant}
                  onChange={(e) => setFilterPropellant(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="all">All Propellants</option>
                  {PROPELLANTS.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </label>

              {/* Power Cycle Filter */}
              <label className="flex items-center gap-2">
                <span className="text-gray-700 font-semibold text-sm">Cycle:</span>
                <select
                  value={filterCycle}
                  onChange={(e) => setFilterCycle(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="all">All Cycles</option>
                  {POWER_CYCLES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </label>

              {/* Capability Filter */}
              <label className="flex items-center gap-2">
                <span className="text-gray-700 font-semibold text-sm">Capability:</span>
                <select
                  value={filterCapability}
                  onChange={(e) => setFilterCapability(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
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

        {/* Results */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedEngines.map((engine) => (
              <EngineCard key={engine.id} engine={engine} />
            ))}
          </div>
        )}

        {viewMode === 'table' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Engine
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Designer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ISP (Vac)
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thrust
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reliability
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Capabilities
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedEngines.map((engine, index) => (
                    <tr key={engine.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{engine.name}</div>
                        {engine.variant && (
                          <div className="text-sm text-gray-500">{engine.variant}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {engine.designer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          engine.status === 'Active' ? 'bg-green-100 text-green-800' :
                          engine.status === 'Retired' ? 'bg-gray-100 text-gray-800' :
                          engine.status === 'Development' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {engine.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        {engine.ispVacuum || engine.isp_s || engine.isp || '—'} s
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        {engine.thrustKn ? `${engine.thrustKn.toLocaleString()} kN` : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        {engine.reliabilityRate ? `${engine.reliabilityRate.toFixed(1)}%` : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-1">
                          {engine.reusable && <Recycling titleAccess="Reusable" className="text-green-600" style={{ fontSize: '1.25rem' }} />}
                          {engine.advancedCycle && <Bolt titleAccess="Advanced Cycle" className="text-purple-600" style={{ fontSize: '1.25rem' }} />}
                          {engine.throttleCapable && <Tune titleAccess="Throttle" className="text-blue-600" style={{ fontSize: '1.25rem' }} />}
                          {engine.restartCapable && <Refresh titleAccess="Restart" className="text-orange-600" style={{ fontSize: '1.25rem' }} />}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          to={`/engines/${engine.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
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
            <p className="text-gray-500 text-lg">No engines match your filters</p>
            <button
              onClick={() => {
                setFilterStatus('all');
                setFilterCountry('all');
                setFilterPropellant('all');
                setFilterCycle('all');
                setFilterCapability('all');
              }}
              className="mt-4 text-indigo-600 hover:text-indigo-800"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Footer note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Data includes liquid rocket engines from major space agencies and manufacturers.
          </p>
        </div>
      </div>
    </div>
  );
}
