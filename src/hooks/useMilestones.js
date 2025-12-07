import { useState, useEffect, useMemo, useCallback } from 'react';
import spaceMilestoneService from '../services/milestoneService';

/**
 * Custom hooks for milestone data
 */

/**
 * Get all milestones
 */
export function useAllMilestones() {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const data = spaceMilestoneService.getAllMilestones();
      setMilestones(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  return { milestones, loading, error };
}

/**
 * Get milestones by country
 */
export function useCountryMilestones(countryId) {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!countryId) {
      setMilestones([]);
      setLoading(false);
      return;
    }

    try {
      const data = spaceMilestoneService.getMilestonesByCountry(countryId);
      setMilestones(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [countryId]);

  return { milestones, loading, error };
}

/**
 * Get country timeline
 */
export function useCountryTimeline(countryId) {
  const [timeline, setTimeline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!countryId) {
      setTimeline(null);
      setLoading(false);
      return;
    }

    try {
      const data = spaceMilestoneService.getCountryTimeline(countryId);
      setTimeline(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [countryId]);

  return { timeline, loading, error };
}

/**
 * Get milestones by category
 */
export function useMilestonesByCategory(category) {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!category) {
      setMilestones([]);
      setLoading(false);
      return;
    }

    try {
      const data = spaceMilestoneService.getMilestonesByCategory(category);
      setMilestones(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [category]);

  return { milestones, loading, error };
}

/**
 * Get first achievements only
 */
export function useFirstAchievements() {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const data = spaceMilestoneService.getFirstAchievements();
      setMilestones(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  return { milestones, loading, error };
}

/**
 * Get milestones by year range
 */
export function useMilestonesByYearRange(startYear, endYear) {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!startYear || !endYear) {
      setMilestones([]);
      setLoading(false);
      return;
    }

    try {
      const data = spaceMilestoneService.getMilestonesByYearRange(startYear, endYear);
      setMilestones(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [startYear, endYear]);

  return { milestones, loading, error };
}

/**
 * Compare country timelines
 */
export function useTimelineComparison(countryIds) {
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!countryIds || countryIds.length < 2) {
      setComparison(null);
      setLoading(false);
      return;
    }

    try {
      const data = spaceMilestoneService.compareTimelines(countryIds);
      setComparison(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [JSON.stringify(countryIds)]);

  return { comparison, loading, error };
}

/**
 * Get global milestone statistics
 */
export function useGlobalMilestoneStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const data = spaceMilestoneService.getGlobalStats();
      setStats(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  return { stats, loading, error };
}

/**
 * Search milestones
 */
export function useMilestoneSearch(query) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const data = spaceMilestoneService.searchMilestones(query);
      setResults(data);
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    }
    setLoading(false);
  }, [query]);

  return { results, loading };
}

/**
 * Get milestone type info
 */
export function useMilestoneTypeInfo(type) {
  return useMemo(() => {
    if (!type) return null;
    return spaceMilestoneService.getMilestoneTypeInfo(type);
  }, [type]);
}

/**
 * Milestones filtering and sorting hook
 */
export function useFilteredMilestones(initialMilestones = []) {
  const [filters, setFilters] = useState({
    category: null,
    countryId: null,
    yearStart: null,
    yearEnd: null,
    firstsOnly: false,
    searchQuery: ''
  });

  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('asc');

  const filteredMilestones = useMemo(() => {
    let result = [...initialMilestones];

    // Apply filters
    if (filters.category) {
      result = result.filter(m => m.category === filters.category);
    }

    if (filters.countryId) {
      result = result.filter(m => m.countryId === filters.countryId);
    }

    if (filters.yearStart) {
      result = result.filter(m => m.year >= filters.yearStart);
    }

    if (filters.yearEnd) {
      result = result.filter(m => m.year <= filters.yearEnd);
    }

    if (filters.firstsOnly) {
      result = result.filter(m => m.isFirst);
    }

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(m =>
        m.title.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query) ||
        (m.achievedBy && m.achievedBy.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = new Date(a.dateAchieved).getTime() - new Date(b.dateAchieved).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'country':
          comparison = String(a.countryId).localeCompare(String(b.countryId));
          break;
        case 'significance':
          const significanceOrder = { major: 0, significant: 1, notable: 2 };
          comparison = significanceOrder[a.significance] - significanceOrder[b.significance];
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [initialMilestones, filters, sortBy, sortOrder]);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      category: null,
      countryId: null,
      yearStart: null,
      yearEnd: null,
      firstsOnly: false,
      searchQuery: ''
    });
  }, []);

  return {
    milestones: filteredMilestones,
    filters,
    updateFilter,
    resetFilters,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder
  };
}

/**
 * Timeline data preparation hook for visualization
 */
export function useTimelineData(milestones) {
  return useMemo(() => {
    if (!milestones || milestones.length === 0) {
      return { events: [], decades: [], yearRange: { min: 0, max: 0 } };
    }

    // Sort by date
    const sortedMilestones = [...milestones].sort(
      (a, b) => new Date(a.dateAchieved).getTime() - new Date(b.dateAchieved).getTime()
    );

    const years = sortedMilestones.map(m => m.year);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);

    // Create decade markers
    const startDecade = Math.floor(minYear / 10) * 10;
    const endDecade = Math.ceil(maxYear / 10) * 10;
    const decades = [];
    for (let decade = startDecade; decade <= endDecade; decade += 10) {
      decades.push(decade);
    }

    // Transform milestones to timeline events
    const events = sortedMilestones.map(m => ({
      id: m.id,
      date: m.dateAchieved,
      year: m.year,
      title: m.title,
      description: m.description,
      category: m.category,
      milestoneType: m.milestoneType,
      countryId: m.countryId,
      isFirst: m.isFirst,
      achievedBy: m.achievedBy,
      significance: m.significance,
      position: ((m.year - minYear) / (maxYear - minYear || 1)) * 100
    }));

    return {
      events,
      decades,
      yearRange: { min: minYear, max: maxYear }
    };
  }, [milestones]);
}

/**
 * Space Race comparison hook (USA vs USSR/Russia)
 */
export function useSpaceRaceComparison() {
  const { comparison, loading, error } = useTimelineComparison(['USA', 'RUS']);

  const raceData = useMemo(() => {
    if (!comparison) return null;

    const usaTimeline = comparison.countries.find(c => c.countryId === 'USA');
    const rusTimeline = comparison.countries.find(c => c.countryId === 'RUS');

    return {
      usa: usaTimeline,
      russia: rusTimeline,
      sharedMilestones: comparison.sharedMilestones,
      usaFirsts: usaTimeline?.firstAchievements?.length || 0,
      russiaFirsts: rusTimeline?.firstAchievements?.length || 0
    };
  }, [comparison]);

  return { raceData, loading, error };
}

/**
 * Modern space race (USA vs China)
 */
export function useModernSpaceRaceComparison() {
  const { comparison, loading, error } = useTimelineComparison(['USA', 'CHN']);

  const raceData = useMemo(() => {
    if (!comparison) return null;

    const usaTimeline = comparison.countries.find(c => c.countryId === 'USA');
    const chnTimeline = comparison.countries.find(c => c.countryId === 'CHN');

    return {
      usa: usaTimeline,
      china: chnTimeline,
      sharedMilestones: comparison.sharedMilestones,
      usaFirsts: usaTimeline?.firstAchievements?.length || 0,
      chinaFirsts: chnTimeline?.firstAchievements?.length || 0
    };
  }, [comparison]);

  return { raceData, loading, error };
}
