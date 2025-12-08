import axios, { AxiosInstance, AxiosError } from 'axios';
import { Engine, EngineComparison, EngineStatistics, ApiErrorResponse } from '../types';
import { API_CONFIG, ERROR_MESSAGES } from '../constants';

// Type for paginated API responses
interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Map country codes to IDs for fallback
const COUNTRY_MAP: Record<string, string> = {
  'United States': 'USA',
  'Russia': 'RUS',
  'China': 'CHN',
  'France': 'FRA',
  'France / ESA': 'FRA',
  'Japan': 'JPN',
  'India': 'IND',
  'Germany': 'DEU',
  'United Kingdom': 'GBR',
};

/**
 * Engine Service - Handles all API communication related to engines
 */
class EngineService {
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

  private validateId(id: string | number): void {
    if (!id) {
      throw new Error(ERROR_MESSAGES.INVALID_ENGINE_ID);
    }
  }

  /**
   * Enhance engine data with computed fields
   */
  private enhanceEngine(engine: Engine): Engine {
    const enhanced = { ...engine };

    // Map origin to countryId if not set
    if (!enhanced.countryId && enhanced.origin) {
      enhanced.countryId = COUNTRY_MAP[enhanced.origin] || enhanced.origin;
    }

    // Calculate sophistication score if not set
    if (!enhanced.sophisticationScore) {
      let score = 50;
      if (enhanced.advancedCycle || enhanced.powerCycle?.includes('Staged')) score += 15;
      if (enhanced.powerCycle === 'Full-Flow Staged Combustion') score += 10;
      if (enhanced.reusable) score += 15;
      if (enhanced.throttleCapable) score += 5;
      if (enhanced.restartCapable) score += 5;
      if ((enhanced.reliabilityRate || 0) >= 99) score += 5;
      enhanced.sophisticationScore = Math.min(100, score);
    }

    return enhanced;
  }

  /**
   * Fetch all engines
   * Uses unpaged=true for simpler response without pagination
   */
  async getAll(): Promise<Engine[]> {
    const response = await this.axiosInstance.get<Engine[] | PaginatedResponse<Engine>>('/engines?unpaged=true');
    const data = response.data;

    // Handle paginated response (fallback)
    if (data && typeof data === 'object' && 'content' in data) {
      return data.content.map(e => this.enhanceEngine(e));
    }

    // Handle flat array response
    return Array.isArray(data) ? data.map(e => this.enhanceEngine(e)) : [];
  }

  /**
   * Fetch a single engine by ID
   */
  async getById(id: string | number): Promise<Engine> {
    this.validateId(id);
    const response = await this.axiosInstance.get<Engine>(`/engines/${id}`);
    return this.enhanceEngine(response.data);
  }

  /**
   * Fetch engines by country
   */
  async getByCountry(countryId: string): Promise<Engine[]> {
    const engines = await this.getAll();
    return engines.filter(e => e.countryId === countryId || e.origin?.includes(countryId));
  }

  /**
   * Fetch engines by propellant type
   */
  async getByPropellant(propellant: string): Promise<Engine[]> {
    const engines = await this.getAll();
    return engines.filter(e => e.propellant?.toLowerCase().includes(propellant.toLowerCase()));
  }

  /**
   * Fetch engines by power cycle
   */
  async getByPowerCycle(cycle: string): Promise<Engine[]> {
    const engines = await this.getAll();
    return engines.filter(e => e.powerCycle?.toLowerCase().includes(cycle.toLowerCase()));
  }

  /**
   * Fetch reusable engines
   */
  async getReusable(): Promise<Engine[]> {
    const engines = await this.getAll();
    return engines.filter(e => e.reusable);
  }

  /**
   * Fetch engines with advanced cycles (staged combustion or better)
   */
  async getAdvancedCycle(): Promise<Engine[]> {
    const engines = await this.getAll();
    return engines.filter(e => e.advancedCycle ||
      e.powerCycle?.includes('Staged') ||
      e.powerCycle?.includes('Full-Flow'));
  }

  /**
   * Get technology leaders (highest sophistication scores)
   */
  async getTechnologyLeaders(limit: number = 10): Promise<Engine[]> {
    const engines = await this.getAll();
    return engines
      .filter(e => e.sophisticationScore)
      .sort((a, b) => (b.sophisticationScore || 0) - (a.sophisticationScore || 0))
      .slice(0, limit);
  }

  /**
   * Get engine family/evolution tree
   */
  async getEvolution(engineId: string | number): Promise<Engine[]> {
    const engines = await this.getAll();
    const baseEngine = engines.find(e => e.id === Number(engineId) || e.id === engineId);
    if (!baseEngine) return [];

    const family: Engine[] = [];
    const familyName = baseEngine.engineFamily;

    if (familyName) {
      // Find all engines in the same family
      const familyEngines = engines.filter(e => e.engineFamily === familyName);
      family.push(...familyEngines);
    } else {
      family.push(baseEngine);
    }

    // Sort by first flight year
    return family.sort((a, b) => (a.firstFlightYear || 0) - (b.firstFlightYear || 0));
  }

  /**
   * Get engine statistics
   */
  async getStatistics(): Promise<EngineStatistics> {
    const engines = await this.getAll();

    // Count by country
    const countryMap = new Map<string, { name: string; count: number }>();
    engines.forEach(e => {
      const id = e.countryId?.toString() || 'Unknown';
      const existing = countryMap.get(id) || { name: e.origin || id, count: 0 };
      countryMap.set(id, { name: existing.name, count: existing.count + 1 });
    });

    // Count by propellant
    const propellantMap = new Map<string, number>();
    engines.forEach(e => {
      const prop = e.propellant || 'Unknown';
      propellantMap.set(prop, (propellantMap.get(prop) || 0) + 1);
    });

    // Count by power cycle
    const cycleMap = new Map<string, number>();
    engines.forEach(e => {
      const cycle = e.powerCycle || 'Unknown';
      cycleMap.set(cycle, (cycleMap.get(cycle) || 0) + 1);
    });

    // Count by status
    const statusMap = new Map<string, number>();
    engines.forEach(e => {
      const status = e.status || 'Unknown';
      statusMap.set(status, (statusMap.get(status) || 0) + 1);
    });

    // Find notable engines
    const enginesWithIsp = engines.filter(e => e.isp || e.ispVacuum);
    const enginesWithThrust = engines.filter(e => e.thrustKn);
    const enginesWithReliability = engines.filter(e => e.reliabilityRate);

    return {
      total: engines.length,
      byCountry: Array.from(countryMap.entries()).map(([id, data]) => ({
        countryId: id,
        countryName: data.name,
        count: data.count,
      })).sort((a, b) => b.count - a.count),
      byPropellant: Array.from(propellantMap.entries()).map(([propellant, count]) => ({
        propellant,
        count,
      })).sort((a, b) => b.count - a.count),
      byPowerCycle: Array.from(cycleMap.entries()).map(([cycle, count]) => ({
        cycle,
        count,
      })).sort((a, b) => b.count - a.count),
      byStatus: Array.from(statusMap.entries()).map(([status, count]) => ({
        status,
        count,
      })).sort((a, b) => b.count - a.count),
      reusableCount: engines.filter(e => e.reusable).length,
      activeCount: engines.filter(e => e.status === 'Active').length,
      averageIsp: enginesWithIsp.length > 0
        ? Math.round(enginesWithIsp.reduce((sum, e) => sum + (e.ispVacuum || e.isp || 0), 0) / enginesWithIsp.length)
        : 0,
      averageThrust: enginesWithThrust.length > 0
        ? Math.round(enginesWithThrust.reduce((sum, e) => sum + (e.thrustKn || 0), 0) / enginesWithThrust.length)
        : 0,
      highestIsp: enginesWithIsp.length > 0
        ? enginesWithIsp.reduce((max, e) => (e.ispVacuum || e.isp || 0) > (max.ispVacuum || max.isp || 0) ? e : max)
        : null,
      highestThrust: enginesWithThrust.length > 0
        ? enginesWithThrust.reduce((max, e) => (e.thrustKn || 0) > (max.thrustKn || 0) ? e : max)
        : null,
      mostReliable: enginesWithReliability.length > 0
        ? enginesWithReliability.reduce((max, e) => (e.reliabilityRate || 0) > (max.reliabilityRate || 0) ? e : max)
        : null,
    };
  }

  /**
   * Get country engine statistics
   */
  async getCountryStatistics(countryId: string): Promise<{
    total: number;
    active: number;
    reusable: number;
    averageIsp: number;
    averageThrust: number;
    advancedCycles: number;
    highestIspEngine: Engine | null;
    highestThrustEngine: Engine | null;
  }> {
    const engines = await this.getByCountry(countryId);
    const enginesWithIsp = engines.filter(e => e.isp || e.ispVacuum);
    const enginesWithThrust = engines.filter(e => e.thrustKn);

    return {
      total: engines.length,
      active: engines.filter(e => e.status === 'Active').length,
      reusable: engines.filter(e => e.reusable).length,
      averageIsp: enginesWithIsp.length > 0
        ? Math.round(enginesWithIsp.reduce((sum, e) => sum + (e.ispVacuum || e.isp || 0), 0) / enginesWithIsp.length)
        : 0,
      averageThrust: enginesWithThrust.length > 0
        ? Math.round(enginesWithThrust.reduce((sum, e) => sum + (e.thrustKn || 0), 0) / enginesWithThrust.length)
        : 0,
      advancedCycles: engines.filter(e => e.advancedCycle).length,
      highestIspEngine: enginesWithIsp.length > 0
        ? enginesWithIsp.reduce((max, e) => (e.ispVacuum || e.isp || 0) > (max.ispVacuum || max.isp || 0) ? e : max)
        : null,
      highestThrustEngine: enginesWithThrust.length > 0
        ? enginesWithThrust.reduce((max, e) => (e.thrustKn || 0) > (max.thrustKn || 0) ? e : max)
        : null,
    };
  }

  /**
   * Compare two engines
   */
  async compare(engine1Id: string | number, engine2Id: string | number): Promise<EngineComparison> {
    this.validateId(engine1Id);
    this.validateId(engine2Id);

    if (engine1Id === engine2Id) {
      throw new Error('Cannot compare engine with itself');
    }

    const [engine1, engine2] = await Promise.all([
      this.getById(engine1Id),
      this.getById(engine2Id),
    ]);

    const differences: Record<string, { engine1: any; engine2: any; difference: number | string }> = {};

    // Compare numeric fields
    const numericFields = [
      'isp', 'ispVacuum', 'thrustKn', 'thrustVacuumKn', 'massKg',
      'chamberPressureBar', 'reliabilityRate', 'sophisticationScore',
      'totalFlights', 'reusabilityFlights'
    ];

    numericFields.forEach(field => {
      const val1 = engine1[field];
      const val2 = engine2[field];
      if (val1 !== undefined || val2 !== undefined) {
        differences[field] = {
          engine1: val1 ?? 'N/A',
          engine2: val2 ?? 'N/A',
          difference: val1 && val2 ? val1 - val2 : 'N/A',
        };
      }
    });

    // Compare string fields
    const stringFields = ['propellant', 'powerCycle', 'status', 'designer'];
    stringFields.forEach(field => {
      differences[field] = {
        engine1: engine1[field] ?? 'N/A',
        engine2: engine2[field] ?? 'N/A',
        difference: engine1[field] === engine2[field] ? 'Same' : 'Different',
      };
    });

    // Compare boolean fields
    const boolFields = ['reusable', 'throttleCapable', 'restartCapable', 'advancedCycle'];
    boolFields.forEach(field => {
      differences[field] = {
        engine1: engine1[field] ? 'Yes' : 'No',
        engine2: engine2[field] ? 'Yes' : 'No',
        difference: engine1[field] === engine2[field] ? 'Same' : 'Different',
      };
    });

    return {
      engine1,
      engine2,
      differences,
    };
  }

  /**
   * Create a new engine
   */
  async create(engineData: Partial<Engine>): Promise<Engine> {
    if (!engineData.name) {
      throw new Error(ERROR_MESSAGES.INVALID_INPUT);
    }
    const response = await this.axiosInstance.post<Engine>('/engines', engineData);
    return this.enhanceEngine(response.data);
  }

  /**
   * Update an existing engine
   */
  async update(id: string | number, engineData: Partial<Engine>): Promise<Engine> {
    this.validateId(id);
    const response = await this.axiosInstance.put<Engine>(`/engines/${id}`, engineData);
    return this.enhanceEngine(response.data);
  }

  /**
   * Delete an engine
   */
  async delete(id: string | number): Promise<void> {
    this.validateId(id);
    await this.axiosInstance.delete(`/engines/${id}`);
  }

  // ============================================================================
  // BACKEND API ENDPOINTS
  // ============================================================================

  /**
   * Get engines by country code (API endpoint)
   */
  async getByCountryCode(isoCode: string): Promise<Engine[]> {
    try {
      const response = await this.axiosInstance.get<Engine[]>(`/engines/by-country-code/${isoCode}`);
      return response.data.map(e => this.enhanceEngine(e));
    } catch (error) {
      // Fallback to local filtering
      return this.getByCountry(isoCode);
    }
  }

  /**
   * Get engines by cycle type (API endpoint)
   */
  async getByCycle(cycle: string): Promise<Engine[]> {
    try {
      const response = await this.axiosInstance.get<Engine[]>(`/engines/by-cycle/${cycle}`);
      return response.data.map(e => this.enhanceEngine(e));
    } catch (error) {
      // Fallback to local filtering
      return this.getByPowerCycle(cycle);
    }
  }

  /**
   * Get engine families
   */
  async getFamilies(): Promise<string[]> {
    try {
      const response = await this.axiosInstance.get<string[]>('/engines/families');
      return response.data;
    } catch (error) {
      // Fallback to local calculation
      const engines = await this.getAll();
      const families = new Set(engines.map(e => e.engineFamily).filter(Boolean));
      return Array.from(families) as string[];
    }
  }

  /**
   * Get engines by family
   */
  async getByFamily(family: string): Promise<Engine[]> {
    try {
      const response = await this.axiosInstance.get<Engine[]>(`/engines/by-family/${family}`);
      return response.data.map(e => this.enhanceEngine(e));
    } catch (error) {
      // Fallback to local filtering
      const engines = await this.getAll();
      return engines.filter(e => e.engineFamily === family);
    }
  }

  /**
   * Get engine cycles (types)
   */
  async getCycles(): Promise<string[]> {
    try {
      const response = await this.axiosInstance.get<string[]>('/engines/cycles');
      return response.data;
    } catch (error) {
      // Fallback to local calculation
      const engines = await this.getAll();
      const cycles = new Set(engines.map(e => e.powerCycle).filter(Boolean));
      return Array.from(cycles) as string[];
    }
  }

  /**
   * Get propellant types
   */
  async getPropellants(): Promise<string[]> {
    try {
      const response = await this.axiosInstance.get<string[]>('/engines/propellants');
      return response.data;
    } catch (error) {
      // Fallback to local calculation
      const engines = await this.getAll();
      const propellants = new Set(engines.map(e => e.propellant).filter(Boolean));
      return Array.from(propellants) as string[];
    }
  }

  /**
   * Search engines
   */
  async search(query: string): Promise<Engine[]> {
    try {
      const response = await this.axiosInstance.get<Engine[]>('/engines/search', {
        params: { q: query }
      });
      return response.data.map(e => this.enhanceEngine(e));
    } catch (error) {
      // Fallback to local search
      const engines = await this.getAll();
      const lowerQuery = query.toLowerCase();
      return engines.filter(e =>
        e.name?.toLowerCase().includes(lowerQuery) ||
        e.designer?.toLowerCase().includes(lowerQuery) ||
        e.engineFamily?.toLowerCase().includes(lowerQuery)
      );
    }
  }
}

// Export singleton instance
export const engineService = new EngineService();
export default engineService;
