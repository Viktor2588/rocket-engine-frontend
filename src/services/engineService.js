import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const engineService = {
  /**
   * Fetch all engines
   */
  getAll: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/engines`);
      return response.data;
    } catch (error) {
      console.error('Error fetching engines:', error);
      throw error;
    }
  },

  /**
   * Fetch a single engine by ID
   */
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/engines/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching engine ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new engine
   */
  create: async (engineData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/engines`, engineData);
      return response.data;
    } catch (error) {
      console.error('Error creating engine:', error);
      throw error;
    }
  },

  /**
   * Update an existing engine
   */
  update: async (id, engineData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/engines/${id}`, engineData);
      return response.data;
    } catch (error) {
      console.error(`Error updating engine ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete an engine
   */
  delete: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/engines/${id}`);
    } catch (error) {
      console.error(`Error deleting engine ${id}:`, error);
      throw error;
    }
  },

  /**
   * Compare two engines
   */
  compare: async (engine1Id, engine2Id) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/compare?engine1=${engine1Id}&engine2=${engine2Id}`
      );
      return response.data;
    } catch (error) {
      console.error('Error comparing engines:', error);
      throw error;
    }
  },
};

export default engineService;
