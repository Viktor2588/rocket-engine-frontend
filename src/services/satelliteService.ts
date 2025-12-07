import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiErrorResponse } from '../types';
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
 * Satellite types
 */
export interface Satellite {
  id: number;
  name: string;
  noradId?: string;
  cosparId?: string;
  countryId: string;
  type: string;
  orbitType: string;
  status: string;
  massKg?: number;
  launchYear?: number;
  launchDate?: string;
  constellation?: string;
  operator?: string;
  purpose?: string;
  altitude?: number;
  perigee?: number;
  apogee?: number;
  inclination?: number;
  period?: number;
}

export interface SatelliteStatistics {
  total: number;
  active: number;
  byType: Array<{ type: string; count: number }>;
  byOrbit: Array<{ orbit: string; count: number }>;
  byCountry: Array<{ countryId: string; count: number }>;
  byConstellation: Array<{ constellation: string; count: number }>;
  byYear: Array<{ year: number; count: number }>;
}

export interface ConstellationAnalysis {
  name: string;
  countryCode: string;
  totalSatellites: number;
  activeSatellites: number;
  orbitType: string;
  purpose: string;
  averageAltitude?: number;
}

/**
 * Satellite Service - Handles all satellite API endpoints
 */
class SatelliteService {
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
      console.error(`Satellite API Error [${status}]:`, message);
    } else if (error.request) {
      console.error('Network Error:', ERROR_MESSAGES.NETWORK_ERROR);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }

  // ============================================================================
  // CRUD OPERATIONS
  // ============================================================================

  async getAll(): Promise<Satellite[]> {
    const response = await this.axiosInstance.get<Satellite[] | PaginatedResponse<Satellite>>('/satellites?size=100');
    const data = response.data;

    // Handle paginated response
    if (data && typeof data === 'object' && 'content' in data) {
      let allSatellites = [...data.content];

      // If there are more pages, fetch them all
      if (data.totalPages > 1) {
        const promises = [];
        for (let page = 1; page < data.totalPages; page++) {
          promises.push(this.axiosInstance.get<PaginatedResponse<Satellite>>(`/satellites?page=${page}&size=100`));
        }
        const responses = await Promise.all(promises);
        responses.forEach(res => {
          if (res.data?.content) {
            allSatellites = [...allSatellites, ...res.data.content];
          }
        });
      }
      return allSatellites;
    }

    // Handle flat array response
    return Array.isArray(data) ? data : [];
  }

  async getById(id: number): Promise<Satellite> {
    const response = await this.axiosInstance.get<Satellite>(`/satellites/${id}`);
    return response.data;
  }

  async getByNoradId(noradId: string): Promise<Satellite> {
    const response = await this.axiosInstance.get<Satellite>(`/satellites/norad/${noradId}`);
    return response.data;
  }

  async getByCosparId(cosparId: string): Promise<Satellite> {
    const response = await this.axiosInstance.get<Satellite>(`/satellites/cospar/${cosparId}`);
    return response.data;
  }

  async create(satellite: Partial<Satellite>): Promise<Satellite> {
    const response = await this.axiosInstance.post<Satellite>('/satellites', satellite);
    return response.data;
  }

  async update(id: number, satellite: Partial<Satellite>): Promise<Satellite> {
    const response = await this.axiosInstance.put<Satellite>(`/satellites/${id}`, satellite);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await this.axiosInstance.delete(`/satellites/${id}`);
  }

  // ============================================================================
  // COUNTRY FILTERS
  // ============================================================================

  async getByCountry(countryId: string | number): Promise<Satellite[]> {
    const response = await this.axiosInstance.get<Satellite[]>(`/satellites/by-country/${countryId}`);
    return response.data;
  }

  async getByCountryCode(isoCode: string): Promise<Satellite[]> {
    const response = await this.axiosInstance.get<Satellite[]>(`/satellites/by-country-code/${isoCode}`);
    return response.data;
  }

  async getByCountryAndStatus(countryId: string | number, status: string): Promise<Satellite[]> {
    const response = await this.axiosInstance.get<Satellite[]>(`/satellites/by-country/${countryId}/status/${status}`);
    return response.data;
  }

  async getCountryStatistics(countryId: string | number): Promise<SatelliteStatistics> {
    const response = await this.axiosInstance.get<SatelliteStatistics>(`/satellites/by-country/${countryId}/statistics`);
    return response.data;
  }

  // ============================================================================
  // STATUS & TYPE FILTERS
  // ============================================================================

  async getByStatus(status: string): Promise<Satellite[]> {
    const response = await this.axiosInstance.get<Satellite[]>(`/satellites/by-status/${status}`);
    return response.data;
  }

  async getActive(): Promise<Satellite[]> {
    const response = await this.axiosInstance.get<Satellite[]>('/satellites/active');
    return response.data;
  }

  async getActiveCount(): Promise<number> {
    const response = await this.axiosInstance.get<number>('/satellites/active/count');
    return response.data;
  }

  async getByType(type: string): Promise<Satellite[]> {
    const response = await this.axiosInstance.get<Satellite[]>(`/satellites/by-type/${type}`);
    return response.data;
  }

  async getByOrbit(orbitType: string): Promise<Satellite[]> {
    const response = await this.axiosInstance.get<Satellite[]>(`/satellites/by-orbit/${orbitType}`);
    return response.data;
  }

  async getByAltitude(minAltitude: number, maxAltitude: number): Promise<Satellite[]> {
    const response = await this.axiosInstance.get<Satellite[]>('/satellites/by-altitude', {
      params: { minAltitude, maxAltitude }
    });
    return response.data;
  }

  async getGeostationary(): Promise<Satellite[]> {
    const response = await this.axiosInstance.get<Satellite[]>('/satellites/geostationary');
    return response.data;
  }

  // ============================================================================
  // CONSTELLATION METHODS
  // ============================================================================

  async getByConstellation(constellation: string): Promise<Satellite[]> {
    const response = await this.axiosInstance.get<Satellite[]>(`/satellites/by-constellation/${constellation}`);
    return response.data;
  }

  async getConstellations(): Promise<string[]> {
    const response = await this.axiosInstance.get<string[]>('/satellites/constellations');
    return response.data;
  }

  async getConstellationCount(constellation: string): Promise<number> {
    const response = await this.axiosInstance.get<number>(`/satellites/constellation/${constellation}/count`);
    return response.data;
  }

  async getConstellationAnalysis(constellation: string): Promise<ConstellationAnalysis> {
    const response = await this.axiosInstance.get<ConstellationAnalysis>(`/satellites/constellation/${constellation}/analysis`);
    return response.data;
  }

  // ============================================================================
  // OPERATOR & SPECIAL CATEGORIES
  // ============================================================================

  async getByOperator(operator: string): Promise<Satellite[]> {
    const response = await this.axiosInstance.get<Satellite[]>(`/satellites/by-operator/${operator}`);
    return response.data;
  }

  async getOperators(): Promise<string[]> {
    const response = await this.axiosInstance.get<string[]>('/satellites/operators');
    return response.data;
  }

  async getNavigationSatellites(): Promise<Satellite[]> {
    const response = await this.axiosInstance.get<Satellite[]>('/satellites/navigation');
    return response.data;
  }

  async getSpaceStations(): Promise<Satellite[]> {
    const response = await this.axiosInstance.get<Satellite[]>('/satellites/space-stations');
    return response.data;
  }

  // ============================================================================
  // TEMPORAL QUERIES
  // ============================================================================

  async getByYear(year: number): Promise<Satellite[]> {
    const response = await this.axiosInstance.get<Satellite[]>(`/satellites/by-year/${year}`);
    return response.data;
  }

  async getByYearRange(startYear: number, endYear: number): Promise<Satellite[]> {
    const response = await this.axiosInstance.get<Satellite[]>('/satellites/by-year-range', {
      params: { startYear, endYear }
    });
    return response.data;
  }

  async getYears(): Promise<number[]> {
    const response = await this.axiosInstance.get<number[]>('/satellites/years');
    return response.data;
  }

  // ============================================================================
  // SEARCH & STATISTICS
  // ============================================================================

  async search(query: string): Promise<Satellite[]> {
    const response = await this.axiosInstance.get<Satellite[]>('/satellites/search', {
      params: { q: query }
    });
    return response.data;
  }

  async getStatistics(): Promise<SatelliteStatistics> {
    const response = await this.axiosInstance.get<SatelliteStatistics>('/satellites/statistics');
    return response.data;
  }

  // ============================================================================
  // COUNTS
  // ============================================================================

  async getCountsByCountry(): Promise<Array<{ countryId: string; count: number }>> {
    const response = await this.axiosInstance.get('/satellites/counts/by-country');
    return response.data;
  }

  async getCountsByType(): Promise<Array<{ type: string; count: number }>> {
    const response = await this.axiosInstance.get('/satellites/counts/by-type');
    return response.data;
  }

  async getCountsByOrbit(): Promise<Array<{ orbit: string; count: number }>> {
    const response = await this.axiosInstance.get('/satellites/counts/by-orbit');
    return response.data;
  }

  async getCountsByConstellation(): Promise<Array<{ constellation: string; count: number }>> {
    const response = await this.axiosInstance.get('/satellites/counts/by-constellation');
    return response.data;
  }

  async getCountsByYear(): Promise<Array<{ year: number; count: number }>> {
    const response = await this.axiosInstance.get('/satellites/counts/by-year');
    return response.data;
  }

  // ============================================================================
  // METADATA
  // ============================================================================

  async getTypes(): Promise<string[]> {
    const response = await this.axiosInstance.get<string[]>('/satellites/types');
    return response.data;
  }

  async getTypesByCategory(category: string): Promise<string[]> {
    const response = await this.axiosInstance.get<string[]>(`/satellites/types/by-category/${category}`);
    return response.data;
  }

  async getTypeCategories(): Promise<string[]> {
    const response = await this.axiosInstance.get<string[]>('/satellites/types/categories');
    return response.data;
  }

  async getStatuses(): Promise<string[]> {
    const response = await this.axiosInstance.get<string[]>('/satellites/statuses');
    return response.data;
  }

  async getOrbits(): Promise<string[]> {
    const response = await this.axiosInstance.get<string[]>('/satellites/orbits');
    return response.data;
  }

  async getOrbitsByCategory(category: string): Promise<string[]> {
    const response = await this.axiosInstance.get<string[]>(`/satellites/orbits/by-category/${category}`);
    return response.data;
  }

  async getOrbitCategories(): Promise<string[]> {
    const response = await this.axiosInstance.get<string[]>('/satellites/orbits/categories');
    return response.data;
  }
}

// Export singleton instance
export const satelliteService = new SatelliteService();
export default satelliteService;
