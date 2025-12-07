import { useState, useEffect, useCallback } from 'react';
import countryService from '../services/countryService';

/**
 * Hook to fetch all countries with space programs
 */
export const useCountries = () => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const data = await countryService.getAll();
        // Ensure data is always an array to prevent "e is not iterable" errors
        setCountries(Array.isArray(data) ? data : []);
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
 * Hook to fetch a single country by ID
 */
export const useCountry = (id) => {
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchCountry = async () => {
      try {
        setLoading(true);
        const data = await countryService.getById(id);
        setCountry(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch country');
        setCountry(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, [id]);

  return { country, loading, error };
};

/**
 * Hook to fetch a country by ISO code (USA, CHN, RUS, etc.)
 */
export const useCountryByCode = (isoCode) => {
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isoCode) {
      setLoading(false);
      return;
    }

    const fetchCountry = async () => {
      try {
        setLoading(true);
        const data = await countryService.getByCode(isoCode);
        setCountry(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch country');
        setCountry(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCountry();
  }, [isoCode]);

  return { country, loading, error };
};

/**
 * Hook to fetch global country rankings
 * Returns countries sorted by capability score
 */
export const useCountryRankings = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      const data = await countryService.getRankings();
      // Backend returns Country[] sorted by score
      // Ensure data is always an array
      const safeData = Array.isArray(data) ? data : [];
      // Map to include rank index
      const rankedData = safeData.map((country, index) => ({
        ...country,
        rank: index + 1
      }));
      setRankings(rankedData);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch rankings');
      setRankings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { rankings, loading, error, refetch };
};

/**
 * Hook to fetch capability scores for a country
 */
export const useCapabilityScores = (countryId) => {
  const [scores, setScores] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!countryId) {
      setLoading(false);
      return;
    }

    const fetchScores = async () => {
      try {
        setLoading(true);
        const data = await countryService.getCapabilityScores(countryId);
        setScores(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch capability scores');
        setScores(null);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [countryId]);

  return { scores, loading, error };
};

/**
 * Hook to compare multiple countries
 */
export const useCountryComparison = (countryIds) => {
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Stringify to create a stable dependency
  const countryIdsKey = JSON.stringify(countryIds);

  useEffect(() => {
    if (!countryIds || countryIds.length < 2) {
      setComparison(null);
      setLoading(false);
      return;
    }

    const fetchComparison = async () => {
      try {
        setLoading(true);
        const data = await countryService.compare(countryIds);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryIdsKey]);

  return { comparison, loading, error };
};

/**
 * Hook to fetch engines for a specific country
 */
export const useCountryEngines = (countryId) => {
  const [engines, setEngines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!countryId) {
      setLoading(false);
      return;
    }

    const fetchEngines = async () => {
      try {
        setLoading(true);
        const data = await countryService.getEngines(countryId);
        setEngines(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch engines');
        setEngines([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEngines();
  }, [countryId]);

  return { engines, loading, error };
};

/**
 * Hook to fetch launch vehicles for a specific country
 */
export const useCountryLaunchVehicles = (countryId) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!countryId) {
      setLoading(false);
      return;
    }

    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const data = await countryService.getLaunchVehicles(countryId);
        setVehicles(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch launch vehicles');
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [countryId]);

  return { vehicles, loading, error };
};

/**
 * Hook to filter countries by capability
 */
export const useCountriesByCapability = (capability) => {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!capability) {
      setLoading(false);
      return;
    }

    const fetchCountries = async () => {
      try {
        setLoading(true);
        const data = await countryService.getByCapability(capability);
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
  }, [capability]);

  return { countries, loading, error };
};
