import axios, { AxiosInstance, AxiosError } from 'axios';
import { LaunchVehicle, LaunchVehicleStatus, ApiErrorResponse } from '../types';
import { API_CONFIG, ERROR_MESSAGES } from '../constants';

/**
 * Launch Vehicle Service - Handles all API communication related to launch vehicles
 */
class LaunchVehicleService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    );
  }

  private handleError(error: AxiosError<ApiErrorResponse>): Promise<never> {
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || ERROR_MESSAGES.INTERNAL_ERROR;
      console.error(`API Error [${status}]:`, message);
    } else if (error.request) {
      console.error('Network Error:', ERROR_MESSAGES.NETWORK_ERROR);
    }
    return Promise.reject(error);
  }

  // ============================================================================
  // LAUNCH VEHICLE CRUD OPERATIONS
  // ============================================================================

  /**
   * Fetch all launch vehicles
   */
  async getAll(): Promise<LaunchVehicle[]> {
    const response = await this.axiosInstance.get<LaunchVehicle[]>('/launch-vehicles');
    return response.data;
  }

  /**
   * Fetch a single launch vehicle by ID
   */
  async getById(id: string | number): Promise<LaunchVehicle | null> {
    try {
      const response = await this.axiosInstance.get<LaunchVehicle>(`/launch-vehicles/${id}`);
      return response.data;
    } catch (error) {
      // Return null if not found
      return null;
    }
  }

  /**
   * Fetch launch vehicles by country
   */
  async getByCountry(countryId: string | number): Promise<LaunchVehicle[]> {
    try {
      const response = await this.axiosInstance.get<LaunchVehicle[]>(
        `/launch-vehicles/by-country/${countryId}`
      );
      return response.data;
    } catch (error) {
      // Fallback: filter from all vehicles
      const all = await this.getAll();
      return all.filter(v => v.countryId.toString() === countryId.toString());
    }
  }

  /**
   * Fetch launch vehicles by status
   */
  async getByStatus(status: LaunchVehicleStatus): Promise<LaunchVehicle[]> {
    try {
      const response = await this.axiosInstance.get<LaunchVehicle[]>(
        `/launch-vehicles/by-status/${status}`
      );
      return response.data;
    } catch (error) {
      // Fallback: filter from all vehicles
      const all = await this.getAll();
      return all.filter(v => v.status === status);
    }
  }

  /**
   * Fetch only reusable launch vehicles
   */
  async getReusable(): Promise<LaunchVehicle[]> {
    try {
      const response = await this.axiosInstance.get<LaunchVehicle[]>('/launch-vehicles/reusable');
      return response.data;
    } catch (error) {
      // Fallback: filter from all vehicles
      const all = await this.getAll();
      return all.filter(v => v.reusable);
    }
  }

  /**
   * Fetch only human-rated launch vehicles
   */
  async getHumanRated(): Promise<LaunchVehicle[]> {
    try {
      const response = await this.axiosInstance.get<LaunchVehicle[]>('/launch-vehicles/human-rated');
      return response.data;
    } catch (error) {
      // Fallback: filter from all vehicles
      const all = await this.getAll();
      return all.filter(v => v.humanRated);
    }
  }

  /**
   * Compare multiple launch vehicles
   */
  async compare(ids: (string | number)[]): Promise<LaunchVehicle[]> {
    try {
      const response = await this.axiosInstance.get<LaunchVehicle[]>('/launch-vehicles/compare', {
        params: { ids: ids.join(',') },
      });
      return response.data;
    } catch (error) {
      // Fallback: filter from all vehicles
      const all = await this.getAll();
      return all.filter(v => ids.map(String).includes(v.id.toString()));
    }
  }

  /**
   * Get launch vehicle statistics
   */
  async getStatistics(): Promise<{
    total: number;
    active: number;
    retired: number;
    development: number;
    reusable: number;
    humanRated: number;
    byCountry: Record<string, number>;
  }> {
    try {
      const response = await this.axiosInstance.get('/launch-vehicles/statistics');
      return response.data;
    } catch (error) {
      // Fallback: calculate from all vehicles
      const vehicles = await this.getAll();
      const byCountry: Record<string, number> = {};

      vehicles.forEach(v => {
        const countryKey = v.countryId?.toString() || 'unknown';
        byCountry[countryKey] = (byCountry[countryKey] || 0) + 1;
      });

      return {
        total: vehicles.length,
        active: vehicles.filter(v => v.status === 'Active').length,
        retired: vehicles.filter(v => v.status === 'Retired').length,
        development: vehicles.filter(v => v.status === 'Development').length,
        reusable: vehicles.filter(v => v.reusable).length,
        humanRated: vehicles.filter(v => v.humanRated).length,
        byCountry,
      };
    }
  }
}

// Export singleton instance
export const launchVehicleService = new LaunchVehicleService();
export default launchVehicleService;
