import { useState, useEffect, useCallback, useMemo } from 'react';
import { satelliteService } from '../services/satelliteService';

// Mock satellite data for fallback
const MOCK_SATELLITES = [
  {
    id: 1,
    name: 'Starlink-1001',
    noradId: '44713',
    cosparId: '2019-074A',
    countryId: 'USA',
    type: 'Communication',
    orbitType: 'LEO',
    status: 'Active',
    massKg: 260,
    launchYear: 2019,
    launchDate: '2019-11-11',
    constellation: 'Starlink',
    operator: 'SpaceX',
    purpose: 'Internet communications',
    altitude: 550,
    inclination: 53,
  },
  {
    id: 2,
    name: 'GPS IIF-1',
    noradId: '36585',
    cosparId: '2010-022A',
    countryId: 'USA',
    type: 'Navigation',
    orbitType: 'MEO',
    status: 'Active',
    massKg: 1630,
    launchYear: 2010,
    launchDate: '2010-05-28',
    constellation: 'GPS',
    operator: 'US Space Force',
    purpose: 'Global navigation',
    altitude: 20200,
    inclination: 55,
  },
  {
    id: 3,
    name: 'Hubble Space Telescope',
    noradId: '20580',
    cosparId: '1990-037B',
    countryId: 'USA',
    type: 'Scientific',
    orbitType: 'LEO',
    status: 'Active',
    massKg: 11110,
    launchYear: 1990,
    launchDate: '1990-04-24',
    operator: 'NASA',
    purpose: 'Space telescope for astronomy',
    altitude: 540,
    inclination: 28.5,
  },
  {
    id: 4,
    name: 'International Space Station',
    noradId: '25544',
    cosparId: '1998-067A',
    countryId: 'USA',
    type: 'Space Station',
    orbitType: 'LEO',
    status: 'Active',
    massKg: 420000,
    launchYear: 1998,
    launchDate: '1998-11-20',
    operator: 'NASA/Roscosmos/ESA/JAXA/CSA',
    purpose: 'Crewed space laboratory',
    altitude: 420,
    inclination: 51.6,
  },
  {
    id: 5,
    name: 'GLONASS-M 751',
    noradId: '40001',
    cosparId: '2014-032A',
    countryId: 'RUS',
    type: 'Navigation',
    orbitType: 'MEO',
    status: 'Active',
    massKg: 1415,
    launchYear: 2014,
    launchDate: '2014-06-14',
    constellation: 'GLONASS',
    operator: 'Roscosmos',
    purpose: 'Global navigation',
    altitude: 19140,
    inclination: 64.8,
  },
  {
    id: 6,
    name: 'BeiDou-3 M1',
    noradId: '43001',
    cosparId: '2017-069A',
    countryId: 'CHN',
    type: 'Navigation',
    orbitType: 'MEO',
    status: 'Active',
    massKg: 1014,
    launchYear: 2017,
    launchDate: '2017-11-05',
    constellation: 'BeiDou',
    operator: 'CNSA',
    purpose: 'Global navigation',
    altitude: 21528,
    inclination: 55,
  },
  {
    id: 7,
    name: 'Galileo FOC FM1',
    noradId: '40128',
    cosparId: '2014-050A',
    countryId: 'EU',
    type: 'Navigation',
    orbitType: 'MEO',
    status: 'Active',
    massKg: 733,
    launchYear: 2014,
    launchDate: '2014-08-22',
    constellation: 'Galileo',
    operator: 'ESA',
    purpose: 'Global navigation',
    altitude: 23222,
    inclination: 56,
  },
  {
    id: 8,
    name: 'Tiangong Space Station',
    noradId: '48274',
    cosparId: '2021-035A',
    countryId: 'CHN',
    type: 'Space Station',
    orbitType: 'LEO',
    status: 'Active',
    massKg: 66000,
    launchYear: 2021,
    launchDate: '2021-04-29',
    operator: 'CNSA',
    purpose: 'Crewed space laboratory',
    altitude: 390,
    inclination: 41.5,
  },
  {
    id: 9,
    name: 'GOES-16',
    noradId: '41866',
    cosparId: '2016-071A',
    countryId: 'USA',
    type: 'Weather',
    orbitType: 'GEO',
    status: 'Active',
    massKg: 5192,
    launchYear: 2016,
    launchDate: '2016-11-19',
    operator: 'NOAA',
    purpose: 'Weather monitoring',
    altitude: 35786,
    inclination: 0.1,
  },
  {
    id: 10,
    name: 'Chandrayaan-3',
    noradId: '57320',
    cosparId: '2023-098A',
    countryId: 'IND',
    type: 'Lunar Probe',
    orbitType: 'Lunar',
    status: 'Completed',
    massKg: 3900,
    launchYear: 2023,
    launchDate: '2023-07-14',
    operator: 'ISRO',
    purpose: 'Lunar lander and rover',
  },
  {
    id: 11,
    name: 'James Webb Space Telescope',
    noradId: '50463',
    cosparId: '2021-130A',
    countryId: 'USA',
    type: 'Scientific',
    orbitType: 'L2',
    status: 'Active',
    massKg: 6500,
    launchYear: 2021,
    launchDate: '2021-12-25',
    operator: 'NASA/ESA/CSA',
    purpose: 'Infrared space telescope',
    altitude: 1500000,
  },
  {
    id: 12,
    name: 'OneWeb-0001',
    noradId: '44057',
    cosparId: '2019-010A',
    countryId: 'GBR',
    type: 'Communication',
    orbitType: 'LEO',
    status: 'Active',
    massKg: 150,
    launchYear: 2019,
    launchDate: '2019-02-27',
    constellation: 'OneWeb',
    operator: 'OneWeb',
    purpose: 'Internet communications',
    altitude: 1200,
    inclination: 87.9,
  },
];

/**
 * Hook for fetching all satellites
 */
export function useSatellites() {
  const [satellites, setSatellites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSatellites = async () => {
      try {
        setLoading(true);
        const data = await satelliteService.getAll();
        setSatellites(data);
        setError(null);
      } catch (err) {
        console.warn('Falling back to mock satellite data');
        setSatellites(MOCK_SATELLITES);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSatellites();
  }, []);

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
        // Fallback to mock data
        const mockSatellite = MOCK_SATELLITES.find(s => s.id === Number(id));
        if (mockSatellite) {
          setSatellite(mockSatellite);
          setError(null);
        } else {
          setError('Satellite not found');
        }
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
        // Fallback to mock data
        const filtered = MOCK_SATELLITES.filter(s => s.countryId === countryCode);
        setSatellites(filtered);
        setError(null);
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
        // Generate mock statistics
        const mockStats = {
          total: MOCK_SATELLITES.length,
          active: MOCK_SATELLITES.filter(s => s.status === 'Active').length,
          byType: Object.entries(
            MOCK_SATELLITES.reduce((acc, s) => {
              acc[s.type] = (acc[s.type] || 0) + 1;
              return acc;
            }, {})
          ).map(([type, count]) => ({ type, count })),
          byOrbit: Object.entries(
            MOCK_SATELLITES.reduce((acc, s) => {
              acc[s.orbitType] = (acc[s.orbitType] || 0) + 1;
              return acc;
            }, {})
          ).map(([orbit, count]) => ({ orbit, count })),
          byCountry: Object.entries(
            MOCK_SATELLITES.reduce((acc, s) => {
              acc[s.countryId] = (acc[s.countryId] || 0) + 1;
              return acc;
            }, {})
          ).map(([countryId, count]) => ({ countryId, count })),
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
      // Fallback to local search
      const filtered = MOCK_SATELLITES.filter(s =>
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

export default useSatellites;
