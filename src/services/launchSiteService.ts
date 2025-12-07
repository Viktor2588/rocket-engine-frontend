import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiErrorResponse } from '../types';
import { API_CONFIG, ERROR_MESSAGES } from '../constants';

/**
 * Launch Site types
 */
export interface LaunchSite {
  id: number;
  name: string;
  countryId: string;
  latitude: number;
  longitude: number;
  status: string;
  operator?: string;
  established?: number;
  totalLaunches?: number;
  successfulLaunches?: number;
  successRate?: number;
  maxInclination?: number;
  minInclination?: number;
  humanRated?: boolean;
  interplanetaryCapable?: boolean;
  geoCapable?: boolean;
  polarCapable?: boolean;
  hasLanding?: boolean;
  region?: string;
  description?: string;
}

export interface LaunchSiteStatistics {
  total: number;
  active: number;
  byCountry: Array<{ countryId: string; count: number }>;
  byStatus: Array<{ status: string; count: number }>;
  byRegion: Array<{ region: string; count: number }>;
  totalLaunches: number;
  averageSuccessRate: number;
}

export interface GeographicDistribution {
  regions: Array<{
    region: string;
    count: number;
    sites: LaunchSite[];
  }>;
  latitudeDistribution: Array<{
    range: string;
    count: number;
  }>;
}

/**
 * Launch Site Service - Handles all launch site API endpoints
 */
class LaunchSiteService {
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
      console.error(`Launch Site API Error [${status}]:`, message);
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

  async getAll(): Promise<LaunchSite[]> {
    const response = await this.axiosInstance.get<LaunchSite[]>('/launch-sites');
    return response.data;
  }

  async getById(id: number): Promise<LaunchSite> {
    const response = await this.axiosInstance.get<LaunchSite>(`/launch-sites/${id}`);
    return response.data;
  }

  async create(site: Partial<LaunchSite>): Promise<LaunchSite> {
    const response = await this.axiosInstance.post<LaunchSite>('/launch-sites', site);
    return response.data;
  }

  async update(id: number, site: Partial<LaunchSite>): Promise<LaunchSite> {
    const response = await this.axiosInstance.put<LaunchSite>(`/launch-sites/${id}`, site);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await this.axiosInstance.delete(`/launch-sites/${id}`);
  }

  // ============================================================================
  // COUNTRY FILTERS
  // ============================================================================

  async getByCountry(countryId: string | number): Promise<LaunchSite[]> {
    const response = await this.axiosInstance.get<LaunchSite[]>(`/launch-sites/by-country/${countryId}`);
    return response.data;
  }

  async getByCountryCode(isoCode: string): Promise<LaunchSite[]> {
    const response = await this.axiosInstance.get<LaunchSite[]>(`/launch-sites/by-country-code/${isoCode}`);
    return response.data;
  }

  // ============================================================================
  // STATUS FILTERS
  // ============================================================================

  async getByStatus(status: string): Promise<LaunchSite[]> {
    const response = await this.axiosInstance.get<LaunchSite[]>(`/launch-sites/by-status/${status}`);
    return response.data;
  }

  async getActive(): Promise<LaunchSite[]> {
    const response = await this.axiosInstance.get<LaunchSite[]>('/launch-sites/active');
    return response.data;
  }

  async getHumanRated(): Promise<LaunchSite[]> {
    const response = await this.axiosInstance.get<LaunchSite[]>('/launch-sites/human-rated');
    return response.data;
  }

  async getInterplanetaryCapable(): Promise<LaunchSite[]> {
    const response = await this.axiosInstance.get<LaunchSite[]>('/launch-sites/interplanetary-capable');
    return response.data;
  }

  async getGeoCapable(): Promise<LaunchSite[]> {
    const response = await this.axiosInstance.get<LaunchSite[]>('/launch-sites/geo-capable');
    return response.data;
  }

  async getPolarCapable(): Promise<LaunchSite[]> {
    const response = await this.axiosInstance.get<LaunchSite[]>('/launch-sites/polar-capable');
    return response.data;
  }

  async getWithLanding(): Promise<LaunchSite[]> {
    const response = await this.axiosInstance.get<LaunchSite[]>('/launch-sites/with-landing');
    return response.data;
  }

  // ============================================================================
  // GEOGRAPHIC QUERIES
  // ============================================================================

  async getByLatitude(minLat: number, maxLat: number): Promise<LaunchSite[]> {
    const response = await this.axiosInstance.get<LaunchSite[]>('/launch-sites/by-latitude', {
      params: { minLat, maxLat }
    });
    return response.data;
  }

  async getByRegion(region: string): Promise<LaunchSite[]> {
    const response = await this.axiosInstance.get<LaunchSite[]>(`/launch-sites/by-region/${region}`);
    return response.data;
  }

  async getGeographicDistribution(): Promise<GeographicDistribution> {
    const response = await this.axiosInstance.get<GeographicDistribution>('/launch-sites/geographic-distribution');
    return response.data;
  }

  // ============================================================================
  // OPERATOR QUERIES
  // ============================================================================

  async getByOperator(operator: string): Promise<LaunchSite[]> {
    const response = await this.axiosInstance.get<LaunchSite[]>(`/launch-sites/by-operator/${operator}`);
    return response.data;
  }

  async getOperators(): Promise<string[]> {
    const response = await this.axiosInstance.get<string[]>('/launch-sites/operators');
    return response.data;
  }

  // ============================================================================
  // RANKINGS
  // ============================================================================

  async getMostLaunches(limit?: number): Promise<LaunchSite[]> {
    const response = await this.axiosInstance.get<LaunchSite[]>('/launch-sites/most-launches', {
      params: limit ? { limit } : undefined
    });
    return response.data;
  }

  async getHighestSuccessRate(limit?: number): Promise<LaunchSite[]> {
    const response = await this.axiosInstance.get<LaunchSite[]>('/launch-sites/highest-success-rate', {
      params: limit ? { limit } : undefined
    });
    return response.data;
  }

  // ============================================================================
  // TEMPORAL QUERIES
  // ============================================================================

  async getByEstablishedYear(year: number): Promise<LaunchSite[]> {
    const response = await this.axiosInstance.get<LaunchSite[]>(`/launch-sites/by-established-year/${year}`);
    return response.data;
  }

  async getByEstablishedYearRange(startYear: number, endYear: number): Promise<LaunchSite[]> {
    const response = await this.axiosInstance.get<LaunchSite[]>('/launch-sites/by-established-year-range', {
      params: { startYear, endYear }
    });
    return response.data;
  }

  // ============================================================================
  // SEARCH & STATISTICS
  // ============================================================================

  async search(query: string): Promise<LaunchSite[]> {
    const response = await this.axiosInstance.get<LaunchSite[]>('/launch-sites/search', {
      params: { q: query }
    });
    return response.data;
  }

  async getStatistics(): Promise<LaunchSiteStatistics> {
    const response = await this.axiosInstance.get<LaunchSiteStatistics>('/launch-sites/statistics');
    return response.data;
  }

  // ============================================================================
  // COUNTS
  // ============================================================================

  async getCountsByCountry(): Promise<Array<{ countryId: string; count: number }>> {
    const response = await this.axiosInstance.get('/launch-sites/counts/by-country');
    return response.data;
  }

  async getCountsByStatus(): Promise<Array<{ status: string; count: number }>> {
    const response = await this.axiosInstance.get('/launch-sites/counts/by-status');
    return response.data;
  }

  async getCountsByRegion(): Promise<Array<{ region: string; count: number }>> {
    const response = await this.axiosInstance.get('/launch-sites/counts/by-region');
    return response.data;
  }

  // ============================================================================
  // METADATA
  // ============================================================================

  async getStatuses(): Promise<string[]> {
    const response = await this.axiosInstance.get<string[]>('/launch-sites/statuses');
    return response.data;
  }

  async getRegions(): Promise<string[]> {
    const response = await this.axiosInstance.get<string[]>('/launch-sites/regions');
    return response.data;
  }
}

// Export singleton instance
export const launchSiteService = new LaunchSiteService();
export default launchSiteService;
