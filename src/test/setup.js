import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Mock data
export const mockCountries = [
  {
    id: 1,
    name: 'United States',
    isoCode: 'USA',
    region: 'North America',
    spaceAgencyName: 'National Aeronautics and Space Administration',
    spaceAgencyAcronym: 'NASA',
    humanSpaceflightCapable: true,
    independentLaunchCapable: true,
    reusableRocketCapable: true,
    deepSpaceCapable: true,
    spaceStationCapable: true,
    lunarLandingCapable: true,
    marsLandingCapable: true,
    overallCapabilityScore: 95,
    totalLaunches: 500,
    launchSuccessRate: 95.5,
  },
  {
    id: 2,
    name: 'China',
    isoCode: 'CHN',
    region: 'Asia',
    spaceAgencyName: 'China National Space Administration',
    spaceAgencyAcronym: 'CNSA',
    humanSpaceflightCapable: true,
    independentLaunchCapable: true,
    reusableRocketCapable: false,
    deepSpaceCapable: true,
    spaceStationCapable: true,
    lunarLandingCapable: true,
    marsLandingCapable: true,
    overallCapabilityScore: 85,
    totalLaunches: 300,
    launchSuccessRate: 94.2,
  },
];

export const mockEngines = [
  {
    id: 1,
    name: 'Merlin 1D',
    designer: 'SpaceX',
    type: 'Gas Generator',
    isp: 311,
    twr: 180,
    propellant: 'LOX/RP-1',
    status: 'Active',
    thrustKn: 845,
    reusable: true,
    advancedCycle: false,
    throttleCapable: true,
    restartCapable: true,
    sophisticationScore: 85,
  },
  {
    id: 2,
    name: 'Raptor 2',
    designer: 'SpaceX',
    type: 'Full-Flow Staged Combustion',
    isp: 363,
    twr: 200,
    propellant: 'LOX/CH4',
    status: 'Active',
    thrustKn: 2300,
    reusable: true,
    advancedCycle: true,
    throttleCapable: true,
    restartCapable: true,
    sophisticationScore: 98,
  },
];

export const mockVehicles = [
  {
    id: 1,
    name: 'Falcon 9',
    manufacturer: 'SpaceX',
    status: 'Active',
    payloadToLeoKg: 22800,
    totalLaunches: 250,
    successRate: 0.98,
    reusable: true,
    humanRated: true,
  },
];

export const mockMissions = [
  {
    id: 1,
    name: 'Apollo 11',
    countryId: 'USA',
    launchDate: '1969-07-16',
    status: 'COMPLETED',
    missionType: 'CREWED_LUNAR',
    destination: 'LUNAR_SURFACE',
    crewed: true,
    crewSize: 3,
    description: 'First crewed lunar landing mission',
  },
];

// API handlers for MSW - match the default API URL from constants
const API_BASE = 'http://localhost:8080/api';

export const handlers = [
  // Countries
  http.get(`${API_BASE}/countries`, () => {
    return HttpResponse.json({
      content: mockCountries,
      totalElements: mockCountries.length,
      totalPages: 1,
      size: 500,
      number: 0,
    });
  }),

  http.get(`${API_BASE}/countries/:code`, ({ params }) => {
    const country = mockCountries.find(c => c.isoCode === params.code);
    if (!country) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(country);
  }),

  http.get(`${API_BASE}/countries/:code/details`, ({ params }) => {
    const country = mockCountries.find(c => c.isoCode === params.code);
    if (!country) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json({
      country,
      engines: mockEngines,
      vehicles: mockVehicles,
      missions: mockMissions,
      milestones: [],
    });
  }),

  // Engines
  http.get(`${API_BASE}/engines`, () => {
    return HttpResponse.json({
      content: mockEngines,
      totalElements: mockEngines.length,
      totalPages: 1,
      size: 500,
      number: 0,
    });
  }),

  http.get(`${API_BASE}/engines/:id`, ({ params }) => {
    const engine = mockEngines.find(e => e.id === Number(params.id));
    if (!engine) {
      return new HttpResponse(null, { status: 404 });
    }
    return HttpResponse.json(engine);
  }),

  // Launch Vehicles
  http.get(`${API_BASE}/launch-vehicles`, () => {
    return HttpResponse.json({
      content: mockVehicles,
      totalElements: mockVehicles.length,
      totalPages: 1,
      size: 500,
      number: 0,
    });
  }),

  // Missions
  http.get(`${API_BASE}/missions`, () => {
    return HttpResponse.json({
      content: mockMissions,
      totalElements: mockMissions.length,
      totalPages: 1,
      size: 500,
      number: 0,
    });
  }),
];

// Setup MSW server
export const server = setupServer(...handlers);

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));

// Reset handlers after each test
afterEach(() => {
  cleanup();
  server.resetHandlers();
});

// Close server after all tests
afterAll(() => server.close());
