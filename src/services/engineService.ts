import axios, { AxiosInstance, AxiosError } from 'axios';
import { Engine, EngineComparison, ApiErrorResponse } from '../types';
import { API_CONFIG, ERROR_MESSAGES } from '../constants';

/**
 * Engine Service - Handles all API communication related to engines
 */

class EngineService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
    });

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    );
  }

  /**
   * Handle API errors with proper logging and transformation
   */
  private handleError(error: AxiosError<ApiErrorResponse>): Promise<never> {
    if (error.response) {
      // Server responded with error status
      const status = error.response.status;
      const message = error.response.data?.message || ERROR_MESSAGES.INTERNAL_ERROR;

      console.error(`API Error [${status}]:`, message);
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', ERROR_MESSAGES.NETWORK_ERROR);
    } else {
      // Error in request setup
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }

  /**
   * Validate ID parameter
   */
  private validateId(id: string | number): void {
    if (!id) {
      throw new Error(ERROR_MESSAGES.INVALID_ENGINE_ID);
    }
  }

  /**
   * Fetch all engines
   */
  async getAll(): Promise<Engine[]> {
    try {
      const response = await this.axiosInstance.get<Engine[]>('/engines');
      return response.data;
    } catch (error) {
      console.error('Error fetching engines:', error);
      throw new Error(ERROR_MESSAGES.FETCH_ENGINES_FAILED);
    }
  }

  /**
   * Fetch a single engine by ID
   */
  async getById(id: string | number): Promise<Engine> {
    try {
      this.validateId(id);
      const response = await this.axiosInstance.get<Engine>(`/engines/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching engine ${id}:`, error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error(ERROR_MESSAGES.NOT_FOUND);
      }
      throw new Error(ERROR_MESSAGES.FETCH_ENGINE_FAILED);
    }
  }

  /**
   * Create a new engine
   */
  async create(engineData: Partial<Engine>): Promise<Engine> {
    try {
      if (!engineData.name) {
        throw new Error(ERROR_MESSAGES.INVALID_INPUT);
      }
      const response = await this.axiosInstance.post<Engine>('/engines', engineData);
      return response.data;
    } catch (error) {
      console.error('Error creating engine:', error);
      throw new Error(ERROR_MESSAGES.INTERNAL_ERROR);
    }
  }

  /**
   * Update an existing engine
   */
  async update(id: string | number, engineData: Partial<Engine>): Promise<Engine> {
    try {
      this.validateId(id);
      const response = await this.axiosInstance.put<Engine>(`/engines/${id}`, engineData);
      return response.data;
    } catch (error) {
      console.error(`Error updating engine ${id}:`, error);
      throw new Error(ERROR_MESSAGES.INTERNAL_ERROR);
    }
  }

  /**
   * Delete an engine
   */
  async delete(id: string | number): Promise<void> {
    try {
      this.validateId(id);
      await this.axiosInstance.delete(`/engines/${id}`);
    } catch (error) {
      console.error(`Error deleting engine ${id}:`, error);
      throw new Error(ERROR_MESSAGES.INTERNAL_ERROR);
    }
  }

  /**
   * Compare two engines
   */
  async compare(engine1Id: string | number, engine2Id: string | number): Promise<EngineComparison> {
    try {
      this.validateId(engine1Id);
      this.validateId(engine2Id);

      if (engine1Id === engine2Id) {
        throw new Error('Cannot compare engine with itself');
      }

      const response = await this.axiosInstance.get<EngineComparison>(
        '/compare',
        {
          params: {
            engine1: engine1Id,
            engine2: engine2Id,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error comparing engines:', error);
      throw new Error(ERROR_MESSAGES.COMPARE_FAILED);
    }
  }
}

// Export singleton instance
export const engineService = new EngineService();
export default engineService;
