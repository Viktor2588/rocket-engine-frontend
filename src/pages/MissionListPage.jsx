import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAllMissions, useFilteredMissions, useMissionStatistics } from '../hooks/useMissions';
import MissionCard, { StatusBadge, MissionTypeBadge, DestinationBadge } from '../components/MissionCard';
import Pagination from '../components/Pagination';
import { MISSION_TYPE_INFO, DESTINATION_INFO } from '../types';
import {
  Rocket,
  PersonOutline,
  EmojiEvents,
  Flag,
  Circle,
  NightlightRound,
} from '@mui/icons-material';

// Status options for filter
const STATUS_OPTIONS = [
  { value: 'PLANNED', label: 'Planned' },
  { value: 'IN_DEVELOPMENT', label: 'In Development' },
  { value: 'LAUNCHED', label: 'Launched' },
  { value: 'IN_TRANSIT', label: 'In Transit' },
  { value: 'ACTIVE', label: 'Active' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'PARTIAL_SUCCESS', label: 'Partial Success' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'LOST', label: 'Lost' }
];

export default function MissionListPage() {
  const { missions: allMissions, loading, error } = useAllMissions();
  const { stats } = useMissionStatistics();
  const [viewMode, setViewMode] = useState('grid'); // grid, list, timeline
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const {
    missions: filteredMissions,
    filters,
    updateFilter,
    resetFilters,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder
  } = useFilteredMissions(allMissions);

  // Paginate the filtered results
  const paginatedMissions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredMissions.slice(startIndex, startIndex + pageSize);
  }, [filteredMissions, currentPage, pageSize]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Loading missions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">Error Loading Missions</h2>
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  const hasActiveFilters = filters.status || filters.missionType || filters.destination || filters.crewedOnly || filters.searchQuery;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Space Missions</h1>
          <p className="text-gray-600 dark:text-gray-400 dark:text-gray-400">
            Explore humanity's missions to space, from historic firsts to ongoing explorations
          </p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="glass-tinted-indigo p-4 text-center">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.totalMissions}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Missions</div>
            </div>
            <div className="glass-tinted-green p-4 text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.activeMissions}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Active</div>
            </div>
            <div className="glass-tinted-purple p-4 text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.crewedMissions}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Crewed</div>
            </div>
            <div className="glass-tinted-yellow p-4 text-center">
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.historicFirsts}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Historic Firsts</div>
            </div>
            <div className="glass-tinted-teal p-4 text-center">
              <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">{stats.successRate}%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Success Rate</div>
            </div>
          </div>
        )}

        {/* Filters and Controls */}
        <div className="glass-panel p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search missions..."
                value={filters.searchQuery}
                onChange={(e) => updateFilter('searchQuery', e.target.value)}
                className="glass-input w-full"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filters.status || ''}
              onChange={(e) => updateFilter('status', e.target.value || null)}
              className="glass-select"
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            {/* Mission Type Filter */}
            <select
              value={filters.missionType || ''}
              onChange={(e) => updateFilter('missionType', e.target.value || null)}
              className="glass-select"
            >
              <option value="">All Types</option>
              {Object.entries(MISSION_TYPE_INFO).map(([key, info]) => (
                <option key={key} value={key}>{info.icon} {info.label}</option>
              ))}
            </select>

            {/* Destination Filter */}
            <select
              value={filters.destination || ''}
              onChange={(e) => updateFilter('destination', e.target.value || null)}
              className="glass-select"
            >
              <option value="">All Destinations</option>
              {Object.entries(DESTINATION_INFO).map(([key, info]) => (
                <option key={key} value={key}>{info.icon} {info.label}</option>
              ))}
            </select>
          </div>

          {/* Second row: toggles and view controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 pt-4 border-t border-gray-200/50 dark:border-white/[0.08]">
            <div className="flex items-center gap-4">
              {/* Crewed Only Toggle */}
              <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={filters.crewedOnly}
                  onChange={(e) => updateFilter('crewedOnly', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Crewed Missions Only</span>
              </label>

              {/* Reset Filters */}
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                >
                  Clear Filters
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Sort */}
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="glass-select text-sm"
                >
                  <option value="launchDate">Launch Date</option>
                  <option value="name">Name</option>
                  <option value="status">Status</option>
                  <option value="destination">Destination</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="glass-button px-2 py-1.5"
                  title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>

              {/* View Mode */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'glass-button-primary' : 'glass-button'}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'glass-button-primary' : 'glass-button'}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Active filters indicator */}
          {hasActiveFilters && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-500 dark:text-gray-400">Showing {filteredMissions.length} of {allMissions.length} missions:</span>
              {filters.status && (
                <span className="px-2 py-1 bg-blue-500/15 dark:bg-blue-500/25 text-blue-700 dark:text-blue-300 rounded-full text-xs border border-blue-400/20 backdrop-blur-sm">
                  {STATUS_OPTIONS.find(s => s.value === filters.status)?.label}
                </span>
              )}
              {filters.missionType && (
                <span className="px-2 py-1 bg-gray-500/15 dark:bg-gray-500/25 text-gray-700 dark:text-gray-300 rounded-full text-xs border border-gray-400/20 backdrop-blur-sm">
                  {MISSION_TYPE_INFO[filters.missionType]?.label}
                </span>
              )}
              {filters.destination && (
                <span className="px-2 py-1 bg-indigo-500/15 dark:bg-indigo-500/25 text-indigo-700 dark:text-indigo-300 rounded-full text-xs border border-indigo-400/20 backdrop-blur-sm">
                  {DESTINATION_INFO[filters.destination]?.label}
                </span>
              )}
              {filters.crewedOnly && (
                <span className="px-2 py-1 bg-purple-500/15 dark:bg-purple-500/25 text-purple-700 dark:text-purple-300 rounded-full text-xs border border-purple-400/20 backdrop-blur-sm">
                  Crewed Only
                </span>
              )}
              {filters.searchQuery && (
                <span className="px-2 py-1 bg-yellow-500/15 dark:bg-yellow-500/25 text-yellow-700 dark:text-yellow-300 rounded-full text-xs border border-yellow-400/20 backdrop-blur-sm">
                  "{filters.searchQuery}"
                </span>
              )}
            </div>
          )}
        </div>

        {/* Mission List */}
        {filteredMissions.length === 0 ? (
          <div className="glass-panel p-12 text-center">
            <div className="mb-4"><Rocket style={{ fontSize: '4rem' }} className="text-indigo-600 dark:text-indigo-400" /></div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Missions Found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {hasActiveFilters
                ? 'Try adjusting your filters to see more missions.'
                : 'No missions available at this time.'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedMissions.map(mission => (
                <MissionCard key={mission.id} mission={mission} />
              ))}
            </div>
            <Pagination
              totalItems={filteredMissions.length}
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
              <table className="min-w-full divide-y divide-gray-200/50 dark:divide-white/[0.08]">
                <thead className="glass-header-gradient">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Mission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Destination
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Launch Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50 dark:divide-white/[0.08]">
                {paginatedMissions.map(mission => (
                  <tr key={mission.id} className="hover:bg-gray-500/[0.05] dark:hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/missions/${mission.id}`}
                        className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                      >
                        {mission.name}
                      </Link>
                      {mission.crewed && (
                        <PersonOutline className="ml-2 text-purple-600 dark:text-purple-400" style={{ fontSize: '1rem' }} />
                      )}
                      {mission.historicFirst && (
                        <EmojiEvents className="ml-1 text-yellow-600 dark:text-yellow-400" style={{ fontSize: '1rem' }} />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Flag className="text-gray-600 dark:text-gray-400" style={{ fontSize: '1.25rem' }} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <MissionTypeBadge missionType={mission.missionType} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <DestinationBadge destination={mission.destination} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(mission.launchDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={mission.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
            <Pagination
              totalItems={filteredMissions.length}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={setCurrentPage}
              onPageSizeChange={setPageSize}
              className="mt-6"
            />
          </>
        )}

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/missions?filter=crewed"
            className="glass-tinted-purple p-4 flex items-center gap-3 glass-float"
          >
            <PersonOutline style={{ fontSize: '2rem' }} className="text-purple-600 dark:text-purple-400" />
            <div>
              <h3 className="font-semibold text-purple-800 dark:text-purple-300">Crewed Missions</h3>
              <p className="text-sm text-purple-600 dark:text-purple-400">Explore human spaceflight</p>
            </div>
          </Link>
          <Link
            to="/missions?destination=MARS"
            className="glass-tinted-red p-4 flex items-center gap-3 glass-float"
          >
            <Circle style={{ fontSize: '2rem' }} className="text-red-600 dark:text-red-400" />
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-300">Mars Missions</h3>
              <p className="text-sm text-red-600 dark:text-red-400">Journey to the Red Planet</p>
            </div>
          </Link>
          <Link
            to="/missions?destination=MOON"
            className="glass-panel p-4 flex items-center gap-3 glass-float"
          >
            <NightlightRound style={{ fontSize: '2rem' }} className="text-gray-600 dark:text-gray-300" />
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">Lunar Missions</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Return to the Moon</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
