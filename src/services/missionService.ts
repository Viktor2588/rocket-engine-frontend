import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  SpaceMission,
  MissionStatus,
  MissionType,
  MissionDestination,
  MissionStatistics,
  MISSION_TYPE_INFO,
  DESTINATION_INFO,
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
 * Space Mission Service
 *
 * Provides space mission data and tracking functionality with API integration
 */

// Country name mapping
const COUNTRY_NAMES: Record<string, string> = {
  'USA': 'United States',
  'RUS': 'Russia',
  'CHN': 'China',
  'EUR': 'European Space Agency',
  'JPN': 'Japan',
  'IND': 'India',
  'ISR': 'Israel'
};

// ============================================================================
// SERVICE CLASS WITH API INTEGRATION
// ============================================================================

class SpaceMissionService {
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
      console.error(`Mission API Error [${status}]:`, message);
    } else if (error.request) {
      console.error('Network Error:', ERROR_MESSAGES.NETWORK_ERROR);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }

  private sortByLaunchDate(missions: SpaceMission[], ascending = false): SpaceMission[] {
    return [...missions].sort((a, b) => {
      const dateA = new Date(a.launchDate).getTime();
      const dateB = new Date(b.launchDate).getTime();
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }

  // ============================================================================
  // CRUD OPERATIONS
  // ============================================================================

  async getAll(): Promise<SpaceMission[]> {
    const response = await this.axiosInstance.get<SpaceMission[] | PaginatedResponse<SpaceMission>>('/missions?size=100');
    const data = response.data;

    // Handle paginated response
    if (data && typeof data === 'object' && 'content' in data) {
      let allMissions = [...data.content];

      // If there are more pages, fetch them all
      if (data.totalPages > 1) {
        const promises = [];
        for (let page = 1; page < data.totalPages; page++) {
          promises.push(this.axiosInstance.get<PaginatedResponse<SpaceMission>>(`/missions?page=${page}&size=100`));
        }
        const responses = await Promise.all(promises);
        responses.forEach(res => {
          if (res.data?.content) {
            allMissions = [...allMissions, ...res.data.content];
          }
        });
      }
      return this.sortByLaunchDate(allMissions);
    }

    // Handle flat array response
    return Array.isArray(data) ? this.sortByLaunchDate(data) : [];
  }

  // Legacy method name for compatibility
  getAllMissions(): Promise<SpaceMission[]> {
    return this.getAll();
  }

  async getById(id: string | number): Promise<SpaceMission | undefined> {
    const response = await this.axiosInstance.get<SpaceMission>(`/missions/${id}`);
    return response.data;
  }

  // Legacy method name
  getMissionById(id: string | number): Promise<SpaceMission | undefined> {
    return this.getById(id);
  }

  async create(mission: Partial<SpaceMission>): Promise<SpaceMission> {
    const response = await this.axiosInstance.post<SpaceMission>('/missions', mission);
    return response.data;
  }

  async update(id: string | number, mission: Partial<SpaceMission>): Promise<SpaceMission> {
    const response = await this.axiosInstance.put<SpaceMission>(`/missions/${id}`, mission);
    return response.data;
  }

  async delete(id: string | number): Promise<void> {
    await this.axiosInstance.delete(`/missions/${id}`);
  }

  // ============================================================================
  // COUNTRY FILTERS
  // ============================================================================

  async getByCountry(countryId: string | number): Promise<SpaceMission[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMission[]>(`/missions/by-country/${countryId}`);
      return this.sortByLaunchDate(response.data);
    } catch (error) {
      const all = await this.getAll();
      return all.filter(m => m.countryId === countryId);
    }
  }

  // Legacy method name
  getMissionsByCountry(countryId: string | number): Promise<SpaceMission[]> {
    return this.getByCountry(countryId);
  }

  async getByCountryCode(isoCode: string): Promise<SpaceMission[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMission[]>(`/missions/by-country-code/${isoCode}`);
      return this.sortByLaunchDate(response.data);
    } catch (error) {
      return this.getByCountry(isoCode);
    }
  }

  async getCountryStatistics(countryId: string | number): Promise<any> {
    try {
      const response = await this.axiosInstance.get(`/missions/by-country/${countryId}/statistics`);
      return response.data;
    } catch (error) {
      const missions = await this.getByCountry(countryId);
      return this.calculateStatisticsFromMissions(missions);
    }
  }

  // ============================================================================
  // STATUS FILTERS
  // ============================================================================

  async getByStatus(status: MissionStatus): Promise<SpaceMission[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMission[]>(`/missions/by-status/${status}`);
      return this.sortByLaunchDate(response.data);
    } catch (error) {
      const all = await this.getAll();
      return all.filter(m => m.status === status);
    }
  }

  getMissionsByStatus(status: MissionStatus): Promise<SpaceMission[]> {
    return this.getByStatus(status);
  }

  async getActive(): Promise<SpaceMission[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMission[]>('/missions/active');
      return this.sortByLaunchDate(response.data);
    } catch (error) {
      return this.getByStatus('Active');
    }
  }

  getActiveMissions(): Promise<SpaceMission[]> {
    return this.getActive();
  }

  async getPlanned(): Promise<SpaceMission[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMission[]>('/missions/planned');
      return this.sortByLaunchDate(response.data, true);
    } catch (error) {
      return this.getByStatus('Planned');
    }
  }

  getUpcomingMissions(): Promise<SpaceMission[]> {
    return this.getPlanned();
  }

  async getCompleted(): Promise<SpaceMission[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMission[]>('/missions/completed');
      return this.sortByLaunchDate(response.data);
    } catch (error) {
      return this.getByStatus('Completed');
    }
  }

  async getFailed(): Promise<SpaceMission[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMission[]>('/missions/failed');
      return this.sortByLaunchDate(response.data);
    } catch (error) {
      return this.getByStatus('Failed');
    }
  }

  // ============================================================================
  // TYPE & DESTINATION FILTERS
  // ============================================================================

  async getByType(type: MissionType): Promise<SpaceMission[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMission[]>(`/missions/by-type/${type}`);
      return this.sortByLaunchDate(response.data);
    } catch (error) {
      const all = await this.getAll();
      return all.filter(m => m.missionType === type);
    }
  }

  getMissionsByType(type: MissionType): Promise<SpaceMission[]> {
    return this.getByType(type);
  }

  async getByDestination(destination: MissionDestination): Promise<SpaceMission[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMission[]>(`/missions/by-destination/${destination}`);
      return this.sortByLaunchDate(response.data);
    } catch (error) {
      const all = await this.getAll();
      return all.filter(m => m.destination === destination);
    }
  }

  getMissionsByDestination(destination: MissionDestination): Promise<SpaceMission[]> {
    return this.getByDestination(destination);
  }

  // ============================================================================
  // CREWED MISSIONS
  // ============================================================================

  async getCrewedMissions(): Promise<SpaceMission[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMission[]>('/missions/crewed');
      return this.sortByLaunchDate(response.data);
    } catch (error) {
      const all = await this.getAll();
      return all.filter(m => m.crewed);
    }
  }

  async getRoboticMissions(): Promise<SpaceMission[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMission[]>('/missions/robotic');
      return this.sortByLaunchDate(response.data);
    } catch (error) {
      const all = await this.getAll();
      return all.filter(m => !m.crewed);
    }
  }

  // ============================================================================
  // HISTORIC FIRSTS
  // ============================================================================

  async getHistoricFirsts(): Promise<SpaceMission[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMission[]>('/missions/historic-firsts');
      return this.sortByLaunchDate(response.data, true);
    } catch (error) {
      const all = await this.getAll();
      return this.sortByLaunchDate(all.filter(m => m.isHistoricFirst), true);
    }
  }

  // ============================================================================
  // TEMPORAL QUERIES
  // ============================================================================

  async getByYear(year: number): Promise<SpaceMission[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMission[]>(`/missions/by-year/${year}`);
      return this.sortByLaunchDate(response.data);
    } catch (error) {
      const all = await this.getAll();
      return all.filter(m => new Date(m.launchDate).getFullYear() === year);
    }
  }

  async getByYearRange(startYear: number, endYear: number): Promise<SpaceMission[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMission[]>('/missions/by-year-range', {
        params: { startYear, endYear }
      });
      return this.sortByLaunchDate(response.data);
    } catch (error) {
      const all = await this.getAll();
      return all.filter(m => {
        const year = new Date(m.launchDate).getFullYear();
        return year >= startYear && year <= endYear;
      });
    }
  }

  async getByDecade(decade: number): Promise<SpaceMission[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMission[]>(`/missions/by-decade/${decade}`);
      return this.sortByLaunchDate(response.data);
    } catch (error) {
      return this.getByYearRange(decade, decade + 9);
    }
  }

  async getRecent(days?: number): Promise<SpaceMission[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMission[]>('/missions/recent', {
        params: days ? { days } : undefined
      });
      return this.sortByLaunchDate(response.data);
    } catch (error) {
      const all = await this.getAll();
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - (days || 30));
      return all.filter(m => new Date(m.launchDate) >= cutoff);
    }
  }

  // ============================================================================
  // SEARCH & STATISTICS
  // ============================================================================

  async search(query: string): Promise<SpaceMission[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMission[]>('/missions/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      const lowerQuery = query.toLowerCase();
      const all = await this.getAll();
      return all.filter(m =>
        m.name.toLowerCase().includes(lowerQuery) ||
        m.description.toLowerCase().includes(lowerQuery) ||
        (m.crewNames && m.crewNames.some(name => name.toLowerCase().includes(lowerQuery))) ||
        (m.launchVehicleName && m.launchVehicleName.toLowerCase().includes(lowerQuery))
      );
    }
  }

  searchMissions(query: string): Promise<SpaceMission[]> {
    return this.search(query);
  }

  async getStatistics(): Promise<MissionStatistics> {
    try {
      const response = await this.axiosInstance.get<MissionStatistics>('/missions/statistics');
      return response.data;
    } catch (error) {
      const missions = await this.getAll();
      return this.calculateStatisticsFromMissions(missions);
    }
  }

  private calculateStatisticsFromMissions(missions: SpaceMission[]): MissionStatistics {
    const statusCount: Record<MissionStatus, number> = {
      'Planned': 0, 'Active': 0, 'Completed': 0, 'Failed': 0, 'Partial': 0
    };
    missions.forEach(m => { statusCount[m.status]++; });

    const typeCount = new Map<MissionType, number>();
    missions.forEach(m => {
      typeCount.set(m.missionType, (typeCount.get(m.missionType) || 0) + 1);
    });

    const destCount = new Map<MissionDestination, number>();
    missions.forEach(m => {
      destCount.set(m.destination, (destCount.get(m.destination) || 0) + 1);
    });

    const countryCount = new Map<string, number>();
    missions.forEach(m => {
      const cid = String(m.countryId);
      countryCount.set(cid, (countryCount.get(cid) || 0) + 1);
    });

    const yearCount = new Map<number, number>();
    missions.forEach(m => {
      const year = new Date(m.launchDate).getFullYear();
      yearCount.set(year, (yearCount.get(year) || 0) + 1);
    });

    const completedMissions = missions.filter(m => m.status === 'Completed');
    const successfulMissions = completedMissions.filter(m => m.successLevel !== 'Failed');

    return {
      total: missions.length,
      byStatus: Object.entries(statusCount).map(([status, count]) => ({
        status: status as MissionStatus,
        count
      })).filter(s => s.count > 0),
      byType: Array.from(typeCount.entries()).map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count),
      byDestination: Array.from(destCount.entries()).map(([destination, count]) => ({ destination, count }))
        .sort((a, b) => b.count - a.count),
      byCountry: Array.from(countryCount.entries()).map(([countryId, count]) => ({
        countryId,
        countryName: COUNTRY_NAMES[countryId] || countryId,
        count
      })).sort((a, b) => b.count - a.count),
      byYear: Array.from(yearCount.entries()).map(([year, count]) => ({ year, count }))
        .sort((a, b) => a.year - b.year),
      crewedCount: missions.filter(m => m.crewed).length,
      roboticCount: missions.filter(m => !m.crewed).length,
      successRate: completedMissions.length > 0
        ? (successfulMissions.length / completedMissions.length) * 100
        : 0,
      activeMissions: statusCount['Active'],
      upcomingMissions: statusCount['Planned']
    };
  }

  // ============================================================================
  // COUNTS
  // ============================================================================

  async getCountsByCountry(): Promise<Array<{ countryId: string | number; count: number }>> {
    try {
      const response = await this.axiosInstance.get('/missions/counts/by-country');
      return response.data;
    } catch (error) {
      const stats = await this.getStatistics();
      return stats.byCountry.map(c => ({ countryId: c.countryId, count: c.count }));
    }
  }

  async getCountsByType(): Promise<Array<{ type: string; count: number }>> {
    try {
      const response = await this.axiosInstance.get('/missions/counts/by-type');
      return response.data;
    } catch (error) {
      const stats = await this.getStatistics();
      return stats.byType.map(t => ({ type: t.type, count: t.count }));
    }
  }

  async getCountsByDestination(): Promise<Array<{ destination: string; count: number }>> {
    try {
      const response = await this.axiosInstance.get('/missions/counts/by-destination');
      return response.data;
    } catch (error) {
      const stats = await this.getStatistics();
      return stats.byDestination.map(d => ({ destination: d.destination, count: d.count }));
    }
  }

  async getCountsByYear(): Promise<Array<{ year: number; count: number }>> {
    try {
      const response = await this.axiosInstance.get('/missions/counts/by-year');
      return response.data;
    } catch (error) {
      const stats = await this.getStatistics();
      return stats.byYear;
    }
  }

  async getCountsByStatus(): Promise<Array<{ status: string; count: number }>> {
    try {
      const response = await this.axiosInstance.get('/missions/counts/by-status');
      return response.data;
    } catch (error) {
      const stats = await this.getStatistics();
      return stats.byStatus.map(s => ({ status: s.status, count: s.count }));
    }
  }

  // ============================================================================
  // METADATA
  // ============================================================================

  async getTypes(): Promise<string[]> {
    try {
      const response = await this.axiosInstance.get<string[]>('/missions/types');
      return response.data;
    } catch (error) {
      return Object.keys(MISSION_TYPE_INFO);
    }
  }

  async getDestinations(): Promise<string[]> {
    try {
      const response = await this.axiosInstance.get<string[]>('/missions/destinations');
      return response.data;
    } catch (error) {
      return Object.keys(DESTINATION_INFO);
    }
  }

  async getStatuses(): Promise<string[]> {
    try {
      const response = await this.axiosInstance.get<string[]>('/missions/statuses');
      return response.data;
    } catch (error) {
      return ['Planned', 'Active', 'Completed', 'Failed', 'Partial'];
    }
  }

  async getYears(): Promise<number[]> {
    try {
      const response = await this.axiosInstance.get<number[]>('/missions/years');
      return response.data;
    } catch (error) {
      const all = await this.getAll();
      const years = new Set(all.map(m => new Date(m.launchDate).getFullYear()));
      return Array.from(years).sort((a, b) => a - b);
    }
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  getMissionTypeInfo(type: MissionType) {
    return MISSION_TYPE_INFO[type];
  }

  getDestinationInfo(destination: MissionDestination) {
    return DESTINATION_INFO[destination];
  }
}

// Export singleton instance
export const spaceMissionService = new SpaceMissionService();
export default spaceMissionService;
