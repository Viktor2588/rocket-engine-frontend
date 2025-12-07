import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  Country,
  CapabilityScores,
  Engine,
  LaunchVehicle,
  ApiErrorResponse
} from '../types';
import { API_CONFIG, ERROR_MESSAGES } from '../constants';

/**
 * Country Service - Handles all API communication related to countries and space programs
 */
class CountryService {
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
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }

  private validateCode(code: string): void {
    if (!code || code.length < 2) {
      throw new Error(ERROR_MESSAGES.INVALID_COUNTRY_CODE);
    }
  }

  // ============================================================================
  // COUNTRY CRUD OPERATIONS
  // ============================================================================

  /**
   * Fetch all countries with space programs
   */
  async getAll(): Promise<Country[]> {
    try {
      const response = await this.axiosInstance.get<Country[]>('/countries');
      return response.data;
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw new Error(ERROR_MESSAGES.FETCH_COUNTRIES_FAILED);
    }
  }

  /**
   * Fetch a single country by ID
   */
  async getById(id: string | number): Promise<Country> {
    try {
      const response = await this.axiosInstance.get<Country>(`/countries/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching country ${id}:`, error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error(ERROR_MESSAGES.COUNTRY_NOT_FOUND);
      }
      throw new Error(ERROR_MESSAGES.FETCH_COUNTRY_FAILED);
    }
  }

  /**
   * Fetch a single country by ISO code (USA, CHN, RUS, etc.)
   */
  async getByCode(isoCode: string): Promise<Country> {
    try {
      this.validateCode(isoCode);
      const response = await this.axiosInstance.get<Country>(`/countries/by-code/${isoCode.toUpperCase()}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching country by code ${isoCode}:`, error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error(ERROR_MESSAGES.COUNTRY_NOT_FOUND);
      }
      throw new Error(ERROR_MESSAGES.FETCH_COUNTRY_FAILED);
    }
  }

  /**
   * Create a new country
   */
  async create(countryData: Partial<Country>): Promise<Country> {
    try {
      if (!countryData.name || !countryData.isoCode) {
        throw new Error(ERROR_MESSAGES.INVALID_INPUT);
      }
      const response = await this.axiosInstance.post<Country>('/countries', countryData);
      return response.data;
    } catch (error) {
      console.error('Error creating country:', error);
      throw new Error(ERROR_MESSAGES.INTERNAL_ERROR);
    }
  }

  /**
   * Update an existing country
   */
  async update(id: string | number, countryData: Partial<Country>): Promise<Country> {
    try {
      const response = await this.axiosInstance.put<Country>(`/countries/${id}`, countryData);
      return response.data;
    } catch (error) {
      console.error(`Error updating country ${id}:`, error);
      throw new Error(ERROR_MESSAGES.INTERNAL_ERROR);
    }
  }

  /**
   * Delete a country
   */
  async delete(id: string | number): Promise<void> {
    try {
      await this.axiosInstance.delete(`/countries/${id}`);
    } catch (error) {
      console.error(`Error deleting country ${id}:`, error);
      throw new Error(ERROR_MESSAGES.INTERNAL_ERROR);
    }
  }

  // ============================================================================
  // RANKINGS & SCORES
  // ============================================================================

  /**
   * Get global country rankings by overall capability score
   * Note: Backend returns Country[] sorted by score, not CountryRanking[]
   */
  async getRankings(): Promise<Country[]> {
    try {
      const response = await this.axiosInstance.get<Country[]>('/countries/rankings');
      return response.data;
    } catch (error) {
      console.error('Error fetching rankings:', error);
      throw new Error(ERROR_MESSAGES.FETCH_RANKINGS_FAILED);
    }
  }

  /**
   * Get capability scores breakdown for a country
   */
  async getCapabilityScores(countryId: string | number): Promise<CapabilityScores> {
    try {
      const response = await this.axiosInstance.get<CapabilityScores>(`/scores/country/${countryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching capability scores for country ${countryId}:`, error);
      throw new Error(ERROR_MESSAGES.FETCH_COUNTRY_FAILED);
    }
  }

  /**
   * Trigger score recalculation for a country
   */
  async recalculateScores(countryId: string | number): Promise<CapabilityScores> {
    try {
      const response = await this.axiosInstance.post<CapabilityScores>(`/scores/recalculate/${countryId}`);
      return response.data;
    } catch (error) {
      console.error(`Error recalculating scores for country ${countryId}:`, error);
      throw new Error(ERROR_MESSAGES.INTERNAL_ERROR);
    }
  }

  // ============================================================================
  // COMPARISON
  // ============================================================================

  /**
   * Compare multiple countries
   */
  async compare(countryIds: (string | number)[]): Promise<any> {
    try {
      if (countryIds.length < 2) {
        throw new Error('At least two countries are required for comparison');
      }
      const response = await this.axiosInstance.get('/countries/compare', {
        params: { ids: countryIds.join(',') },
      });
      return response.data;
    } catch (error) {
      console.error('Error comparing countries:', error);
      throw new Error(ERROR_MESSAGES.COMPARE_COUNTRIES_FAILED);
    }
  }

  /**
   * Compare two countries directly
   */
  async compareTwoCountries(countryId1: string | number, countryId2: string | number): Promise<any> {
    try {
      const response = await this.axiosInstance.get(
        `/countries/compare/${countryId1}/vs/${countryId2}`
      );
      return response.data;
    } catch (error) {
      console.error('Error comparing two countries:', error);
      throw new Error(ERROR_MESSAGES.COMPARE_COUNTRIES_FAILED);
    }
  }

  // ============================================================================
  // RELATED ENTITIES
  // ============================================================================

  /**
   * Get all engines for a country
   */
  async getEngines(countryId: string | number): Promise<Engine[]> {
    try {
      const response = await this.axiosInstance.get<Engine[]>(`/countries/${countryId}/engines`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching engines for country ${countryId}:`, error);
      throw new Error(ERROR_MESSAGES.FETCH_ENGINES_FAILED);
    }
  }

  /**
   * Get all launch vehicles for a country
   */
  async getLaunchVehicles(countryId: string | number): Promise<LaunchVehicle[]> {
    try {
      const response = await this.axiosInstance.get<LaunchVehicle[]>(`/countries/${countryId}/launch-vehicles`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching launch vehicles for country ${countryId}:`, error);
      throw new Error(ERROR_MESSAGES.INTERNAL_ERROR);
    }
  }

  // ============================================================================
  // FILTERING
  // ============================================================================

  /**
   * Get countries by region
   */
  async getByRegion(region: string): Promise<Country[]> {
    try {
      const response = await this.axiosInstance.get<Country[]>('/countries', {
        params: { region },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching countries by region ${region}:`, error);
      throw new Error(ERROR_MESSAGES.FETCH_COUNTRIES_FAILED);
    }
  }

  /**
   * Get countries with specific capability
   */
  async getByCapability(capability: string): Promise<Country[]> {
    try {
      const response = await this.axiosInstance.get<Country[]>('/countries', {
        params: { capability },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching countries by capability ${capability}:`, error);
      throw new Error(ERROR_MESSAGES.FETCH_COUNTRIES_FAILED);
    }
  }

  /**
   * Get countries with human spaceflight capability
   */
  async getHumanSpaceflightCapable(): Promise<Country[]> {
    try {
      const response = await this.axiosInstance.get<Country[]>('/countries/capability/human-spaceflight');
      return response.data;
    } catch (error) {
      console.error('Error fetching human spaceflight capable countries:', error);
      throw new Error(ERROR_MESSAGES.FETCH_COUNTRIES_FAILED);
    }
  }

  /**
   * Get countries with independent launch capability
   */
  async getIndependentLaunchCapable(): Promise<Country[]> {
    try {
      const response = await this.axiosInstance.get<Country[]>('/countries/capability/independent-launch');
      return response.data;
    } catch (error) {
      console.error('Error fetching independent launch capable countries:', error);
      throw new Error(ERROR_MESSAGES.FETCH_COUNTRIES_FAILED);
    }
  }

  /**
   * Get global statistics
   */
  async getStatistics(): Promise<any> {
    try {
      const response = await this.axiosInstance.get('/countries/statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw new Error(ERROR_MESSAGES.INTERNAL_ERROR);
    }
  }
}

// Export singleton instance
export const countryService = new CountryService();
export default countryService;
