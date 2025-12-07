import { useState, useEffect, useCallback, useMemo } from 'react';
import { launchSiteService } from '../services/launchSiteService';

/**
 * Hook for fetching all launch sites
 */
export function useLaunchSites() {
  const [launchSites, setLaunchSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLaunchSites = async () => {
      try {
        setLoading(true);
        const data = await launchSiteService.getAll();
        setLaunchSites(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch launch sites:', err);
        setError('Failed to load launch sites');
        setLaunchSites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLaunchSites();
  }, []);

  return { launchSites, loading, error };
}

/**
 * Hook for fetching a single launch site by ID
 */
export function useLaunchSite(id) {
  const [launchSite, setLaunchSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchLaunchSite = async () => {
      try {
        setLoading(true);
        const data = await launchSiteService.getById(Number(id));
        setLaunchSite(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch launch site:', err);
        setError('Launch site not found');
        setLaunchSite(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLaunchSite();
  }, [id]);

  return { launchSite, loading, error };
}

/**
 * Hook for fetching launch sites by country
 */
export function useLaunchSitesByCountry(countryCode) {
  const [launchSites, setLaunchSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!countryCode) {
      setLaunchSites([]);
      setLoading(false);
      return;
    }

    const fetchLaunchSites = async () => {
      try {
        setLoading(true);
        const data = await launchSiteService.getByCountryCode(countryCode);
        setLaunchSites(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch launch sites by country:', err);
        setError('Failed to load launch sites');
        setLaunchSites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLaunchSites();
  }, [countryCode]);

  return { launchSites, loading, error };
}

/**
 * Hook for launch site statistics
 */
export function useLaunchSiteStatistics() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const data = await launchSiteService.getStatistics();
        setStatistics(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch launch site statistics:', err);
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
 * Hook for filtering launch sites
 */
export function useFilteredLaunchSites(launchSites, filters) {
  return useMemo(() => {
    if (!launchSites || launchSites.length === 0) return [];

    return launchSites.filter(site => {
      // Status filter
      if (filters.status && site.status !== filters.status) {
        return false;
      }

      // Country filter
      if (filters.countryId && site.countryId !== filters.countryId) {
        return false;
      }

      // Region filter
      if (filters.region && site.region !== filters.region) {
        return false;
      }

      // Human rated filter
      if (filters.humanRated !== undefined && site.humanRated !== filters.humanRated) {
        return false;
      }

      // Polar capable filter
      if (filters.polarCapable !== undefined && site.polarCapable !== filters.polarCapable) {
        return false;
      }

      // GEO capable filter
      if (filters.geoCapable !== undefined && site.geoCapable !== filters.geoCapable) {
        return false;
      }

      // Interplanetary capable filter
      if (filters.interplanetaryCapable !== undefined && site.interplanetaryCapable !== filters.interplanetaryCapable) {
        return false;
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          site.name?.toLowerCase().includes(searchLower) ||
          site.operator?.toLowerCase().includes(searchLower) ||
          site.description?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [launchSites, filters]);
}

/**
 * Hook for launch site search
 */
export function useLaunchSiteSearch() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const data = await launchSiteService.search(query);
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

export default useLaunchSites;
