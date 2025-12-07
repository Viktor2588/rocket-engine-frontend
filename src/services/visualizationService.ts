import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiErrorResponse } from '../types';
import { API_CONFIG, ERROR_MESSAGES } from '../constants';

/**
 * Types for Visualization API responses
 */
export interface LaunchSiteMapData {
  id: number;
  name: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  launchCount: number;
  status: string;
}

export interface RadarCountryData {
  countryCode: string;
  countryName: string;
  launchCapability: number;
  propulsionTechnology: number;
  humanSpaceflight: number;
  deepSpaceExploration: number;
  satelliteInfrastructure: number;
  groundInfrastructure: number;
  overallScore: number;
}

export interface BubbleEngineData {
  id: number;
  name: string;
  countryCode: string;
  thrustKn: number;
  specificImpulseS: number;
  chamberPressureMpa: number;
  massKg: number;
  cycle: string;
  propellant: string;
}

export interface TimelineMilestoneData {
  id: number;
  countryCode: string;
  year: number;
  title: string;
  description: string;
  category: string;
  significance: number;
}

export interface TreemapEngineData {
  countryCode: string;
  countryName: string;
  engineCount: number;
  totalThrust: number;
  engines: Array<{
    id: number;
    name: string;
    thrustKn: number;
    cycle: string;
  }>;
}

export interface SankeyMissionData {
  nodes: Array<{
    id: string;
    name: string;
    category: string;
  }>;
  links: Array<{
    source: string;
    target: string;
    value: number;
  }>;
}

export interface HeatmapLaunchData {
  year: number;
  countryCode: string;
  launchCount: number;
  successCount: number;
  failureCount: number;
}

export interface NetworkCollaborationData {
  nodes: Array<{
    id: string;
    countryCode: string;
    countryName: string;
    size: number;
  }>;
  links: Array<{
    source: string;
    target: string;
    weight: number;
    projectName?: string;
  }>;
}

export interface GaugeProgressData {
  countryCode: string;
  countryName: string;
  overallProgress: number;
  categories: Array<{
    name: string;
    current: number;
    max: number;
    percentage: number;
  }>;
}

/**
 * Visualization Service - Handles all visualization API endpoints
 */
class VisualizationService {
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
      console.error(`Visualization API Error [${status}]:`, message);
    } else if (error.request) {
      console.error('Network Error:', ERROR_MESSAGES.NETWORK_ERROR);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }

  // ============================================================================
  // MAP VISUALIZATIONS
  // ============================================================================

  /**
   * Get launch site geographic data for map visualization
   */
  async getLaunchSiteMapData(): Promise<LaunchSiteMapData[]> {
    try {
      const response = await this.axiosInstance.get<LaunchSiteMapData[]>('/visualizations/launch-site-map');
      return response.data;
    } catch (error) {
      console.error('Error fetching launch site map data:', error);
      throw new Error('Failed to fetch launch site map data');
    }
  }

  // ============================================================================
  // RADAR CHART DATA
  // ============================================================================

  /**
   * Get radar chart capability data for all countries
   */
  async getRadarCountryCapabilities(): Promise<RadarCountryData[]> {
    try {
      const response = await this.axiosInstance.get<RadarCountryData[]>('/visualizations/radar-country-capabilities');
      return response.data;
    } catch (error) {
      console.error('Error fetching radar country data:', error);
      throw new Error('Failed to fetch radar chart data');
    }
  }

  /**
   * Get radar chart capability data for a specific country
   */
  async getRadarCountryCapabilitiesByCode(countryCode: string): Promise<RadarCountryData> {
    try {
      const response = await this.axiosInstance.get<RadarCountryData>(
        `/visualizations/radar-country-capabilities/${countryCode}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching radar data for ${countryCode}:`, error);
      throw new Error('Failed to fetch radar chart data');
    }
  }

  /**
   * @deprecated Use getRadarCountryCapabilities instead
   */
  async getRadarCountryData(_countryIds?: string[]): Promise<RadarCountryData[]> {
    return this.getRadarCountryCapabilities();
  }

  // ============================================================================
  // BUBBLE CHART DATA
  // ============================================================================

  /**
   * Get bubble chart engine performance data
   */
  async getBubbleEnginePerformance(): Promise<BubbleEngineData[]> {
    try {
      const response = await this.axiosInstance.get<BubbleEngineData[]>('/visualizations/bubble-engine-performance');
      return response.data;
    } catch (error) {
      console.error('Error fetching bubble engine data:', error);
      throw new Error('Failed to fetch engine bubble chart data');
    }
  }

  /**
   * @deprecated Use getBubbleEnginePerformance instead
   */
  async getBubbleEngineData(_filters?: {
    countryCode?: string;
    cycle?: string;
    propellant?: string;
  }): Promise<BubbleEngineData[]> {
    return this.getBubbleEnginePerformance();
  }

  // ============================================================================
  // TIMELINE DATA
  // ============================================================================

  /**
   * Get timeline milestone data for all countries
   */
  async getTimelineMilestones(): Promise<TimelineMilestoneData[]> {
    try {
      const response = await this.axiosInstance.get<TimelineMilestoneData[]>('/visualizations/timeline-milestones');
      return response.data;
    } catch (error) {
      console.error('Error fetching timeline milestones:', error);
      throw new Error('Failed to fetch timeline data');
    }
  }

  /**
   * Get timeline milestone data for a specific country
   */
  async getTimelineMilestonesByCountry(countryCode: string): Promise<TimelineMilestoneData[]> {
    try {
      const response = await this.axiosInstance.get<TimelineMilestoneData[]>(
        `/visualizations/timeline-milestones/${countryCode}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching timeline milestones for ${countryCode}:`, error);
      throw new Error('Failed to fetch timeline data');
    }
  }

  // ============================================================================
  // TREEMAP DATA
  // ============================================================================

  /**
   * Get treemap data for engines by country
   */
  async getTreemapEnginesByCountry(): Promise<TreemapEngineData[]> {
    try {
      const response = await this.axiosInstance.get<TreemapEngineData[]>('/visualizations/treemap-engines-by-country');
      return response.data;
    } catch (error) {
      console.error('Error fetching treemap engine data:', error);
      throw new Error('Failed to fetch treemap data');
    }
  }

  // ============================================================================
  // SANKEY DIAGRAM DATA
  // ============================================================================

  /**
   * Get sankey diagram data for mission flow
   */
  async getSankeyMissionsFlow(): Promise<SankeyMissionData> {
    try {
      const response = await this.axiosInstance.get<SankeyMissionData>('/visualizations/sankey-missions-flow');
      return response.data;
    } catch (error) {
      console.error('Error fetching sankey mission data:', error);
      throw new Error('Failed to fetch sankey diagram data');
    }
  }

  // ============================================================================
  // HEATMAP DATA
  // ============================================================================

  /**
   * Get heatmap data for launches by year
   */
  async getHeatmapLaunchesByYear(): Promise<HeatmapLaunchData[]> {
    try {
      const response = await this.axiosInstance.get<HeatmapLaunchData[]>('/visualizations/heatmap-launches-by-year');
      return response.data;
    } catch (error) {
      console.error('Error fetching heatmap launch data:', error);
      throw new Error('Failed to fetch heatmap data');
    }
  }

  // ============================================================================
  // NETWORK GRAPH DATA
  // ============================================================================

  /**
   * Get network graph data for international collaboration
   */
  async getNetworkCollaboration(): Promise<NetworkCollaborationData> {
    try {
      const response = await this.axiosInstance.get<NetworkCollaborationData>('/visualizations/network-collaboration');
      return response.data;
    } catch (error) {
      console.error('Error fetching network collaboration data:', error);
      throw new Error('Failed to fetch network graph data');
    }
  }

  // ============================================================================
  // GAUGE DATA
  // ============================================================================

  /**
   * Get gauge progress data for a specific country
   */
  async getGaugeCountryProgress(countryCode: string): Promise<GaugeProgressData> {
    try {
      const response = await this.axiosInstance.get<GaugeProgressData>(
        `/visualizations/gauge-country-progress/${countryCode}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching gauge progress for ${countryCode}:`, error);
      throw new Error('Failed to fetch gauge data');
    }
  }
}

// Export singleton instance
export const visualizationService = new VisualizationService();
export default visualizationService;
