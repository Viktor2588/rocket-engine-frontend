import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLaunchVehicles, useLaunchVehicleStatistics } from '../hooks/useLaunchVehicles';
import LaunchVehicleCard from '../components/LaunchVehicleCard';
import { Rocket, Recycling, PersonOutline } from '@mui/icons-material';

const COUNTRIES = [
  { code: 'USA', name: 'United States' },
  { code: 'CHN', name: 'China' },
  { code: 'RUS', name: 'Russia' },
  { code: 'FRA', name: 'France/ESA' },
  { code: 'JPN', name: 'Japan' },
  { code: 'IND', name: 'India' },
];

export default function LaunchVehicleListPage() {
  const { vehicles, loading, error } = useLaunchVehicles();
  const stats = useLaunchVehicleStatistics();
  const [sortBy, setSortBy] = useState('payload');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterCapability, setFilterCapability] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  // Filter and sort vehicles
  const filteredAndSortedVehicles = useMemo(() => {
    let result = [...vehicles];

    // Filter by status
    if (filterStatus !== 'all') {
      result = result.filter(v => v.status === filterStatus);
    }

    // Filter by country
    if (filterCountry !== 'all') {
      result = result.filter(v => v.countryId === filterCountry);
    }

    // Filter by capability
    if (filterCapability !== 'all') {
      if (filterCapability === 'reusable') {
        result = result.filter(v => v.reusable);
      } else if (filterCapability === 'humanRated') {
        result = result.filter(v => v.humanRated);
      } else if (filterCapability === 'heavyLift') {
        result = result.filter(v => (v.payloadToLeoKg || 0) >= 20000);
      }
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'payload':
          return (b.payloadToLeoKg || 0) - (a.payloadToLeoKg || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'launches':
          return (b.totalLaunches || 0) - (a.totalLaunches || 0);
        case 'successRate':
          return (b.successRate || 0) - (a.successRate || 0);
        case 'cost':
          return (a.costPerLaunchUsd || Infinity) - (b.costPerLaunchUsd || Infinity);
        default:
          return 0;
      }
    });

    return result;
  }, [vehicles, sortBy, filterStatus, filterCountry, filterCapability]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Loading launch vehicles...</p>
        </div>
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Rocket style={{ fontSize: '2.5rem' }} className="text-blue-600" /> Launch Vehicles
          </h1>
          <p className="text-gray-600 dark:text-gray-400 dark:text-gray-400">
            Explore {vehicles.length} launch vehicles from space agencies around the world
          </p>
        </div>

        {/* Quick Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
              <p className="text-3xl font-bold text-indigo-600">{stats.total}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-400">Total Vehicles</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
              <p className="text-3xl font-bold text-green-600">{stats.active}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-400">Active</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
              <p className="text-3xl font-bold text-gray-600 dark:text-gray-400 dark:text-gray-400">{stats.retired}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-400">Retired</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
              <p className="text-3xl font-bold text-blue-600">{stats.development}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-400">In Development</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
              <p className="text-3xl font-bold text-purple-600">{stats.reusable}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-400">Reusable</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
              <p className="text-3xl font-bold text-orange-600">{stats.humanRated}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-400">Human-Rated</p>
            </div>
          </div>
        )}

        {/* Filters & Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <div className="flex flex-wrap gap-4">
              {/* Sort */}
              <label className="flex items-center gap-2">
                <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="payload">Payload Capacity</option>
                  <option value="name">Name</option>
                  <option value="launches">Total Launches</option>
                  <option value="successRate">Success Rate</option>
                  <option value="cost">Cost (Low to High)</option>
                </select>
              </label>

              {/* Status Filter */}
              <label className="flex items-center gap-2">
                <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm">Status:</span>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Retired">Retired</option>
                  <option value="Development">Development</option>
                  <option value="Planned">Planned</option>
                </select>
              </label>

              {/* Country Filter */}
              <label className="flex items-center gap-2">
                <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm">Country:</span>
                <select
                  value={filterCountry}
                  onChange={(e) => setFilterCountry(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="all">All Countries</option>
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                  ))}
                </select>
              </label>

              {/* Capability Filter */}
              <label className="flex items-center gap-2">
                <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm">Capability:</span>
                <select
                  value={filterCapability}
                  onChange={(e) => setFilterCapability(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="all">All Capabilities</option>
                  <option value="reusable">Reusable</option>
                  <option value="humanRated">Human-Rated</option>
                  <option value="heavyLift">Heavy-Lift (20t+)</option>
                </select>
              </label>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-4 py-2 rounded-md font-semibold transition text-sm ${
                  viewMode === 'grid'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 rounded-md font-semibold transition text-sm ${
                  viewMode === 'table'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Table
              </button>
              <Link
                to="/compare/vehicles"
                className="px-4 py-2 rounded-md font-semibold bg-green-500 text-white hover:bg-green-600 transition text-sm"
              >
                Compare
              </Link>
            </div>
          </div>
        </div>

        {/* Results */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedVehicles.map((vehicle) => (
              <LaunchVehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Vehicle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Manufacturer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Payload (LEO)
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Launches
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Success Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Capabilities
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredAndSortedVehicles.map((vehicle, index) => (
                    <tr key={vehicle.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 dark:text-white">{vehicle.name}</div>
                        {vehicle.variant && (
                          <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-400">{vehicle.variant}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 dark:text-gray-400">
                        {vehicle.manufacturer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          vehicle.status === 'Active' ? 'bg-green-100 text-green-800' :
                          vehicle.status === 'Retired' ? 'bg-gray-100 text-gray-800' :
                          vehicle.status === 'Development' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {vehicle.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        {vehicle.payloadToLeoKg ? `${vehicle.payloadToLeoKg.toLocaleString()} kg` : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        {vehicle.totalLaunches ?? '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        {vehicle.successRate ? `${vehicle.successRate.toFixed(1)}%` : '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-1">
                          {vehicle.reusable && <Recycling titleAccess="Reusable" className="text-purple-600" style={{ fontSize: '1.25rem' }} />}
                          {vehicle.humanRated && <PersonOutline titleAccess="Human-Rated" className="text-green-600" style={{ fontSize: '1.25rem' }} />}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          to={`/vehicles/${vehicle.id}`}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
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

        {/* No results */}
        {filteredAndSortedVehicles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No vehicles match your filters</p>
            <button
              onClick={() => {
                setFilterStatus('all');
                setFilterCountry('all');
                setFilterCapability('all');
              }}
              className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
            >
              Clear filters
            </button>
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
