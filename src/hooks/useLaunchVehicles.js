import { useState, useEffect, useCallback, useContext } from 'react';
import { launchVehicleService } from '../services/launchVehicleService';
import DataContext from '../context/DataContext';

/**
 * Hook to fetch all launch vehicles (with caching)
 */
export function useLaunchVehicles() {
  const dataContext = useContext(DataContext);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      // If DataContext is available and has cached data, use it
      if (dataContext?.cache?.vehicles?.data) {
        setVehicles(dataContext.cache.vehicles.data);
        setLoading(false);
        return;
      }

      // If DataContext is available, fetch through it (caches the data)
      if (dataContext?.fetchVehicles) {
        try {
          setLoading(true);
          setError(null);
          const data = await dataContext.fetchVehicles();
          setVehicles(Array.isArray(data) ? data : []);
        } catch (err) {
          setError(err.message || 'Failed to fetch launch vehicles');
        } finally {
          setLoading(false);
        }
        return;
      }

      // Fallback to direct service call
      try {
        setLoading(true);
        setError(null);
        const data = await launchVehicleService.getAll();
        setVehicles(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch launch vehicles');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [dataContext]);

  return { vehicles, loading, error };
}

/**
 * Hook to fetch a single launch vehicle by ID
 */
export function useLaunchVehicle(id) {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchVehicle = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await launchVehicleService.getById(id);
        setVehicle(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch launch vehicle');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  return { vehicle, loading, error };
}

/**
 * Hook to fetch launch vehicles by country
 */
export function useLaunchVehiclesByCountry(countryId) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!countryId) {
      setVehicles([]);
      setLoading(false);
      return;
    }

    const fetchVehicles = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await launchVehicleService.getByCountry(countryId);
        setVehicles(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch launch vehicles');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [countryId]);

  return { vehicles, loading, error };
}

/**
 * Hook to fetch launch vehicles by status
 */
export function useLaunchVehiclesByStatus(status) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!status) {
      setVehicles([]);
      setLoading(false);
      return;
    }

    const fetchVehicles = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await launchVehicleService.getByStatus(status);
        setVehicles(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch launch vehicles');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [status]);

  return { vehicles, loading, error };
}

/**
 * Hook to fetch reusable launch vehicles
 */
export function useReusableLaunchVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await launchVehicleService.getReusable();
        setVehicles(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch launch vehicles');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  return { vehicles, loading, error };
}

/**
 * Hook to fetch human-rated launch vehicles
 */
export function useHumanRatedLaunchVehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await launchVehicleService.getHumanRated();
        setVehicles(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch launch vehicles');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  return { vehicles, loading, error };
}

/**
 * Hook to compare launch vehicles
 */
export function useLaunchVehicleComparison(ids) {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const compare = useCallback(async (vehicleIds) => {
    if (!vehicleIds || vehicleIds.length < 2) {
      setVehicles([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await launchVehicleService.compare(vehicleIds);
      setVehicles(data);
    } catch (err) {
      setError(err.message || 'Failed to compare launch vehicles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (ids && ids.length >= 2) {
      compare(ids);
    }
  }, [ids, compare]);

  return { vehicles, loading, error, compare };
}

/**
 * Hook to get launch vehicle statistics
 */
export function useLaunchVehicleStatistics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const statistics = launchVehicleService.getStatistics();
    setStats(statistics);
  }, []);

  return stats;
}
