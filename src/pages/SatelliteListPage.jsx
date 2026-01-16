import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSatellites, useFilteredSatellites, useSatelliteStatistics } from '../hooks/useSatellites';
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

function StatisticsCard({ statistics }) {
  if (!statistics) return null;

  return (
    <div className="glass-panel p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Satellite Statistics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 glass-tinted-indigo">
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{statistics.total}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Satellites</p>
        </div>
        <div className="text-center p-4 glass-tinted-green">
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{statistics.active}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
        </div>
        <div className="text-center p-4 glass-tinted-purple">
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{statistics.byType?.length || 0}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Types</p>
        </div>
        <div className="text-center p-4 glass-tinted-yellow">
          <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{statistics.byCountry?.length || 0}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Countries</p>
        </div>
      </div>
    </div>
  );
}

export default function SatelliteListPage() {
  const { satellites, loading, error } = useSatellites();
  const { statistics } = useSatelliteStatistics();
  const [filters, setFilters] = useState({
    type: '',
    orbitType: '',
    status: '',
    countryId: '',
    constellation: '',
    search: '',
  });
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');

  const filteredSatellites = useFilteredSatellites(satellites, filters);

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

  // Sort satellites
  const sortedSatellites = useMemo(() => {
    const sorted = [...filteredSatellites];
    switch (sortBy) {
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'launchYear':
        return sorted.sort((a, b) => (b.launchYear || 0) - (a.launchYear || 0));
      case 'altitude':
        return sorted.sort((a, b) => (b.altitude || 0) - (a.altitude || 0));
      case 'mass':
        return sorted.sort((a, b) => (b.massKg || 0) - (a.massKg || 0));
      default:
        return sorted;
    }
  }, [filteredSatellites, sortBy]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      orbitType: '',
      status: '',
      countryId: '',
      constellation: '',
      search: '',
    });
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Satellites</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Explore satellites and space assets from around the world
        </p>
      </div>

      {/* Statistics */}
      <StatisticsCard statistics={statistics} />

      {/* Filters */}
      <div className="glass-panel p-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Filters</h3>
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
            >
              Clear all ({activeFilterCount})
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Search satellites..."
              className="glass-input w-full"
            />
          </div>

          {/* Type filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="glass-select w-full"
            >
              <option value="">All Types</option>
              {filterOptions.types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Orbit filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Orbit</label>
            <select
              value={filters.orbitType}
              onChange={(e) => handleFilterChange('orbitType', e.target.value)}
              className="glass-select w-full"
            >
              <option value="">All Orbits</option>
              {filterOptions.orbits.map(orbit => (
                <option key={orbit} value={orbit}>{orbit}</option>
              ))}
            </select>
          </div>

          {/* Status filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="glass-select w-full"
            >
              <option value="">All Statuses</option>
              {filterOptions.statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Country filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
            <select
              value={filters.countryId}
              onChange={(e) => handleFilterChange('countryId', e.target.value)}
              className="glass-select w-full"
            >
              <option value="">All Countries</option>
              {filterOptions.countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>

          {/* Constellation filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Constellation</label>
            <select
              value={filters.constellation}
              onChange={(e) => handleFilterChange('constellation', e.target.value)}
              className="glass-select w-full"
            >
              <option value="">All Constellations</option>
              {filterOptions.constellations.map(constellation => (
                <option key={constellation} value={constellation}>{constellation}</option>
              ))}
            </select>
          </div>

          {/* Sort by */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass-select w-full"
            >
              <option value="name">Name</option>
              <option value="launchYear">Launch Year</option>
              <option value="altitude">Altitude</option>
              <option value="mass">Mass</option>
            </select>
          </div>

          {/* View mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">View</label>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex-1 ${viewMode === 'grid' ? 'glass-button-primary' : 'glass-button'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`flex-1 ${viewMode === 'list' ? 'glass-button-primary' : 'glass-button'}`}
              >
                List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="mb-4 text-gray-600 dark:text-gray-400">
        Showing {sortedSatellites.length} of {satellites.length} satellites
      </div>

      {/* Satellite grid/list */}
      {sortedSatellites.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No satellites found matching your criteria</p>
          <button
            onClick={clearFilters}
            className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
          >
            Clear filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedSatellites.map(satellite => (
            <SatelliteCard key={satellite.id} satellite={satellite} />
          ))}
        </div>
      ) : (
        <div className="glass-panel overflow-hidden">
          <table className="w-full">
            <thead className="glass-header-gradient">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Orbit</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Country</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Launch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50 dark:divide-white/[0.08]">
              {sortedSatellites.map(satellite => (
                <tr key={satellite.id} className="hover:bg-gray-500/[0.05] dark:hover:bg-white/[0.03] transition-colors">
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
      )}
    </div>
  );
}
