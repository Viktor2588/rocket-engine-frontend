import axios, { AxiosInstance, AxiosError } from 'axios';
import { Engine, EngineComparison, EngineStatistics, ApiErrorResponse } from '../types';
import { API_CONFIG, ERROR_MESSAGES } from '../constants';

/**
 * Mock engine data with enhanced fields
 */
const MOCK_ENGINES: Engine[] = [
  // SpaceX Engines
  {
    id: 1,
    name: 'Merlin 1D',
    designer: 'SpaceX',
    type: 'Liquid',
    isp: 282,
    twr: 180,
    propellant: 'LOX/RP-1',
    status: 'Active',
    countryId: 'USA',
    origin: 'United States',
    thrustKn: 845,
    thrustVacuumKn: 914,
    ispSeaLevel: 282,
    ispVacuum: 311,
    isp_s: 282,
    massKg: 470,
    powerCycle: 'Gas Generator',
    chamberPressureBar: 97,
    throttleMinPercent: 40,
    throttleMaxPercent: 100,
    throttleCapable: true,
    gimbalRangeDegrees: 5,
    gimbalCapable: true,
    restartCapable: true,
    maxRestarts: 3,
    firstFlightYear: 2013,
    firstFlight: '2013-09-29',
    reusable: true,
    reusabilityFlights: 20,
    actualReusedFlights: 19,
    totalFlights: 300,
    successfulFlights: 298,
    reliabilityRate: 99.3,
    engineFamily: 'Merlin',
    variant: '1D',
    advancedCycle: false,
    vehicle: 'Falcon 9, Falcon Heavy',
    use: 'First Stage',
    calculateThrustToWeightRatio: 180,
    sophisticationScore: 75,
    wikiUrl: 'https://en.wikipedia.org/wiki/SpaceX_Merlin',
  },
  {
    id: 2,
    name: 'Merlin 1D Vacuum',
    designer: 'SpaceX',
    type: 'Liquid',
    isp: 348,
    twr: 150,
    propellant: 'LOX/RP-1',
    status: 'Active',
    countryId: 'USA',
    origin: 'United States',
    thrustKn: 934,
    ispVacuum: 348,
    isp_s: 348,
    massKg: 490,
    powerCycle: 'Gas Generator',
    chamberPressureBar: 97,
    throttleCapable: true,
    gimbalRangeDegrees: 5,
    gimbalCapable: true,
    restartCapable: true,
    firstFlightYear: 2013,
    reusable: false,
    totalFlights: 200,
    successfulFlights: 199,
    reliabilityRate: 99.5,
    engineFamily: 'Merlin',
    variant: '1D Vacuum',
    predecessorEngineId: 1,
    vehicle: 'Falcon 9',
    use: 'Second Stage',
    calculateThrustToWeightRatio: 150,
    sophisticationScore: 72,
  },
  {
    id: 3,
    name: 'Raptor 2',
    designer: 'SpaceX',
    type: 'Liquid',
    isp: 327,
    twr: 200,
    propellant: 'LOX/CH4',
    status: 'Active',
    countryId: 'USA',
    origin: 'United States',
    thrustKn: 2300,
    thrustVacuumKn: 2500,
    ispSeaLevel: 327,
    ispVacuum: 356,
    isp_s: 327,
    massKg: 1600,
    powerCycle: 'Full-Flow Staged Combustion',
    chamberPressureBar: 300,
    throttleMinPercent: 20,
    throttleMaxPercent: 100,
    throttleCapable: true,
    gimbalRangeDegrees: 15,
    gimbalCapable: true,
    restartCapable: true,
    maxRestarts: 1000,
    firstFlightYear: 2023,
    firstFlight: '2023-04-20',
    reusable: true,
    reusabilityFlights: 1000,
    totalFlights: 50,
    successfulFlights: 47,
    reliabilityRate: 94.0,
    engineFamily: 'Raptor',
    variant: '2',
    advancedCycle: true,
    methalox: true,
    vehicle: 'Starship',
    use: 'First Stage, Second Stage',
    calculateThrustToWeightRatio: 200,
    sophisticationScore: 98,
    wikiUrl: 'https://en.wikipedia.org/wiki/SpaceX_Raptor',
  },
  {
    id: 4,
    name: 'Raptor Vacuum',
    designer: 'SpaceX',
    type: 'Liquid',
    isp: 380,
    twr: 170,
    propellant: 'LOX/CH4',
    status: 'Active',
    countryId: 'USA',
    origin: 'United States',
    thrustKn: 2650,
    ispVacuum: 380,
    isp_s: 380,
    massKg: 1700,
    powerCycle: 'Full-Flow Staged Combustion',
    chamberPressureBar: 300,
    throttleCapable: true,
    gimbalCapable: false,
    restartCapable: true,
    firstFlightYear: 2023,
    reusable: true,
    reusabilityFlights: 100,
    totalFlights: 10,
    successfulFlights: 9,
    reliabilityRate: 90.0,
    engineFamily: 'Raptor',
    variant: 'Vacuum',
    predecessorEngineId: 3,
    advancedCycle: true,
    methalox: true,
    vehicle: 'Starship',
    use: 'Second Stage',
    calculateThrustToWeightRatio: 170,
    sophisticationScore: 96,
  },
  // Russian Engines
  {
    id: 5,
    name: 'RD-180',
    designer: 'NPO Energomash',
    type: 'Liquid',
    isp: 311,
    twr: 78,
    propellant: 'LOX/RP-1',
    status: 'Active',
    countryId: 'RUS',
    origin: 'Russia',
    thrustKn: 4152,
    ispSeaLevel: 311,
    ispVacuum: 338,
    isp_s: 311,
    massKg: 5480,
    powerCycle: 'Staged Combustion',
    chamberPressureBar: 267,
    throttleMinPercent: 47,
    throttleMaxPercent: 100,
    throttleCapable: true,
    gimbalRangeDegrees: 8,
    gimbalCapable: true,
    restartCapable: false,
    firstFlightYear: 2000,
    firstFlight: '2000-05-24',
    reusable: false,
    totalFlights: 116,
    successfulFlights: 116,
    reliabilityRate: 100.0,
    engineFamily: 'RD-180',
    advancedCycle: true,
    vehicle: 'Atlas V',
    use: 'First Stage',
    calculateThrustToWeightRatio: 78,
    sophisticationScore: 88,
    wikiUrl: 'https://en.wikipedia.org/wiki/RD-180',
  },
  {
    id: 6,
    name: 'RD-191',
    designer: 'NPO Energomash',
    type: 'Liquid',
    isp: 311,
    twr: 80,
    propellant: 'LOX/RP-1',
    status: 'Active',
    countryId: 'RUS',
    origin: 'Russia',
    thrustKn: 2090,
    ispSeaLevel: 311,
    ispVacuum: 337,
    isp_s: 311,
    massKg: 2290,
    powerCycle: 'Staged Combustion',
    chamberPressureBar: 263,
    throttleMinPercent: 27,
    throttleMaxPercent: 105,
    throttleCapable: true,
    gimbalRangeDegrees: 8,
    gimbalCapable: true,
    firstFlightYear: 2014,
    reusable: false,
    totalFlights: 30,
    successfulFlights: 29,
    reliabilityRate: 96.7,
    engineFamily: 'RD-191',
    advancedCycle: true,
    vehicle: 'Angara',
    use: 'First Stage',
    calculateThrustToWeightRatio: 80,
    sophisticationScore: 85,
  },
  {
    id: 7,
    name: 'RD-170',
    designer: 'NPO Energomash',
    type: 'Liquid',
    isp: 309,
    twr: 83,
    propellant: 'LOX/RP-1',
    status: 'Retired',
    countryId: 'RUS',
    origin: 'Russia',
    thrustKn: 7887,
    ispSeaLevel: 309,
    ispVacuum: 337,
    isp_s: 309,
    massKg: 9750,
    powerCycle: 'Staged Combustion',
    chamberPressureBar: 250,
    throttleCapable: true,
    gimbalCapable: true,
    firstFlightYear: 1985,
    reusable: true,
    reusabilityFlights: 10,
    totalFlights: 22,
    successfulFlights: 22,
    reliabilityRate: 100.0,
    engineFamily: 'RD-170',
    advancedCycle: true,
    vehicle: 'Energia, Zenit',
    use: 'First Stage',
    calculateThrustToWeightRatio: 83,
    sophisticationScore: 90,
    wikiUrl: 'https://en.wikipedia.org/wiki/RD-170',
  },
  // Aerojet Rocketdyne Engines (USA)
  {
    id: 8,
    name: 'RS-25',
    designer: 'Aerojet Rocketdyne',
    type: 'Liquid',
    isp: 366,
    twr: 73,
    propellant: 'LOX/LH2',
    status: 'Active',
    countryId: 'USA',
    origin: 'United States',
    thrustKn: 2279,
    ispSeaLevel: 366,
    ispVacuum: 452,
    isp_s: 366,
    massKg: 3527,
    powerCycle: 'Staged Combustion',
    chamberPressureBar: 206,
    throttleMinPercent: 67,
    throttleMaxPercent: 109,
    throttleCapable: true,
    gimbalRangeDegrees: 11.5,
    gimbalCapable: true,
    restartCapable: false,
    firstFlightYear: 1981,
    firstFlight: '1981-04-12',
    reusable: true,
    reusabilityFlights: 55,
    totalFlights: 135,
    successfulFlights: 135,
    reliabilityRate: 100.0,
    engineFamily: 'RS-25',
    advancedCycle: true,
    hydrolox: true,
    vehicle: 'Space Shuttle, SLS',
    use: 'Core Stage',
    calculateThrustToWeightRatio: 73,
    sophisticationScore: 92,
    wikiUrl: 'https://en.wikipedia.org/wiki/RS-25',
  },
  {
    id: 9,
    name: 'RL-10',
    designer: 'Aerojet Rocketdyne',
    type: 'Liquid',
    isp: 465,
    twr: 40,
    propellant: 'LOX/LH2',
    status: 'Active',
    countryId: 'USA',
    origin: 'United States',
    thrustKn: 110,
    ispVacuum: 465,
    isp_s: 465,
    massKg: 277,
    powerCycle: 'Expander',
    chamberPressureBar: 44,
    throttleCapable: true,
    gimbalRangeDegrees: 4,
    gimbalCapable: true,
    restartCapable: true,
    maxRestarts: 15,
    firstFlightYear: 1963,
    reusable: false,
    totalFlights: 520,
    successfulFlights: 515,
    reliabilityRate: 99.0,
    engineFamily: 'RL-10',
    hydrolox: true,
    vehicle: 'Centaur, Delta IV, SLS',
    use: 'Upper Stage',
    calculateThrustToWeightRatio: 40,
    sophisticationScore: 80,
    wikiUrl: 'https://en.wikipedia.org/wiki/RL10',
  },
  // Blue Origin
  {
    id: 10,
    name: 'BE-4',
    designer: 'Blue Origin',
    type: 'Liquid',
    isp: 310,
    twr: 90,
    propellant: 'LOX/CH4',
    status: 'Active',
    countryId: 'USA',
    origin: 'United States',
    thrustKn: 2400,
    ispSeaLevel: 310,
    ispVacuum: 340,
    isp_s: 310,
    massKg: 2000,
    powerCycle: 'Staged Combustion',
    chamberPressureBar: 135,
    throttleMinPercent: 30,
    throttleMaxPercent: 100,
    throttleCapable: true,
    gimbalRangeDegrees: 8,
    gimbalCapable: true,
    restartCapable: true,
    firstFlightYear: 2024,
    firstFlight: '2024-01-08',
    reusable: true,
    reusabilityFlights: 25,
    totalFlights: 10,
    successfulFlights: 10,
    reliabilityRate: 100.0,
    engineFamily: 'BE-4',
    advancedCycle: true,
    methalox: true,
    vehicle: 'Vulcan, New Glenn',
    use: 'First Stage',
    calculateThrustToWeightRatio: 90,
    sophisticationScore: 88,
    wikiUrl: 'https://en.wikipedia.org/wiki/BE-4',
  },
  // European (ESA/Arianespace)
  {
    id: 11,
    name: 'Vulcain 2.1',
    designer: 'Safran',
    type: 'Liquid',
    isp: 434,
    twr: 66,
    propellant: 'LOX/LH2',
    status: 'Active',
    countryId: 'FRA',
    origin: 'France / ESA',
    thrustKn: 1390,
    ispVacuum: 434,
    isp_s: 434,
    massKg: 2100,
    powerCycle: 'Gas Generator',
    chamberPressureBar: 116,
    throttleCapable: false,
    gimbalRangeDegrees: 6,
    gimbalCapable: true,
    firstFlightYear: 2023,
    reusable: false,
    totalFlights: 5,
    successfulFlights: 4,
    reliabilityRate: 80.0,
    engineFamily: 'Vulcain',
    variant: '2.1',
    hydrolox: true,
    vehicle: 'Ariane 6',
    use: 'Core Stage',
    calculateThrustToWeightRatio: 66,
    sophisticationScore: 75,
  },
  {
    id: 12,
    name: 'Vinci',
    designer: 'Safran',
    type: 'Liquid',
    isp: 465,
    twr: 42,
    propellant: 'LOX/LH2',
    status: 'Active',
    countryId: 'FRA',
    origin: 'France / ESA',
    thrustKn: 180,
    ispVacuum: 465,
    isp_s: 465,
    massKg: 550,
    powerCycle: 'Expander',
    chamberPressureBar: 60,
    throttleCapable: false,
    gimbalCapable: true,
    restartCapable: true,
    maxRestarts: 5,
    firstFlightYear: 2023,
    reusable: false,
    totalFlights: 3,
    successfulFlights: 2,
    reliabilityRate: 66.7,
    engineFamily: 'Vinci',
    hydrolox: true,
    vehicle: 'Ariane 6',
    use: 'Upper Stage',
    calculateThrustToWeightRatio: 42,
    sophisticationScore: 78,
    wikiUrl: 'https://en.wikipedia.org/wiki/Vinci_(rocket_engine)',
  },
  // Chinese Engines
  {
    id: 13,
    name: 'YF-100',
    designer: 'AALPT',
    type: 'Liquid',
    isp: 300,
    twr: 85,
    propellant: 'LOX/RP-1',
    status: 'Active',
    countryId: 'CHN',
    origin: 'China',
    thrustKn: 1340,
    ispSeaLevel: 300,
    ispVacuum: 335,
    isp_s: 300,
    massKg: 1650,
    powerCycle: 'Staged Combustion',
    chamberPressureBar: 180,
    throttleCapable: false,
    gimbalRangeDegrees: 8,
    gimbalCapable: true,
    firstFlightYear: 2015,
    reusable: false,
    totalFlights: 50,
    successfulFlights: 49,
    reliabilityRate: 98.0,
    engineFamily: 'YF-100',
    advancedCycle: true,
    vehicle: 'Long March 5, 6, 7',
    use: 'First Stage, Boosters',
    calculateThrustToWeightRatio: 85,
    sophisticationScore: 82,
  },
  {
    id: 14,
    name: 'YF-77',
    designer: 'AALPT',
    type: 'Liquid',
    isp: 430,
    twr: 50,
    propellant: 'LOX/LH2',
    status: 'Active',
    countryId: 'CHN',
    origin: 'China',
    thrustKn: 700,
    ispVacuum: 430,
    isp_s: 430,
    massKg: 1400,
    powerCycle: 'Gas Generator',
    chamberPressureBar: 102,
    throttleCapable: false,
    gimbalCapable: true,
    firstFlightYear: 2016,
    reusable: false,
    totalFlights: 12,
    successfulFlights: 10,
    reliabilityRate: 83.3,
    engineFamily: 'YF-77',
    hydrolox: true,
    vehicle: 'Long March 5',
    use: 'Core Stage',
    calculateThrustToWeightRatio: 50,
    sophisticationScore: 72,
  },
  // Japanese Engines
  {
    id: 15,
    name: 'LE-9',
    designer: 'MHI',
    type: 'Liquid',
    isp: 425,
    twr: 55,
    propellant: 'LOX/LH2',
    status: 'Active',
    countryId: 'JPN',
    origin: 'Japan',
    thrustKn: 1471,
    ispVacuum: 425,
    isp_s: 425,
    massKg: 2400,
    powerCycle: 'Expander Bleed',
    chamberPressureBar: 100,
    throttleMinPercent: 60,
    throttleMaxPercent: 100,
    throttleCapable: true,
    gimbalCapable: true,
    firstFlightYear: 2024,
    reusable: false,
    totalFlights: 3,
    successfulFlights: 2,
    reliabilityRate: 66.7,
    engineFamily: 'LE-9',
    hydrolox: true,
    vehicle: 'H3',
    use: 'First Stage',
    calculateThrustToWeightRatio: 55,
    sophisticationScore: 80,
    wikiUrl: 'https://en.wikipedia.org/wiki/LE-9',
  },
  // Indian Engines
  {
    id: 16,
    name: 'CE-20',
    designer: 'ISRO',
    type: 'Liquid',
    isp: 442,
    twr: 35,
    propellant: 'LOX/LH2',
    status: 'Active',
    countryId: 'IND',
    origin: 'India',
    thrustKn: 200,
    ispVacuum: 442,
    isp_s: 442,
    massKg: 585,
    powerCycle: 'Gas Generator',
    chamberPressureBar: 60,
    throttleCapable: false,
    gimbalCapable: true,
    restartCapable: true,
    firstFlightYear: 2017,
    reusable: false,
    totalFlights: 8,
    successfulFlights: 8,
    reliabilityRate: 100.0,
    engineFamily: 'CE-20',
    hydrolox: true,
    vehicle: 'GSLV Mk III',
    use: 'Upper Stage',
    calculateThrustToWeightRatio: 35,
    sophisticationScore: 68,
  },
  {
    id: 17,
    name: 'Vikas',
    designer: 'ISRO',
    type: 'Liquid',
    isp: 281,
    twr: 60,
    propellant: 'N2O4/UDMH',
    status: 'Active',
    countryId: 'IND',
    origin: 'India',
    thrustKn: 800,
    ispSeaLevel: 281,
    ispVacuum: 295,
    isp_s: 281,
    massKg: 900,
    powerCycle: 'Gas Generator',
    chamberPressureBar: 58,
    throttleCapable: false,
    gimbalCapable: true,
    firstFlightYear: 1987,
    reusable: false,
    totalFlights: 65,
    successfulFlights: 63,
    reliabilityRate: 96.9,
    engineFamily: 'Vikas',
    hypergolic: true,
    vehicle: 'PSLV, GSLV',
    use: 'First/Second Stage',
    calculateThrustToWeightRatio: 60,
    sophisticationScore: 55,
  },
  // Rocket Lab
  {
    id: 18,
    name: 'Rutherford',
    designer: 'Rocket Lab',
    type: 'Liquid',
    isp: 311,
    twr: 150,
    propellant: 'LOX/RP-1',
    status: 'Active',
    countryId: 'USA',
    origin: 'United States',
    thrustKn: 25.8,
    ispSeaLevel: 311,
    ispVacuum: 343,
    isp_s: 311,
    massKg: 35,
    powerCycle: 'Electric Pump-Fed',
    chamberPressureBar: 120,
    throttleMinPercent: 50,
    throttleMaxPercent: 100,
    throttleCapable: true,
    gimbalCapable: true,
    restartCapable: true,
    firstFlightYear: 2017,
    reusable: true,
    reusabilityFlights: 10,
    totalFlights: 200,
    successfulFlights: 196,
    reliabilityRate: 98.0,
    engineFamily: 'Rutherford',
    vehicle: 'Electron',
    use: 'First Stage',
    calculateThrustToWeightRatio: 150,
    sophisticationScore: 78,
    wikiUrl: 'https://en.wikipedia.org/wiki/Rutherford_(rocket_engine)',
  },
];

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
  private useMockData: boolean = false;

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
   */
  async getAll(): Promise<Engine[]> {
    if (this.useMockData) {
      return MOCK_ENGINES.map(e => this.enhanceEngine(e));
    }

    try {
      const response = await this.axiosInstance.get<Engine[]>('/engines');
      return response.data.map(e => this.enhanceEngine(e));
    } catch (error) {
      console.warn('Falling back to mock engine data');
      this.useMockData = true;
      return MOCK_ENGINES.map(e => this.enhanceEngine(e));
    }
  }

  /**
   * Fetch a single engine by ID
   */
  async getById(id: string | number): Promise<Engine> {
    this.validateId(id);

    if (this.useMockData) {
      const engine = MOCK_ENGINES.find(e => e.id === Number(id) || e.id === id);
      if (!engine) throw new Error(ERROR_MESSAGES.NOT_FOUND);
      return this.enhanceEngine(engine);
    }

    try {
      const response = await this.axiosInstance.get<Engine>(`/engines/${id}`);
      return this.enhanceEngine(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error(ERROR_MESSAGES.NOT_FOUND);
      }
      // Try mock data
      const engine = MOCK_ENGINES.find(e => e.id === Number(id) || e.id === id);
      if (engine) return this.enhanceEngine(engine);
      throw new Error(ERROR_MESSAGES.FETCH_ENGINE_FAILED);
    }
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
    try {
      const response = await this.axiosInstance.post<Engine>('/engines', engineData);
      return this.enhanceEngine(response.data);
    } catch (error) {
      console.error('Error creating engine:', error);
      throw new Error(ERROR_MESSAGES.INTERNAL_ERROR);
    }
  }

  /**
   * Update an existing engine
   */
  async update(id: string | number, engineData: Partial<Engine>): Promise<Engine> {
    this.validateId(id);
    try {
      const response = await this.axiosInstance.put<Engine>(`/engines/${id}`, engineData);
      return this.enhanceEngine(response.data);
    } catch (error) {
      console.error(`Error updating engine ${id}:`, error);
      throw new Error(ERROR_MESSAGES.INTERNAL_ERROR);
    }
  }

  /**
   * Delete an engine
   */
  async delete(id: string | number): Promise<void> {
    this.validateId(id);
    try {
      await this.axiosInstance.delete(`/engines/${id}`);
    } catch (error) {
      console.error(`Error deleting engine ${id}:`, error);
      throw new Error(ERROR_MESSAGES.INTERNAL_ERROR);
    }
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
