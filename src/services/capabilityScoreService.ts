import {
  Country,
  CapabilityScores,
  CapabilityCategory,
  SCIBreakdown,
  SCIMetric,
  SCIRankings,
  SCIComparison,
  SCITier,
  CATEGORY_WEIGHTS,
  SCI_TIER_THRESHOLDS
} from '../types';

/**
 * Space Capability Index (SCI) Scoring Service
 *
 * Implements comprehensive scoring algorithms for evaluating and ranking
 * national space programs across 7 capability categories.
 */

// ============================================================================
// MOCK DATA FOR COUNTRIES (enhanced with all scoring metrics)
// ============================================================================

const MOCK_COUNTRIES: Country[] = [
  {
    id: 'USA',
    name: 'United States',
    isoCode: 'USA',
    region: 'North America',
    spaceAgencyName: 'NASA',
    spaceAgencyAcronym: 'NASA',
    spaceAgencyFounded: 1958,
    annualBudgetUsd: 25400000000,
    budgetAsPercentOfGdp: 0.10,
    activeAstronauts: 44,
    totalSpaceAgencyEmployees: 18000,
    totalLaunches: 1520,
    successfulLaunches: 1463,
    launchSuccessRate: 96.3,
    humanSpaceflightCapable: true,
    independentLaunchCapable: true,
    reusableRocketCapable: true,
    deepSpaceCapable: true,
    spaceStationCapable: true,
    lunarLandingCapable: true,
    marsLandingCapable: true,
    overallCapabilityScore: 94.2,
  },
  {
    id: 'CHN',
    name: 'China',
    isoCode: 'CHN',
    region: 'Asia',
    spaceAgencyName: 'China National Space Administration',
    spaceAgencyAcronym: 'CNSA',
    spaceAgencyFounded: 1993,
    annualBudgetUsd: 12000000000,
    budgetAsPercentOfGdp: 0.07,
    activeAstronauts: 18,
    totalSpaceAgencyEmployees: 150000,
    totalLaunches: 450,
    successfulLaunches: 432,
    launchSuccessRate: 96.0,
    humanSpaceflightCapable: true,
    independentLaunchCapable: true,
    reusableRocketCapable: false,
    deepSpaceCapable: true,
    spaceStationCapable: true,
    lunarLandingCapable: true,
    marsLandingCapable: true,
    overallCapabilityScore: 82.5,
  },
  {
    id: 'RUS',
    name: 'Russia',
    isoCode: 'RUS',
    region: 'Europe',
    spaceAgencyName: 'Roscosmos',
    spaceAgencyAcronym: 'ROSCOSMOS',
    spaceAgencyFounded: 1992,
    annualBudgetUsd: 3500000000,
    budgetAsPercentOfGdp: 0.20,
    activeAstronauts: 25,
    totalSpaceAgencyEmployees: 170000,
    totalLaunches: 3250,
    successfulLaunches: 3120,
    launchSuccessRate: 96.0,
    humanSpaceflightCapable: true,
    independentLaunchCapable: true,
    reusableRocketCapable: false,
    deepSpaceCapable: true,
    spaceStationCapable: true,
    lunarLandingCapable: true,
    marsLandingCapable: false,
    overallCapabilityScore: 75.8,
  },
  {
    id: 'EUR',
    name: 'Europe (ESA)',
    isoCode: 'EUR',
    region: 'Europe',
    spaceAgencyName: 'European Space Agency',
    spaceAgencyAcronym: 'ESA',
    spaceAgencyFounded: 1975,
    annualBudgetUsd: 7500000000,
    budgetAsPercentOfGdp: 0.04,
    activeAstronauts: 7,
    totalSpaceAgencyEmployees: 2200,
    totalLaunches: 260,
    successfulLaunches: 248,
    launchSuccessRate: 95.4,
    humanSpaceflightCapable: false,
    independentLaunchCapable: true,
    reusableRocketCapable: false,
    deepSpaceCapable: true,
    spaceStationCapable: false,
    lunarLandingCapable: false,
    marsLandingCapable: false,
    overallCapabilityScore: 62.3,
  },
  {
    id: 'JPN',
    name: 'Japan',
    isoCode: 'JPN',
    region: 'Asia',
    spaceAgencyName: 'Japan Aerospace Exploration Agency',
    spaceAgencyAcronym: 'JAXA',
    spaceAgencyFounded: 2003,
    annualBudgetUsd: 2100000000,
    budgetAsPercentOfGdp: 0.05,
    activeAstronauts: 7,
    totalSpaceAgencyEmployees: 1500,
    totalLaunches: 98,
    successfulLaunches: 95,
    launchSuccessRate: 96.9,
    humanSpaceflightCapable: false,
    independentLaunchCapable: true,
    reusableRocketCapable: false,
    deepSpaceCapable: true,
    spaceStationCapable: false,
    lunarLandingCapable: true,
    marsLandingCapable: false,
    overallCapabilityScore: 58.2,
  },
  {
    id: 'IND',
    name: 'India',
    isoCode: 'IND',
    region: 'Asia',
    spaceAgencyName: 'Indian Space Research Organisation',
    spaceAgencyAcronym: 'ISRO',
    spaceAgencyFounded: 1969,
    annualBudgetUsd: 1800000000,
    budgetAsPercentOfGdp: 0.06,
    activeAstronauts: 4,
    totalSpaceAgencyEmployees: 17000,
    totalLaunches: 92,
    successfulLaunches: 85,
    launchSuccessRate: 92.4,
    humanSpaceflightCapable: false,
    independentLaunchCapable: true,
    reusableRocketCapable: false,
    deepSpaceCapable: true,
    spaceStationCapable: false,
    lunarLandingCapable: true,
    marsLandingCapable: false,
    overallCapabilityScore: 52.7,
  },
  {
    id: 'DEU',
    name: 'Germany',
    isoCode: 'DEU',
    region: 'Europe',
    spaceAgencyName: 'German Aerospace Center',
    spaceAgencyAcronym: 'DLR',
    spaceAgencyFounded: 1969,
    annualBudgetUsd: 2800000000,
    budgetAsPercentOfGdp: 0.07,
    activeAstronauts: 3,
    totalSpaceAgencyEmployees: 8500,
    totalLaunches: 0,
    successfulLaunches: 0,
    launchSuccessRate: 0,
    humanSpaceflightCapable: false,
    independentLaunchCapable: false,
    reusableRocketCapable: false,
    deepSpaceCapable: false,
    spaceStationCapable: false,
    lunarLandingCapable: false,
    marsLandingCapable: false,
    overallCapabilityScore: 35.4,
  },
  {
    id: 'FRA',
    name: 'France',
    isoCode: 'FRA',
    region: 'Europe',
    spaceAgencyName: 'Centre National d\'Études Spatiales',
    spaceAgencyAcronym: 'CNES',
    spaceAgencyFounded: 1961,
    annualBudgetUsd: 3300000000,
    budgetAsPercentOfGdp: 0.12,
    activeAstronauts: 4,
    totalSpaceAgencyEmployees: 2400,
    totalLaunches: 12,
    successfulLaunches: 11,
    launchSuccessRate: 91.7,
    humanSpaceflightCapable: false,
    independentLaunchCapable: true,
    reusableRocketCapable: false,
    deepSpaceCapable: false,
    spaceStationCapable: false,
    lunarLandingCapable: false,
    marsLandingCapable: false,
    overallCapabilityScore: 42.1,
  },
  {
    id: 'GBR',
    name: 'United Kingdom',
    isoCode: 'GBR',
    region: 'Europe',
    spaceAgencyName: 'UK Space Agency',
    spaceAgencyAcronym: 'UKSA',
    spaceAgencyFounded: 2010,
    annualBudgetUsd: 800000000,
    budgetAsPercentOfGdp: 0.03,
    activeAstronauts: 1,
    totalSpaceAgencyEmployees: 130,
    totalLaunches: 1,
    successfulLaunches: 0,
    launchSuccessRate: 0,
    humanSpaceflightCapable: false,
    independentLaunchCapable: true,
    reusableRocketCapable: false,
    deepSpaceCapable: false,
    spaceStationCapable: false,
    lunarLandingCapable: false,
    marsLandingCapable: false,
    overallCapabilityScore: 28.5,
  },
  {
    id: 'KOR',
    name: 'South Korea',
    isoCode: 'KOR',
    region: 'Asia',
    spaceAgencyName: 'Korea Aerospace Research Institute',
    spaceAgencyAcronym: 'KARI',
    spaceAgencyFounded: 1989,
    annualBudgetUsd: 700000000,
    budgetAsPercentOfGdp: 0.04,
    activeAstronauts: 0,
    totalSpaceAgencyEmployees: 1100,
    totalLaunches: 4,
    successfulLaunches: 3,
    launchSuccessRate: 75.0,
    humanSpaceflightCapable: false,
    independentLaunchCapable: true,
    reusableRocketCapable: false,
    deepSpaceCapable: false,
    spaceStationCapable: false,
    lunarLandingCapable: false,
    marsLandingCapable: false,
    overallCapabilityScore: 32.1,
  },
  {
    id: 'ISR',
    name: 'Israel',
    isoCode: 'ISR',
    region: 'Middle East',
    spaceAgencyName: 'Israel Space Agency',
    spaceAgencyAcronym: 'ISA',
    spaceAgencyFounded: 1983,
    annualBudgetUsd: 200000000,
    budgetAsPercentOfGdp: 0.05,
    activeAstronauts: 0,
    totalSpaceAgencyEmployees: 200,
    totalLaunches: 11,
    successfulLaunches: 9,
    launchSuccessRate: 81.8,
    humanSpaceflightCapable: false,
    independentLaunchCapable: true,
    reusableRocketCapable: false,
    deepSpaceCapable: false,
    spaceStationCapable: false,
    lunarLandingCapable: false,
    marsLandingCapable: false,
    overallCapabilityScore: 25.3,
  },
  {
    id: 'IRN',
    name: 'Iran',
    isoCode: 'IRN',
    region: 'Middle East',
    spaceAgencyName: 'Iranian Space Agency',
    spaceAgencyAcronym: 'ISA',
    spaceAgencyFounded: 2004,
    annualBudgetUsd: 100000000,
    budgetAsPercentOfGdp: 0.02,
    activeAstronauts: 0,
    totalSpaceAgencyEmployees: 500,
    totalLaunches: 15,
    successfulLaunches: 8,
    launchSuccessRate: 53.3,
    humanSpaceflightCapable: false,
    independentLaunchCapable: true,
    reusableRocketCapable: false,
    deepSpaceCapable: false,
    spaceStationCapable: false,
    lunarLandingCapable: false,
    marsLandingCapable: false,
    overallCapabilityScore: 18.7,
  },
];

// Extended country data for scoring metrics
const COUNTRY_METRICS: Record<string, {
  launchVehicles: number;
  activeLaunchVehicles: number;
  maxPayloadLeo: number;
  launchesLastYear: number;
  engineCount: number;
  maxIsp: number;
  maxChamberPressure: number;
  advancedCycleEngines: number;
  hasReusableEngine: boolean;
  propellantTypes: number;
  crewedMissions: number;
  longestMissionDays: number;
  lunarMissions: number;
  marsMissions: number;
  planetaryMissions: number;
  hasSampleReturn: boolean;
  maxProbeDistanceAU: number;
  activeSatellites: number;
  satelliteTypes: number;
  hasGNSS: boolean;
  hasMegaConstellation: boolean;
  launchSites: number;
  trackingStations: number;
  manufacturingCenters: number;
  indigenousTechScore: number;
}> = {
  USA: {
    launchVehicles: 12,
    activeLaunchVehicles: 8,
    maxPayloadLeo: 140000,
    launchesLastYear: 109,
    engineCount: 15,
    maxIsp: 452,
    maxChamberPressure: 300,
    advancedCycleEngines: 4,
    hasReusableEngine: true,
    propellantTypes: 4,
    crewedMissions: 180,
    longestMissionDays: 355,
    lunarMissions: 9,
    marsMissions: 12,
    planetaryMissions: 25,
    hasSampleReturn: true,
    maxProbeDistanceAU: 156,
    activeSatellites: 4500,
    satelliteTypes: 8,
    hasGNSS: true,
    hasMegaConstellation: true,
    launchSites: 6,
    trackingStations: 12,
    manufacturingCenters: 15,
    indigenousTechScore: 100,
  },
  CHN: {
    launchVehicles: 15,
    activeLaunchVehicles: 10,
    maxPayloadLeo: 70000,
    launchesLastYear: 67,
    engineCount: 12,
    maxIsp: 430,
    maxChamberPressure: 260,
    advancedCycleEngines: 3,
    hasReusableEngine: false,
    propellantTypes: 3,
    crewedMissions: 15,
    longestMissionDays: 180,
    lunarMissions: 6,
    marsMissions: 2,
    planetaryMissions: 3,
    hasSampleReturn: true,
    maxProbeDistanceAU: 1.5,
    activeSatellites: 700,
    satelliteTypes: 7,
    hasGNSS: true,
    hasMegaConstellation: false,
    launchSites: 4,
    trackingStations: 8,
    manufacturingCenters: 10,
    indigenousTechScore: 85,
  },
  RUS: {
    launchVehicles: 8,
    activeLaunchVehicles: 5,
    maxPayloadLeo: 23000,
    launchesLastYear: 19,
    engineCount: 10,
    maxIsp: 359,
    maxChamberPressure: 260,
    advancedCycleEngines: 4,
    hasReusableEngine: false,
    propellantTypes: 3,
    crewedMissions: 150,
    longestMissionDays: 437,
    lunarMissions: 25,
    marsMissions: 8,
    planetaryMissions: 18,
    hasSampleReturn: false,
    maxProbeDistanceAU: 1.5,
    activeSatellites: 200,
    satelliteTypes: 6,
    hasGNSS: true,
    hasMegaConstellation: false,
    launchSites: 3,
    trackingStations: 6,
    manufacturingCenters: 8,
    indigenousTechScore: 90,
  },
  EUR: {
    launchVehicles: 3,
    activeLaunchVehicles: 2,
    maxPayloadLeo: 21000,
    launchesLastYear: 5,
    engineCount: 4,
    maxIsp: 431,
    maxChamberPressure: 115,
    advancedCycleEngines: 0,
    hasReusableEngine: false,
    propellantTypes: 2,
    crewedMissions: 0,
    longestMissionDays: 0,
    lunarMissions: 1,
    marsMissions: 3,
    planetaryMissions: 8,
    hasSampleReturn: false,
    maxProbeDistanceAU: 50,
    activeSatellites: 150,
    satelliteTypes: 5,
    hasGNSS: true,
    hasMegaConstellation: false,
    launchSites: 1,
    trackingStations: 5,
    manufacturingCenters: 6,
    indigenousTechScore: 75,
  },
  JPN: {
    launchVehicles: 3,
    activeLaunchVehicles: 2,
    maxPayloadLeo: 16500,
    launchesLastYear: 3,
    engineCount: 4,
    maxIsp: 447,
    maxChamberPressure: 121,
    advancedCycleEngines: 1,
    hasReusableEngine: false,
    propellantTypes: 2,
    crewedMissions: 0,
    longestMissionDays: 0,
    lunarMissions: 2,
    marsMissions: 1,
    planetaryMissions: 4,
    hasSampleReturn: true,
    maxProbeDistanceAU: 3,
    activeSatellites: 100,
    satelliteTypes: 5,
    hasGNSS: true,
    hasMegaConstellation: false,
    launchSites: 2,
    trackingStations: 4,
    manufacturingCenters: 5,
    indigenousTechScore: 80,
  },
  IND: {
    launchVehicles: 4,
    activeLaunchVehicles: 3,
    maxPayloadLeo: 10000,
    launchesLastYear: 7,
    engineCount: 5,
    maxIsp: 460,
    maxChamberPressure: 60,
    advancedCycleEngines: 0,
    hasReusableEngine: false,
    propellantTypes: 2,
    crewedMissions: 0,
    longestMissionDays: 0,
    lunarMissions: 3,
    marsMissions: 1,
    planetaryMissions: 2,
    hasSampleReturn: false,
    maxProbeDistanceAU: 1.5,
    activeSatellites: 60,
    satelliteTypes: 4,
    hasGNSS: true,
    hasMegaConstellation: false,
    launchSites: 2,
    trackingStations: 3,
    manufacturingCenters: 3,
    indigenousTechScore: 70,
  },
  DEU: {
    launchVehicles: 0,
    activeLaunchVehicles: 0,
    maxPayloadLeo: 0,
    launchesLastYear: 0,
    engineCount: 2,
    maxIsp: 320,
    maxChamberPressure: 100,
    advancedCycleEngines: 0,
    hasReusableEngine: false,
    propellantTypes: 1,
    crewedMissions: 0,
    longestMissionDays: 0,
    lunarMissions: 0,
    marsMissions: 0,
    planetaryMissions: 0,
    hasSampleReturn: false,
    maxProbeDistanceAU: 0,
    activeSatellites: 45,
    satelliteTypes: 3,
    hasGNSS: false,
    hasMegaConstellation: false,
    launchSites: 0,
    trackingStations: 2,
    manufacturingCenters: 4,
    indigenousTechScore: 40,
  },
  FRA: {
    launchVehicles: 1,
    activeLaunchVehicles: 1,
    maxPayloadLeo: 1500,
    launchesLastYear: 2,
    engineCount: 2,
    maxIsp: 310,
    maxChamberPressure: 100,
    advancedCycleEngines: 0,
    hasReusableEngine: false,
    propellantTypes: 1,
    crewedMissions: 0,
    longestMissionDays: 0,
    lunarMissions: 0,
    marsMissions: 0,
    planetaryMissions: 1,
    hasSampleReturn: false,
    maxProbeDistanceAU: 0,
    activeSatellites: 50,
    satelliteTypes: 4,
    hasGNSS: false,
    hasMegaConstellation: false,
    launchSites: 1,
    trackingStations: 3,
    manufacturingCenters: 3,
    indigenousTechScore: 50,
  },
  GBR: {
    launchVehicles: 1,
    activeLaunchVehicles: 1,
    maxPayloadLeo: 500,
    launchesLastYear: 1,
    engineCount: 1,
    maxIsp: 343,
    maxChamberPressure: 0,
    advancedCycleEngines: 0,
    hasReusableEngine: false,
    propellantTypes: 1,
    crewedMissions: 0,
    longestMissionDays: 0,
    lunarMissions: 0,
    marsMissions: 0,
    planetaryMissions: 0,
    hasSampleReturn: false,
    maxProbeDistanceAU: 0,
    activeSatellites: 40,
    satelliteTypes: 3,
    hasGNSS: false,
    hasMegaConstellation: false,
    launchSites: 2,
    trackingStations: 1,
    manufacturingCenters: 2,
    indigenousTechScore: 35,
  },
  KOR: {
    launchVehicles: 2,
    activeLaunchVehicles: 1,
    maxPayloadLeo: 2600,
    launchesLastYear: 2,
    engineCount: 2,
    maxIsp: 315,
    maxChamberPressure: 60,
    advancedCycleEngines: 0,
    hasReusableEngine: false,
    propellantTypes: 1,
    crewedMissions: 0,
    longestMissionDays: 0,
    lunarMissions: 1,
    marsMissions: 0,
    planetaryMissions: 0,
    hasSampleReturn: false,
    maxProbeDistanceAU: 0.3,
    activeSatellites: 30,
    satelliteTypes: 3,
    hasGNSS: false,
    hasMegaConstellation: false,
    launchSites: 1,
    trackingStations: 2,
    manufacturingCenters: 2,
    indigenousTechScore: 45,
  },
  ISR: {
    launchVehicles: 1,
    activeLaunchVehicles: 1,
    maxPayloadLeo: 350,
    launchesLastYear: 1,
    engineCount: 1,
    maxIsp: 280,
    maxChamberPressure: 0,
    advancedCycleEngines: 0,
    hasReusableEngine: false,
    propellantTypes: 1,
    crewedMissions: 0,
    longestMissionDays: 0,
    lunarMissions: 1,
    marsMissions: 0,
    planetaryMissions: 0,
    hasSampleReturn: false,
    maxProbeDistanceAU: 0.3,
    activeSatellites: 20,
    satelliteTypes: 3,
    hasGNSS: false,
    hasMegaConstellation: false,
    launchSites: 1,
    trackingStations: 1,
    manufacturingCenters: 2,
    indigenousTechScore: 55,
  },
  IRN: {
    launchVehicles: 3,
    activeLaunchVehicles: 2,
    maxPayloadLeo: 500,
    launchesLastYear: 3,
    engineCount: 2,
    maxIsp: 270,
    maxChamberPressure: 0,
    advancedCycleEngines: 0,
    hasReusableEngine: false,
    propellantTypes: 1,
    crewedMissions: 0,
    longestMissionDays: 0,
    lunarMissions: 0,
    marsMissions: 0,
    planetaryMissions: 0,
    hasSampleReturn: false,
    maxProbeDistanceAU: 0,
    activeSatellites: 5,
    satelliteTypes: 2,
    hasGNSS: false,
    hasMegaConstellation: false,
    launchSites: 1,
    trackingStations: 1,
    manufacturingCenters: 1,
    indigenousTechScore: 30,
  },
};

// ============================================================================
// SCORING ALGORITHMS
// ============================================================================

/**
 * Calculate Launch Capability Score (0-100)
 *
 * Metrics:
 * - Active launch vehicles: 0-25 points
 * - Payload capacity (max to LEO): 0-25 points
 * - Launch frequency (per year): 0-25 points
 * - Success rate: 0-25 points
 */
function calculateLaunchCapability(country: Country): { score: number; metrics: SCIMetric[] } {
  const metrics = COUNTRY_METRICS[country.isoCode] || {
    activeLaunchVehicles: 0,
    maxPayloadLeo: 0,
    launchesLastYear: 0,
  };

  const vehicleScore = Math.min(25, metrics.activeLaunchVehicles * 3);
  const payloadScore = Math.min(25, (metrics.maxPayloadLeo / 140000) * 25);
  const frequencyScore = Math.min(25, (metrics.launchesLastYear / 100) * 25);
  const successScore = (country.launchSuccessRate || 0) * 0.25;

  const score = vehicleScore + payloadScore + frequencyScore + successScore;

  return {
    score: Math.round(score * 10) / 10,
    metrics: [
      { name: 'Active Launch Vehicles', value: metrics.activeLaunchVehicles, maxValue: 8, contribution: vehicleScore },
      { name: 'Max Payload to LEO', value: metrics.maxPayloadLeo, unit: 'kg', maxValue: 140000, contribution: payloadScore },
      { name: 'Launches Last Year', value: metrics.launchesLastYear, maxValue: 100, contribution: frequencyScore },
      { name: 'Success Rate', value: country.launchSuccessRate || 0, unit: '%', maxValue: 100, contribution: successScore },
    ]
  };
}

/**
 * Calculate Propulsion Technology Score (0-100)
 *
 * Metrics:
 * - Engine count: 0-15 points
 * - Propellant diversity: 0-20 points
 * - Max specific impulse: 0-20 points
 * - Max chamber pressure: 0-15 points
 * - Advanced cycles: 0-15 points
 * - Reusable capability: 0-15 points
 */
function calculatePropulsionTechnology(country: Country): { score: number; metrics: SCIMetric[] } {
  const metrics = COUNTRY_METRICS[country.isoCode] || {
    engineCount: 0,
    propellantTypes: 0,
    maxIsp: 0,
    maxChamberPressure: 0,
    advancedCycleEngines: 0,
    hasReusableEngine: false,
  };

  const engineScore = Math.min(15, metrics.engineCount * 1.5);
  const propellantScore = Math.min(20, metrics.propellantTypes * 5);
  const ispScore = Math.min(20, (metrics.maxIsp / 460) * 20);
  const pressureScore = Math.min(15, (metrics.maxChamberPressure / 300) * 15);
  const advancedScore = Math.min(15, metrics.advancedCycleEngines * 5);
  const reusableScore = metrics.hasReusableEngine ? 15 : 0;

  const score = engineScore + propellantScore + ispScore + pressureScore + advancedScore + reusableScore;

  return {
    score: Math.round(score * 10) / 10,
    metrics: [
      { name: 'Engine Count', value: metrics.engineCount, maxValue: 10, contribution: engineScore },
      { name: 'Propellant Types', value: metrics.propellantTypes, maxValue: 4, contribution: propellantScore },
      { name: 'Max ISP', value: metrics.maxIsp, unit: 's', maxValue: 460, contribution: ispScore },
      { name: 'Max Chamber Pressure', value: metrics.maxChamberPressure, unit: 'bar', maxValue: 300, contribution: pressureScore },
      { name: 'Advanced Cycle Engines', value: metrics.advancedCycleEngines, maxValue: 3, contribution: advancedScore },
      { name: 'Reusable Engine', value: metrics.hasReusableEngine, contribution: reusableScore },
    ]
  };
}

/**
 * Calculate Human Spaceflight Score (0-100)
 *
 * Metrics:
 * - Has capability: 0 or 30 points
 * - Total crewed missions: 0-20 points
 * - Active astronaut corps: 0-15 points
 * - Space station capability: 0-20 points
 * - Long-duration experience: 0-15 points
 */
function calculateHumanSpaceflight(country: Country): { score: number; metrics: SCIMetric[] } {
  if (!country.humanSpaceflightCapable) {
    return {
      score: 0,
      metrics: [
        { name: 'Human Spaceflight Capable', value: false, contribution: 0 },
        { name: 'Crewed Missions', value: 0, contribution: 0 },
        { name: 'Active Astronauts', value: 0, contribution: 0 },
        { name: 'Space Station Capable', value: false, contribution: 0 },
        { name: 'Longest Mission', value: 0, unit: 'days', contribution: 0 },
      ]
    };
  }

  const metrics = COUNTRY_METRICS[country.isoCode] || {
    crewedMissions: 0,
    longestMissionDays: 0,
  };

  const baseScore = 30;
  const missionScore = Math.min(20, metrics.crewedMissions * 0.15);
  const astronautScore = Math.min(15, (country.activeAstronauts || 0) * 0.5);
  const stationScore = country.spaceStationCapable ? 20 : 0;
  const durationScore = Math.min(15, (metrics.longestMissionDays / 365) * 15);

  const score = baseScore + missionScore + astronautScore + stationScore + durationScore;

  return {
    score: Math.round(score * 10) / 10,
    metrics: [
      { name: 'Human Spaceflight Capable', value: true, contribution: baseScore },
      { name: 'Crewed Missions', value: metrics.crewedMissions, maxValue: 150, contribution: missionScore },
      { name: 'Active Astronauts', value: country.activeAstronauts || 0, maxValue: 30, contribution: astronautScore },
      { name: 'Space Station Capable', value: country.spaceStationCapable, contribution: stationScore },
      { name: 'Longest Mission', value: metrics.longestMissionDays, unit: 'days', maxValue: 365, contribution: durationScore },
    ]
  };
}

/**
 * Calculate Deep Space Exploration Score (0-100)
 *
 * Metrics:
 * - Lunar missions: 0-25 points
 * - Mars missions: 0-25 points
 * - Other planetary missions: 0-20 points
 * - Sample return capability: 0-15 points
 * - Max probe distance: 0-15 points
 */
function calculateDeepSpaceExploration(country: Country): { score: number; metrics: SCIMetric[] } {
  const metrics = COUNTRY_METRICS[country.isoCode] || {
    lunarMissions: 0,
    marsMissions: 0,
    planetaryMissions: 0,
    hasSampleReturn: false,
    maxProbeDistanceAU: 0,
  };

  const lunarScore = Math.min(25, metrics.lunarMissions * 2.5);
  const marsScore = Math.min(25, metrics.marsMissions * 3);
  const planetaryScore = Math.min(20, metrics.planetaryMissions * 2);
  const sampleScore = metrics.hasSampleReturn ? 15 : 0;
  const distanceScore = Math.min(15, (Math.log10(metrics.maxProbeDistanceAU + 1) / Math.log10(160)) * 15);

  const score = lunarScore + marsScore + planetaryScore + sampleScore + distanceScore;

  return {
    score: Math.round(score * 10) / 10,
    metrics: [
      { name: 'Lunar Missions', value: metrics.lunarMissions, maxValue: 10, contribution: lunarScore },
      { name: 'Mars Missions', value: metrics.marsMissions, maxValue: 8, contribution: marsScore },
      { name: 'Planetary Missions', value: metrics.planetaryMissions, maxValue: 10, contribution: planetaryScore },
      { name: 'Sample Return', value: metrics.hasSampleReturn, contribution: sampleScore },
      { name: 'Max Probe Distance', value: metrics.maxProbeDistanceAU, unit: 'AU', maxValue: 156, contribution: distanceScore },
    ]
  };
}

/**
 * Calculate Satellite Infrastructure Score (0-100)
 *
 * Metrics:
 * - Active satellites: 0-25 points
 * - Satellite type diversity: 0-20 points
 * - Indigenous GNSS: 0-20 points
 * - Mega-constellation: 0-20 points
 * - Space station: 0-15 points
 */
function calculateSatelliteInfrastructure(country: Country): { score: number; metrics: SCIMetric[] } {
  const metrics = COUNTRY_METRICS[country.isoCode] || {
    activeSatellites: 0,
    satelliteTypes: 0,
    hasGNSS: false,
    hasMegaConstellation: false,
  };

  const countScore = Math.min(25, Math.log10(metrics.activeSatellites + 1) * 8);
  const diversityScore = Math.min(20, metrics.satelliteTypes * 3);
  const gnssScore = metrics.hasGNSS ? 20 : 0;
  const constellationScore = metrics.hasMegaConstellation ? 20 : 0;
  const stationScore = country.spaceStationCapable ? 15 : 0;

  const score = countScore + diversityScore + gnssScore + constellationScore + stationScore;

  return {
    score: Math.round(score * 10) / 10,
    metrics: [
      { name: 'Active Satellites', value: metrics.activeSatellites, maxValue: 4500, contribution: countScore },
      { name: 'Satellite Types', value: metrics.satelliteTypes, maxValue: 8, contribution: diversityScore },
      { name: 'Indigenous GNSS', value: metrics.hasGNSS, contribution: gnssScore },
      { name: 'Mega-Constellation', value: metrics.hasMegaConstellation, contribution: constellationScore },
      { name: 'Space Station', value: country.spaceStationCapable, contribution: stationScore },
    ]
  };
}

/**
 * Calculate Ground Infrastructure Score (0-100)
 *
 * Metrics:
 * - Launch sites: 0-30 points
 * - Tracking stations: 0-30 points
 * - Manufacturing centers: 0-40 points
 */
function calculateGroundInfrastructure(country: Country): { score: number; metrics: SCIMetric[] } {
  const metrics = COUNTRY_METRICS[country.isoCode] || {
    launchSites: 0,
    trackingStations: 0,
    manufacturingCenters: 0,
  };

  const launchScore = Math.min(30, metrics.launchSites * 5);
  const trackingScore = Math.min(30, metrics.trackingStations * 3);
  const manufacturingScore = Math.min(40, metrics.manufacturingCenters * 3);

  const score = launchScore + trackingScore + manufacturingScore;

  return {
    score: Math.round(score * 10) / 10,
    metrics: [
      { name: 'Launch Sites', value: metrics.launchSites, maxValue: 6, contribution: launchScore },
      { name: 'Tracking Stations', value: metrics.trackingStations, maxValue: 12, contribution: trackingScore },
      { name: 'Manufacturing Centers', value: metrics.manufacturingCenters, maxValue: 15, contribution: manufacturingScore },
    ]
  };
}

/**
 * Calculate Technological Independence Score (0-100)
 *
 * Based on indigenous technology development capability
 */
function calculateTechnologicalIndependence(country: Country): { score: number; metrics: SCIMetric[] } {
  const metrics = COUNTRY_METRICS[country.isoCode] || {
    indigenousTechScore: 0,
  };

  const score = metrics.indigenousTechScore;

  return {
    score: Math.round(score * 10) / 10,
    metrics: [
      { name: 'Indigenous Technology Score', value: metrics.indigenousTechScore, maxValue: 100, contribution: score },
    ]
  };
}

/**
 * Calculate overall SCI score from category scores
 */
function calculateOverallScore(categoryScores: CapabilityScores): number {
  return Math.round((
    categoryScores.launchCapability * 0.20 +
    categoryScores.propulsionTechnology * 0.15 +
    categoryScores.humanSpaceflight * 0.20 +
    categoryScores.deepSpaceExploration * 0.15 +
    categoryScores.satelliteInfrastructure * 0.15 +
    categoryScores.groundInfrastructure * 0.10 +
    categoryScores.technologicalIndependence * 0.05
  ) * 10) / 10;
}

/**
 * Determine tier based on score
 */
function determineTier(score: number): SCITier {
  for (const threshold of SCI_TIER_THRESHOLDS) {
    if (score >= threshold.minScore) {
      return threshold.tier;
    }
  }
  return 'Nascent';
}

/**
 * Identify strengths and weaknesses
 */
function identifyStrengthsWeaknesses(categoryScores: CapabilityScores): {
  strengths: CapabilityCategory[];
  weaknesses: CapabilityCategory[];
} {
  const scores = Object.entries(categoryScores) as [CapabilityCategory, number][];
  const sorted = [...scores].sort((a, b) => b[1] - a[1]);

  const strengths = sorted.slice(0, 2).filter(([, score]) => score >= 40).map(([cat]) => cat);
  const weaknesses = sorted.slice(-2).filter(([, score]) => score < 60).map(([cat]) => cat);

  return { strengths, weaknesses };
}

// ============================================================================
// SERVICE CLASS
// ============================================================================

class CapabilityScoreService {
  /**
   * Get all countries with their SCI breakdowns
   */
  async getAllCountries(): Promise<Country[]> {
    // In production, this would fetch from backend
    // For now, return mock data with calculated scores
    return MOCK_COUNTRIES.map(country => {
      const launch = calculateLaunchCapability(country);
      const propulsion = calculatePropulsionTechnology(country);
      const human = calculateHumanSpaceflight(country);
      const deepSpace = calculateDeepSpaceExploration(country);
      const satellite = calculateSatelliteInfrastructure(country);
      const ground = calculateGroundInfrastructure(country);
      const tech = calculateTechnologicalIndependence(country);

      const capabilityScores: CapabilityScores = {
        launchCapability: launch.score,
        propulsionTechnology: propulsion.score,
        humanSpaceflight: human.score,
        deepSpaceExploration: deepSpace.score,
        satelliteInfrastructure: satellite.score,
        groundInfrastructure: ground.score,
        technologicalIndependence: tech.score,
      };

      return {
        ...country,
        capabilityScores,
        overallCapabilityScore: calculateOverallScore(capabilityScores),
      };
    });
  }

  /**
   * Get SCI breakdown for a specific country
   */
  async getSCIBreakdown(countryId: string): Promise<SCIBreakdown | null> {
    const countries = await this.getAllCountries();
    const country = countries.find(c => c.isoCode === countryId || c.id === countryId);

    if (!country) return null;

    // Calculate all scores with metrics
    const launch = calculateLaunchCapability(country);
    const propulsion = calculatePropulsionTechnology(country);
    const human = calculateHumanSpaceflight(country);
    const deepSpace = calculateDeepSpaceExploration(country);
    const satellite = calculateSatelliteInfrastructure(country);
    const ground = calculateGroundInfrastructure(country);
    const tech = calculateTechnologicalIndependence(country);

    const capabilityScores: CapabilityScores = {
      launchCapability: launch.score,
      propulsionTechnology: propulsion.score,
      humanSpaceflight: human.score,
      deepSpaceExploration: deepSpace.score,
      satelliteInfrastructure: satellite.score,
      groundInfrastructure: ground.score,
      technologicalIndependence: tech.score,
    };

    const overallScore = calculateOverallScore(capabilityScores);
    const { strengths, weaknesses } = identifyStrengthsWeaknesses(capabilityScores);

    // Calculate ranks
    const sortedCountries = [...countries].sort(
      (a, b) => (b.overallCapabilityScore || 0) - (a.overallCapabilityScore || 0)
    );
    const globalRank = sortedCountries.findIndex(c => c.id === country.id) + 1;

    const regionalCountries = countries.filter(c => c.region === country.region);
    const sortedRegional = [...regionalCountries].sort(
      (a, b) => (b.overallCapabilityScore || 0) - (a.overallCapabilityScore || 0)
    );
    const regionalRank = sortedRegional.findIndex(c => c.id === country.id) + 1;

    // Build category scores with ranks
    const categoryScoresWithRanks: SCIBreakdown['categoryScores'] = [
      { category: 'launchCapability', score: launch.score, weightedScore: launch.score * 0.20, rank: 1, metrics: launch.metrics },
      { category: 'propulsionTechnology', score: propulsion.score, weightedScore: propulsion.score * 0.15, rank: 1, metrics: propulsion.metrics },
      { category: 'humanSpaceflight', score: human.score, weightedScore: human.score * 0.20, rank: 1, metrics: human.metrics },
      { category: 'deepSpaceExploration', score: deepSpace.score, weightedScore: deepSpace.score * 0.15, rank: 1, metrics: deepSpace.metrics },
      { category: 'satelliteInfrastructure', score: satellite.score, weightedScore: satellite.score * 0.15, rank: 1, metrics: satellite.metrics },
      { category: 'groundInfrastructure', score: ground.score, weightedScore: ground.score * 0.10, rank: 1, metrics: ground.metrics },
      { category: 'technologicalIndependence', score: tech.score, weightedScore: tech.score * 0.05, rank: 1, metrics: tech.metrics },
    ];

    return {
      countryId: country.id,
      countryName: country.name,
      overallScore,
      tier: determineTier(overallScore),
      categoryScores: categoryScoresWithRanks,
      globalRank,
      regionalRank,
      trend: 'stable',
      strengths,
      weaknesses,
    };
  }

  /**
   * Get global rankings
   */
  async getRankings(): Promise<SCIRankings> {
    const countries = await this.getAllCountries();
    const sortedCountries = [...countries].sort(
      (a, b) => (b.overallCapabilityScore || 0) - (a.overallCapabilityScore || 0)
    );

    const rankings: SCIBreakdown[] = [];
    for (let i = 0; i < sortedCountries.length; i++) {
      const country = sortedCountries[i];
      const breakdown = await this.getSCIBreakdown(String(country.id));
      if (breakdown) {
        breakdown.globalRank = i + 1;
        rankings.push(breakdown);
      }
    }

    const scores = countries.map(c => c.overallCapabilityScore || 0);
    const sortedScores = [...scores].sort((a, b) => b - a);

    return {
      rankings,
      lastUpdated: new Date().toISOString(),
      globalStatistics: {
        averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10) / 10,
        medianScore: sortedScores[Math.floor(sortedScores.length / 2)],
        topScore: sortedScores[0],
        bottomScore: sortedScores[sortedScores.length - 1],
        totalCountries: countries.length,
        countriesWithLaunchCapability: countries.filter(c => c.independentLaunchCapable).length,
        countriesWithHumanSpaceflight: countries.filter(c => c.humanSpaceflightCapable).length,
      },
    };
  }

  /**
   * Compare multiple countries
   */
  async compareCountries(countryIds: string[]): Promise<SCIComparison> {
    const breakdowns: SCIBreakdown[] = [];
    for (const id of countryIds) {
      const breakdown = await this.getSCIBreakdown(id);
      if (breakdown) breakdowns.push(breakdown);
    }

    const categories = CATEGORY_WEIGHTS.map(cw => cw.label);
    const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B'];

    const radarData = {
      categories,
      datasets: breakdowns.map((bd, i) => ({
        countryId: bd.countryId,
        countryName: bd.countryName,
        scores: bd.categoryScores.map(cs => cs.score),
        color: colors[i % colors.length],
      })),
    };

    const gapAnalysis = CATEGORY_WEIGHTS.map(cw => {
      const categoryScores = breakdowns.map(bd => ({
        countryId: bd.countryId,
        score: bd.categoryScores.find(cs => cs.category === cw.category)?.score || 0,
      }));

      const sorted = [...categoryScores].sort((a, b) => b.score - a.score);
      const leader = breakdowns.find(bd => bd.countryId === sorted[0].countryId);

      return {
        category: cw.category,
        leader: leader?.countryName || '',
        leaderScore: sorted[0].score,
        gaps: sorted.slice(1).map(s => ({
          countryId: s.countryId,
          gap: sorted[0].score - s.score,
        })),
      };
    });

    return {
      countries: breakdowns,
      radarData,
      gapAnalysis,
    };
  }

  /**
   * Get rankings by specific category
   */
  async getRankingsByCategory(category: CapabilityCategory): Promise<SCIBreakdown[]> {
    const { rankings } = await this.getRankings();

    return [...rankings].sort((a, b) => {
      const scoreA = a.categoryScores.find(cs => cs.category === category)?.score || 0;
      const scoreB = b.categoryScores.find(cs => cs.category === category)?.score || 0;
      return scoreB - scoreA;
    });
  }

  /**
   * Get category weight information
   */
  getCategoryWeights(): typeof CATEGORY_WEIGHTS {
    return CATEGORY_WEIGHTS;
  }

  /**
   * Get tier thresholds
   */
  getTierThresholds(): typeof SCI_TIER_THRESHOLDS {
    return SCI_TIER_THRESHOLDS;
  }
}

export const capabilityScoreService = new CapabilityScoreService();
export default capabilityScoreService;
