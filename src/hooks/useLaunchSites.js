import { useState, useEffect, useCallback, useMemo } from 'react';
import { launchSiteService } from '../services/launchSiteService';

// Mock launch site data for fallback
const MOCK_LAUNCH_SITES = [
  {
    id: 1,
    name: 'Kennedy Space Center',
    countryId: 'USA',
    latitude: 28.5721,
    longitude: -80.6480,
    status: 'Active',
    operator: 'NASA / SpaceX',
    established: 1962,
    totalLaunches: 185,
    successfulLaunches: 180,
    successRate: 97.3,
    maxInclination: 57,
    minInclination: 28.5,
    humanRated: true,
    interplanetaryCapable: true,
    geoCapable: true,
    polarCapable: false,
    hasLanding: true,
    region: 'North America',
    description: 'Primary US launch site for crewed missions and heavy-lift vehicles.',
  },
  {
    id: 2,
    name: 'Cape Canaveral Space Force Station',
    countryId: 'USA',
    latitude: 28.4889,
    longitude: -80.5778,
    status: 'Active',
    operator: 'US Space Force / ULA / SpaceX',
    established: 1950,
    totalLaunches: 950,
    successfulLaunches: 920,
    successRate: 96.8,
    maxInclination: 57,
    minInclination: 28.5,
    humanRated: true,
    interplanetaryCapable: true,
    geoCapable: true,
    polarCapable: false,
    hasLanding: true,
    region: 'North America',
    description: 'Americas busiest spaceport with multiple launch complexes.',
  },
  {
    id: 3,
    name: 'Vandenberg Space Force Base',
    countryId: 'USA',
    latitude: 34.7420,
    longitude: -120.5724,
    status: 'Active',
    operator: 'US Space Force / SpaceX',
    established: 1957,
    totalLaunches: 700,
    successfulLaunches: 680,
    successRate: 97.1,
    maxInclination: 104,
    minInclination: 56,
    humanRated: false,
    interplanetaryCapable: true,
    geoCapable: false,
    polarCapable: true,
    hasLanding: true,
    region: 'North America',
    description: 'Primary US site for polar and sun-synchronous orbit launches.',
  },
  {
    id: 4,
    name: 'Baikonur Cosmodrome',
    countryId: 'RUS',
    latitude: 45.9650,
    longitude: 63.3050,
    status: 'Active',
    operator: 'Roscosmos',
    established: 1955,
    totalLaunches: 1500,
    successfulLaunches: 1430,
    successRate: 95.3,
    maxInclination: 65,
    minInclination: 45,
    humanRated: true,
    interplanetaryCapable: true,
    geoCapable: true,
    polarCapable: false,
    hasLanding: false,
    region: 'Asia',
    description: 'Worlds first and largest operational space launch facility. Launch site of Sputnik and Vostok 1.',
  },
  {
    id: 5,
    name: 'Plesetsk Cosmodrome',
    countryId: 'RUS',
    latitude: 62.9271,
    longitude: 40.5777,
    status: 'Active',
    operator: 'Russian Space Forces',
    established: 1957,
    totalLaunches: 1600,
    successfulLaunches: 1550,
    successRate: 96.9,
    maxInclination: 83,
    minInclination: 62.8,
    humanRated: false,
    interplanetaryCapable: false,
    geoCapable: false,
    polarCapable: true,
    hasLanding: false,
    region: 'Europe',
    description: 'Northern Russian spaceport optimized for high-inclination orbits.',
  },
  {
    id: 6,
    name: 'Jiuquan Satellite Launch Center',
    countryId: 'CHN',
    latitude: 40.9606,
    longitude: 100.2910,
    status: 'Active',
    operator: 'CNSA',
    established: 1958,
    totalLaunches: 150,
    successfulLaunches: 145,
    successRate: 96.7,
    maxInclination: 70,
    minInclination: 40,
    humanRated: true,
    interplanetaryCapable: false,
    geoCapable: false,
    polarCapable: false,
    hasLanding: false,
    region: 'Asia',
    description: 'Chinas first and primary crewed spaceflight launch site.',
  },
  {
    id: 7,
    name: 'Wenchang Space Launch Center',
    countryId: 'CHN',
    latitude: 19.6145,
    longitude: 110.9510,
    status: 'Active',
    operator: 'CNSA',
    established: 2014,
    totalLaunches: 25,
    successfulLaunches: 25,
    successRate: 100,
    maxInclination: 60,
    minInclination: 19,
    humanRated: true,
    interplanetaryCapable: true,
    geoCapable: true,
    polarCapable: false,
    hasLanding: false,
    region: 'Asia',
    description: 'Chinas newest and southernmost launch site for heavy-lift rockets.',
  },
  {
    id: 8,
    name: 'Satish Dhawan Space Centre',
    countryId: 'IND',
    latitude: 13.7200,
    longitude: 80.2300,
    status: 'Active',
    operator: 'ISRO',
    established: 1971,
    totalLaunches: 85,
    successfulLaunches: 78,
    successRate: 91.8,
    maxInclination: 100,
    minInclination: 13,
    humanRated: true,
    interplanetaryCapable: true,
    geoCapable: true,
    polarCapable: true,
    hasLanding: false,
    region: 'Asia',
    description: 'Indias primary launch center on Sriharikota Island.',
  },
  {
    id: 9,
    name: 'Tanegashima Space Center',
    countryId: 'JPN',
    latitude: 30.4000,
    longitude: 130.9700,
    status: 'Active',
    operator: 'JAXA',
    established: 1969,
    totalLaunches: 95,
    successfulLaunches: 92,
    successRate: 96.8,
    maxInclination: 99,
    minInclination: 28,
    humanRated: false,
    interplanetaryCapable: true,
    geoCapable: true,
    polarCapable: true,
    hasLanding: false,
    region: 'Asia',
    description: 'Japans largest rocket launch complex.',
  },
  {
    id: 10,
    name: 'Guiana Space Centre',
    countryId: 'FRA',
    latitude: 5.2322,
    longitude: -52.7750,
    status: 'Active',
    operator: 'CNES / ESA / Arianespace',
    established: 1968,
    totalLaunches: 320,
    successfulLaunches: 305,
    successRate: 95.3,
    maxInclination: 102,
    minInclination: 5,
    humanRated: false,
    interplanetaryCapable: true,
    geoCapable: true,
    polarCapable: true,
    hasLanding: false,
    region: 'South America',
    description: 'European spaceport near the equator, ideal for GEO launches.',
  },
  {
    id: 11,
    name: 'Starbase',
    countryId: 'USA',
    latitude: 25.9972,
    longitude: -97.1560,
    status: 'Active',
    operator: 'SpaceX',
    established: 2019,
    totalLaunches: 6,
    successfulLaunches: 4,
    successRate: 66.7,
    maxInclination: 57,
    minInclination: 26,
    humanRated: false,
    interplanetaryCapable: true,
    geoCapable: true,
    polarCapable: false,
    hasLanding: true,
    region: 'North America',
    description: 'SpaceXs private launch facility for Starship development and orbital flights.',
  },
  {
    id: 12,
    name: 'Naro Space Center',
    countryId: 'KOR',
    latitude: 34.4317,
    longitude: 127.5356,
    status: 'Active',
    operator: 'KARI',
    established: 2009,
    totalLaunches: 6,
    successfulLaunches: 4,
    successRate: 66.7,
    maxInclination: 80,
    minInclination: 34,
    humanRated: false,
    interplanetaryCapable: false,
    geoCapable: false,
    polarCapable: false,
    hasLanding: false,
    region: 'Asia',
    description: 'South Koreas first spaceport.',
  },
];

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
        console.warn('Falling back to mock launch site data');
        setLaunchSites(MOCK_LAUNCH_SITES);
        setError(null);
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
        // Fallback to mock data
        const mockSite = MOCK_LAUNCH_SITES.find(s => s.id === Number(id));
        if (mockSite) {
          setLaunchSite(mockSite);
          setError(null);
        } else {
          setError('Launch site not found');
        }
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
        // Fallback to mock data
        const filtered = MOCK_LAUNCH_SITES.filter(s => s.countryId === countryCode);
        setLaunchSites(filtered);
        setError(null);
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
        // Generate mock statistics
        const mockStats = {
          total: MOCK_LAUNCH_SITES.length,
          active: MOCK_LAUNCH_SITES.filter(s => s.status === 'Active').length,
          byCountry: Object.entries(
            MOCK_LAUNCH_SITES.reduce((acc, s) => {
              acc[s.countryId] = (acc[s.countryId] || 0) + 1;
              return acc;
            }, {})
          ).map(([countryId, count]) => ({ countryId, count })),
          byStatus: Object.entries(
            MOCK_LAUNCH_SITES.reduce((acc, s) => {
              acc[s.status] = (acc[s.status] || 0) + 1;
              return acc;
            }, {})
          ).map(([status, count]) => ({ status, count })),
          byRegion: Object.entries(
            MOCK_LAUNCH_SITES.reduce((acc, s) => {
              acc[s.region] = (acc[s.region] || 0) + 1;
              return acc;
            }, {})
          ).map(([region, count]) => ({ region, count })),
          totalLaunches: MOCK_LAUNCH_SITES.reduce((acc, s) => acc + (s.totalLaunches || 0), 0),
          averageSuccessRate: MOCK_LAUNCH_SITES.reduce((acc, s) => acc + (s.successRate || 0), 0) / MOCK_LAUNCH_SITES.length,
        };
        setStatistics(mockStats);
        setError(null);
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
      // Fallback to local search
      const filtered = MOCK_LAUNCH_SITES.filter(s =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.operator?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, search };
}

export default useLaunchSites;
