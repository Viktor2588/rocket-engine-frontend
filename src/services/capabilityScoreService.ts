import axios, { AxiosInstance } from 'axios';
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
import { API_CONFIG } from '../constants';

/**
 * Space Capability Index (SCI) Scoring Service
 *
 * Implements comprehensive scoring algorithms for evaluating and ranking
 * national space programs across 7 capability categories.
 *
 * Fetches country data from the backend API and calculates SCI scores
 * using the scoring algorithms defined below.
 */

// ============================================================================
// COUNTRY METRICS DATA (detailed metrics for scoring calculations)
// This supplements the API data with detailed scoring metrics
// ============================================================================

interface CountryMetrics {
  activeLaunchVehicles: number;
  maxPayloadLeo: number;
  launchesLastYear: number;
  engineCount: number;
  propellantTypes: number;
  maxIsp: number;
  maxChamberPressure: number;
  advancedCycleEngines: number;
  hasReusableEngine: boolean;
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
}

const COUNTRY_METRICS: Record<string, Partial<CountryMetrics>> = {
  USA: {
    activeLaunchVehicles: 8,
    maxPayloadLeo: 140000,
    launchesLastYear: 92,
    engineCount: 10,
    propellantTypes: 4,
    maxIsp: 465,
    maxChamberPressure: 300,
    advancedCycleEngines: 3,
    hasReusableEngine: true,
    crewedMissions: 166,
    longestMissionDays: 340,
    lunarMissions: 10,
    marsMissions: 9,
    planetaryMissions: 12,
    hasSampleReturn: true,
    maxProbeDistanceAU: 156,
    activeSatellites: 4500,
    satelliteTypes: 8,
    hasGNSS: true,
    hasMegaConstellation: true,
    launchSites: 6,
    trackingStations: 12,
    manufacturingCenters: 15,
    indigenousTechScore: 95,
  },
  CHN: {
    activeLaunchVehicles: 6,
    maxPayloadLeo: 25000,
    launchesLastYear: 64,
    engineCount: 8,
    propellantTypes: 3,
    maxIsp: 430,
    maxChamberPressure: 180,
    advancedCycleEngines: 2,
    hasReusableEngine: false,
    crewedMissions: 15,
    longestMissionDays: 183,
    lunarMissions: 6,
    marsMissions: 2,
    planetaryMissions: 3,
    hasSampleReturn: true,
    maxProbeDistanceAU: 1.5,
    activeSatellites: 600,
    satelliteTypes: 7,
    hasGNSS: true,
    hasMegaConstellation: false,
    launchSites: 4,
    trackingStations: 8,
    manufacturingCenters: 12,
    indigenousTechScore: 85,
  },
  RUS: {
    activeLaunchVehicles: 5,
    maxPayloadLeo: 22000,
    launchesLastYear: 22,
    engineCount: 12,
    propellantTypes: 4,
    maxIsp: 338,
    maxChamberPressure: 267,
    advancedCycleEngines: 5,
    hasReusableEngine: false,
    crewedMissions: 140,
    longestMissionDays: 437,
    lunarMissions: 5,
    marsMissions: 3,
    planetaryMissions: 8,
    hasSampleReturn: false,
    maxProbeDistanceAU: 30,
    activeSatellites: 200,
    satelliteTypes: 6,
    hasGNSS: true,
    hasMegaConstellation: false,
    launchSites: 3,
    trackingStations: 10,
    manufacturingCenters: 8,
    indigenousTechScore: 75,
  },
  EUR: {
    activeLaunchVehicles: 2,
    maxPayloadLeo: 21000,
    launchesLastYear: 6,
    engineCount: 4,
    propellantTypes: 2,
    maxIsp: 465,
    maxChamberPressure: 116,
    advancedCycleEngines: 0,
    hasReusableEngine: false,
    crewedMissions: 0,
    longestMissionDays: 0,
    lunarMissions: 1,
    marsMissions: 2,
    planetaryMissions: 5,
    hasSampleReturn: false,
    maxProbeDistanceAU: 45,
    activeSatellites: 250,
    satelliteTypes: 6,
    hasGNSS: true,
    hasMegaConstellation: false,
    launchSites: 2,
    trackingStations: 8,
    manufacturingCenters: 6,
    indigenousTechScore: 70,
  },
  JPN: {
    activeLaunchVehicles: 2,
    maxPayloadLeo: 16500,
    launchesLastYear: 3,
    engineCount: 3,
    propellantTypes: 2,
    maxIsp: 447,
    maxChamberPressure: 100,
    advancedCycleEngines: 0,
    hasReusableEngine: false,
    crewedMissions: 0,
    longestMissionDays: 0,
    lunarMissions: 2,
    marsMissions: 0,
    planetaryMissions: 2,
    hasSampleReturn: true,
    maxProbeDistanceAU: 2,
    activeSatellites: 180,
    satelliteTypes: 5,
    hasGNSS: true,
    hasMegaConstellation: false,
    launchSites: 2,
    trackingStations: 5,
    manufacturingCenters: 4,
    indigenousTechScore: 72,
  },
  IND: {
    activeLaunchVehicles: 3,
    maxPayloadLeo: 8000,
    launchesLastYear: 8,
    engineCount: 4,
    propellantTypes: 3,
    maxIsp: 442,
    maxChamberPressure: 60,
    advancedCycleEngines: 0,
    hasReusableEngine: false,
    crewedMissions: 0,
    longestMissionDays: 0,
    lunarMissions: 3,
    marsMissions: 1,
    planetaryMissions: 0,
    hasSampleReturn: false,
    maxProbeDistanceAU: 1.5,
    activeSatellites: 120,
    satelliteTypes: 5,
    hasGNSS: true,
    hasMegaConstellation: false,
    launchSites: 2,
    trackingStations: 4,
    manufacturingCenters: 3,
    indigenousTechScore: 65,
  },
  FRA: {
    activeLaunchVehicles: 2,
    maxPayloadLeo: 21000,
    launchesLastYear: 6,
    engineCount: 3,
    propellantTypes: 2,
    maxIsp: 465,
    maxChamberPressure: 116,
    advancedCycleEngines: 0,
    hasReusableEngine: false,
    crewedMissions: 0,
    longestMissionDays: 0,
    lunarMissions: 0,
    marsMissions: 0,
    planetaryMissions: 1,
    hasSampleReturn: false,
    maxProbeDistanceAU: 5,
    activeSatellites: 80,
    satelliteTypes: 5,
    hasGNSS: false,
    hasMegaConstellation: false,
    launchSites: 1,
    trackingStations: 4,
    manufacturingCenters: 4,
    indigenousTechScore: 68,
  },
  DEU: {
    activeLaunchVehicles: 0,
    maxPayloadLeo: 0,
    launchesLastYear: 0,
    engineCount: 2,
    propellantTypes: 1,
    maxIsp: 350,
    maxChamberPressure: 80,
    advancedCycleEngines: 0,
    hasReusableEngine: false,
    crewedMissions: 0,
    longestMissionDays: 0,
    lunarMissions: 0,
    marsMissions: 0,
    planetaryMissions: 1,
    hasSampleReturn: false,
    maxProbeDistanceAU: 5,
    activeSatellites: 60,
    satelliteTypes: 4,
    hasGNSS: false,
    hasMegaConstellation: false,
    launchSites: 0,
    trackingStations: 3,
    manufacturingCenters: 4,
    indigenousTechScore: 55,
  },
  GBR: {
    activeLaunchVehicles: 0,
    maxPayloadLeo: 0,
    launchesLastYear: 0,
    engineCount: 1,
    propellantTypes: 1,
    maxIsp: 320,
    maxChamberPressure: 50,
    advancedCycleEngines: 0,
    hasReusableEngine: false,
    crewedMissions: 0,
    longestMissionDays: 0,
    lunarMissions: 0,
    marsMissions: 0,
    planetaryMissions: 0,
    hasSampleReturn: false,
    maxProbeDistanceAU: 0,
    activeSatellites: 50,
    satelliteTypes: 4,
    hasGNSS: false,
    hasMegaConstellation: false,
    launchSites: 1,
    trackingStations: 2,
    manufacturingCenters: 3,
    indigenousTechScore: 45,
  },
  KOR: {
    activeLaunchVehicles: 1,
    maxPayloadLeo: 1500,
    launchesLastYear: 1,
    engineCount: 2,
    propellantTypes: 1,
    maxIsp: 315,
    maxChamberPressure: 60,
    advancedCycleEngines: 0,
    hasReusableEngine: false,
    crewedMissions: 0,
    longestMissionDays: 0,
    lunarMissions: 1,
    marsMissions: 0,
    planetaryMissions: 0,
    hasSampleReturn: false,
    maxProbeDistanceAU: 0.01,
    activeSatellites: 50,
    satelliteTypes: 4,
    hasGNSS: false,
    hasMegaConstellation: false,
    launchSites: 1,
    trackingStations: 3,
    manufacturingCenters: 2,
    indigenousTechScore: 48,
  },
  ISR: {
    activeLaunchVehicles: 1,
    maxPayloadLeo: 350,
    launchesLastYear: 1,
    engineCount: 1,
    propellantTypes: 1,
    maxIsp: 280,
    maxChamberPressure: 50,
    advancedCycleEngines: 0,
    hasReusableEngine: false,
    crewedMissions: 0,
    longestMissionDays: 0,
    lunarMissions: 1,
    marsMissions: 0,
    planetaryMissions: 0,
    hasSampleReturn: false,
    maxProbeDistanceAU: 0.01,
    activeSatellites: 20,
    satelliteTypes: 3,
    hasGNSS: false,
    hasMegaConstellation: false,
    launchSites: 1,
    trackingStations: 2,
    manufacturingCenters: 2,
    indigenousTechScore: 52,
  },
  IRN: {
    activeLaunchVehicles: 2,
    maxPayloadLeo: 500,
    launchesLastYear: 3,
    engineCount: 2,
    propellantTypes: 1,
    maxIsp: 260,
    maxChamberPressure: 40,
    advancedCycleEngines: 0,
    hasReusableEngine: false,
    crewedMissions: 0,
    longestMissionDays: 0,
    lunarMissions: 0,
    marsMissions: 0,
    planetaryMissions: 0,
    hasSampleReturn: false,
    maxProbeDistanceAU: 0,
    activeSatellites: 10,
    satelliteTypes: 2,
    hasGNSS: false,
    hasMegaConstellation: false,
    launchSites: 2,
    trackingStations: 2,
    manufacturingCenters: 1,
    indigenousTechScore: 35,
  },
  // Additional countries with basic metrics
  CAN: {
    activeLaunchVehicles: 0,
    maxPayloadLeo: 0,
    launchesLastYear: 0,
    engineCount: 0,
    propellantTypes: 0,
    maxIsp: 0,
    maxChamberPressure: 0,
    advancedCycleEngines: 0,
    hasReusableEngine: false,
    crewedMissions: 0,
    longestMissionDays: 0,
    lunarMissions: 0,
    marsMissions: 0,
    planetaryMissions: 0,
    hasSampleReturn: false,
    maxProbeDistanceAU: 0,
    activeSatellites: 45,
    satelliteTypes: 4,
    hasGNSS: false,
    hasMegaConstellation: false,
    launchSites: 0,
    trackingStations: 2,
    manufacturingCenters: 2,
    indigenousTechScore: 40,
  },
  AUS: {
    activeLaunchVehicles: 0,
    maxPayloadLeo: 0,
    launchesLastYear: 0,
    engineCount: 0,
    propellantTypes: 0,
    maxIsp: 0,
    maxChamberPressure: 0,
    advancedCycleEngines: 0,
    hasReusableEngine: false,
    crewedMissions: 0,
    longestMissionDays: 0,
    lunarMissions: 0,
    marsMissions: 0,
    planetaryMissions: 0,
    hasSampleReturn: false,
    maxProbeDistanceAU: 0,
    activeSatellites: 30,
    satelliteTypes: 3,
    hasGNSS: false,
    hasMegaConstellation: false,
    launchSites: 1,
    trackingStations: 3,
    manufacturingCenters: 1,
    indigenousTechScore: 35,
  },
  BRA: {
    activeLaunchVehicles: 1,
    maxPayloadLeo: 200,
    launchesLastYear: 0,
    engineCount: 1,
    propellantTypes: 1,
    maxIsp: 260,
    maxChamberPressure: 30,
    advancedCycleEngines: 0,
    hasReusableEngine: false,
    crewedMissions: 0,
    longestMissionDays: 0,
    lunarMissions: 0,
    marsMissions: 0,
    planetaryMissions: 0,
    hasSampleReturn: false,
    maxProbeDistanceAU: 0,
    activeSatellites: 15,
    satelliteTypes: 3,
    hasGNSS: false,
    hasMegaConstellation: false,
    launchSites: 1,
    trackingStations: 2,
    manufacturingCenters: 1,
    indigenousTechScore: 30,
  },
  ITA: {
    activeLaunchVehicles: 0,
    maxPayloadLeo: 0,
    launchesLastYear: 0,
    engineCount: 1,
    propellantTypes: 1,
    maxIsp: 300,
    maxChamberPressure: 50,
    advancedCycleEngines: 0,
    hasReusableEngine: false,
    crewedMissions: 0,
    longestMissionDays: 0,
    lunarMissions: 0,
    marsMissions: 0,
    planetaryMissions: 0,
    hasSampleReturn: false,
    maxProbeDistanceAU: 0,
    activeSatellites: 25,
    satelliteTypes: 4,
    hasGNSS: false,
    hasMegaConstellation: false,
    launchSites: 0,
    trackingStations: 2,
    manufacturingCenters: 3,
    indigenousTechScore: 48,
  },
  NZL: {
    activeLaunchVehicles: 1,
    maxPayloadLeo: 300,
    launchesLastYear: 9,
    engineCount: 1,
    propellantTypes: 1,
    maxIsp: 343,
    maxChamberPressure: 120,
    advancedCycleEngines: 0,
    hasReusableEngine: true,
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
    indigenousTechScore: 42,
  },
  UAE: {
    activeLaunchVehicles: 0,
    maxPayloadLeo: 0,
    launchesLastYear: 0,
    engineCount: 0,
    propellantTypes: 0,
    maxIsp: 0,
    maxChamberPressure: 0,
    advancedCycleEngines: 0,
    hasReusableEngine: false,
    crewedMissions: 0,
    longestMissionDays: 0,
    lunarMissions: 0,
    marsMissions: 1,
    planetaryMissions: 1,
    hasSampleReturn: false,
    maxProbeDistanceAU: 1.5,
    activeSatellites: 15,
    satelliteTypes: 3,
    hasGNSS: false,
    hasMegaConstellation: false,
    launchSites: 0,
    trackingStations: 2,
    manufacturingCenters: 1,
    indigenousTechScore: 35,
  },
  ARG: {
    activeLaunchVehicles: 0,
    maxPayloadLeo: 0,
    launchesLastYear: 0,
    engineCount: 0,
    propellantTypes: 0,
    maxIsp: 0,
    maxChamberPressure: 0,
    advancedCycleEngines: 0,
    hasReusableEngine: false,
    crewedMissions: 0,
    longestMissionDays: 0,
    lunarMissions: 0,
    marsMissions: 0,
    planetaryMissions: 0,
    hasSampleReturn: false,
    maxProbeDistanceAU: 0,
    activeSatellites: 12,
    satelliteTypes: 2,
    hasGNSS: false,
    hasMegaConstellation: false,
    launchSites: 0,
    trackingStations: 1,
    manufacturingCenters: 1,
    indigenousTechScore: 25,
  },
  PRK: {
    activeLaunchVehicles: 1,
    maxPayloadLeo: 500,
    launchesLastYear: 2,
    engineCount: 1,
    propellantTypes: 1,
    maxIsp: 260,
    maxChamberPressure: 30,
    advancedCycleEngines: 0,
    hasReusableEngine: false,
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
    indigenousTechScore: 28,
  },
  UKR: {
    activeLaunchVehicles: 1,
    maxPayloadLeo: 6000,
    launchesLastYear: 0,
    engineCount: 3,
    propellantTypes: 2,
    maxIsp: 315,
    maxChamberPressure: 200,
    advancedCycleEngines: 1,
    hasReusableEngine: false,
    crewedMissions: 0,
    longestMissionDays: 0,
    lunarMissions: 0,
    marsMissions: 0,
    planetaryMissions: 0,
    hasSampleReturn: false,
    maxProbeDistanceAU: 0,
    activeSatellites: 8,
    satelliteTypes: 2,
    hasGNSS: false,
    hasMegaConstellation: false,
    launchSites: 0,
    trackingStations: 2,
    manufacturingCenters: 2,
    indigenousTechScore: 45,
  },
};

// Default metrics for countries not in the detailed list
const DEFAULT_METRICS: CountryMetrics = {
  activeLaunchVehicles: 0,
  maxPayloadLeo: 0,
  launchesLastYear: 0,
  engineCount: 0,
  propellantTypes: 0,
  maxIsp: 0,
  maxChamberPressure: 0,
  advancedCycleEngines: 0,
  hasReusableEngine: false,
  crewedMissions: 0,
  longestMissionDays: 0,
  lunarMissions: 0,
  marsMissions: 0,
  planetaryMissions: 0,
  hasSampleReturn: false,
  maxProbeDistanceAU: 0,
  activeSatellites: 0,
  satelliteTypes: 0,
  hasGNSS: false,
  hasMegaConstellation: false,
  launchSites: 0,
  trackingStations: 0,
  manufacturingCenters: 0,
  indigenousTechScore: 0,
};

// ============================================================================
// SCORING ALGORITHMS
// ============================================================================

/**
 * Calculate Launch Capability Score (0-100)
 */
function calculateLaunchCapability(country: Country): { score: number; metrics: SCIMetric[] } {
  const metrics = { ...DEFAULT_METRICS, ...COUNTRY_METRICS[country.isoCode || ''] };

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
 */
function calculatePropulsionTechnology(country: Country): { score: number; metrics: SCIMetric[] } {
  const metrics = { ...DEFAULT_METRICS, ...COUNTRY_METRICS[country.isoCode || ''] };

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

  const metrics = { ...DEFAULT_METRICS, ...COUNTRY_METRICS[country.isoCode || ''] };

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
 */
function calculateDeepSpaceExploration(country: Country): { score: number; metrics: SCIMetric[] } {
  const metrics = { ...DEFAULT_METRICS, ...COUNTRY_METRICS[country.isoCode || ''] };

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
 */
function calculateSatelliteInfrastructure(country: Country): { score: number; metrics: SCIMetric[] } {
  const metrics = { ...DEFAULT_METRICS, ...COUNTRY_METRICS[country.isoCode || ''] };

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
 */
function calculateGroundInfrastructure(country: Country): { score: number; metrics: SCIMetric[] } {
  const metrics = { ...DEFAULT_METRICS, ...COUNTRY_METRICS[country.isoCode || ''] };

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
 */
function calculateTechnologicalIndependence(country: Country): { score: number; metrics: SCIMetric[] } {
  const metrics = { ...DEFAULT_METRICS, ...COUNTRY_METRICS[country.isoCode || ''] };

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
  private axiosInstance: AxiosInstance;
  private countriesCache: Country[] | null = null;
  private cacheTimestamp: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
    });
  }

  /**
   * Get all countries with their SCI breakdowns from the API
   */
  async getAllCountries(): Promise<Country[]> {
    // Check cache
    const now = Date.now();
    if (this.countriesCache && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
      return this.countriesCache;
    }

    try {
      // Fetch from API - try unpaged first, then handle paginated response
      const response = await this.axiosInstance.get('/countries?unpaged=true');
      // Handle both array response and paginated response { content: [...] }
      const countries: Country[] = Array.isArray(response.data)
        ? response.data
        : (response.data.content || []);

      // Calculate scores for each country
      const countriesWithScores = countries.map(country => {
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

        // Use the country's overallCapabilityScore if available from API, otherwise calculate
        const overallScore = country.overallCapabilityScore || calculateOverallScore(capabilityScores);

        return {
          ...country,
          capabilityScores,
          overallCapabilityScore: overallScore,
        };
      });

      // Update cache
      this.countriesCache = countriesWithScores;
      this.cacheTimestamp = now;

      return countriesWithScores;
    } catch (error) {
      console.warn('Failed to fetch countries from API, cache may be stale:', error);
      // Return cached data if available
      if (this.countriesCache) {
        return this.countriesCache;
      }
      // If no cache, throw error
      throw new Error('Failed to fetch countries');
    }
  }

  /**
   * Get a single country by ID from the API
   */
  async getCountryById(countryId: string): Promise<Country | null> {
    try {
      const response = await this.axiosInstance.get<Country>(`/countries/by-code/${countryId}`);
      return response.data;
    } catch (error) {
      // Try getting from the full list
      const countries = await this.getAllCountries();
      return countries.find(c => c.isoCode === countryId || c.id === countryId) || null;
    }
  }

  /**
   * Get SCI breakdown for a specific country
   */
  async getSCIBreakdown(countryId: string): Promise<SCIBreakdown | null> {
    // First try to get the specific country from API
    let country = await this.getCountryById(countryId);

    // If not found directly, try from the full list
    if (!country) {
      const countries = await this.getAllCountries();
      country = countries.find(c => c.isoCode === countryId || c.id === countryId) || null;
    }

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

    const overallScore = country.overallCapabilityScore || calculateOverallScore(capabilityScores);
    const { strengths, weaknesses } = identifyStrengthsWeaknesses(capabilityScores);

    // Get all countries for rankings
    const countries = await this.getAllCountries();

    // Calculate ranks
    const sortedCountries = [...countries].sort(
      (a, b) => (b.overallCapabilityScore || 0) - (a.overallCapabilityScore || 0)
    );
    const globalRank = sortedCountries.findIndex(c => c.id === country!.id || c.isoCode === country!.isoCode) + 1;

    const regionalCountries = countries.filter(c => c.region === country!.region);
    const sortedRegional = [...regionalCountries].sort(
      (a, b) => (b.overallCapabilityScore || 0) - (a.overallCapabilityScore || 0)
    );
    const regionalRank = sortedRegional.findIndex(c => c.id === country!.id || c.isoCode === country!.isoCode) + 1;

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
      countryId: country.id || country.isoCode || countryId,
      countryName: country.name,
      overallScore,
      tier: determineTier(overallScore),
      categoryScores: categoryScoresWithRanks,
      globalRank: globalRank || 1,
      regionalRank: regionalRank || 1,
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
      const breakdown = await this.getSCIBreakdown(String(country.id || country.isoCode));
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

  /**
   * Clear the cache (useful for forcing a refresh)
   */
  clearCache(): void {
    this.countriesCache = null;
    this.cacheTimestamp = 0;
  }
}

export const capabilityScoreService = new CapabilityScoreService();
export default capabilityScoreService;
