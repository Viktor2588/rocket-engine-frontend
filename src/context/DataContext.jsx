import { createContext, useContext, useState, useCallback, useMemo, useRef } from 'react';
import axios from 'axios';
import { API_CONFIG } from '../constants';

// Create context
const DataContext = createContext(null);

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

// API instance
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

/**
 * Helper to handle paginated responses and fetch all pages
 */
async function fetchAllPages(apiInstance, endpoint) {
  const baseUrl = endpoint.includes('?') ? endpoint : `${endpoint}?`;
  const separator = endpoint.includes('?') ? '&' : '';

  // First request with large page size
  const firstResponse = await apiInstance.get(`${baseUrl}${separator}size=500`);
  const data = firstResponse.data;

  // If it's a flat array response, return directly
  if (Array.isArray(data)) {
    return data;
  }

  // If it's a paginated response
  if (data && typeof data === 'object' && 'content' in data) {
    let allContent = [...data.content];

    // If there are more pages, fetch them
    if (data.totalPages > 1) {
      const promises = [];
      for (let page = 1; page < data.totalPages; page++) {
        promises.push(apiInstance.get(`${baseUrl}${separator}size=500&page=${page}`));
      }
      const responses = await Promise.all(promises);
      responses.forEach(res => {
        if (res.data?.content) {
          allContent = [...allContent, ...res.data.content];
        }
      });
    }
    return allContent;
  }

  return [];
}

/**
 * Data Provider - Centralized data fetching with caching
 */
export function DataProvider({ children }) {
  // Cache state for each data type
  const [cache, setCache] = useState({
    countries: { data: null, timestamp: 0, loading: false, error: null },
    engines: { data: null, timestamp: 0, loading: false, error: null },
    vehicles: { data: null, timestamp: 0, loading: false, error: null },
    missions: { data: null, timestamp: 0, loading: false, error: null },
    satellites: { data: null, timestamp: 0, loading: false, error: null },
    launchSites: { data: null, timestamp: 0, loading: false, error: null },
  });

  // Use ref to access cache without causing callback recreation
  const cacheRef = useRef(cache);
  cacheRef.current = cache;

  // Check if cache is valid - uses ref to avoid dependency on cache
  const isCacheValid = useCallback((key) => {
    const entry = cacheRef.current[key];
    return entry.data && (Date.now() - entry.timestamp) < CACHE_DURATION;
  }, []);

  // Generic fetch function with caching (uses pagination)
  const fetchData = useCallback(async (key, endpoint) => {
    // Return cached data if valid
    if (isCacheValid(key)) {
      return cacheRef.current[key].data;
    }

    // If already loading, wait for it
    if (cacheRef.current[key].loading) {
      // Return existing data while loading, or empty array
      return cacheRef.current[key].data || [];
    }

    // Set loading state
    setCache(prev => ({
      ...prev,
      [key]: { ...prev[key], loading: true, error: null }
    }));

    try {
      // Use fetchAllPages to handle pagination properly
      const data = await fetchAllPages(api, endpoint);

      setCache(prev => ({
        ...prev,
        [key]: { data, timestamp: Date.now(), loading: false, error: null }
      }));

      return data;
    } catch (error) {
      const errorMessage = error.message || `Failed to fetch ${key}`;
      setCache(prev => ({
        ...prev,
        [key]: { ...prev[key], loading: false, error: errorMessage }
      }));
      throw error;
    }
  }, [isCacheValid]);

  // Specific fetch functions (pagination handled automatically)
  const fetchCountries = useCallback(() =>
    fetchData('countries', '/countries'), [fetchData]);

  const fetchEngines = useCallback(() =>
    fetchData('engines', '/engines'), [fetchData]);

  const fetchVehicles = useCallback(() =>
    fetchData('vehicles', '/launch-vehicles'), [fetchData]);

  const fetchMissions = useCallback(() =>
    fetchData('missions', '/missions'), [fetchData]);

  const fetchSatellites = useCallback(() =>
    fetchData('satellites', '/satellites'), [fetchData]);

  const fetchLaunchSites = useCallback(() =>
    fetchData('launchSites', '/launch-sites'), [fetchData]);

  // Invalidate cache (for manual refresh)
  const invalidateCache = useCallback((key) => {
    if (key) {
      setCache(prev => ({
        ...prev,
        [key]: { data: null, timestamp: 0, loading: false, error: null }
      }));
    } else {
      // Invalidate all
      setCache({
        countries: { data: null, timestamp: 0, loading: false, error: null },
        engines: { data: null, timestamp: 0, loading: false, error: null },
        vehicles: { data: null, timestamp: 0, loading: false, error: null },
        missions: { data: null, timestamp: 0, loading: false, error: null },
        satellites: { data: null, timestamp: 0, loading: false, error: null },
        launchSites: { data: null, timestamp: 0, loading: false, error: null },
      });
    }
  }, []);

  const value = useMemo(() => ({
    cache,
    isCacheValid,
    fetchCountries,
    fetchEngines,
    fetchVehicles,
    fetchMissions,
    fetchSatellites,
    fetchLaunchSites,
    invalidateCache,
  }), [cache, isCacheValid, fetchCountries, fetchEngines, fetchVehicles,
      fetchMissions, fetchSatellites, fetchLaunchSites, invalidateCache]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

/**
 * Hook to access cached data context
 */
export function useDataContext() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
}

/**
 * Hook for countries with caching
 */
export function useCachedCountries() {
  const { cache, fetchCountries } = useDataContext();
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const load = useCallback(async () => {
    if (cache.countries.data) return;
    setLocalLoading(true);
    try {
      await fetchCountries();
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setLocalLoading(false);
    }
  }, [cache.countries.data, fetchCountries]);

  // Auto-load on mount if not cached
  useState(() => {
    if (!cache.countries.data && !cache.countries.loading) {
      load();
    }
  });

  return {
    countries: cache.countries.data || [],
    loading: cache.countries.loading || localLoading,
    error: cache.countries.error || localError,
    refetch: load,
  };
}

/**
 * Hook for engines with caching
 */
export function useCachedEngines() {
  const { cache, fetchEngines } = useDataContext();
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const load = useCallback(async () => {
    if (cache.engines.data) return;
    setLocalLoading(true);
    try {
      await fetchEngines();
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setLocalLoading(false);
    }
  }, [cache.engines.data, fetchEngines]);

  useState(() => {
    if (!cache.engines.data && !cache.engines.loading) {
      load();
    }
  });

  return {
    engines: cache.engines.data || [],
    loading: cache.engines.loading || localLoading,
    error: cache.engines.error || localError,
    refetch: load,
  };
}

/**
 * Hook for vehicles with caching
 */
export function useCachedVehicles() {
  const { cache, fetchVehicles } = useDataContext();
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const load = useCallback(async () => {
    if (cache.vehicles.data) return;
    setLocalLoading(true);
    try {
      await fetchVehicles();
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setLocalLoading(false);
    }
  }, [cache.vehicles.data, fetchVehicles]);

  useState(() => {
    if (!cache.vehicles.data && !cache.vehicles.loading) {
      load();
    }
  });

  return {
    vehicles: cache.vehicles.data || [],
    loading: cache.vehicles.loading || localLoading,
    error: cache.vehicles.error || localError,
    refetch: load,
  };
}

/**
 * Hook for missions with caching
 */
export function useCachedMissions() {
  const { cache, fetchMissions } = useDataContext();
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const load = useCallback(async () => {
    if (cache.missions.data) return;
    setLocalLoading(true);
    try {
      await fetchMissions();
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setLocalLoading(false);
    }
  }, [cache.missions.data, fetchMissions]);

  useState(() => {
    if (!cache.missions.data && !cache.missions.loading) {
      load();
    }
  });

  return {
    missions: cache.missions.data || [],
    loading: cache.missions.loading || localLoading,
    error: cache.missions.error || localError,
    refetch: load,
  };
}

/**
 * Hook for satellites with caching
 */
export function useCachedSatellites() {
  const { cache, fetchSatellites } = useDataContext();
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const load = useCallback(async () => {
    if (cache.satellites.data) return;
    setLocalLoading(true);
    try {
      await fetchSatellites();
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setLocalLoading(false);
    }
  }, [cache.satellites.data, fetchSatellites]);

  useState(() => {
    if (!cache.satellites.data && !cache.satellites.loading) {
      load();
    }
  });

  return {
    satellites: cache.satellites.data || [],
    loading: cache.satellites.loading || localLoading,
    error: cache.satellites.error || localError,
    refetch: load,
  };
}

/**
 * Hook for launch sites with caching
 */
export function useCachedLaunchSites() {
  const { cache, fetchLaunchSites } = useDataContext();
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const load = useCallback(async () => {
    if (cache.launchSites.data) return;
    setLocalLoading(true);
    try {
      await fetchLaunchSites();
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setLocalLoading(false);
    }
  }, [cache.launchSites.data, fetchLaunchSites]);

  useState(() => {
    if (!cache.launchSites.data && !cache.launchSites.loading) {
      load();
    }
  });

  return {
    launchSites: cache.launchSites.data || [],
    loading: cache.launchSites.loading || localLoading,
    error: cache.launchSites.error || localError,
    refetch: load,
  };
}

export default DataContext;
