import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  Country,
  CapabilityScores,
  Engine,
  LaunchVehicle,
  ApiErrorResponse
} from '../types';
import { API_CONFIG, ERROR_MESSAGES } from '../constants';

// Type for paginated API responses
interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

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

  /**
   * Extract data from potentially paginated response
   * Handles both paginated ({content: []}) and flat array responses
   */
  private extractData<T>(data: T[] | PaginatedResponse<T>): T[] {
    if (Array.isArray(data)) {
      return data;
    }
    if (data && typeof data === 'object' && 'content' in data) {
      return data.content;
    }
    return [];
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
   * Handles paginated API responses - fetches all pages if paginated
   */
  async getAll(): Promise<Country[]> {
    try {
      const response = await this.axiosInstance.get<Country[] | PaginatedResponse<Country>>('/countries?size=100');
      const data = response.data;

      // Handle paginated response
      if (data && typeof data === 'object' && 'content' in data) {
        let allCountries = [...data.content];

        // If there are more pages, fetch them all
        if (data.totalPages > 1) {
          const promises = [];
          for (let page = 1; page < data.totalPages; page++) {
            promises.push(this.axiosInstance.get<PaginatedResponse<Country>>(`/countries?page=${page}&size=100`));
          }
          const responses = await Promise.all(promises);
          responses.forEach(res => {
            if (res.data?.content) {
              allCountries = [...allCountries, ...res.data.content];
            }
          });
        }
        return allCountries;
      }

      // Handle flat array response
      return Array.isArray(data) ? data : [];
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
      // Fallback: fetch all countries and find by ISO code
      try {
        const allCountries = await this.getAll();
        const country = allCountries.find(c => c.isoCode?.toUpperCase() === isoCode.toUpperCase());
        if (country) {
          return country;
        }
      } catch (fallbackError) {
        console.error('Fallback fetch failed:', fallbackError);
      }
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
      // Fallback: fetch all engines and filter by countryId or origin
      try {
        const allEnginesResponse = await this.axiosInstance.get<Engine[]>('/engines');
        const allEngines = allEnginesResponse.data;

        // Get country info to match by name
        let country: Country | null = null;
        try {
          const allCountries = await this.getAll();
          country = allCountries.find(c =>
            c.id?.toString() === countryId.toString() ||
            c.isoCode?.toUpperCase() === countryId.toString().toUpperCase()
          ) || null;
        } catch (e) {
          // Continue without country info
        }

        const countryName = country?.name?.toLowerCase();
        const isoCode = country?.isoCode?.toUpperCase();

        // Filter engines by various matching criteria
        return allEngines.filter(engine => {
          const engineOrigin = engine.origin?.toLowerCase();
          const engineCountryId = engine.countryId?.toString().toUpperCase();

          // Match by origin name (e.g., "Russia", "United States")
          if (countryName && engineOrigin?.includes(countryName)) {
            return true;
          }
          // Match by ISO code in countryId field
          if (isoCode && engineCountryId === isoCode) {
            return true;
          }
          // Match by numeric ID
          if (engine.countryId?.toString() === countryId.toString()) {
            return true;
          }
          return false;
        });
      } catch (fallbackError) {
        console.error(`Fallback engine fetch also failed for country ${countryId}:`, fallbackError);
        return [];
      }
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
      // Fallback: fetch all launch vehicles and filter by countryId
      try {
        const allVehiclesResponse = await this.axiosInstance.get<LaunchVehicle[]>('/launch-vehicles');
        const allVehicles = allVehiclesResponse.data;

        // Get country info to match by numeric ID
        let country: Country | null = null;
        try {
          const allCountries = await this.getAll();
          country = allCountries.find(c =>
            c.id?.toString() === countryId.toString() ||
            c.isoCode?.toUpperCase() === countryId.toString().toUpperCase()
          ) || null;
        } catch (e) {
          // Continue without country info
        }

        const numericCountryId = country?.id?.toString();

        // Filter vehicles by countryId (numeric) - handle nested country object
        return allVehicles.filter(vehicle => {
          // Check nested country object first (backend returns this structure)
          const nestedCountryId = (vehicle as any).country?.id?.toString();
          // Also check flat countryId field
          const flatCountryId = vehicle.countryId?.toString();

          // Match by nested country ID
          if (numericCountryId && nestedCountryId === numericCountryId) {
            return true;
          }
          // Match by flat countryId
          if (numericCountryId && flatCountryId === numericCountryId) {
            return true;
          }
          // Match by the passed countryId directly
          if (nestedCountryId === countryId.toString() || flatCountryId === countryId.toString()) {
            return true;
          }
          return false;
        });
      } catch (fallbackError) {
        console.error(`Fallback launch vehicle fetch also failed for country ${countryId}:`, fallbackError);
        return [];
      }
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

  // ============================================================================
  // ADDITIONAL CAPABILITY FILTERS
  // ============================================================================

  /**
   * Get countries with deep space capability
   */
  async getDeepSpaceCapable(): Promise<Country[]> {
    try {
      const response = await this.axiosInstance.get<Country[]>('/countries/capability/deep-space');
      return response.data;
    } catch (error) {
      console.error('Error fetching deep space capable countries:', error);
      throw new Error(ERROR_MESSAGES.FETCH_COUNTRIES_FAILED);
    }
  }

  /**
   * Get countries with reusable rocket capability
   */
  async getReusableRocketCapable(): Promise<Country[]> {
    try {
      const response = await this.axiosInstance.get<Country[]>('/countries/capability/reusable-rocket');
      return response.data;
    } catch (error) {
      console.error('Error fetching reusable rocket capable countries:', error);
      throw new Error(ERROR_MESSAGES.FETCH_COUNTRIES_FAILED);
    }
  }

  /**
   * Get countries with space station capability
   */
  async getSpaceStationCapable(): Promise<Country[]> {
    try {
      const response = await this.axiosInstance.get<Country[]>('/countries/capability/space-station');
      return response.data;
    } catch (error) {
      console.error('Error fetching space station capable countries:', error);
      throw new Error(ERROR_MESSAGES.FETCH_COUNTRIES_FAILED);
    }
  }

  // ============================================================================
  // ADDITIONAL RELATED ENTITIES
  // ============================================================================

  /**
   * Get milestones for a country
   */
  async getMilestones(countryId: string | number): Promise<any[]> {
    try {
      const response = await this.axiosInstance.get(`/countries/${countryId}/milestones`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching milestones for country ${countryId}:`, error);
      throw new Error(ERROR_MESSAGES.INTERNAL_ERROR);
    }
  }

  /**
   * Get satellites for a country
   */
  async getSatellites(countryId: string | number): Promise<any[]> {
    try {
      const response = await this.axiosInstance.get(`/countries/${countryId}/satellites`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching satellites for country ${countryId}:`, error);
      throw new Error(ERROR_MESSAGES.INTERNAL_ERROR);
    }
  }

  /**
   * Get launch sites for a country
   */
  async getLaunchSites(countryId: string | number): Promise<any[]> {
    try {
      const response = await this.axiosInstance.get(`/countries/${countryId}/launch-sites`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching launch sites for country ${countryId}:`, error);
      throw new Error(ERROR_MESSAGES.INTERNAL_ERROR);
    }
  }

  /**
   * Get missions for a country
   */
  async getMissions(countryId: string | number): Promise<any[]> {
    try {
      const response = await this.axiosInstance.get(`/countries/${countryId}/missions`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching missions for country ${countryId}:`, error);
      throw new Error(ERROR_MESSAGES.INTERNAL_ERROR);
    }
  }

  // ============================================================================
  // SEARCH
  // ============================================================================

  /**
   * Search countries
   */
  async search(query: string): Promise<Country[]> {
    try {
      const response = await this.axiosInstance.get<Country[]>('/countries/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching countries:', error);
      throw new Error(ERROR_MESSAGES.FETCH_COUNTRIES_FAILED);
    }
  }
}

// Export singleton instance
export const countryService = new CountryService();
export default countryService;
