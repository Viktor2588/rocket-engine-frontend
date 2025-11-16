import { useState, useEffect } from 'react';
import engineService from '../services/engineService';

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
