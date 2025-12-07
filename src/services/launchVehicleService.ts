import axios, { AxiosInstance, AxiosError } from 'axios';
import { LaunchVehicle, LaunchVehicleStatus, ApiErrorResponse } from '../types';
import { API_CONFIG, ERROR_MESSAGES } from '../constants';

// Mock data for development until backend is ready
const MOCK_LAUNCH_VEHICLES: LaunchVehicle[] = [
  {
    id: 1,
    name: 'Falcon 9',
    variant: 'Block 5',
    countryId: 'USA',
    manufacturer: 'SpaceX',
    description: 'Partially reusable two-stage medium-lift launch vehicle designed and manufactured by SpaceX.',
    status: 'Active',
    firstFlight: '2010-06-04',
    totalLaunches: 300,
    successfulLaunches: 298,
    successRate: 99.3,
    payloadToLeoKg: 22800,
    payloadToGtoKg: 8300,
    payloadToMarsKg: 4020,
    heightMeters: 70,
    diameterMeters: 3.7,
    liftoffMassKg: 549054,
    liftoffThrustKn: 7607,
    stages: 2,
    costPerLaunchUsd: 67000000,
    costPerKgToLeoUsd: 2720,
    reusable: true,
    humanRated: true,
    partiallyReusable: true,
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Falcon_9_first_stage_landing_on_JRTI.jpg/220px-Falcon_9_first_stage_landing_on_JRTI.jpg',
  },
  {
    id: 2,
    name: 'Falcon Heavy',
    countryId: 'USA',
    manufacturer: 'SpaceX',
    description: 'Partially reusable heavy-lift launch vehicle designed and manufactured by SpaceX.',
    status: 'Active',
    firstFlight: '2018-02-06',
    totalLaunches: 10,
    successfulLaunches: 10,
    successRate: 100,
    payloadToLeoKg: 63800,
    payloadToGtoKg: 26700,
    payloadToMarsKg: 16800,
    heightMeters: 70,
    diameterMeters: 12.2,
    liftoffMassKg: 1420788,
    liftoffThrustKn: 22819,
    stages: 2,
    costPerLaunchUsd: 97000000,
    costPerKgToLeoUsd: 1520,
    reusable: true,
    humanRated: false,
    partiallyReusable: true,
  },
  {
    id: 3,
    name: 'Starship',
    countryId: 'USA',
    manufacturer: 'SpaceX',
    description: 'Fully reusable super heavy-lift launch vehicle under development by SpaceX.',
    status: 'Development',
    firstFlight: '2023-04-20',
    totalLaunches: 6,
    successfulLaunches: 3,
    successRate: 50,
    payloadToLeoKg: 150000,
    payloadToGtoKg: 21000,
    payloadToMarsKg: 100000,
    heightMeters: 121,
    diameterMeters: 9,
    liftoffMassKg: 5000000,
    liftoffThrustKn: 74500,
    stages: 2,
    costPerLaunchUsd: 10000000,
    costPerKgToLeoUsd: 67,
    reusable: true,
    humanRated: false,
  },
  {
    id: 4,
    name: 'Atlas V',
    countryId: 'USA',
    manufacturer: 'United Launch Alliance',
    description: 'Expendable launch system in the Atlas rocket family.',
    status: 'Active',
    firstFlight: '2002-08-21',
    totalLaunches: 99,
    successfulLaunches: 99,
    successRate: 100,
    payloadToLeoKg: 18850,
    payloadToGtoKg: 8900,
    heightMeters: 58.3,
    diameterMeters: 3.81,
    liftoffMassKg: 590000,
    liftoffThrustKn: 4152,
    stages: 2,
    costPerLaunchUsd: 110000000,
    costPerKgToLeoUsd: 5836,
    reusable: false,
    humanRated: true,
  },
  {
    id: 5,
    name: 'Delta IV Heavy',
    countryId: 'USA',
    manufacturer: 'United Launch Alliance',
    description: 'Expendable heavy-lift launch vehicle, the largest member of the Delta IV family.',
    status: 'Retired',
    firstFlight: '2004-12-21',
    lastFlight: '2024-04-09',
    totalLaunches: 16,
    successfulLaunches: 15,
    successRate: 93.75,
    payloadToLeoKg: 28790,
    payloadToGtoKg: 14220,
    heightMeters: 72,
    diameterMeters: 5,
    liftoffMassKg: 733000,
    liftoffThrustKn: 9420,
    stages: 2,
    costPerLaunchUsd: 350000000,
    costPerKgToLeoUsd: 12157,
    reusable: false,
    humanRated: false,
  },
  {
    id: 6,
    name: 'Long March 5',
    countryId: 'CHN',
    manufacturer: 'CALT',
    description: 'Chinese heavy-lift launch vehicle, used for lunar missions and space station modules.',
    status: 'Active',
    firstFlight: '2016-11-03',
    totalLaunches: 13,
    successfulLaunches: 12,
    successRate: 92.3,
    payloadToLeoKg: 25000,
    payloadToGtoKg: 14000,
    payloadToTliKg: 8200,
    heightMeters: 57,
    diameterMeters: 5,
    liftoffMassKg: 867000,
    liftoffThrustKn: 10565,
    stages: 2,
    costPerLaunchUsd: 100000000,
    costPerKgToLeoUsd: 4000,
    reusable: false,
    humanRated: false,
  },
  {
    id: 7,
    name: 'Long March 2F',
    countryId: 'CHN',
    manufacturer: 'CALT',
    description: 'Human-rated Chinese orbital launch vehicle used for Shenzhou crewed missions.',
    status: 'Active',
    firstFlight: '1999-11-19',
    totalLaunches: 20,
    successfulLaunches: 20,
    successRate: 100,
    payloadToLeoKg: 8400,
    heightMeters: 62,
    diameterMeters: 3.35,
    liftoffMassKg: 493000,
    liftoffThrustKn: 6040,
    stages: 2,
    costPerLaunchUsd: 70000000,
    costPerKgToLeoUsd: 8333,
    reusable: false,
    humanRated: true,
  },
  {
    id: 8,
    name: 'Soyuz-2',
    variant: '1b',
    countryId: 'RUS',
    manufacturer: 'RKK Energia',
    description: 'Russian medium-lift launch vehicle, successor to the Soyuz-U.',
    status: 'Active',
    firstFlight: '2006-12-27',
    totalLaunches: 150,
    successfulLaunches: 147,
    successRate: 98,
    payloadToLeoKg: 8200,
    payloadToGtoKg: 3250,
    heightMeters: 46.3,
    diameterMeters: 2.95,
    liftoffMassKg: 312000,
    liftoffThrustKn: 4456,
    stages: 3,
    costPerLaunchUsd: 48500000,
    costPerKgToLeoUsd: 5915,
    reusable: false,
    humanRated: true,
  },
  {
    id: 9,
    name: 'Proton-M',
    countryId: 'RUS',
    manufacturer: 'Khrunichev',
    description: 'Russian heavy-lift launch vehicle used primarily for commercial launches.',
    status: 'Active',
    firstFlight: '2001-04-07',
    totalLaunches: 113,
    successfulLaunches: 103,
    successRate: 91.2,
    payloadToLeoKg: 23000,
    payloadToGtoKg: 6920,
    heightMeters: 58.2,
    diameterMeters: 7.4,
    liftoffMassKg: 712000,
    liftoffThrustKn: 10470,
    stages: 4,
    costPerLaunchUsd: 65000000,
    costPerKgToLeoUsd: 2826,
    reusable: false,
    humanRated: false,
  },
  {
    id: 10,
    name: 'Ariane 5',
    countryId: 'FRA',
    manufacturer: 'ArianeGroup',
    description: 'European heavy-lift launch vehicle, part of the Ariane rocket family.',
    status: 'Retired',
    firstFlight: '1996-06-04',
    lastFlight: '2023-07-05',
    totalLaunches: 117,
    successfulLaunches: 112,
    successRate: 95.7,
    payloadToLeoKg: 21000,
    payloadToGtoKg: 10865,
    heightMeters: 52,
    diameterMeters: 5.4,
    liftoffMassKg: 780000,
    liftoffThrustKn: 14780,
    stages: 2,
    costPerLaunchUsd: 165000000,
    costPerKgToLeoUsd: 7857,
    reusable: false,
    humanRated: false,
  },
  {
    id: 11,
    name: 'Ariane 6',
    variant: 'A64',
    countryId: 'FRA',
    manufacturer: 'ArianeGroup',
    description: 'Next-generation European launch vehicle designed to replace Ariane 5.',
    status: 'Active',
    firstFlight: '2024-07-09',
    totalLaunches: 2,
    successfulLaunches: 1,
    successRate: 50,
    payloadToLeoKg: 21650,
    payloadToGtoKg: 11500,
    heightMeters: 63,
    diameterMeters: 5.4,
    liftoffMassKg: 860000,
    liftoffThrustKn: 15370,
    stages: 2,
    costPerLaunchUsd: 75000000,
    costPerKgToLeoUsd: 3464,
    reusable: false,
    humanRated: false,
  },
  {
    id: 12,
    name: 'H3',
    countryId: 'JPN',
    manufacturer: 'Mitsubishi Heavy Industries',
    description: 'Japanese next-generation liquid-fueled launch vehicle.',
    status: 'Active',
    firstFlight: '2024-02-17',
    totalLaunches: 4,
    successfulLaunches: 3,
    successRate: 75,
    payloadToLeoKg: 6500,
    payloadToGtoKg: 4000,
    heightMeters: 63,
    diameterMeters: 5.2,
    liftoffMassKg: 574000,
    liftoffThrustKn: 8400,
    stages: 2,
    costPerLaunchUsd: 50000000,
    costPerKgToLeoUsd: 7692,
    reusable: false,
    humanRated: false,
  },
  {
    id: 13,
    name: 'GSLV Mk III',
    variant: 'LVM3',
    countryId: 'IND',
    manufacturer: 'ISRO',
    description: 'Indian heavy-lift launch vehicle capable of placing satellites into geostationary orbit.',
    status: 'Active',
    firstFlight: '2017-06-05',
    totalLaunches: 8,
    successfulLaunches: 8,
    successRate: 100,
    payloadToLeoKg: 10000,
    payloadToGtoKg: 4000,
    heightMeters: 43.5,
    diameterMeters: 4,
    liftoffMassKg: 640000,
    liftoffThrustKn: 6870,
    stages: 3,
    costPerLaunchUsd: 40000000,
    costPerKgToLeoUsd: 4000,
    reusable: false,
    humanRated: true,
  },
  {
    id: 14,
    name: 'PSLV',
    countryId: 'IND',
    manufacturer: 'ISRO',
    description: 'Indian expendable medium-lift launch vehicle, workhorse of ISRO.',
    status: 'Active',
    firstFlight: '1993-09-20',
    totalLaunches: 60,
    successfulLaunches: 57,
    successRate: 95,
    payloadToLeoKg: 3800,
    payloadToGtoKg: 1425,
    heightMeters: 44,
    diameterMeters: 2.8,
    liftoffMassKg: 320000,
    liftoffThrustKn: 4860,
    stages: 4,
    costPerLaunchUsd: 21000000,
    costPerKgToLeoUsd: 5526,
    reusable: false,
    humanRated: false,
  },
  {
    id: 15,
    name: 'Electron',
    countryId: 'USA',
    manufacturer: 'Rocket Lab',
    description: 'American small-lift launch vehicle developed by Rocket Lab.',
    status: 'Active',
    firstFlight: '2017-05-25',
    totalLaunches: 50,
    successfulLaunches: 46,
    successRate: 92,
    payloadToLeoKg: 300,
    heightMeters: 18,
    diameterMeters: 1.2,
    liftoffMassKg: 13000,
    liftoffThrustKn: 224,
    stages: 2,
    costPerLaunchUsd: 7500000,
    costPerKgToLeoUsd: 25000,
    reusable: true,
    humanRated: false,
    partiallyReusable: true,
  },
];

/**
 * Launch Vehicle Service - Handles all API communication related to launch vehicles
 * Falls back to mock data if backend is not available
 */
class LaunchVehicleService {
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
    if (error.response?.status === 404) {
      // Enable mock data mode if endpoint doesn't exist
      this.useMockData = true;
    }
    if (error.response) {
      const status = error.response.status;
      const message = error.response.data?.message || ERROR_MESSAGES.INTERNAL_ERROR;
      console.error(`API Error [${status}]:`, message);
    } else if (error.request) {
      console.error('Network Error:', ERROR_MESSAGES.NETWORK_ERROR);
      this.useMockData = true;
    }
    return Promise.reject(error);
  }

  // ============================================================================
  // LAUNCH VEHICLE CRUD OPERATIONS
  // ============================================================================

  /**
   * Fetch all launch vehicles
   */
  async getAll(): Promise<LaunchVehicle[]> {
    if (this.useMockData) {
      return Promise.resolve(MOCK_LAUNCH_VEHICLES);
    }
    try {
      const response = await this.axiosInstance.get<LaunchVehicle[]>('/launch-vehicles');
      return response.data;
    } catch (error) {
      console.warn('Launch vehicles API not available, using mock data');
      this.useMockData = true;
      return MOCK_LAUNCH_VEHICLES;
    }
  }

  /**
   * Fetch a single launch vehicle by ID
   */
  async getById(id: string | number): Promise<LaunchVehicle | null> {
    if (this.useMockData) {
      const vehicle = MOCK_LAUNCH_VEHICLES.find(v => v.id.toString() === id.toString());
      return Promise.resolve(vehicle || null);
    }
    try {
      const response = await this.axiosInstance.get<LaunchVehicle>(`/launch-vehicles/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Launch vehicle API not available, using mock data');
      this.useMockData = true;
      return MOCK_LAUNCH_VEHICLES.find(v => v.id.toString() === id.toString()) || null;
    }
  }

  /**
   * Fetch launch vehicles by country
   */
  async getByCountry(countryId: string | number): Promise<LaunchVehicle[]> {
    if (this.useMockData) {
      return Promise.resolve(
        MOCK_LAUNCH_VEHICLES.filter(v => v.countryId.toString() === countryId.toString())
      );
    }
    try {
      const response = await this.axiosInstance.get<LaunchVehicle[]>(
        `/launch-vehicles/by-country/${countryId}`
      );
      return response.data;
    } catch (error) {
      console.warn('Launch vehicles by country API not available, using mock data');
      this.useMockData = true;
      return MOCK_LAUNCH_VEHICLES.filter(v => v.countryId.toString() === countryId.toString());
    }
  }

  /**
   * Fetch launch vehicles by status
   */
  async getByStatus(status: LaunchVehicleStatus): Promise<LaunchVehicle[]> {
    if (this.useMockData) {
      return Promise.resolve(MOCK_LAUNCH_VEHICLES.filter(v => v.status === status));
    }
    try {
      const response = await this.axiosInstance.get<LaunchVehicle[]>(
        `/launch-vehicles/by-status/${status}`
      );
      return response.data;
    } catch (error) {
      this.useMockData = true;
      return MOCK_LAUNCH_VEHICLES.filter(v => v.status === status);
    }
  }

  /**
   * Fetch only reusable launch vehicles
   */
  async getReusable(): Promise<LaunchVehicle[]> {
    if (this.useMockData) {
      return Promise.resolve(MOCK_LAUNCH_VEHICLES.filter(v => v.reusable));
    }
    try {
      const response = await this.axiosInstance.get<LaunchVehicle[]>('/launch-vehicles/reusable');
      return response.data;
    } catch (error) {
      this.useMockData = true;
      return MOCK_LAUNCH_VEHICLES.filter(v => v.reusable);
    }
  }

  /**
   * Fetch only human-rated launch vehicles
   */
  async getHumanRated(): Promise<LaunchVehicle[]> {
    if (this.useMockData) {
      return Promise.resolve(MOCK_LAUNCH_VEHICLES.filter(v => v.humanRated));
    }
    try {
      const response = await this.axiosInstance.get<LaunchVehicle[]>('/launch-vehicles/human-rated');
      return response.data;
    } catch (error) {
      this.useMockData = true;
      return MOCK_LAUNCH_VEHICLES.filter(v => v.humanRated);
    }
  }

  /**
   * Compare multiple launch vehicles
   */
  async compare(ids: (string | number)[]): Promise<LaunchVehicle[]> {
    if (this.useMockData) {
      return Promise.resolve(
        MOCK_LAUNCH_VEHICLES.filter(v => ids.map(String).includes(v.id.toString()))
      );
    }
    try {
      const response = await this.axiosInstance.get<LaunchVehicle[]>('/launch-vehicles/compare', {
        params: { ids: ids.join(',') },
      });
      return response.data;
    } catch (error) {
      this.useMockData = true;
      return MOCK_LAUNCH_VEHICLES.filter(v => ids.map(String).includes(v.id.toString()));
    }
  }

  /**
   * Get launch vehicle statistics
   */
  getStatistics(): {
    total: number;
    active: number;
    retired: number;
    development: number;
    reusable: number;
    humanRated: number;
    byCountry: Record<string, number>;
  } {
    const vehicles = MOCK_LAUNCH_VEHICLES;
    const byCountry: Record<string, number> = {};

    vehicles.forEach(v => {
      byCountry[v.countryId.toString()] = (byCountry[v.countryId.toString()] || 0) + 1;
    });

    return {
      total: vehicles.length,
      active: vehicles.filter(v => v.status === 'Active').length,
      retired: vehicles.filter(v => v.status === 'Retired').length,
      development: vehicles.filter(v => v.status === 'Development').length,
      reusable: vehicles.filter(v => v.reusable).length,
      humanRated: vehicles.filter(v => v.humanRated).length,
      byCountry,
    };
  }
}

// Export singleton instance
export const launchVehicleService = new LaunchVehicleService();
export default launchVehicleService;
