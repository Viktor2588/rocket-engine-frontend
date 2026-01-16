import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAllMissions, useMissionStatistics } from '../hooks/useMissions';
import MissionCard, { StatusBadge, MissionTypeBadge, DestinationBadge } from '../components/MissionCard';
import Pagination from '../components/Pagination';
import SortableHeader, { SortableGridHeader } from '../components/SortableHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import ViewToggle from '../components/ViewToggle';
import { FilterPanel, FilterSection, FilterToggle } from '../components/filters';
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
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Multi-select filter states
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedMissionTypes, setSelectedMissionTypes] = useState([]);
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [crewedOnly, setCrewedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sort states
  const [sortBy, setSortBy] = useState('launchDate');
  const [sortOrder, setSortOrder] = useState('desc');

  // Toggle functions for multi-select
  const toggleStatus = useCallback((status) => {
    setSelectedStatuses(prev =>
      prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
    );
    setCurrentPage(1);
  }, []);

  const toggleMissionType = useCallback((type) => {
    setSelectedMissionTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
    setCurrentPage(1);
  }, []);

  const toggleDestination = useCallback((dest) => {
    setSelectedDestinations(prev =>
      prev.includes(dest) ? prev.filter(d => d !== dest) : [...prev, dest]
    );
    setCurrentPage(1);
  }, []);

  const toggleCrewedOnly = useCallback(() => {
    setCrewedOnly(prev => !prev);
    setCurrentPage(1);
  }, []);

  const clearAllFilters = useCallback(() => {
    setSelectedStatuses([]);
    setSelectedMissionTypes([]);
    setSelectedDestinations([]);
    setCrewedOnly(false);
    setSearchQuery('');
    setCurrentPage(1);
  }, []);

  const hasActiveFilters = selectedStatuses.length > 0 || selectedMissionTypes.length > 0 ||
    selectedDestinations.length > 0 || crewedOnly || searchQuery;

  // Sort handler for table/grid headers
  const handleSort = useCallback((key, order) => {
    setSortBy(key);
    setSortOrder(order);
  }, []);

  // Sort columns configuration
  const sortColumns = [
    { key: 'launchDate', label: 'Launch Date' },
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status' },
    { key: 'destination', label: 'Destination' },
  ];

  // Count missions per filter option
  const filterCounts = useMemo(() => {
    const counts = {
      statuses: {},
      missionTypes: {},
      destinations: {},
      crewed: 0,
    };

    allMissions.forEach(m => {
      // Status counts
      if (m.status) {
        counts.statuses[m.status] = (counts.statuses[m.status] || 0) + 1;
      }
      // Mission type counts
      if (m.missionType) {
        counts.missionTypes[m.missionType] = (counts.missionTypes[m.missionType] || 0) + 1;
      }
      // Destination counts
      if (m.destination) {
        counts.destinations[m.destination] = (counts.destinations[m.destination] || 0) + 1;
      }
      // Crewed count
      if (m.crewed) {
        counts.crewed++;
      }
    });

    return counts;
  }, [allMissions]);

  // Filter and sort missions
  const filteredAndSortedMissions = useMemo(() => {
    let result = [...allMissions];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(m =>
        m.name?.toLowerCase().includes(query) ||
        m.description?.toLowerCase().includes(query)
      );
    }

    // Filter by status (OR within category)
    if (selectedStatuses.length > 0) {
      result = result.filter(m => selectedStatuses.includes(m.status));
    }

    // Filter by mission type (OR within category)
    if (selectedMissionTypes.length > 0) {
      result = result.filter(m => selectedMissionTypes.includes(m.missionType));
    }

    // Filter by destination (OR within category)
    if (selectedDestinations.length > 0) {
      result = result.filter(m => selectedDestinations.includes(m.destination));
    }

    // Filter by crewed
    if (crewedOnly) {
      result = result.filter(m => m.crewed);
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'launchDate':
          comparison = new Date(a.launchDate || 0) - new Date(b.launchDate || 0);
          break;
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '');
          break;
        case 'status':
          comparison = (a.status || '').localeCompare(b.status || '');
          break;
        case 'destination':
          comparison = (a.destination || '').localeCompare(b.destination || '');
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [allMissions, searchQuery, selectedStatuses, selectedMissionTypes, selectedDestinations, crewedOnly, sortBy, sortOrder]);

  // Paginate the filtered results
  const paginatedMissions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedMissions.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedMissions, currentPage, pageSize]);

  // Build active filters array for FilterPanel
  const activeFilters = useMemo(() => {
    const filters = [];

    selectedStatuses.forEach(status => {
      const opt = STATUS_OPTIONS.find(s => s.value === status);
      filters.push({
        key: `status-${status}`,
        label: opt?.label || status,
        color: 'blue',
        onRemove: () => toggleStatus(status),
      });
    });

    selectedMissionTypes.forEach(type => {
      const info = MISSION_TYPE_INFO[type];
      filters.push({
        key: `type-${type}`,
        label: info?.label || type,
        color: 'indigo',
        onRemove: () => toggleMissionType(type),
      });
    });

    selectedDestinations.forEach(dest => {
      const info = DESTINATION_INFO[dest];
      filters.push({
        key: `dest-${dest}`,
        label: info?.label || dest,
        color: 'purple',
        onRemove: () => toggleDestination(dest),
      });
    });

    if (crewedOnly) {
      filters.push({
        key: 'crewed',
        label: 'Crewed Only',
        color: 'orange',
        onRemove: () => setCrewedOnly(false),
      });
    }

    if (searchQuery) {
      filters.push({
        key: 'search',
        label: `"${searchQuery}"`,
        color: 'yellow',
        onRemove: () => setSearchQuery(''),
      });
    }

    return filters;
  }, [selectedStatuses, selectedMissionTypes, selectedDestinations, crewedOnly, searchQuery, toggleStatus, toggleMissionType, toggleDestination]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <LoadingSpinner message="Loading missions..." />
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

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Rocket style={{ fontSize: '2.5rem' }} className="text-gray-900 dark:text-white" /> Space Missions
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
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

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search missions..."
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
          {/* Status Filters */}
          <FilterSection title="Status">
            {STATUS_OPTIONS.map(status => (
              <FilterToggle
                key={status.value}
                label={status.label}
                active={selectedStatuses.includes(status.value)}
                onClick={() => toggleStatus(status.value)}
                count={filterCounts.statuses[status.value] || 0}
              />
            ))}
          </FilterSection>

          {/* Mission Type Filters */}
          <FilterSection title="Mission Type">
            {Object.entries(MISSION_TYPE_INFO).map(([key, info]) => (
              <FilterToggle
                key={key}
                label={`${info.icon} ${info.label}`}
                active={selectedMissionTypes.includes(key)}
                onClick={() => toggleMissionType(key)}
                count={filterCounts.missionTypes[key] || 0}
              />
            ))}
          </FilterSection>

          {/* Destination Filters */}
          <FilterSection title="Destination">
            {Object.entries(DESTINATION_INFO).map(([key, info]) => (
              <FilterToggle
                key={key}
                label={`${info.icon} ${info.label}`}
                active={selectedDestinations.includes(key)}
                onClick={() => toggleDestination(key)}
                count={filterCounts.destinations[key] || 0}
              />
            ))}
          </FilterSection>

          {/* Crewed Filter */}
          <FilterSection title="Crew">
            <FilterToggle
              label="Crewed Missions"
              active={crewedOnly}
              onClick={toggleCrewedOnly}
              count={filterCounts.crewed}
            />
          </FilterSection>
        </FilterPanel>

        {/* Results count */}
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Found {filteredAndSortedMissions.length} missions
        </div>

        {/* Mission List */}
        {filteredAndSortedMissions.length === 0 ? (
          <div className="glass-panel p-12 text-center">
            <div className="mb-4"><Rocket style={{ fontSize: '4rem' }} className="text-gray-300 dark:text-gray-600 mx-auto" /></div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Missions Found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {hasActiveFilters
                ? 'Try adjusting your filters to see more missions.'
                : 'No missions available at this time.'}
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
                {paginatedMissions.map(mission => (
                  <MissionCard key={mission.id} mission={mission} />
                ))}
              </div>
            </div>
            <Pagination
              totalItems={filteredAndSortedMissions.length}
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
                  <SortableHeader
                    label="Mission"
                    sortKey="name"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <SortableHeader label="Country" sortKey={null} />
                  <SortableHeader label="Type" sortKey={null} />
                  <SortableHeader
                    label="Destination"
                    sortKey="destination"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Launch Date"
                    sortKey="launchDate"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Status"
                    sortKey="status"
                    currentSort={sortBy}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                  />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50 dark:divide-white/[0.08]">
                {paginatedMissions.map((mission, index) => (
                  <tr key={mission.id} className={`${index % 2 === 0 ? 'bg-transparent' : 'bg-gray-500/[0.03] dark:bg-white/[0.02]'} hover:bg-gray-500/[0.05] dark:hover:bg-white/[0.03] transition-colors`}>
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
              totalItems={filteredAndSortedMissions.length}
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
