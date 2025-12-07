import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiErrorResponse } from '../types';
import { API_CONFIG, ERROR_MESSAGES } from '../constants';

/**
 * Types for Statistics API responses
 */
export interface GlobalOverview {
  totalCountries: number;
  totalEngines: number;
  totalLaunchVehicles: number;
  totalSatellites: number;
  totalMissions: number;
  totalLaunchSites: number;
  humanSpaceflightCapable: number;
  independentLaunchCapable: number;
  reusableRocketCapable: number;
  deepSpaceCapable: number;
}

export interface EntityCounts {
  countries: number;
  engines: number;
  launchVehicles: number;
  satellites: number;
  missions: number;
  launchSites: number;
  astronauts: number;
}

export interface CountryStatistics {
  isoCode: string;
  name: string;
  engineCount: number;
  vehicleCount: number;
  missionCount: number;
  launchSiteCount: number;
  overallScore: number;
  rank: number;
}

export interface TopCountry {
  rank: number;
  isoCode: string;
  name: string;
  score: number;
  category: string;
}

export interface TechnologyBreakdown {
  category: string;
  count: number;
  percentage: number;
  examples: string[];
}

export interface InfrastructureStats {
  totalLaunchSites: number;
  activeLaunchSites: number;
  launchSitesByCountry: Array<{
    countryCode: string;
    count: number;
  }>;
  launchSitesByType: Array<{
    type: string;
    count: number;
  }>;
}

export interface MissionStats {
  total: number;
  byStatus: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  byType: Array<{
    type: string;
    count: number;
  }>;
  byDestination: Array<{
    destination: string;
    count: number;
  }>;
}

export interface MissionSuccessRate {
  countryCode: string;
  countryName: string;
  totalMissions: number;
  successfulMissions: number;
  successRate: number;
}

export interface TimelineByDecade {
  decade: string;
  startYear: number;
  endYear: number;
  milestones: number;
  launches: number;
  newCountries: number;
}

export interface GrowthData {
  year: number;
  launches: number;
  launchesByCountry: Record<string, number>;
  cumulativeLaunches: number;
}

/**
 * Statistics Service - Handles all statistics API endpoints
 */
class StatisticsService {
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
      console.error(`Statistics API Error [${status}]:`, message);
    } else if (error.request) {
      console.error('Network Error:', ERROR_MESSAGES.NETWORK_ERROR);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }

  // ============================================================================
  // OVERVIEW & COUNTS
  // ============================================================================

  /**
   * Get global metrics overview
   */
  async getOverview(): Promise<GlobalOverview> {
    try {
      const response = await this.axiosInstance.get<GlobalOverview>('/statistics/overview');
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics overview:', error);
      throw new Error('Failed to fetch statistics overview');
    }
  }

  /**
   * Get entity counts by type
   */
  async getCounts(): Promise<EntityCounts> {
    try {
      const response = await this.axiosInstance.get<EntityCounts>('/statistics/counts');
      return response.data;
    } catch (error) {
      console.error('Error fetching entity counts:', error);
      throw new Error('Failed to fetch entity counts');
    }
  }

  // ============================================================================
  // COUNTRY STATISTICS
  // ============================================================================

  /**
   * Get country statistics
   */
  async getCountryStatistics(): Promise<CountryStatistics[]> {
    try {
      const response = await this.axiosInstance.get<CountryStatistics[]>('/statistics/countries');
      return response.data;
    } catch (error) {
      console.error('Error fetching country statistics:', error);
      throw new Error('Failed to fetch country statistics');
    }
  }

  /**
   * Get top countries by category
   */
  async getTopCountries(category?: string, limit?: number): Promise<TopCountry[]> {
    try {
      const params: Record<string, any> = {};
      if (category) params.category = category;
      if (limit) params.limit = limit;

      const response = await this.axiosInstance.get<TopCountry[]>('/statistics/countries/top', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching top countries:', error);
      throw new Error('Failed to fetch top countries');
    }
  }

  // ============================================================================
  // TECHNOLOGY STATISTICS
  // ============================================================================

  /**
   * Get engine technology breakdown
   */
  async getEngineTechnologyStats(): Promise<TechnologyBreakdown[]> {
    try {
      const response = await this.axiosInstance.get<TechnologyBreakdown[]>('/statistics/technology/engines');
      return response.data;
    } catch (error) {
      console.error('Error fetching engine technology stats:', error);
      throw new Error('Failed to fetch engine technology statistics');
    }
  }

  /**
   * Get satellite technology breakdown
   */
  async getSatelliteTechnologyStats(): Promise<TechnologyBreakdown[]> {
    try {
      const response = await this.axiosInstance.get<TechnologyBreakdown[]>('/statistics/technology/satellites');
      return response.data;
    } catch (error) {
      console.error('Error fetching satellite technology stats:', error);
      throw new Error('Failed to fetch satellite technology statistics');
    }
  }

  // ============================================================================
  // INFRASTRUCTURE STATISTICS
  // ============================================================================

  /**
   * Get infrastructure statistics
   */
  async getInfrastructureStats(): Promise<InfrastructureStats> {
    try {
      const response = await this.axiosInstance.get<InfrastructureStats>('/statistics/infrastructure');
      return response.data;
    } catch (error) {
      console.error('Error fetching infrastructure stats:', error);
      throw new Error('Failed to fetch infrastructure statistics');
    }
  }

  // ============================================================================
  // MISSION STATISTICS
  // ============================================================================

  /**
   * Get mission statistics
   */
  async getMissionStats(): Promise<MissionStats> {
    try {
      const response = await this.axiosInstance.get<MissionStats>('/statistics/missions');
      return response.data;
    } catch (error) {
      console.error('Error fetching mission stats:', error);
      throw new Error('Failed to fetch mission statistics');
    }
  }

  /**
   * Get mission success rates by country
   */
  async getMissionSuccessRates(): Promise<MissionSuccessRate[]> {
    try {
      const response = await this.axiosInstance.get<MissionSuccessRate[]>('/statistics/missions/success-rates');
      return response.data;
    } catch (error) {
      console.error('Error fetching mission success rates:', error);
      throw new Error('Failed to fetch mission success rates');
    }
  }

  // ============================================================================
  // TIMELINE STATISTICS
  // ============================================================================

  /**
   * Get timeline data by decade
   */
  async getTimelineByDecade(): Promise<TimelineByDecade[]> {
    try {
      const response = await this.axiosInstance.get<TimelineByDecade[]>('/statistics/timeline/by-decade');
      return response.data;
    } catch (error) {
      console.error('Error fetching timeline by decade:', error);
      throw new Error('Failed to fetch timeline data');
    }
  }

  /**
   * Get growth data over time
   */
  async getGrowthData(startYear?: number, endYear?: number): Promise<GrowthData[]> {
    try {
      const params: Record<string, any> = {};
      if (startYear) params.startYear = startYear;
      if (endYear) params.endYear = endYear;

      const response = await this.axiosInstance.get<GrowthData[]>('/statistics/timeline/growth', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching growth data:', error);
      throw new Error('Failed to fetch growth data');
    }
  }
}

// Export singleton instance
export const statisticsService = new StatisticsService();
export default statisticsService;
