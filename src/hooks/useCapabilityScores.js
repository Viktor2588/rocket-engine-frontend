import { useState, useEffect, useMemo, useCallback } from 'react';
import capabilityScoreService from '../services/capabilityScoreService';

/**
 * Hook to fetch all countries with capability scores
 */
export const useCountriesWithScores = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const data = await capabilityScoreService.getAllCountries();
        setCountries(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch countries');
        setCountries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, loading, error };
};

/**
 * Hook to fetch SCI breakdown for a specific country
 */
export const useSCIBreakdown = (countryId) => {
  const [breakdown, setBreakdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!countryId) {
      setLoading(false);
      return;
    }

    const fetchBreakdown = async () => {
      try {
        setLoading(true);
        const data = await capabilityScoreService.getSCIBreakdown(countryId);
        setBreakdown(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch SCI breakdown');
        setBreakdown(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBreakdown();
  }, [countryId]);

  return { breakdown, loading, error };
};

/**
 * Hook to fetch global rankings
 */
export const useSCIRankings = () => {
  const [rankings, setRankings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true);
        const data = await capabilityScoreService.getRankings();
        setRankings(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch rankings');
        setRankings(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  return { rankings, loading, error };
};

/**
 * Hook to compare multiple countries
 */
export const useSCIComparison = (countryIds) => {
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!countryIds || countryIds.length < 2) {
      setLoading(false);
      setComparison(null);
      return;
    }

    const fetchComparison = async () => {
      try {
        setLoading(true);
        const data = await capabilityScoreService.compareCountries(countryIds);
        setComparison(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to compare countries');
        setComparison(null);
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [JSON.stringify(countryIds)]);

  return { comparison, loading, error };
};

/**
 * Hook to fetch rankings by category
 */
export const useSCIRankingsByCategory = (category) => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!category) {
      setLoading(false);
      return;
    }

    const fetchRankings = async () => {
      try {
        setLoading(true);
        const data = await capabilityScoreService.getRankingsByCategory(category);
        setRankings(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch category rankings');
        setRankings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, [category]);

  return { rankings, loading, error };
};

/**
 * Hook to get category weights (static data)
 */
export const useCategoryWeights = () => {
  return useMemo(() => capabilityScoreService.getCategoryWeights(), []);
};

/**
 * Hook to get tier thresholds (static data)
 */
export const useTierThresholds = () => {
  return useMemo(() => capabilityScoreService.getTierThresholds(), []);
};

/**
 * Hook for computed statistics from rankings
 */
export const useRankingsStatistics = (rankings) => {
  return useMemo(() => {
    if (!rankings || !rankings.rankings || rankings.rankings.length === 0) {
      return null;
    }

    const breakdowns = rankings.rankings;
    const scores = breakdowns.map(b => b.overallScore);

    // Tier distribution
    const tierCounts = {
      'Superpower': 0,
      'Major Power': 0,
      'Emerging Power': 0,
      'Developing': 0,
      'Nascent': 0,
    };
    breakdowns.forEach(b => {
      tierCounts[b.tier] = (tierCounts[b.tier] || 0) + 1;
    });

    // Regional distribution
    const regionalScores = {};
    breakdowns.forEach(b => {
      // Get country region from the original data if available
      const country = rankings.rankings.find(r => r.countryId === b.countryId);
      const region = 'Global'; // Default since we don't have region in breakdown
      if (!regionalScores[region]) {
        regionalScores[region] = [];
      }
      regionalScores[region].push(b.overallScore);
    });

    // Category averages
    const categoryAverages = {};
    const categories = breakdowns[0]?.categoryScores.map(cs => cs.category) || [];
    categories.forEach(cat => {
      const catScores = breakdowns.map(
        b => b.categoryScores.find(cs => cs.category === cat)?.score || 0
      );
      categoryAverages[cat] = Math.round(
        catScores.reduce((a, b) => a + b, 0) / catScores.length * 10
      ) / 10;
    });

    return {
      tierDistribution: tierCounts,
      categoryAverages,
      topPerformers: breakdowns.slice(0, 5),
      bottomPerformers: breakdowns.slice(-5).reverse(),
      improvingCountries: breakdowns.filter(b => b.trend === 'improving'),
      decliningCountries: breakdowns.filter(b => b.trend === 'declining'),
    };
  }, [rankings]);
};

/**
 * Hook to manage country selection for comparison
 */
export const useCountrySelection = (maxSelections = 4) => {
  const [selectedCountries, setSelectedCountries] = useState([]);

  const toggleCountry = useCallback((countryId) => {
    setSelectedCountries(prev => {
      if (prev.includes(countryId)) {
        return prev.filter(id => id !== countryId);
      }
      if (prev.length >= maxSelections) {
        return prev;
      }
      return [...prev, countryId];
    });
  }, [maxSelections]);

  const clearSelection = useCallback(() => {
    setSelectedCountries([]);
  }, []);

  const isSelected = useCallback((countryId) => {
    return selectedCountries.includes(countryId);
  }, [selectedCountries]);

  const canSelectMore = selectedCountries.length < maxSelections;

  return {
    selectedCountries,
    toggleCountry,
    clearSelection,
    isSelected,
    canSelectMore,
    selectionCount: selectedCountries.length,
  };
};

/**
 * Hook for filtering and sorting rankings
 */
export const useFilteredRankings = (rankings, options = {}) => {
  const {
    tierFilter = null,
    regionFilter = null,
    capabilityFilter = null,
    searchQuery = '',
    sortBy = 'overall',
    sortOrder = 'desc',
  } = options;

  return useMemo(() => {
    if (!rankings || !rankings.rankings) return [];

    let filtered = [...rankings.rankings];

    // Apply tier filter
    if (tierFilter) {
      filtered = filtered.filter(r => r.tier === tierFilter);
    }

    // Apply capability filter (has specific capability above threshold)
    if (capabilityFilter) {
      filtered = filtered.filter(r => {
        const catScore = r.categoryScores.find(cs => cs.category === capabilityFilter);
        return catScore && catScore.score >= 50;
      });
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.countryName.toLowerCase().includes(query) ||
        String(r.countryId).toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let valueA, valueB;

      if (sortBy === 'overall') {
        valueA = a.overallScore;
        valueB = b.overallScore;
      } else if (sortBy === 'rank') {
        valueA = a.globalRank;
        valueB = b.globalRank;
      } else if (sortBy === 'name') {
        valueA = a.countryName;
        valueB = b.countryName;
        return sortOrder === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        // Sort by specific category
        const catA = a.categoryScores.find(cs => cs.category === sortBy);
        const catB = b.categoryScores.find(cs => cs.category === sortBy);
        valueA = catA?.score || 0;
        valueB = catB?.score || 0;
      }

      return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
    });

    return filtered;
  }, [rankings, tierFilter, regionFilter, capabilityFilter, searchQuery, sortBy, sortOrder]);
};

/**
 * Hook to prepare radar chart data
 */
export const useRadarChartData = (breakdowns, categoryWeights) => {
  return useMemo(() => {
    if (!breakdowns || breakdowns.length === 0 || !categoryWeights) {
      return null;
    }

    const labels = categoryWeights.map(cw => cw.label);
    const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'];

    const datasets = breakdowns.map((breakdown, index) => {
      const data = categoryWeights.map(cw => {
        const catScore = breakdown.categoryScores.find(cs => cs.category === cw.category);
        return catScore?.score || 0;
      });

      return {
        label: breakdown.countryName,
        data,
        backgroundColor: `${colors[index % colors.length]}33`,
        borderColor: colors[index % colors.length],
        borderWidth: 2,
        pointBackgroundColor: colors[index % colors.length],
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: colors[index % colors.length],
      };
    });

    return {
      labels,
      datasets,
    };
  }, [breakdowns, categoryWeights]);
};

/**
 * Hook to prepare bar chart data for category comparison
 */
export const useBarChartData = (breakdowns, category, categoryWeights) => {
  return useMemo(() => {
    if (!breakdowns || breakdowns.length === 0) {
      return null;
    }

    const categoryInfo = categoryWeights?.find(cw => cw.category === category);
    const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'];

    const sortedBreakdowns = [...breakdowns].sort((a, b) => {
      const scoreA = a.categoryScores.find(cs => cs.category === category)?.score || 0;
      const scoreB = b.categoryScores.find(cs => cs.category === category)?.score || 0;
      return scoreB - scoreA;
    });

    return {
      labels: sortedBreakdowns.map(b => b.countryName),
      datasets: [{
        label: categoryInfo?.label || category,
        data: sortedBreakdowns.map(b => {
          const catScore = b.categoryScores.find(cs => cs.category === category);
          return catScore?.score || 0;
        }),
        backgroundColor: sortedBreakdowns.map((_, i) => colors[i % colors.length]),
        borderColor: sortedBreakdowns.map((_, i) => colors[i % colors.length]),
        borderWidth: 1,
      }],
    };
  }, [breakdowns, category, categoryWeights]);
};
