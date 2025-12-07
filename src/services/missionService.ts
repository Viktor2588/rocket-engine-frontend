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

/**
 * Space Mission Service
 *
 * Provides space mission data and tracking functionality with API integration
 */

// ============================================================================
// MOCK MISSION DATA (Fallback)
// ============================================================================

const MOCK_MISSIONS: SpaceMission[] = [
  // ============================================================================
  // USA MISSIONS
  // ============================================================================
  {
    id: 'apollo-11',
    name: 'Apollo 11',
    missionDesignation: 'AS-506',
    countryId: 'USA',
    launchVehicleName: 'Saturn V',
    launchDate: '1969-07-16',
    endDate: '1969-07-24',
    durationDays: 8,
    status: 'Completed',
    missionType: 'CREWED_LUNAR',
    destination: 'LUNAR_SURFACE',
    crewed: true,
    crewSize: 3,
    crewNames: ['Neil Armstrong', 'Buzz Aldrin', 'Michael Collins'],
    isHistoricFirst: true,
    historicFirstType: 'First crewed Moon landing',
    description: 'First crewed mission to land on the Moon. Neil Armstrong and Buzz Aldrin became the first humans to walk on the lunar surface.',
    outcomes: 'Successful lunar landing, 21.5 kg lunar samples returned',
    objectives: ['Land humans on Moon', 'Return safely to Earth', 'Collect lunar samples'],
    launchSite: 'Kennedy Space Center LC-39A',
    successLevel: 'Full',
    wikiUrl: 'https://en.wikipedia.org/wiki/Apollo_11'
  },
  {
    id: 'voyager-1',
    name: 'Voyager 1',
    countryId: 'USA',
    launchVehicleName: 'Titan IIIE',
    launchDate: '1977-09-05',
    status: 'Active',
    missionType: 'DEEP_SPACE_PROBE',
    destination: 'INTERSTELLAR',
    crewed: false,
    isHistoricFirst: true,
    historicFirstType: 'First spacecraft to reach interstellar space',
    description: 'Voyager 1 is the farthest human-made object from Earth, having entered interstellar space in 2012.',
    outcomes: 'Continuing to transmit data from interstellar space',
    objectives: ['Study outer planets', 'Enter interstellar space'],
    launchSite: 'Cape Canaveral LC-41',
    successLevel: 'Full',
    wikiUrl: 'https://en.wikipedia.org/wiki/Voyager_1'
  },
  {
    id: 'mars-2020',
    name: 'Mars 2020 (Perseverance)',
    countryId: 'USA',
    launchVehicleName: 'Atlas V 541',
    launchDate: '2020-07-30',
    status: 'Active',
    missionType: 'MARS_ROVER',
    destination: 'MARS_SURFACE',
    crewed: false,
    description: 'NASA Mars rover mission carrying the Perseverance rover and Ingenuity helicopter.',
    outcomes: 'Ongoing surface operations, first Mars helicopter flights',
    objectives: ['Search for signs of ancient life', 'Collect samples for future return', 'Test technologies'],
    launchSite: 'Cape Canaveral SLC-41',
    successLevel: 'Full',
    wikiUrl: 'https://en.wikipedia.org/wiki/Mars_2020'
  },
  {
    id: 'crew-dragon-demo-2',
    name: 'Crew Dragon Demo-2',
    countryId: 'USA',
    launchVehicleName: 'Falcon 9 Block 5',
    launchDate: '2020-05-30',
    endDate: '2020-08-02',
    durationDays: 64,
    status: 'Completed',
    missionType: 'CREWED_ORBITAL',
    destination: 'LEO',
    crewed: true,
    crewSize: 2,
    crewNames: ['Doug Hurley', 'Bob Behnken'],
    isHistoricFirst: true,
    historicFirstType: 'First commercial crewed mission to ISS',
    description: 'First crewed mission of SpaceX Crew Dragon spacecraft to the ISS.',
    outcomes: 'Successful docking with ISS, return to Earth',
    objectives: ['Demonstrate commercial crew capability', 'Transport crew to ISS'],
    launchSite: 'Kennedy Space Center LC-39A',
    successLevel: 'Full',
    wikiUrl: 'https://en.wikipedia.org/wiki/Crew_Dragon_Demo-2'
  },
  {
    id: 'jwst',
    name: 'James Webb Space Telescope',
    countryId: 'USA',
    launchVehicleName: 'Ariane 5 ECA',
    launchDate: '2021-12-25',
    status: 'Active',
    missionType: 'SCIENTIFIC',
    destination: 'EARTH_MOON_L2',
    crewed: false,
    description: 'Space telescope designed to conduct infrared astronomy, successor to Hubble.',
    outcomes: 'Revolutionary observations of distant galaxies and exoplanets',
    objectives: ['Study early universe', 'Observe exoplanet atmospheres', 'Study star formation'],
    launchSite: 'Guiana Space Centre ELA-3',
    successLevel: 'Full',
    wikiUrl: 'https://en.wikipedia.org/wiki/James_Webb_Space_Telescope'
  },
  {
    id: 'artemis-1',
    name: 'Artemis I',
    countryId: 'USA',
    launchVehicleName: 'SLS Block 1',
    launchDate: '2022-11-16',
    endDate: '2022-12-11',
    durationDays: 25,
    status: 'Completed',
    missionType: 'LUNAR_ORBITER',
    destination: 'LUNAR_ORBIT',
    crewed: false,
    description: 'First uncrewed test flight of the Space Launch System and Orion spacecraft.',
    outcomes: 'Successful lunar flyby and return',
    objectives: ['Test SLS and Orion', 'Demonstrate distant retrograde orbit'],
    launchSite: 'Kennedy Space Center LC-39B',
    successLevel: 'Full',
    wikiUrl: 'https://en.wikipedia.org/wiki/Artemis_1'
  },

  // ============================================================================
  // RUSSIA/USSR MISSIONS
  // ============================================================================
  {
    id: 'sputnik-1',
    name: 'Sputnik 1',
    countryId: 'RUS',
    launchVehicleName: 'Sputnik-PS',
    launchDate: '1957-10-04',
    endDate: '1958-01-04',
    durationDays: 92,
    status: 'Completed',
    missionType: 'TECHNOLOGY_DEMO',
    destination: 'LEO',
    crewed: false,
    isHistoricFirst: true,
    historicFirstType: 'First artificial satellite',
    description: 'First artificial satellite to orbit Earth, marking the start of the Space Age.',
    outcomes: 'Transmitted radio signals for 21 days',
    objectives: ['Demonstrate satellite technology', 'Study upper atmosphere'],
    launchSite: 'Baikonur Cosmodrome',
    successLevel: 'Full',
    wikiUrl: 'https://en.wikipedia.org/wiki/Sputnik_1'
  },
  {
    id: 'vostok-1',
    name: 'Vostok 1',
    countryId: 'RUS',
    launchVehicleName: 'Vostok-K',
    launchDate: '1961-04-12',
    endDate: '1961-04-12',
    durationDays: 1,
    status: 'Completed',
    missionType: 'CREWED_ORBITAL',
    destination: 'LEO',
    crewed: true,
    crewSize: 1,
    crewNames: ['Yuri Gagarin'],
    isHistoricFirst: true,
    historicFirstType: 'First human in space',
    description: 'First human spaceflight. Yuri Gagarin orbited Earth once.',
    outcomes: 'Single orbit completed successfully',
    objectives: ['First human spaceflight', 'Demonstrate human survivability in space'],
    launchSite: 'Baikonur Cosmodrome',
    successLevel: 'Full',
    wikiUrl: 'https://en.wikipedia.org/wiki/Vostok_1'
  },
  {
    id: 'luna-9',
    name: 'Luna 9',
    countryId: 'RUS',
    launchVehicleName: 'Molniya-M',
    launchDate: '1966-01-31',
    endDate: '1966-02-06',
    durationDays: 6,
    status: 'Completed',
    missionType: 'LUNAR_LANDER',
    destination: 'LUNAR_SURFACE',
    crewed: false,
    isHistoricFirst: true,
    historicFirstType: 'First soft landing on the Moon',
    description: 'First spacecraft to achieve a soft landing on the Moon.',
    outcomes: 'First lunar surface images transmitted',
    objectives: ['Soft land on Moon', 'Transmit surface images'],
    launchSite: 'Baikonur Cosmodrome',
    successLevel: 'Full',
    wikiUrl: 'https://en.wikipedia.org/wiki/Luna_9'
  },
  {
    id: 'mir',
    name: 'Mir Space Station',
    countryId: 'RUS',
    launchVehicleName: 'Proton-K',
    launchDate: '1986-02-20',
    endDate: '2001-03-23',
    durationDays: 5511,
    status: 'Completed',
    missionType: 'SPACE_STATION',
    destination: 'LEO',
    crewed: true,
    description: 'First modular space station, operated for over 15 years.',
    outcomes: 'Long-duration spaceflight research, international cooperation',
    objectives: ['Long-duration spaceflight', 'Scientific research', 'International cooperation'],
    launchSite: 'Baikonur Cosmodrome',
    successLevel: 'Full',
    wikiUrl: 'https://en.wikipedia.org/wiki/Mir'
  },

  // ============================================================================
  // CHINA MISSIONS
  // ============================================================================
  {
    id: 'shenzhou-5',
    name: 'Shenzhou 5',
    countryId: 'CHN',
    launchVehicleName: 'Long March 2F',
    launchDate: '2003-10-15',
    endDate: '2003-10-16',
    durationDays: 1,
    status: 'Completed',
    missionType: 'CREWED_ORBITAL',
    destination: 'LEO',
    crewed: true,
    crewSize: 1,
    crewNames: ['Yang Liwei'],
    isHistoricFirst: true,
    historicFirstType: 'First Chinese human spaceflight',
    description: 'First Chinese crewed spaceflight, making China the third country to independently launch a human into space.',
    outcomes: '14 orbits completed',
    objectives: ['First Chinese crewed spaceflight', 'Demonstrate crewed spacecraft'],
    launchSite: 'Jiuquan Satellite Launch Center',
    successLevel: 'Full',
    wikiUrl: 'https://en.wikipedia.org/wiki/Shenzhou_5'
  },
  {
    id: 'chang-e-4',
    name: "Chang'e 4",
    countryId: 'CHN',
    launchVehicleName: 'Long March 3B',
    launchDate: '2018-12-08',
    status: 'Active',
    missionType: 'LUNAR_LANDER',
    destination: 'LUNAR_SURFACE',
    crewed: false,
    isHistoricFirst: true,
    historicFirstType: 'First landing on lunar far side',
    description: 'First mission to land on the far side of the Moon.',
    outcomes: 'Ongoing operations on lunar far side',
    objectives: ['First far side landing', 'Study lunar geology', 'Radio astronomy'],
    launchSite: 'Xichang Satellite Launch Center',
    successLevel: 'Full',
    wikiUrl: 'https://en.wikipedia.org/wiki/Chang%27e_4'
  },
  {
    id: 'tianwen-1',
    name: 'Tianwen-1',
    countryId: 'CHN',
    launchVehicleName: 'Long March 5',
    launchDate: '2020-07-23',
    status: 'Active',
    missionType: 'MARS_ROVER',
    destination: 'MARS_SURFACE',
    crewed: false,
    description: "China's first Mars mission, including orbiter, lander, and Zhurong rover.",
    outcomes: 'Successful Mars orbit and surface operations',
    objectives: ['Study Mars geology', 'Search for water', 'Atmospheric research'],
    launchSite: 'Wenchang Space Launch Site',
    successLevel: 'Full',
    wikiUrl: 'https://en.wikipedia.org/wiki/Tianwen-1'
  },
  {
    id: 'tiangong',
    name: 'Chinese Space Station',
    countryId: 'CHN',
    launchVehicleName: 'Long March 5B',
    launchDate: '2021-04-29',
    status: 'Active',
    missionType: 'SPACE_STATION',
    destination: 'LEO',
    crewed: true,
    description: "China's modular space station, operational since 2022.",
    outcomes: 'Ongoing crewed operations',
    objectives: ['Long-duration spaceflight', 'Scientific research', 'Technology demonstration'],
    launchSite: 'Wenchang Space Launch Site',
    successLevel: 'Full',
    wikiUrl: 'https://en.wikipedia.org/wiki/Tiangong_space_station'
  },

  // ============================================================================
  // ESA/EUROPE MISSIONS
  // ============================================================================
  {
    id: 'rosetta',
    name: 'Rosetta',
    countryId: 'EUR',
    launchVehicleName: 'Ariane 5 G+',
    launchDate: '2004-03-02',
    endDate: '2016-09-30',
    durationDays: 4565,
    status: 'Completed',
    missionType: 'ASTEROID_MISSION',
    destination: 'COMET',
    crewed: false,
    isHistoricFirst: true,
    historicFirstType: 'First comet landing',
    description: 'First spacecraft to orbit and land on a comet (67P/Churyumov-Gerasimenko).',
    outcomes: 'Extensive comet data, Philae landing',
    objectives: ['Orbit comet', 'Deploy lander', 'Study comet composition'],
    launchSite: 'Guiana Space Centre',
    successLevel: 'Full',
    wikiUrl: 'https://en.wikipedia.org/wiki/Rosetta_(spacecraft)'
  },
  {
    id: 'juice',
    name: 'JUICE',
    countryId: 'EUR',
    launchVehicleName: 'Ariane 5 ECA',
    launchDate: '2023-04-14',
    status: 'Active',
    missionType: 'PLANETARY_PROBE',
    destination: 'JUPITER',
    crewed: false,
    description: 'Jupiter Icy Moons Explorer mission to study Jupiter and its moons.',
    outcomes: 'En route to Jupiter (arrival 2031)',
    objectives: ['Study Ganymede', 'Study Europa', 'Study Callisto'],
    launchSite: 'Guiana Space Centre',
    successLevel: 'Full',
    wikiUrl: 'https://en.wikipedia.org/wiki/Jupiter_Icy_Moons_Explorer'
  },

  // ============================================================================
  // JAPAN MISSIONS
  // ============================================================================
  {
    id: 'hayabusa2',
    name: 'Hayabusa2',
    countryId: 'JPN',
    launchVehicleName: 'H-IIA',
    launchDate: '2014-12-03',
    endDate: '2020-12-06',
    durationDays: 2195,
    status: 'Completed',
    missionType: 'SAMPLE_RETURN',
    destination: 'ASTEROID',
    crewed: false,
    description: 'Sample return mission to asteroid Ryugu.',
    outcomes: '5.4g of asteroid samples returned',
    objectives: ['Land on asteroid', 'Collect samples', 'Return samples to Earth'],
    launchSite: 'Tanegashima Space Center',
    successLevel: 'Full',
    wikiUrl: 'https://en.wikipedia.org/wiki/Hayabusa2'
  },

  // ============================================================================
  // INDIA MISSIONS
  // ============================================================================
  {
    id: 'chandrayaan-3',
    name: 'Chandrayaan-3',
    countryId: 'IND',
    launchVehicleName: 'LVM3',
    launchDate: '2023-07-14',
    status: 'Completed',
    missionType: 'LUNAR_LANDER',
    destination: 'LUNAR_SURFACE',
    crewed: false,
    isHistoricFirst: true,
    historicFirstType: 'First Indian lunar landing',
    description: "India's first successful lunar landing mission.",
    outcomes: 'Successful soft landing near lunar south pole',
    objectives: ['Demonstrate soft landing', 'Deploy Pragyan rover', 'Study lunar surface'],
    launchSite: 'Satish Dhawan Space Centre',
    successLevel: 'Full',
    wikiUrl: 'https://en.wikipedia.org/wiki/Chandrayaan-3'
  },
  {
    id: 'mangalyaan',
    name: 'Mars Orbiter Mission',
    countryId: 'IND',
    launchVehicleName: 'PSLV-XL',
    launchDate: '2013-11-05',
    endDate: '2022-10-03',
    status: 'Completed',
    missionType: 'MARS_ORBITER',
    destination: 'MARS_ORBIT',
    crewed: false,
    isHistoricFirst: true,
    historicFirstType: 'First Asian Mars orbiter',
    description: "India's first interplanetary mission. First Asian country to reach Mars.",
    outcomes: 'Successful Mars orbit for 8 years',
    objectives: ['Demonstrate Mars orbit capability', 'Study Mars atmosphere'],
    launchSite: 'Satish Dhawan Space Centre',
    successLevel: 'Full',
    wikiUrl: 'https://en.wikipedia.org/wiki/Mars_Orbiter_Mission'
  },

  // ============================================================================
  // UPCOMING/PLANNED MISSIONS
  // ============================================================================
  {
    id: 'artemis-2',
    name: 'Artemis II',
    countryId: 'USA',
    launchVehicleName: 'SLS Block 1',
    launchDate: '2025-09-01',
    status: 'Planned',
    missionType: 'CREWED_LUNAR',
    destination: 'LUNAR_ORBIT',
    crewed: true,
    crewSize: 4,
    crewNames: ['Reid Wiseman', 'Victor Glover', 'Christina Koch', 'Jeremy Hansen'],
    description: 'First crewed Artemis mission, will fly around the Moon.',
    objectives: ['First crewed lunar mission since Apollo', 'Test Orion life support'],
    launchSite: 'Kennedy Space Center LC-39B',
    wikiUrl: 'https://en.wikipedia.org/wiki/Artemis_2'
  },
  {
    id: 'artemis-3',
    name: 'Artemis III',
    countryId: 'USA',
    launchVehicleName: 'SLS Block 1',
    launchDate: '2026-09-01',
    status: 'Planned',
    missionType: 'CREWED_LUNAR',
    destination: 'LUNAR_SURFACE',
    crewed: true,
    crewSize: 4,
    description: 'First crewed lunar landing since Apollo 17, including first woman on Moon.',
    objectives: ['Land humans on Moon', 'First woman on Moon', 'Explore lunar south pole'],
    launchSite: 'Kennedy Space Center LC-39B',
    wikiUrl: 'https://en.wikipedia.org/wiki/Artemis_3'
  }
];

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
    if (this.useMockData) {
      return this.sortByLaunchDate(MOCK_MISSIONS);
    }
    try {
      const response = await this.axiosInstance.get<SpaceMission[]>('/missions');
      return this.sortByLaunchDate(response.data);
    } catch (error) {
      console.warn('Falling back to mock mission data');
      this.useMockData = true;
      return this.sortByLaunchDate(MOCK_MISSIONS);
    }
  }

  // Legacy method name for compatibility
  getAllMissions(): Promise<SpaceMission[]> {
    return this.getAll();
  }

  async getById(id: string | number): Promise<SpaceMission | undefined> {
    if (this.useMockData) {
      return MOCK_MISSIONS.find(m => m.id === id);
    }
    try {
      const response = await this.axiosInstance.get<SpaceMission>(`/missions/${id}`);
      return response.data;
    } catch (error) {
      return MOCK_MISSIONS.find(m => m.id === id);
    }
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
