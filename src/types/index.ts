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
  reusableRocketStatus: 'Yes' | 'In Development' | 'No';
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
// SPACE CAPABILITY INDEX (SCI) TYPES
// ============================================================================

export interface CategoryWeight {
  category: CapabilityCategory;
  weight: number;
  label: string;
  description: string;
  icon: string;
  color: string;
}

export const CATEGORY_WEIGHTS: CategoryWeight[] = [
  {
    category: 'launchCapability',
    weight: 0.20,
    label: 'Launch Capability',
    description: 'Ability to reach space independently with active rockets',
    icon: 'rocket',
    color: '#3B82F6'  // blue
  },
  {
    category: 'propulsionTechnology',
    weight: 0.15,
    label: 'Propulsion Technology',
    description: 'Engine sophistication, ISP, advanced cycles',
    icon: 'bolt',
    color: '#8B5CF6'  // purple
  },
  {
    category: 'humanSpaceflight',
    weight: 0.20,
    label: 'Human Spaceflight',
    description: 'Crewed mission capability and astronaut corps',
    icon: 'astronaut',
    color: '#10B981'  // green
  },
  {
    category: 'deepSpaceExploration',
    weight: 0.15,
    label: 'Deep Space',
    description: 'Moon, Mars, and planetary exploration missions',
    icon: 'moon',
    color: '#F59E0B'  // amber
  },
  {
    category: 'satelliteInfrastructure',
    weight: 0.15,
    label: 'Satellite Infrastructure',
    description: 'Active satellites, constellations, GNSS systems',
    icon: 'satellite',
    color: '#EF4444'  // red
  },
  {
    category: 'groundInfrastructure',
    weight: 0.10,
    label: 'Ground Infrastructure',
    description: 'Launch sites, tracking stations, manufacturing',
    icon: 'factory',
    color: '#6366F1'  // indigo
  },
  {
    category: 'technologicalIndependence',
    weight: 0.05,
    label: 'Tech Independence',
    description: 'Self-reliance in space technology development',
    icon: 'build',
    color: '#EC4899'  // pink
  }
];

export interface SCIBreakdown {
  countryId: string | number;
  countryName: string;
  overallScore: number;
  tier: 'Superpower' | 'Major Power' | 'Emerging Power' | 'Developing' | 'Nascent';
  categoryScores: {
    category: CapabilityCategory;
    score: number;
    weightedScore: number;
    rank: number;
    metrics: SCIMetric[];
  }[];
  globalRank: number;
  regionalRank: number;
  trend: 'improving' | 'stable' | 'declining';
  strengths: CapabilityCategory[];
  weaknesses: CapabilityCategory[];
}

export interface SCIMetric {
  name: string;
  value: number | string | boolean;
  maxValue?: number;
  unit?: string;
  contribution: number;  // Points contributed to category score
}

export interface SCIRankings {
  rankings: SCIBreakdown[];
  lastUpdated: string;
  globalStatistics: {
    averageScore: number;
    medianScore: number;
    topScore: number;
    bottomScore: number;
    totalCountries: number;
    countriesWithLaunchCapability: number;
    countriesWithHumanSpaceflight: number;
  };
}

export interface SCIComparison {
  countries: SCIBreakdown[];
  radarData: {
    categories: string[];
    datasets: {
      countryId: string | number;
      countryName: string;
      scores: number[];
      color: string;
    }[];
  };
  gapAnalysis: {
    category: CapabilityCategory;
    leader: string;
    leaderScore: number;
    gaps: { countryId: string | number; gap: number }[];
  }[];
}

export interface SCIHistoricalData {
  countryId: string | number;
  history: {
    year: number;
    overallScore: number;
    categoryScores: CapabilityScores;
    rank: number;
    majorEvents?: string[];
  }[];
}

export type SCITier = 'Superpower' | 'Major Power' | 'Emerging Power' | 'Developing' | 'Nascent';

export const SCI_TIER_THRESHOLDS: { tier: SCITier; minScore: number; color: string; description: string }[] = [
  { tier: 'Superpower', minScore: 80, color: '#FFD700', description: 'Full-spectrum space capability' },
  { tier: 'Major Power', minScore: 60, color: '#C0C0C0', description: 'Advanced capabilities across multiple domains' },
  { tier: 'Emerging Power', minScore: 40, color: '#CD7F32', description: 'Growing capabilities with active programs' },
  { tier: 'Developing', minScore: 20, color: '#3B82F6', description: 'Building foundational space capabilities' },
  { tier: 'Nascent', minScore: 0, color: '#6B7280', description: 'Early-stage space program development' }
];

// ============================================================================
// LAUNCH VEHICLE TYPES
// ============================================================================

export type LaunchVehicleStatus = 'Active' | 'In Development' | 'Retired' | 'Cancelled';

export interface LaunchVehicle {
  id: string | number;
  name: string;
  variant?: string;
  countryId: string | number;
  country?: Country;
  manufacturer: string;
  description?: string;

  // Status & Timeline
  status: LaunchVehicleStatus;
  firstFlight?: string;
  lastFlight?: string;

  // Launch Statistics
  totalLaunches?: number;
  successfulLaunches?: number;
  failedLaunches?: number;
  successRate?: number;

  // Payload Capabilities (kg)
  payloadToLeoKg?: number;
  payloadToGtoKg?: number;
  payloadToTliKg?: number;
  payloadToMarsKg?: number;

  // Physical Specifications
  heightMeters?: number;
  diameterMeters?: number;
  liftoffMassKg?: number;
  liftoffThrustKn?: number;
  stages?: number;

  // Economics
  costPerLaunchUsd?: number;
  costPerKgToLeoUsd?: number;

  // Capabilities
  reusable: boolean;
  humanRated: boolean;
  partiallyReusable?: boolean;

  // Engine Configuration
  engineIds?: (string | number)[];
  engines?: Engine[];

  // Image
  imageUrl?: string;
  wikiUrl?: string;
}

// ============================================================================
// ENGINE TYPES (Enhanced)
// ============================================================================

export type EngineStatus = 'Active' | 'Retired' | 'Development' | 'Experimental' | 'Historical';

export type PowerCycle =
  | 'Gas Generator'
  | 'Staged Combustion'
  | 'Full-Flow Staged Combustion'
  | 'Expander'
  | 'Expander Bleed'
  | 'Pressure-Fed'
  | 'Electric Pump-Fed'
  | 'Tap-Off'
  | 'Open Cycle'
  | 'Closed Cycle';

export type PropellantType =
  | 'LOX/RP-1'
  | 'LOX/LH2'
  | 'LOX/CH4'
  | 'N2O4/UDMH'
  | 'N2O4/Aerozine-50'
  | 'LOX/Ethanol'
  | 'Solid'
  | 'Hybrid'
  | 'Other';

export interface Engine {
  id: string | number;
  name: string;
  designer: string;
  type: string;
  isp: number;
  twr: number;
  propellant: string;
  status?: EngineStatus;

  // Country linkage
  countryId?: string | number;
  country?: Country;
  origin?: string;  // Legacy field, maps to country

  // Performance Specifications
  thrustN?: number;            // Thrust in Newtons
  thrustKn?: number;           // Thrust in kN
  thrustVacuumKn?: number;     // Vacuum thrust in kN
  ispSeaLevel?: number;        // ISP at sea level (seconds)
  ispVacuum?: number;          // ISP in vacuum (seconds)
  isp_s?: number;              // Legacy ISP field
  massKg?: number;             // Dry mass in kg

  // Combustion Details
  powerCycle?: PowerCycle | string;
  chamberPressureBar?: number;
  chamberPressurePsi?: number;
  nozzleExpansionRatio?: number;
  ofRatio?: number;            // Oxidizer/Fuel ratio

  // Throttle & Control
  throttleMinPercent?: number;
  throttleMaxPercent?: number;
  throttleCapable?: boolean;
  gimbalRangeDegrees?: number;
  gimbalCapable?: boolean;
  restartCapable?: boolean;
  maxRestarts?: number;

  // Timeline & Development
  firstFlightYear?: number;
  firstFlight?: string;
  developmentStartYear?: number;
  developmentCost?: number;

  // Reusability
  reusable?: boolean;
  reusabilityFlights?: number;     // Max certified reuse flights
  actualReusedFlights?: number;    // Record for actual reuses

  // Reliability Statistics
  totalFlights?: number;
  successfulFlights?: number;
  failedFlights?: number;
  reliabilityRate?: number;        // 0-100 percentage

  // Engine Evolution (Family Tree)
  predecessorEngineId?: string | number;
  predecessorEngine?: Engine;
  successorEngineId?: string | number;
  successorEngine?: Engine;
  engineFamily?: string;           // e.g., "Merlin", "RS-25", "RD-180"
  variant?: string;                // e.g., "1D", "1D+", "1D Vacuum"

  // Technology Classification
  advancedCycle?: boolean;         // Staged combustion or full-flow
  methalox?: boolean;              // Methane-LOX propellant
  hydrolox?: boolean;              // Hydrogen-LOX propellant
  hypergolic?: boolean;            // Hypergolic propellants
  solidFuel?: boolean;

  // Usage Information
  vehicle?: string;                // Primary vehicle(s) using this engine
  use?: string;                    // Stage position (1st stage, upper stage, etc.)
  launchVehicleIds?: (string | number)[];

  // Calculated fields
  calculateThrustToWeightRatio?: number;
  sophisticationScore?: number;    // 0-100 based on cycle, reusability, etc.

  // External References
  wikiUrl?: string;
  imageUrl?: string;

  // Allow additional fields
  [key: string]: any;
}

export interface EngineFamily {
  familyName: string;
  engines: Engine[];
  originCountry: Country;
  designer: string;
  firstEngine: Engine;
  latestEngine: Engine;
  totalVariants: number;
}

export interface EngineStatistics {
  total: number;
  byCountry: { countryId: string; countryName: string; count: number }[];
  byPropellant: { propellant: string; count: number }[];
  byPowerCycle: { cycle: string; count: number }[];
  byStatus: { status: string; count: number }[];
  reusableCount: number;
  activeCount: number;
  averageIsp: number;
  averageThrust: number;
  highestIsp: Engine | null;
  highestThrust: Engine | null;
  mostReliable: Engine | null;
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

/**
 * RFC 7807 ProblemDetail error response format
 * https://tools.ietf.org/html/rfc7807
 */
export interface ProblemDetail {
  type?: string;              // URI reference identifying the problem type
  title: string;              // Human-readable summary
  status: number;             // HTTP status code
  detail?: string;            // Human-readable explanation
  instance?: string;          // URI reference to specific occurrence
  requestId?: string;         // X-Request-Id for tracing
  timestamp?: string;         // When the error occurred
  path?: string;              // Request path
  errors?: ValidationFieldError[];  // Field-level validation errors
}

export interface ValidationFieldError {
  field: string;
  message: string;
  code?: string;
  rejectedValue?: any;
}

export interface ValidationError extends Error {
  validationErrors?: Record<string, string[]>;
}

// Toast notification types for the notification system
export type ToastSeverity = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  severity: ToastSeverity;
  title?: string;
  requestId?: string;         // For error tracing
  autoHideDuration?: number;  // ms, null = manual dismiss
  details?: string;           // Expandable details
}

// ============================================================================
// SPACE MILESTONE TYPES
// ============================================================================

export type MilestoneCategory =
  | 'orbital'
  | 'lunar'
  | 'planetary'
  | 'technology'
  | 'human'
  | 'other';

export type MilestoneType =
  // Orbital Firsts
  | 'FIRST_SATELLITE'
  | 'FIRST_ANIMAL_IN_SPACE'
  | 'FIRST_HUMAN_IN_SPACE'
  | 'FIRST_WOMAN_IN_SPACE'
  | 'FIRST_SPACEWALK'
  | 'FIRST_SPACE_STATION'
  | 'FIRST_COMMERCIAL_CREW'
  | 'FIRST_SPACE_TOURIST'
  // Lunar Firsts
  | 'FIRST_LUNAR_FLYBY'
  | 'FIRST_LUNAR_IMPACT'
  | 'FIRST_LUNAR_ORBIT'
  | 'FIRST_LUNAR_LANDING_ROBOTIC'
  | 'FIRST_HUMAN_LUNAR_ORBIT'
  | 'FIRST_HUMAN_LUNAR_LANDING'
  | 'FIRST_LUNAR_ROVER'
  | 'FIRST_LUNAR_SAMPLE_RETURN'
  | 'FIRST_LUNAR_FAR_SIDE_LANDING'
  // Planetary Firsts
  | 'FIRST_MARS_FLYBY'
  | 'FIRST_MARS_ORBIT'
  | 'FIRST_MARS_LANDING'
  | 'FIRST_MARS_ROVER'
  | 'FIRST_MARS_HELICOPTER'
  | 'FIRST_VENUS_FLYBY'
  | 'FIRST_VENUS_LANDING'
  | 'FIRST_MERCURY_ORBIT'
  | 'FIRST_JUPITER_FLYBY'
  | 'FIRST_SATURN_ORBIT'
  | 'FIRST_OUTER_PLANET_PROBE'
  // Technology Firsts
  | 'FIRST_REUSABLE_ROCKET'
  | 'FIRST_PROPULSIVE_LANDING'
  | 'FIRST_ROCKET_CATCH'
  | 'FIRST_COMMERCIAL_SPACE_STATION'
  | 'FIRST_SPACE_TOURISM'
  // Other
  | 'FIRST_ASTEROID_LANDING'
  | 'FIRST_COMET_LANDING'
  | 'FIRST_SAMPLE_RETURN_ASTEROID'
  | 'FIRST_INTERSTELLAR_PROBE';

export interface SpaceMilestone {
  id: string | number;
  countryId: string | number;
  country?: Country;
  missionId?: string | number;
  missionName?: string;

  milestoneType: MilestoneType;
  category: MilestoneCategory;

  dateAchieved: string;  // ISO date string
  year: number;

  globalRank: number;    // 1st, 2nd, 3rd to achieve
  isFirst: boolean;      // Was this country first to achieve this?

  title: string;         // "First Human in Space"
  description: string;
  achievedBy?: string;   // Person or spacecraft name

  significance: 'major' | 'significant' | 'notable';

  // Optional media
  imageUrl?: string;
  wikiUrl?: string;
}

export interface MilestoneTypeInfo {
  type: MilestoneType;
  category: MilestoneCategory;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export const MILESTONE_TYPE_INFO: Record<MilestoneType, MilestoneTypeInfo> = {
  // Orbital Firsts
  FIRST_SATELLITE: { type: 'FIRST_SATELLITE', category: 'orbital', title: 'First Satellite', description: 'Launch of first artificial satellite', icon: 'satellite', color: '#3B82F6' },
  FIRST_ANIMAL_IN_SPACE: { type: 'FIRST_ANIMAL_IN_SPACE', category: 'orbital', title: 'First Animal in Space', description: 'First living animal to reach orbit', icon: 'science', color: '#10B981' },
  FIRST_HUMAN_IN_SPACE: { type: 'FIRST_HUMAN_IN_SPACE', category: 'human', title: 'First Human in Space', description: 'First crewed spaceflight', icon: 'astronaut', color: '#8B5CF6' },
  FIRST_WOMAN_IN_SPACE: { type: 'FIRST_WOMAN_IN_SPACE', category: 'human', title: 'First Woman in Space', description: 'First female astronaut/cosmonaut', icon: 'astronaut', color: '#EC4899' },
  FIRST_SPACEWALK: { type: 'FIRST_SPACEWALK', category: 'human', title: 'First Spacewalk', description: 'First extravehicular activity (EVA)', icon: 'astronaut', color: '#6366F1' },
  FIRST_SPACE_STATION: { type: 'FIRST_SPACE_STATION', category: 'orbital', title: 'First Space Station', description: 'First orbital space station', icon: 'hub', color: '#F59E0B' },
  FIRST_COMMERCIAL_CREW: { type: 'FIRST_COMMERCIAL_CREW', category: 'technology', title: 'First Commercial Crew', description: 'First commercially-operated crewed mission', icon: 'group', color: '#14B8A6' },
  FIRST_SPACE_TOURIST: { type: 'FIRST_SPACE_TOURIST', category: 'human', title: 'First Space Tourist', description: 'First paying space tourist', icon: 'person', color: '#F97316' },

  // Lunar Firsts
  FIRST_LUNAR_FLYBY: { type: 'FIRST_LUNAR_FLYBY', category: 'lunar', title: 'First Lunar Flyby', description: 'First spacecraft to fly by the Moon', icon: 'moon', color: '#94A3B8' },
  FIRST_LUNAR_IMPACT: { type: 'FIRST_LUNAR_IMPACT', category: 'lunar', title: 'First Lunar Impact', description: 'First spacecraft to impact the Moon', icon: 'target', color: '#64748B' },
  FIRST_LUNAR_ORBIT: { type: 'FIRST_LUNAR_ORBIT', category: 'lunar', title: 'First Lunar Orbit', description: 'First spacecraft to orbit the Moon', icon: 'radar', color: '#A3A3A3' },
  FIRST_LUNAR_LANDING_ROBOTIC: { type: 'FIRST_LUNAR_LANDING_ROBOTIC', category: 'lunar', title: 'First Lunar Landing (Robotic)', description: 'First soft landing on the Moon', icon: 'engineering', color: '#71717A' },
  FIRST_HUMAN_LUNAR_ORBIT: { type: 'FIRST_HUMAN_LUNAR_ORBIT', category: 'lunar', title: 'First Human Lunar Orbit', description: 'First crewed mission to orbit the Moon', icon: 'astronaut', color: '#D4D4D8' },
  FIRST_HUMAN_LUNAR_LANDING: { type: 'FIRST_HUMAN_LUNAR_LANDING', category: 'lunar', title: 'First Human Lunar Landing', description: 'First humans to walk on the Moon', icon: 'trophy', color: '#FFD700' },
  FIRST_LUNAR_ROVER: { type: 'FIRST_LUNAR_ROVER', category: 'lunar', title: 'First Lunar Rover', description: 'First rover to drive on the Moon', icon: 'explore', color: '#9CA3AF' },
  FIRST_LUNAR_SAMPLE_RETURN: { type: 'FIRST_LUNAR_SAMPLE_RETURN', category: 'lunar', title: 'First Lunar Sample Return', description: 'First robotic sample return from Moon', icon: 'science', color: '#78716C' },
  FIRST_LUNAR_FAR_SIDE_LANDING: { type: 'FIRST_LUNAR_FAR_SIDE_LANDING', category: 'lunar', title: 'First Lunar Far Side Landing', description: 'First landing on lunar far side', icon: 'moon', color: '#44403C' },

  // Planetary Firsts
  FIRST_MARS_FLYBY: { type: 'FIRST_MARS_FLYBY', category: 'planetary', title: 'First Mars Flyby', description: 'First spacecraft to fly by Mars', icon: 'explore', color: '#DC2626' },
  FIRST_MARS_ORBIT: { type: 'FIRST_MARS_ORBIT', category: 'planetary', title: 'First Mars Orbit', description: 'First spacecraft to orbit Mars', icon: 'radar', color: '#B91C1C' },
  FIRST_MARS_LANDING: { type: 'FIRST_MARS_LANDING', category: 'planetary', title: 'First Mars Landing', description: 'First soft landing on Mars', icon: 'target', color: '#991B1B' },
  FIRST_MARS_ROVER: { type: 'FIRST_MARS_ROVER', category: 'planetary', title: 'First Mars Rover', description: 'First rover to drive on Mars', icon: 'explore', color: '#7F1D1D' },
  FIRST_MARS_HELICOPTER: { type: 'FIRST_MARS_HELICOPTER', category: 'planetary', title: 'First Mars Helicopter', description: 'First powered flight on Mars', icon: 'launch', color: '#EF4444' },
  FIRST_VENUS_FLYBY: { type: 'FIRST_VENUS_FLYBY', category: 'planetary', title: 'First Venus Flyby', description: 'First spacecraft to fly by Venus', icon: 'explore', color: '#FBBF24' },
  FIRST_VENUS_LANDING: { type: 'FIRST_VENUS_LANDING', category: 'planetary', title: 'First Venus Landing', description: 'First soft landing on Venus', icon: 'target', color: '#D97706' },
  FIRST_MERCURY_ORBIT: { type: 'FIRST_MERCURY_ORBIT', category: 'planetary', title: 'First Mercury Orbit', description: 'First spacecraft to orbit Mercury', icon: 'radar', color: '#737373' },
  FIRST_JUPITER_FLYBY: { type: 'FIRST_JUPITER_FLYBY', category: 'planetary', title: 'First Jupiter Flyby', description: 'First spacecraft to fly by Jupiter', icon: 'explore', color: '#EA580C' },
  FIRST_SATURN_ORBIT: { type: 'FIRST_SATURN_ORBIT', category: 'planetary', title: 'First Saturn Orbit', description: 'First spacecraft to orbit Saturn', icon: 'radar', color: '#CA8A04' },
  FIRST_OUTER_PLANET_PROBE: { type: 'FIRST_OUTER_PLANET_PROBE', category: 'planetary', title: 'First Outer Planet Probe', description: 'First spacecraft beyond Saturn', icon: 'explore', color: '#1E3A8A' },

  // Technology Firsts
  FIRST_REUSABLE_ROCKET: { type: 'FIRST_REUSABLE_ROCKET', category: 'technology', title: 'First Reusable Rocket', description: 'First orbital-class reusable rocket', icon: 'recycling', color: '#22C55E' },
  FIRST_PROPULSIVE_LANDING: { type: 'FIRST_PROPULSIVE_LANDING', category: 'technology', title: 'First Propulsive Landing', description: 'First propulsive rocket landing', icon: 'target', color: '#16A34A' },
  FIRST_ROCKET_CATCH: { type: 'FIRST_ROCKET_CATCH', category: 'technology', title: 'First Rocket Catch', description: 'First rocket caught by launch tower', icon: 'engineering', color: '#15803D' },
  FIRST_COMMERCIAL_SPACE_STATION: { type: 'FIRST_COMMERCIAL_SPACE_STATION', category: 'technology', title: 'First Commercial Space Station', description: 'First privately-operated space station', icon: 'hub', color: '#059669' },
  FIRST_SPACE_TOURISM: { type: 'FIRST_SPACE_TOURISM', category: 'technology', title: 'First Space Tourism', description: 'First commercial space tourism operation', icon: 'launch', color: '#0D9488' },

  // Other
  FIRST_ASTEROID_LANDING: { type: 'FIRST_ASTEROID_LANDING', category: 'other', title: 'First Asteroid Landing', description: 'First spacecraft to land on an asteroid', icon: 'explore', color: '#6B7280' },
  FIRST_COMET_LANDING: { type: 'FIRST_COMET_LANDING', category: 'other', title: 'First Comet Landing', description: 'First spacecraft to land on a comet', icon: 'star', color: '#9333EA' },
  FIRST_SAMPLE_RETURN_ASTEROID: { type: 'FIRST_SAMPLE_RETURN_ASTEROID', category: 'other', title: 'First Asteroid Sample Return', description: 'First sample return from an asteroid', icon: 'science', color: '#7C3AED' },
  FIRST_INTERSTELLAR_PROBE: { type: 'FIRST_INTERSTELLAR_PROBE', category: 'other', title: 'First Interstellar Probe', description: 'First spacecraft to enter interstellar space', icon: 'star', color: '#4F46E5' }
};

export interface CountryTimeline {
  countryId: string | number;
  countryName: string;
  milestones: SpaceMilestone[];
  firstAchievements: SpaceMilestone[];
  totalMilestones: number;
  totalFirsts: number;
  earliestMilestone?: SpaceMilestone;
  latestMilestone?: SpaceMilestone;
}

export interface TimelineComparison {
  countries: CountryTimeline[];
  sharedMilestones: {
    milestoneType: MilestoneType;
    achievements: { countryId: string | number; date: string; rank: number }[];
  }[];
}

export interface GlobalMilestoneStats {
  totalMilestones: number;
  totalMilestoneTypes: number;
  achievedMilestoneTypes: number;
  unachievedMilestoneTypes: MilestoneType[];
  milestonesByCategory: { category: MilestoneCategory; count: number }[];
  milestonesByCountry: { countryId: string | number; countryName: string; count: number; firstsCount: number }[];
  milestonesByDecade: { decade: string; count: number }[];
  mostRecentMilestone?: SpaceMilestone;
  upcomingMilestones?: MilestoneType[];
}

// ============================================================================
// SPACE MISSION TYPES
// ============================================================================

export type MissionStatus = 'Planned' | 'Active' | 'Completed' | 'Failed' | 'Partial';

export type MissionType =
  | 'CREWED_ORBITAL'
  | 'CREWED_LUNAR'
  | 'CREWED_PLANETARY'
  | 'CARGO_RESUPPLY'
  | 'SATELLITE_DEPLOYMENT'
  | 'SPACE_STATION'
  | 'LUNAR_ORBITER'
  | 'LUNAR_LANDER'
  | 'LUNAR_SAMPLE_RETURN'
  | 'MARS_ORBITER'
  | 'MARS_LANDER'
  | 'MARS_ROVER'
  | 'PLANETARY_PROBE'
  | 'DEEP_SPACE_PROBE'
  | 'ASTEROID_MISSION'
  | 'SAMPLE_RETURN'
  | 'TECHNOLOGY_DEMO'
  | 'EARTH_OBSERVATION'
  | 'COMMUNICATIONS'
  | 'NAVIGATION'
  | 'SCIENTIFIC'
  | 'MILITARY';

export type MissionDestination =
  | 'LEO'
  | 'MEO'
  | 'GEO'
  | 'HEO'
  | 'SSO'
  | 'LUNAR_ORBIT'
  | 'LUNAR_SURFACE'
  | 'EARTH_MOON_L1'
  | 'EARTH_MOON_L2'
  | 'MARS_ORBIT'
  | 'MARS_SURFACE'
  | 'VENUS'
  | 'MERCURY'
  | 'JUPITER'
  | 'SATURN'
  | 'OUTER_PLANETS'
  | 'ASTEROID'
  | 'COMET'
  | 'SUN'
  | 'INTERSTELLAR';

export interface SpaceMission {
  id: string | number;
  name: string;                       // "Apollo 11"
  missionDesignation?: string;        // "AS-506"

  countryId: string | number;
  country?: Country;

  launchVehicleId?: string | number;
  launchVehicle?: LaunchVehicle;
  launchVehicleName?: string;

  // Timeline
  launchDate: string;                 // ISO date string
  endDate?: string;                   // ISO date string
  durationDays?: number;

  // Classification
  status: MissionStatus;
  missionType: MissionType;
  destination: MissionDestination;

  // Crew Information
  crewed: boolean;
  crewSize?: number;
  crewNames?: string[];

  // Mission Details
  isHistoricFirst?: boolean;
  historicFirstType?: string;
  description: string;
  outcomes?: string;
  objectives?: string[];

  launchSite?: string;
  missionMassKg?: number;

  // Media
  imageUrl?: string;
  wikiUrl?: string;
  patchUrl?: string;

  // Success metrics
  successLevel?: 'Full' | 'Partial' | 'Failed';
}

export interface MissionTypeInfo {
  type: MissionType;
  label: string;
  description: string;
  icon: string;
  color: string;
  category: 'crewed' | 'robotic' | 'satellite' | 'exploration';
}

export const MISSION_TYPE_INFO: Record<MissionType, MissionTypeInfo> = {
  CREWED_ORBITAL: { type: 'CREWED_ORBITAL', label: 'Crewed Orbital', description: 'Human spaceflight to Earth orbit', icon: 'astronaut', color: '#8B5CF6', category: 'crewed' },
  CREWED_LUNAR: { type: 'CREWED_LUNAR', label: 'Crewed Lunar', description: 'Human spaceflight to the Moon', icon: 'astronaut', color: '#6366F1', category: 'crewed' },
  CREWED_PLANETARY: { type: 'CREWED_PLANETARY', label: 'Crewed Planetary', description: 'Human spaceflight to other planets', icon: 'astronaut', color: '#4F46E5', category: 'crewed' },
  CARGO_RESUPPLY: { type: 'CARGO_RESUPPLY', label: 'Cargo Resupply', description: 'Supply mission to space station', icon: 'rocket', color: '#10B981', category: 'robotic' },
  SATELLITE_DEPLOYMENT: { type: 'SATELLITE_DEPLOYMENT', label: 'Satellite Deployment', description: 'Deploying satellites to orbit', icon: 'satellite', color: '#3B82F6', category: 'satellite' },
  SPACE_STATION: { type: 'SPACE_STATION', label: 'Space Station', description: 'Space station construction or operation', icon: 'hub', color: '#F59E0B', category: 'crewed' },
  LUNAR_ORBITER: { type: 'LUNAR_ORBITER', label: 'Lunar Orbiter', description: 'Robotic mission to lunar orbit', icon: 'moon', color: '#94A3B8', category: 'exploration' },
  LUNAR_LANDER: { type: 'LUNAR_LANDER', label: 'Lunar Lander', description: 'Robotic landing on the Moon', icon: 'moon', color: '#64748B', category: 'exploration' },
  LUNAR_SAMPLE_RETURN: { type: 'LUNAR_SAMPLE_RETURN', label: 'Lunar Sample Return', description: 'Return samples from the Moon', icon: 'science', color: '#475569', category: 'exploration' },
  MARS_ORBITER: { type: 'MARS_ORBITER', label: 'Mars Orbiter', description: 'Robotic mission to Mars orbit', icon: 'explore', color: '#DC2626', category: 'exploration' },
  MARS_LANDER: { type: 'MARS_LANDER', label: 'Mars Lander', description: 'Robotic landing on Mars', icon: 'target', color: '#B91C1C', category: 'exploration' },
  MARS_ROVER: { type: 'MARS_ROVER', label: 'Mars Rover', description: 'Robotic rover on Mars', icon: 'explore', color: '#991B1B', category: 'exploration' },
  PLANETARY_PROBE: { type: 'PLANETARY_PROBE', label: 'Planetary Probe', description: 'Robotic probe to other planets', icon: 'explore', color: '#EA580C', category: 'exploration' },
  DEEP_SPACE_PROBE: { type: 'DEEP_SPACE_PROBE', label: 'Deep Space Probe', description: 'Robotic probe to deep space', icon: 'explore', color: '#1E3A8A', category: 'exploration' },
  ASTEROID_MISSION: { type: 'ASTEROID_MISSION', label: 'Asteroid Mission', description: 'Mission to asteroids', icon: 'explore', color: '#6B7280', category: 'exploration' },
  SAMPLE_RETURN: { type: 'SAMPLE_RETURN', label: 'Sample Return', description: 'Return samples from space', icon: 'science', color: '#7C3AED', category: 'exploration' },
  TECHNOLOGY_DEMO: { type: 'TECHNOLOGY_DEMO', label: 'Technology Demo', description: 'Technology demonstration mission', icon: 'bolt', color: '#14B8A6', category: 'robotic' },
  EARTH_OBSERVATION: { type: 'EARTH_OBSERVATION', label: 'Earth Observation', description: 'Earth observation satellite', icon: 'globe', color: '#059669', category: 'satellite' },
  COMMUNICATIONS: { type: 'COMMUNICATIONS', label: 'Communications', description: 'Communications satellite', icon: 'satellite', color: '#0EA5E9', category: 'satellite' },
  NAVIGATION: { type: 'NAVIGATION', label: 'Navigation', description: 'Navigation satellite (GPS, etc.)', icon: 'explore', color: '#0284C7', category: 'satellite' },
  SCIENTIFIC: { type: 'SCIENTIFIC', label: 'Scientific', description: 'Scientific research mission', icon: 'science', color: '#9333EA', category: 'robotic' },
  MILITARY: { type: 'MILITARY', label: 'Military', description: 'Military/Defense satellite', icon: 'military', color: '#374151', category: 'satellite' }
};

export interface DestinationInfo {
  destination: MissionDestination;
  label: string;
  description: string;
  icon: string;
  distance?: string;
}

export const DESTINATION_INFO: Record<MissionDestination, DestinationInfo> = {
  LEO: { destination: 'LEO', label: 'Low Earth Orbit', description: '160-2,000 km altitude', icon: 'globe', distance: '~400 km' },
  MEO: { destination: 'MEO', label: 'Medium Earth Orbit', description: '2,000-35,786 km altitude', icon: 'globe', distance: '~20,200 km' },
  GEO: { destination: 'GEO', label: 'Geostationary Orbit', description: '35,786 km altitude', icon: 'globe', distance: '35,786 km' },
  HEO: { destination: 'HEO', label: 'High Earth Orbit', description: 'Above 35,786 km altitude', icon: 'globe', distance: '>35,786 km' },
  SSO: { destination: 'SSO', label: 'Sun-Synchronous Orbit', description: 'Polar orbit for Earth observation', icon: 'sun', distance: '~600-800 km' },
  LUNAR_ORBIT: { destination: 'LUNAR_ORBIT', label: 'Lunar Orbit', description: 'Orbit around the Moon', icon: 'moon', distance: '384,400 km' },
  LUNAR_SURFACE: { destination: 'LUNAR_SURFACE', label: 'Lunar Surface', description: 'Moon landing', icon: 'moon', distance: '384,400 km' },
  EARTH_MOON_L1: { destination: 'EARTH_MOON_L1', label: 'Earth-Moon L1', description: 'Lagrange point 1', icon: 'radar', distance: '~326,500 km' },
  EARTH_MOON_L2: { destination: 'EARTH_MOON_L2', label: 'Earth-Moon L2', description: 'Lagrange point 2', icon: 'radar', distance: '~448,900 km' },
  MARS_ORBIT: { destination: 'MARS_ORBIT', label: 'Mars Orbit', description: 'Orbit around Mars', icon: 'explore', distance: '~225M km' },
  MARS_SURFACE: { destination: 'MARS_SURFACE', label: 'Mars Surface', description: 'Mars landing', icon: 'explore', distance: '~225M km' },
  VENUS: { destination: 'VENUS', label: 'Venus', description: 'Venus flyby, orbit, or landing', icon: 'explore', distance: '~41M km' },
  MERCURY: { destination: 'MERCURY', label: 'Mercury', description: 'Mercury flyby or orbit', icon: 'explore', distance: '~77M km' },
  JUPITER: { destination: 'JUPITER', label: 'Jupiter', description: 'Jupiter system', icon: 'explore', distance: '~628M km' },
  SATURN: { destination: 'SATURN', label: 'Saturn', description: 'Saturn system', icon: 'explore', distance: '~1.2B km' },
  OUTER_PLANETS: { destination: 'OUTER_PLANETS', label: 'Outer Planets', description: 'Uranus, Neptune, or beyond', icon: 'explore', distance: '>2.8B km' },
  ASTEROID: { destination: 'ASTEROID', label: 'Asteroid', description: 'Asteroid belt or NEO', icon: 'explore', distance: 'Varies' },
  COMET: { destination: 'COMET', label: 'Comet', description: 'Comet rendezvous', icon: 'star', distance: 'Varies' },
  SUN: { destination: 'SUN', label: 'Sun', description: 'Solar observation', icon: 'sun', distance: '~150M km' },
  INTERSTELLAR: { destination: 'INTERSTELLAR', label: 'Interstellar', description: 'Beyond the solar system', icon: 'star', distance: '>18B km' }
};

export interface MissionStatistics {
  total: number;
  byStatus: { status: MissionStatus; count: number }[];
  byType: { type: MissionType; count: number }[];
  byDestination: { destination: MissionDestination; count: number }[];
  byCountry: { countryId: string | number; countryName: string; count: number }[];
  byYear: { year: number; count: number }[];
  crewedCount: number;
  roboticCount: number;
  successRate: number;
  activeMissions: number;
  upcomingMissions: number;
}
