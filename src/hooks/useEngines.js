import { useState, useEffect, useMemo } from 'react';
import engineService from '../services/engineService';

/**
 * Hook to fetch all engines
 */
export const useEngines = () => {
  const [engines, setEngines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEngines = async () => {
      try {
        setLoading(true);
        const data = await engineService.getAll();
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
  }, []);

  return { engines, loading, error };
};

/**
 * Hook to fetch a single engine by ID
 */
export const useEngine = (id) => {
  const [engine, setEngine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchEngine = async () => {
      try {
        setLoading(true);
        const data = await engineService.getById(id);
        setEngine(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch engine');
        setEngine(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEngine();
  }, [id]);

  return { engine, loading, error };
};

/**
 * Hook to fetch engines by country
 */
export const useEnginesByCountry = (countryId) => {
  const [engines, setEngines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!countryId) {
      setLoading(false);
      setEngines([]);
      return;
    }

    const fetchEngines = async () => {
      try {
        setLoading(true);
        const data = await engineService.getByCountry(countryId);
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
 * Hook to fetch engines by propellant type
 */
export const useEnginesByPropellant = (propellant) => {
  const [engines, setEngines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!propellant) {
      setLoading(false);
      setEngines([]);
      return;
    }

    const fetchEngines = async () => {
      try {
        setLoading(true);
        const data = await engineService.getByPropellant(propellant);
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
  }, [propellant]);

  return { engines, loading, error };
};

/**
 * Hook to fetch engines by power cycle
 */
export const useEnginesByPowerCycle = (cycle) => {
  const [engines, setEngines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!cycle) {
      setLoading(false);
      setEngines([]);
      return;
    }

    const fetchEngines = async () => {
      try {
        setLoading(true);
        const data = await engineService.getByPowerCycle(cycle);
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
  }, [cycle]);

  return { engines, loading, error };
};

/**
 * Hook to fetch reusable engines
 */
export const useReusableEngines = () => {
  const [engines, setEngines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEngines = async () => {
      try {
        setLoading(true);
        const data = await engineService.getReusable();
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
  }, []);

  return { engines, loading, error };
};

/**
 * Hook to fetch engines with advanced power cycles
 */
export const useAdvancedCycleEngines = () => {
  const [engines, setEngines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEngines = async () => {
      try {
        setLoading(true);
        const data = await engineService.getAdvancedCycle();
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
  }, []);

  return { engines, loading, error };
};

/**
 * Hook to fetch technology leader engines
 */
export const useTechnologyLeaders = (limit = 10) => {
  const [engines, setEngines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEngines = async () => {
      try {
        setLoading(true);
        const data = await engineService.getTechnologyLeaders(limit);
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
  }, [limit]);

  return { engines, loading, error };
};

/**
 * Hook to fetch engine evolution/family tree
 */
export const useEngineEvolution = (engineId) => {
  const [engines, setEngines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!engineId) {
      setLoading(false);
      setEngines([]);
      return;
    }

    const fetchEngines = async () => {
      try {
        setLoading(true);
        const data = await engineService.getEvolution(engineId);
        setEngines(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch engine evolution');
        setEngines([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEngines();
  }, [engineId]);

  return { engines, loading, error };
};

/**
 * Hook to fetch engine statistics
 */
export const useEngineStatistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const data = await engineService.getStatistics();
        setStatistics(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch engine statistics');
        setStatistics(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  return { statistics, loading, error };
};

/**
 * Hook to fetch country engine statistics
 */
export const useCountryEngineStatistics = (countryId) => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!countryId) {
      setLoading(false);
      setStatistics(null);
      return;
    }

    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const data = await engineService.getCountryStatistics(countryId);
        setStatistics(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch engine statistics');
        setStatistics(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [countryId]);

  return { statistics, loading, error };
};

/**
 * Hook to compare two engines
 */
export const useEngineComparison = (engine1Id, engine2Id) => {
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!engine1Id || !engine2Id) {
      setLoading(false);
      setComparison(null);
      return;
    }

    if (engine1Id === engine2Id) {
      setLoading(false);
      setError('Cannot compare engine with itself');
      return;
    }

    const fetchComparison = async () => {
      try {
        setLoading(true);
        const data = await engineService.compare(engine1Id, engine2Id);
        setComparison(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to compare engines');
        setComparison(null);
      } finally {
        setLoading(false);
      }
    };

    fetchComparison();
  }, [engine1Id, engine2Id]);

  return { comparison, loading, error };
};

/**
 * Hook for computed engine statistics from loaded data
 */
export const useComputedEngineStats = (engines) => {
  return useMemo(() => {
    if (!engines || engines.length === 0) {
      return null;
    }

    const activeEngines = engines.filter(e => e.status === 'Active');
    const reusableEngines = engines.filter(e => e.reusable);
    const advancedCycleEngines = engines.filter(e => e.advancedCycle);

    const enginesWithIsp = engines.filter(e => e.ispVacuum || e.isp);
    const enginesWithThrust = engines.filter(e => e.thrustKn);

    return {
      total: engines.length,
      active: activeEngines.length,
      reusable: reusableEngines.length,
      advancedCycle: advancedCycleEngines.length,
      averageIsp: enginesWithIsp.length > 0
        ? Math.round(enginesWithIsp.reduce((sum, e) => sum + (e.ispVacuum || e.isp || 0), 0) / enginesWithIsp.length)
        : 0,
      averageThrust: enginesWithThrust.length > 0
        ? Math.round(enginesWithThrust.reduce((sum, e) => sum + (e.thrustKn || 0), 0) / enginesWithThrust.length)
        : 0,
      highestIspEngine: enginesWithIsp.length > 0
        ? enginesWithIsp.reduce((max, e) => (e.ispVacuum || e.isp || 0) > (max.ispVacuum || max.isp || 0) ? e : max)
        : null,
      highestThrustEngine: enginesWithThrust.length > 0
        ? enginesWithThrust.reduce((max, e) => (e.thrustKn || 0) > (max.thrustKn || 0) ? e : max)
        : null,
      propellantDistribution: engines.reduce((acc, e) => {
        const prop = e.propellant || 'Unknown';
        acc[prop] = (acc[prop] || 0) + 1;
        return acc;
      }, {}),
      cycleDistribution: engines.reduce((acc, e) => {
        const cycle = e.powerCycle || 'Unknown';
        acc[cycle] = (acc[cycle] || 0) + 1;
        return acc;
      }, {}),
    };
  }, [engines]);
};
