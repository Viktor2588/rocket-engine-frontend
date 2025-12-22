import { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { satelliteService } from '../services/satelliteService';
import DataContext from '../context/DataContext';

/**
 * Hook for fetching all satellites (with caching)
 */
export function useSatellites() {
  const dataContext = useContext(DataContext);
  const [satellites, setSatellites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract stable references from context
  const cachedData = dataContext?.cache?.satellites?.data;
  const fetchSatellites = dataContext?.fetchSatellites;

  useEffect(() => {
    // If we have cached data, use it immediately
    if (cachedData) {
      setSatellites(cachedData);
      setLoading(false);
      return;
    }

    const doFetch = async () => {
      // If DataContext is available, fetch through it (caches the data)
      if (fetchSatellites) {
        try {
          setLoading(true);
          const data = await fetchSatellites();
          setSatellites(Array.isArray(data) ? data : []);
          setError(null);
        } catch (err) {
          console.error('Failed to fetch satellites:', err);
          setError('Failed to load satellites');
          setSatellites([]);
        } finally {
          setLoading(false);
        }
        return;
      }

      // Fallback to direct service call
      try {
        setLoading(true);
        const data = await satelliteService.getAll();
        setSatellites(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch satellites:', err);
        setError('Failed to load satellites');
        setSatellites([]);
      } finally {
        setLoading(false);
      }
    };

    doFetch();
  }, [cachedData, fetchSatellites]);

  return { satellites, loading, error };
}

/**
 * Hook for fetching a single satellite by ID
 */
export function useSatellite(id) {
  const [satellite, setSatellite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchSatellite = async () => {
      try {
        setLoading(true);
        const data = await satelliteService.getById(Number(id));
        setSatellite(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch satellite:', err);
        setError('Satellite not found');
        setSatellite(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSatellite();
  }, [id]);

  return { satellite, loading, error };
}

/**
 * Hook for fetching satellites by country
 */
export function useSatellitesByCountry(countryCode) {
  const [satellites, setSatellites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!countryCode) {
      setSatellites([]);
      setLoading(false);
      return;
    }

    const fetchSatellites = async () => {
      try {
        setLoading(true);
        const data = await satelliteService.getByCountryCode(countryCode);
        setSatellites(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch satellites by country:', err);
        setError('Failed to load satellites');
        setSatellites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSatellites();
  }, [countryCode]);

  return { satellites, loading, error };
}

/**
 * Hook for satellite statistics
 */
export function useSatelliteStatistics() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const data = await satelliteService.getStatistics();
        setStatistics(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch satellite statistics:', err);
        setError('Failed to load statistics');
        setStatistics(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  return { statistics, loading, error };
}

/**
 * Hook for filtering satellites
 */
export function useFilteredSatellites(satellites, filters) {
  return useMemo(() => {
    if (!satellites || satellites.length === 0) return [];

    return satellites.filter(satellite => {
      // Type filter
      if (filters.type && satellite.type !== filters.type) {
        return false;
      }

      // Orbit filter
      if (filters.orbitType && satellite.orbitType !== filters.orbitType) {
        return false;
      }

      // Status filter
      if (filters.status && satellite.status !== filters.status) {
        return false;
      }

      // Country filter
      if (filters.countryId && satellite.countryId !== filters.countryId) {
        return false;
      }

      // Constellation filter
      if (filters.constellation && satellite.constellation !== filters.constellation) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          satellite.name?.toLowerCase().includes(searchLower) ||
          satellite.operator?.toLowerCase().includes(searchLower) ||
          satellite.purpose?.toLowerCase().includes(searchLower) ||
          satellite.noradId?.includes(filters.search);
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [satellites, filters]);
}

/**
 * Hook for satellite search
 */
export function useSatelliteSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const data = await satelliteService.search(query);
      setResults(data);
    } catch (err) {
      console.error('Search failed:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, search };
}

export default useSatellites;
