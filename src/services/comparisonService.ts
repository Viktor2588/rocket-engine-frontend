import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiErrorResponse } from '../types';
import { API_CONFIG, ERROR_MESSAGES } from '../constants';

/**
 * Types for Comparison API responses
 */
export interface CountryComparison {
  countries: Array<{
    isoCode: string;
    name: string;
    overallScore: number;
    capabilities: Record<string, number>;
  }>;
  differences: Array<{
    category: string;
    values: Record<string, number>;
    winner: string;
  }>;
}

export interface HeadToHeadComparison {
  country1: {
    isoCode: string;
    name: string;
    score: number;
    wins: number;
  };
  country2: {
    isoCode: string;
    name: string;
    score: number;
    wins: number;
  };
  categories: Array<{
    name: string;
    country1Score: number;
    country2Score: number;
    winner: string;
  }>;
  overallWinner: string;
}

export interface TechnologyComparison {
  countries: string[];
  engines: Record<string, number>;
  launchVehicles: Record<string, number>;
  satellites: Record<string, number>;
  propellantTypes: Record<string, string[]>;
  engineCycles: Record<string, string[]>;
}

export interface EngineComparison {
  engines: Array<{
    id: number;
    name: string;
    countryCode: string;
    thrustKn: number;
    specificImpulseS: number;
    chamberPressureMpa: number;
    massKg: number;
    cycle: string;
    propellant: string;
  }>;
  rankings: {
    byThrust: number[];
    byIsp: number[];
    byPressure: number[];
    byTwr: number[];
  };
}

export interface SimilarEngine {
  id: number;
  name: string;
  countryCode: string;
  similarity: number;
  thrustKn: number;
  specificImpulseS: number;
  cycle: string;
}

export interface SatelliteComparison {
  satellites: Array<{
    id: number;
    name: string;
    countryCode: string;
    type: string;
    massKg: number;
    orbitType: string;
    launchYear: number;
  }>;
  byType: Record<string, number[]>;
  byOrbit: Record<string, number[]>;
}

export interface ConstellationComparison {
  constellations: Array<{
    name: string;
    countryCode: string;
    satelliteCount: number;
    purpose: string;
    orbitType: string;
  }>;
}

export interface LaunchSiteComparison {
  sites: Array<{
    id: number;
    name: string;
    countryCode: string;
    latitude: number;
    longitude: number;
    launchCount: number;
    capabilities: string[];
    status: string;
  }>;
  byCapability: Record<string, number[]>;
  byCountry: Record<string, number[]>;
}

/**
 * Comparison Service - Handles all comparison API endpoints
 */
class ComparisonService {
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
      console.error(`Comparison API Error [${status}]:`, message);
    } else if (error.request) {
      console.error('Network Error:', ERROR_MESSAGES.NETWORK_ERROR);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }

  // ============================================================================
  // COUNTRY COMPARISONS
  // ============================================================================

  /**
   * Compare multiple countries
   */
  async compareCountries(countryCodes: string[]): Promise<CountryComparison> {
    try {
      const response = await this.axiosInstance.get<CountryComparison>('/compare/countries', {
        params: { codes: countryCodes.join(',') },
      });
      return response.data;
    } catch (error) {
      console.error('Error comparing countries:', error);
      throw new Error(ERROR_MESSAGES.COMPARE_COUNTRIES_FAILED);
    }
  }

  /**
   * Head-to-head comparison of two countries
   */
  async compareCountriesHeadToHead(code1: string, code2: string): Promise<HeadToHeadComparison> {
    try {
      const response = await this.axiosInstance.get<HeadToHeadComparison>('/compare/countries/head-to-head', {
        params: { country1: code1, country2: code2 },
      });
      return response.data;
    } catch (error) {
      console.error('Error comparing countries head-to-head:', error);
      throw new Error(ERROR_MESSAGES.COMPARE_COUNTRIES_FAILED);
    }
  }

  /**
   * Compare countries by technology
   */
  async compareCountriesTechnology(countryCodes: string[]): Promise<TechnologyComparison> {
    try {
      const response = await this.axiosInstance.get<TechnologyComparison>('/compare/countries/technology', {
        params: { codes: countryCodes.join(',') },
      });
      return response.data;
    } catch (error) {
      console.error('Error comparing country technologies:', error);
      throw new Error(ERROR_MESSAGES.COMPARE_COUNTRIES_FAILED);
    }
  }

  // ============================================================================
  // ENGINE COMPARISONS
  // ============================================================================

  /**
   * Compare multiple engines
   */
  async compareEngines(engineIds: number[]): Promise<EngineComparison> {
    try {
      const response = await this.axiosInstance.get<EngineComparison>('/compare/engines', {
        params: { ids: engineIds.join(',') },
      });
      return response.data;
    } catch (error) {
      console.error('Error comparing engines:', error);
      throw new Error(ERROR_MESSAGES.COMPARE_FAILED);
    }
  }

  /**
   * Find similar engines to a given engine
   */
  async findSimilarEngines(engineId: number, limit?: number): Promise<SimilarEngine[]> {
    try {
      const params: Record<string, any> = {};
      if (limit) params.limit = limit;

      const response = await this.axiosInstance.get<SimilarEngine[]>(`/compare/engines/${engineId}/similar`, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error(`Error finding similar engines to ${engineId}:`, error);
      throw new Error(ERROR_MESSAGES.COMPARE_FAILED);
    }
  }

  // ============================================================================
  // SATELLITE COMPARISONS
  // ============================================================================

  /**
   * Compare multiple satellites
   */
  async compareSatellites(satelliteIds: number[]): Promise<SatelliteComparison> {
    try {
      const response = await this.axiosInstance.get<SatelliteComparison>('/compare/satellites', {
        params: { ids: satelliteIds.join(',') },
      });
      return response.data;
    } catch (error) {
      console.error('Error comparing satellites:', error);
      throw new Error(ERROR_MESSAGES.COMPARE_FAILED);
    }
  }

  /**
   * Compare satellite constellations
   */
  async compareConstellations(): Promise<ConstellationComparison> {
    try {
      const response = await this.axiosInstance.get<ConstellationComparison>('/compare/satellites/constellations');
      return response.data;
    } catch (error) {
      console.error('Error comparing constellations:', error);
      throw new Error(ERROR_MESSAGES.COMPARE_FAILED);
    }
  }

  // ============================================================================
  // LAUNCH SITE COMPARISONS
  // ============================================================================

  /**
   * Compare launch sites
   */
  async compareLaunchSites(siteIds?: number[]): Promise<LaunchSiteComparison> {
    try {
      const params = siteIds ? { ids: siteIds.join(',') } : {};
      const response = await this.axiosInstance.get<LaunchSiteComparison>('/compare/launch-sites', { params });
      return response.data;
    } catch (error) {
      console.error('Error comparing launch sites:', error);
      throw new Error(ERROR_MESSAGES.COMPARE_FAILED);
    }
  }
}

// Export singleton instance
export const comparisonService = new ComparisonService();
export default comparisonService;
