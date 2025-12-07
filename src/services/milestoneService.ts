import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  SpaceMilestone,
  MilestoneType,
  MilestoneCategory,
  CountryTimeline,
  TimelineComparison,
  GlobalMilestoneStats,
  MILESTONE_TYPE_INFO,
  ApiErrorResponse
} from '../types';
import { API_CONFIG, ERROR_MESSAGES } from '../constants';

/**
 * Space Milestone Service
 *
 * Provides historical space achievement data and timeline functionality
 * for tracking and comparing national space program milestones with API integration.
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

class SpaceMilestoneService {
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
      console.error(`Milestone API Error [${status}]:`, message);
    } else if (error.request) {
      console.error('Network Error:', ERROR_MESSAGES.NETWORK_ERROR);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }

  private sortByDate(milestones: SpaceMilestone[], descending = false): SpaceMilestone[] {
    return [...milestones].sort((a, b) => {
      const dateA = new Date(a.dateAchieved).getTime();
      const dateB = new Date(b.dateAchieved).getTime();
      return descending ? dateB - dateA : dateA - dateB;
    });
  }

  // ============================================================================
  // CRUD OPERATIONS
  // ============================================================================

  async getAll(): Promise<SpaceMilestone[]> {
    const response = await this.axiosInstance.get<SpaceMilestone[]>('/milestones');
    return this.sortByDate(response.data);
  }

  // Legacy method name
  getAllMilestones(): Promise<SpaceMilestone[]> {
    return this.getAll();
  }

  async getById(id: string | number): Promise<SpaceMilestone | undefined> {
    const response = await this.axiosInstance.get<SpaceMilestone>(`/milestones/${id}`);
    return response.data;
  }

  // Legacy method name
  getMilestoneById(id: string | number): Promise<SpaceMilestone | undefined> {
    return this.getById(id);
  }

  async create(milestone: Partial<SpaceMilestone>): Promise<SpaceMilestone> {
    const response = await this.axiosInstance.post<SpaceMilestone>('/milestones', milestone);
    return response.data;
  }

  async update(id: string | number, milestone: Partial<SpaceMilestone>): Promise<SpaceMilestone> {
    const response = await this.axiosInstance.put<SpaceMilestone>(`/milestones/${id}`, milestone);
    return response.data;
  }

  async delete(id: string | number): Promise<void> {
    await this.axiosInstance.delete(`/milestones/${id}`);
  }

  // ============================================================================
  // COUNTRY FILTERS
  // ============================================================================

  async getByCountry(countryId: string | number): Promise<SpaceMilestone[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMilestone[]>(`/milestones/by-country/${countryId}`);
      return this.sortByDate(response.data);
    } catch (error) {
      const all = await this.getAll();
      return all.filter(m => m.countryId === countryId);
    }
  }

  // Legacy method name
  getMilestonesByCountry(countryId: string | number): Promise<SpaceMilestone[]> {
    return this.getByCountry(countryId);
  }

  async getByCountryCode(isoCode: string): Promise<SpaceMilestone[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMilestone[]>(`/milestones/by-country-code/${isoCode}`);
      return this.sortByDate(response.data);
    } catch (error) {
      return this.getByCountry(isoCode);
    }
  }

  // ============================================================================
  // TYPE & CATEGORY FILTERS
  // ============================================================================

  async getByType(type: MilestoneType): Promise<SpaceMilestone[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMilestone[]>(`/milestones/by-type/${type}`);
      return response.data.sort((a, b) => a.globalRank - b.globalRank);
    } catch (error) {
      const all = await this.getAll();
      return all.filter(m => m.milestoneType === type).sort((a, b) => a.globalRank - b.globalRank);
    }
  }

  // Legacy method name
  getMilestonesByType(type: MilestoneType): Promise<SpaceMilestone[]> {
    return this.getByType(type);
  }

  async getByCategory(category: MilestoneCategory): Promise<SpaceMilestone[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMilestone[]>(`/milestones/by-category/${category}`);
      return this.sortByDate(response.data);
    } catch (error) {
      const all = await this.getAll();
      return all.filter(m => m.category === category);
    }
  }

  // Legacy method name
  getMilestonesByCategory(category: MilestoneCategory): Promise<SpaceMilestone[]> {
    return this.getByCategory(category);
  }

  async getBySignificance(significance: string): Promise<SpaceMilestone[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMilestone[]>(`/milestones/by-significance/${significance}`);
      return this.sortByDate(response.data);
    } catch (error) {
      const all = await this.getAll();
      return all.filter(m => m.significance === significance);
    }
  }

  // ============================================================================
  // FIRSTS & RANKINGS
  // ============================================================================

  async getFirsts(): Promise<SpaceMilestone[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMilestone[]>('/milestones/firsts');
      return this.sortByDate(response.data);
    } catch (error) {
      const all = await this.getAll();
      return all.filter(m => m.isFirst);
    }
  }

  // Legacy method name
  getFirstAchievements(): Promise<SpaceMilestone[]> {
    return this.getFirsts();
  }

  async getByRank(rank: number): Promise<SpaceMilestone[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMilestone[]>(`/milestones/by-rank/${rank}`);
      return this.sortByDate(response.data);
    } catch (error) {
      const all = await this.getAll();
      return all.filter(m => m.globalRank === rank);
    }
  }

  async getCountryFirsts(countryId: string | number): Promise<SpaceMilestone[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMilestone[]>(`/milestones/by-country/${countryId}/firsts`);
      return this.sortByDate(response.data);
    } catch (error) {
      const countryMilestones = await this.getByCountry(countryId);
      return countryMilestones.filter(m => m.isFirst);
    }
  }

  // ============================================================================
  // TEMPORAL QUERIES
  // ============================================================================

  async getByYear(year: number): Promise<SpaceMilestone[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMilestone[]>(`/milestones/by-year/${year}`);
      return this.sortByDate(response.data);
    } catch (error) {
      const all = await this.getAll();
      return all.filter(m => m.year === year);
    }
  }

  async getByYearRange(startYear: number, endYear: number): Promise<SpaceMilestone[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMilestone[]>('/milestones/by-year-range', {
        params: { startYear, endYear }
      });
      return this.sortByDate(response.data);
    } catch (error) {
      const all = await this.getAll();
      return all.filter(m => m.year >= startYear && m.year <= endYear);
    }
  }

  // Legacy method name
  getMilestonesByYearRange(startYear: number, endYear: number): Promise<SpaceMilestone[]> {
    return this.getByYearRange(startYear, endYear);
  }

  async getByDecade(decade: number): Promise<SpaceMilestone[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMilestone[]>(`/milestones/by-decade/${decade}`);
      return this.sortByDate(response.data);
    } catch (error) {
      return this.getByYearRange(decade, decade + 9);
    }
  }

  async getRecent(limit?: number): Promise<SpaceMilestone[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMilestone[]>('/milestones/recent', {
        params: limit ? { limit } : undefined
      });
      return response.data;
    } catch (error) {
      const all = await this.getAll();
      return this.sortByDate(all, true).slice(0, limit || 10);
    }
  }

  // ============================================================================
  // TIMELINES
  // ============================================================================

  async getCountryTimeline(countryId: string | number): Promise<CountryTimeline> {
    try {
      const response = await this.axiosInstance.get<CountryTimeline>(`/milestones/timeline/${countryId}`);
      return response.data;
    } catch (error) {
      // Fallback to local calculation
      const countryMilestones = await this.getByCountry(countryId);
      const firstAchievements = countryMilestones.filter(m => m.isFirst);

      return {
        countryId,
        countryName: COUNTRY_NAMES[countryId as string] || countryId.toString(),
        milestones: countryMilestones,
        firstAchievements,
        totalMilestones: countryMilestones.length,
        totalFirsts: firstAchievements.length,
        earliestMilestone: countryMilestones[0],
        latestMilestone: countryMilestones[countryMilestones.length - 1]
      };
    }
  }

  async compareTimelines(countryIds: (string | number)[]): Promise<TimelineComparison> {
    try {
      const response = await this.axiosInstance.post<TimelineComparison>('/milestones/compare-timelines', {
        countryIds
      });
      return response.data;
    } catch (error) {
      // Fallback to local calculation
      const countryTimelines = await Promise.all(countryIds.map(id => this.getCountryTimeline(id)));
      const allMilestones = await this.getAll();

      const milestoneTypes = new Set(allMilestones.map(m => m.milestoneType));
      const sharedMilestones: TimelineComparison['sharedMilestones'] = [];

      milestoneTypes.forEach(type => {
        const achievements = allMilestones
          .filter(m => m.milestoneType === type && countryIds.includes(m.countryId))
          .map(m => ({
            countryId: m.countryId,
            date: m.dateAchieved,
            rank: m.globalRank
          }))
          .sort((a, b) => a.rank - b.rank);

        if (achievements.length > 0) {
          sharedMilestones.push({
            milestoneType: type,
            achievements
          });
        }
      });

      return {
        countries: countryTimelines,
        sharedMilestones
      };
    }
  }

  // ============================================================================
  // SEARCH & STATISTICS
  // ============================================================================

  async search(query: string): Promise<SpaceMilestone[]> {
    try {
      const response = await this.axiosInstance.get<SpaceMilestone[]>('/milestones/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      const lowerQuery = query.toLowerCase();
      const all = await this.getAll();
      return all.filter(m =>
        m.title.toLowerCase().includes(lowerQuery) ||
        m.description.toLowerCase().includes(lowerQuery) ||
        (m.achievedBy && m.achievedBy.toLowerCase().includes(lowerQuery))
      );
    }
  }

  // Legacy method name
  searchMilestones(query: string): Promise<SpaceMilestone[]> {
    return this.search(query);
  }

  async getStatistics(): Promise<GlobalMilestoneStats> {
    try {
      const response = await this.axiosInstance.get<GlobalMilestoneStats>('/milestones/statistics');
      return response.data;
    } catch (error) {
      return this.getGlobalStats();
    }
  }

  async getGlobalStats(): Promise<GlobalMilestoneStats> {
    const milestones = await this.getAll();
    const allTypes = Object.keys(MILESTONE_TYPE_INFO) as MilestoneType[];
    const achievedTypes = new Set(milestones.map(m => m.milestoneType));
    const unachievedTypes = allTypes.filter(t => !achievedTypes.has(t));

    const categoryCount: Record<MilestoneCategory, number> = {
      orbital: 0, lunar: 0, planetary: 0, technology: 0, human: 0, other: 0
    };
    milestones.forEach(m => { categoryCount[m.category]++; });

    const countryMap = new Map<string | number, { count: number; firstsCount: number }>();
    milestones.forEach(m => {
      const countryKey = m.countryId ?? 'unknown';
      const current = countryMap.get(countryKey) || { count: 0, firstsCount: 0 };
      current.count++;
      if (m.isFirst) current.firstsCount++;
      countryMap.set(countryKey, current);
    });

    const decadeCount = new Map<string, number>();
    milestones.forEach(m => {
      const decade = `${Math.floor(m.year / 10) * 10}s`;
      decadeCount.set(decade, (decadeCount.get(decade) || 0) + 1);
    });

    const sortedByDate = this.sortByDate(milestones, true);

    return {
      totalMilestones: milestones.length,
      totalMilestoneTypes: allTypes.length,
      achievedMilestoneTypes: achievedTypes.size,
      unachievedMilestoneTypes: unachievedTypes,
      milestonesByCategory: Object.entries(categoryCount).map(([category, count]) => ({
        category: category as MilestoneCategory,
        count
      })),
      milestonesByCountry: Array.from(countryMap.entries()).map(([countryId, data]) => ({
        countryId,
        countryName: COUNTRY_NAMES[countryId as string] || String(countryId ?? 'Unknown'),
        count: data.count,
        firstsCount: data.firstsCount
      })).sort((a, b) => b.firstsCount - a.firstsCount),
      milestonesByDecade: Array.from(decadeCount.entries())
        .map(([decade, count]) => ({ decade, count }))
        .sort((a, b) => a.decade.localeCompare(b.decade)),
      mostRecentMilestone: sortedByDate[0],
      upcomingMilestones: unachievedTypes.slice(0, 5)
    };
  }

  // ============================================================================
  // COUNTS
  // ============================================================================

  async getCountsByCountry(): Promise<Array<{ countryId: string; count: number }>> {
    try {
      const response = await this.axiosInstance.get('/milestones/counts/by-country');
      return response.data;
    } catch (error) {
      const stats = await this.getStatistics();
      return stats.milestonesByCountry.map(c => ({ countryId: String(c.countryId), count: c.count }));
    }
  }

  async getCountsByType(): Promise<Array<{ type: string; count: number }>> {
    try {
      const response = await this.axiosInstance.get('/milestones/counts/by-type');
      return response.data;
    } catch (error) {
      const all = await this.getAll();
      const typeMap = new Map<string, number>();
      all.forEach(m => typeMap.set(m.milestoneType, (typeMap.get(m.milestoneType) || 0) + 1));
      return Array.from(typeMap.entries()).map(([type, count]) => ({ type, count }));
    }
  }

  async getCountsByCategory(): Promise<Array<{ category: string; count: number }>> {
    try {
      const response = await this.axiosInstance.get('/milestones/counts/by-category');
      return response.data;
    } catch (error) {
      const stats = await this.getStatistics();
      return stats.milestonesByCategory.map(c => ({ category: c.category, count: c.count }));
    }
  }

  async getCountsByDecade(): Promise<Array<{ decade: string; count: number }>> {
    try {
      const response = await this.axiosInstance.get('/milestones/counts/by-decade');
      return response.data;
    } catch (error) {
      const stats = await this.getStatistics();
      return stats.milestonesByDecade;
    }
  }

  // ============================================================================
  // METADATA
  // ============================================================================

  async getTypes(): Promise<string[]> {
    try {
      const response = await this.axiosInstance.get<string[]>('/milestones/types');
      return response.data;
    } catch (error) {
      return Object.keys(MILESTONE_TYPE_INFO);
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      const response = await this.axiosInstance.get<string[]>('/milestones/categories');
      return response.data;
    } catch (error) {
      return ['orbital', 'lunar', 'planetary', 'technology', 'human', 'other'];
    }
  }

  async getSignificanceLevels(): Promise<string[]> {
    try {
      const response = await this.axiosInstance.get<string[]>('/milestones/significance-levels');
      return response.data;
    } catch (error) {
      return ['major', 'significant', 'notable'];
    }
  }

  async getYears(): Promise<number[]> {
    try {
      const response = await this.axiosInstance.get<number[]>('/milestones/years');
      return response.data;
    } catch (error) {
      const all = await this.getAll();
      const years = new Set(all.map(m => m.year));
      return Array.from(years).sort((a, b) => a - b);
    }
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  getMilestoneTypeInfo(type: MilestoneType): (typeof MILESTONE_TYPE_INFO)[MilestoneType] {
    return MILESTONE_TYPE_INFO[type];
  }

  getAllMilestoneTypeInfos() {
    return MILESTONE_TYPE_INFO;
  }
}

// Export singleton instance
export const spaceMilestoneService = new SpaceMilestoneService();
export default spaceMilestoneService;
