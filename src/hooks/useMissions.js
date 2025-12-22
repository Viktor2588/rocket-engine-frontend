import { useState, useEffect, useMemo, useCallback, useContext } from 'react';
import SpaceMissionService from '../services/missionService';
import DataContext from '../context/DataContext';

// Hook to get all missions (with caching)
export function useAllMissions() {
  const dataContext = useContext(DataContext);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract stable references from context
  const cachedData = dataContext?.cache?.missions?.data;
  const fetchMissions = dataContext?.fetchMissions;

  useEffect(() => {
    // If we have cached data, use it immediately
    if (cachedData) {
      setMissions(cachedData);
      setLoading(false);
      return;
    }

    const doFetch = async () => {
      // If DataContext is available, fetch through it (caches the data)
      if (fetchMissions) {
        try {
          setLoading(true);
          const data = await fetchMissions();
          setMissions(Array.isArray(data) ? data : []);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
        return;
      }

      // Fallback to direct service call
      try {
        setLoading(true);
        const data = await SpaceMissionService.getAllMissions();
        setMissions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    doFetch();
  }, [cachedData, fetchMissions]);

  return { missions, loading, error };
}

// Hook to get a single mission by ID
export function useMissionById(id) {
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchMission = async () => {
      try {
        setLoading(true);
        const data = await SpaceMissionService.getMissionById(id);
        setMission(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMission();
  }, [id]);

  return { mission, loading, error };
}

// Hook to get missions by country
export function useCountryMissions(countryId) {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!countryId) {
      setMissions([]);
      setLoading(false);
      return;
    }

    const fetchMissions = async () => {
      try {
        setLoading(true);
        const data = await SpaceMissionService.getMissionsByCountry(countryId);
        setMissions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMissions();
  }, [countryId]);

  return { missions, loading, error };
}

// Hook to get missions by type
export function useMissionsByType(missionType) {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setLoading(true);
        const data = missionType
          ? await SpaceMissionService.getMissionsByType(missionType)
          : await SpaceMissionService.getAllMissions();
        setMissions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMissions();
  }, [missionType]);

  return { missions, loading, error };
}

// Hook to get missions by destination
export function useMissionsByDestination(destination) {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setLoading(true);
        const data = destination
          ? await SpaceMissionService.getMissionsByDestination(destination)
          : await SpaceMissionService.getAllMissions();
        setMissions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMissions();
  }, [destination]);

  return { missions, loading, error };
}

// Hook to get crewed missions
export function useCrewedMissions() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setLoading(true);
        const data = await SpaceMissionService.getCrewedMissions();
        setMissions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMissions();
  }, []);

  return { missions, loading, error };
}

// Hook to get historic first missions
export function useHistoricFirsts() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setLoading(true);
        const data = await SpaceMissionService.getHistoricFirsts();
        setMissions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMissions();
  }, []);

  return { missions, loading, error };
}

// Hook to get active missions
export function useActiveMissions() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setLoading(true);
        const data = await SpaceMissionService.getActiveMissions();
        setMissions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMissions();
  }, []);

  return { missions, loading, error };
}

// Hook to get upcoming missions
export function useUpcomingMissions() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setLoading(true);
        const data = await SpaceMissionService.getUpcomingMissions();
        setMissions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMissions();
  }, []);

  return { missions, loading, error };
}

// Hook to get mission statistics
export function useMissionStatistics(countryId = null) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await SpaceMissionService.getStatistics(countryId);
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [countryId]);

  return { stats, loading, error };
}

// Hook to search missions
export function useMissionSearch(query) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const searchMissions = async () => {
      try {
        setLoading(true);
        const data = await SpaceMissionService.searchMissions(query);
        setResults(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchMissions, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return { results, loading, error };
}

// Hook for filtered and sorted missions
export function useFilteredMissions(missions = []) {
  const [filters, setFilters] = useState({
    status: null,
    missionType: null,
    destination: null,
    crewedOnly: false,
    yearRange: null,
    searchQuery: ''
  });
  const [sortBy, setSortBy] = useState('launchDate');
  const [sortOrder, setSortOrder] = useState('desc');

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      status: null,
      missionType: null,
      destination: null,
      crewedOnly: false,
      yearRange: null,
      searchQuery: ''
    });
  }, []);

  const filteredMissions = useMemo(() => {
    let result = [...missions];

    // Apply filters
    if (filters.status) {
      result = result.filter(m => m.status === filters.status);
    }

    if (filters.missionType) {
      result = result.filter(m => m.missionType === filters.missionType);
    }

    if (filters.destination) {
      result = result.filter(m => m.destination === filters.destination);
    }

    if (filters.crewedOnly) {
      result = result.filter(m => m.crewed);
    }

    if (filters.yearRange) {
      const [startYear, endYear] = filters.yearRange;
      result = result.filter(m => {
        const year = new Date(m.launchDate).getFullYear();
        return year >= startYear && year <= endYear;
      });
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(m =>
        m.name.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query) ||
        (m.objectives && m.objectives.some(o => o.toLowerCase().includes(query)))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'launchDate':
          comparison = new Date(a.launchDate) - new Date(b.launchDate);
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'destination':
          comparison = a.destination.localeCompare(b.destination);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [missions, filters, sortBy, sortOrder]);

  return {
    missions: filteredMissions,
    filters,
    updateFilter,
    resetFilters,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder
  };
}

// Hook to get mission type info
export function useMissionTypeInfo(missionType) {
  const { MISSION_TYPE_INFO } = require('../types');

  return useMemo(() => {
    if (!missionType) return null;
    return MISSION_TYPE_INFO[missionType] || null;
  }, [missionType, MISSION_TYPE_INFO]);
}

// Hook to get destination info
export function useDestinationInfo(destination) {
  const { DESTINATION_INFO } = require('../types');

  return useMemo(() => {
    if (!destination) return null;
    return DESTINATION_INFO[destination] || null;
  }, [destination, DESTINATION_INFO]);
}

// Hook for mission timeline data (grouped by year)
export function useMissionTimeline(missions = []) {
  return useMemo(() => {
    const timeline = {};

    missions.forEach(mission => {
      const year = new Date(mission.launchDate).getFullYear();
      if (!timeline[year]) {
        timeline[year] = [];
      }
      timeline[year].push(mission);
    });

    // Sort missions within each year by date
    Object.keys(timeline).forEach(year => {
      timeline[year].sort((a, b) =>
        new Date(a.launchDate) - new Date(b.launchDate)
      );
    });

    // Convert to array of { year, missions } objects, sorted by year
    return Object.entries(timeline)
      .map(([year, missions]) => ({
        year: parseInt(year),
        missions,
        count: missions.length
      }))
      .sort((a, b) => b.year - a.year);
  }, [missions]);
}

// Hook to get country mission summary
export function useCountryMissionSummary(countryId) {
  const { missions, loading, error } = useCountryMissions(countryId);

  const summary = useMemo(() => {
    if (!missions || missions.length === 0) return null;

    const byStatus = {};
    const byType = {};
    const byDestination = {};
    let crewedCount = 0;
    let totalCrew = 0;

    missions.forEach(m => {
      // Status counts
      byStatus[m.status] = (byStatus[m.status] || 0) + 1;

      // Type counts
      byType[m.missionType] = (byType[m.missionType] || 0) + 1;

      // Destination counts
      byDestination[m.destination] = (byDestination[m.destination] || 0) + 1;

      // Crewed stats
      if (m.crewed) {
        crewedCount++;
        totalCrew += m.crewSize || 0;
      }
    });

    const sortedMissions = [...missions].sort((a, b) =>
      new Date(a.launchDate) - new Date(b.launchDate)
    );

    return {
      totalMissions: missions.length,
      byStatus,
      byType,
      byDestination,
      crewedMissions: crewedCount,
      totalCrewMembers: totalCrew,
      firstMission: sortedMissions[0],
      latestMission: sortedMissions[sortedMissions.length - 1],
      activeMissions: missions.filter(m => m.status === 'ACTIVE' || m.status === 'IN_TRANSIT').length,
      successRate: missions.length > 0
        ? ((missions.filter(m => m.status === 'COMPLETED' || m.status === 'ACTIVE').length / missions.length) * 100).toFixed(1)
        : 0
    };
  }, [missions]);

  return { summary, missions, loading, error };
}
