/**
 * Type definitions for Rocket Engine API and application state
 */

// ============================================================================
// COUNTRY & SPACE AGENCY TYPES
// ============================================================================

export interface Country {
  id: string | number;
  name: string;
  isoCode: string;                    // ISO 3166-1 alpha-3 (USA, CHN, RUS)
  flagUrl?: string;
  region: string;                     // Europe, Asia, North America, etc.

  // Space Agency Info
  spaceAgencyName: string;            // NASA, ESA, CNSA, Roscosmos
  spaceAgencyAcronym: string;
  spaceAgencyFounded?: number;
  spaceAgencyLogo?: string;

  // Budget & Resources
  annualBudgetUsd?: number;
  budgetAsPercentOfGdp?: number;

  // Workforce
  activeAstronauts?: number;
  totalSpaceAgencyEmployees?: number;

  // Launch Statistics
  totalLaunches?: number;
  successfulLaunches?: number;
  launchSuccessRate?: number;

  // Capability Flags
  humanSpaceflightCapable: boolean;
  independentLaunchCapable: boolean;
  reusableRocketCapable: boolean;
  deepSpaceCapable: boolean;
  spaceStationCapable: boolean;
  lunarLandingCapable: boolean;
  marsLandingCapable: boolean;

  // Calculated Score (0-100)
  overallCapabilityScore?: number;

  // Category Scores
  capabilityScores?: CapabilityScores;
}

export interface CapabilityScores {
  launchCapability: number;           // 0-100
  propulsionTechnology: number;       // 0-100
  humanSpaceflight: number;           // 0-100
  deepSpaceExploration: number;       // 0-100
  satelliteInfrastructure: number;    // 0-100
  groundInfrastructure: number;       // 0-100
  technologicalIndependence: number;  // 0-100
}

export type CapabilityCategory =
  | 'launchCapability'
  | 'propulsionTechnology'
  | 'humanSpaceflight'
  | 'deepSpaceExploration'
  | 'satelliteInfrastructure'
  | 'groundInfrastructure'
  | 'technologicalIndependence';

export interface CountryRanking {
  country: Country;
  rank: number;
  previousRank?: number;
  score: number;
  trend: 'up' | 'down' | 'stable';
}

export interface CountryComparison {
  countries: Country[];
  scoreComparison: {
    category: CapabilityCategory;
    scores: { countryId: string | number; score: number }[];
  }[];
  gapAnalysis?: GapAnalysis;
}

export interface GapAnalysis {
  leader: Country;
  follower: Country;
  overallGap: number;
  categoryGaps: {
    category: CapabilityCategory;
    gap: number;
    leaderScore: number;
    followerScore: number;
  }[];
  strengths: CapabilityCategory[];
  weaknesses: CapabilityCategory[];
}

// ============================================================================
// LAUNCH VEHICLE TYPES
// ============================================================================

export interface LaunchVehicle {
  id: string | number;
  name: string;
  variant?: string;
  countryId: string | number;
  manufacturer: string;

  // Status & Timeline
  status: 'Active' | 'Retired' | 'Development' | 'Planned';
  firstFlight?: string;

  // Launch Statistics
  totalLaunches?: number;
  successfulLaunches?: number;
  successRate?: number;

  // Payload Capabilities (kg)
  payloadToLeoKg?: number;
  payloadToGtoKg?: number;
  payloadToTliKg?: number;

  // Physical Specifications
  heightMeters?: number;
  diameterMeters?: number;
  liftoffMassKg?: number;
  stages?: number;

  // Economics
  costPerLaunchUsd?: number;
  costPerKgToLeoUsd?: number;

  // Capabilities
  reusable: boolean;
  humanRated: boolean;

  // Image
  imageUrl?: string;
}

// ============================================================================
// ENGINE TYPES (Enhanced)
// ============================================================================

export interface Engine {
  id: string | number;
  name: string;
  designer: string;
  type: string;
  isp: number;
  twr: number;
  propellant: string;
  status?: string;

  // Country linkage (new)
  countryId?: string | number;
  country?: Country;

  // Enhanced fields
  firstFlightYear?: number;
  reusable?: boolean;
  reusabilityFlights?: number;

  // Throttle & Control
  throttleMinPercent?: number;
  throttleMaxPercent?: number;
  gimbalRangeDegrees?: number;

  // Reliability
  totalFlights?: number;
  successfulFlights?: number;
  reliabilityRate?: number;

  // Allow additional fields
  [key: string]: any;
}

export interface EngineComparison {
  engine1: Engine;
  engine2: Engine;
  differences: ComparisonDifferences;
}

export interface ComparisonDifferences {
  [key: string]: {
    engine1: any;
    engine2: any;
    difference: number | string;
  };
}

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export interface ListAsyncState<T> {
  data: T[];
  loading: boolean;
  error: Error | null;
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
  fill?: boolean;
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export type SortKey = 'name' | 'isp' | 'twr' | 'designer';
export type SortOrder = 'asc' | 'desc';

export interface ApiErrorResponse {
  message: string;
  status: number;
  code?: string;
}

export interface ValidationError extends Error {
  validationErrors?: Record<string, string[]>;
}
