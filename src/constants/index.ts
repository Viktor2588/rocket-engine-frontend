/**
 * Application constants - centralized configuration and magic strings
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Sort Options
export const SORT_OPTIONS = {
  NAME: 'name',
  ISP: 'isp',
  TWR: 'twr',
  DESIGNER: 'designer',
} as const;

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

// Sort UI Labels
export const SORT_LABELS = {
  [SORT_OPTIONS.NAME]: 'Name',
  [SORT_OPTIONS.ISP]: 'ISP (seconds)',
  [SORT_OPTIONS.TWR]: 'Thrust-to-Weight',
  [SORT_OPTIONS.DESIGNER]: 'Designer',
} as const;

// Chart Configuration
export const CHART_CONFIG = {
  COLORS: {
    PRIMARY: 'rgba(59, 130, 246, 0.5)',
    SECONDARY: 'rgba(239, 68, 68, 0.5)',
    SUCCESS: 'rgba(34, 197, 94, 0.5)',
    WARNING: 'rgba(251, 146, 60, 0.5)',
  },
  BORDER_COLORS: {
    PRIMARY: 'rgb(59, 130, 246)',
    SECONDARY: 'rgb(239, 68, 68)',
    SUCCESS: 'rgb(34, 197, 94)',
    WARNING: 'rgb(251, 146, 60)',
  },
  BORDER_WIDTH: 2,
  FONT_SIZE: 12,
} as const;

// UI Configuration
export const UI_CONFIG = {
  LOADING_TIMEOUT: 5000,
  DEBOUNCE_DELAY: 300,
  ANIMATION_DURATION: 300,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  FETCH_ENGINES_FAILED: 'Failed to fetch engines. Please try again.',
  FETCH_ENGINE_FAILED: 'Failed to load engine details. Please try again.',
  COMPARE_FAILED: 'Failed to compare engines. Please try again.',
  INVALID_ENGINE_ID: 'Invalid engine ID. Please select a valid engine.',
  INVALID_INPUT: 'Invalid input. Please check your data.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INTERNAL_ERROR: 'An unexpected error occurred. Please try again.',
  NOT_FOUND: 'The requested resource was not found.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  // Country-specific errors
  FETCH_COUNTRIES_FAILED: 'Failed to fetch countries. Please try again.',
  FETCH_COUNTRY_FAILED: 'Failed to load country details. Please try again.',
  COUNTRY_NOT_FOUND: 'Country not found.',
  INVALID_COUNTRY_CODE: 'Invalid country code.',
  COMPARE_COUNTRIES_FAILED: 'Failed to compare countries. Please try again.',
  FETCH_RANKINGS_FAILED: 'Failed to fetch rankings. Please try again.',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  ENGINE_CREATED: 'Engine created successfully',
  ENGINE_UPDATED: 'Engine updated successfully',
  ENGINE_DELETED: 'Engine deleted successfully',
  COMPARISON_LOADED: 'Comparison loaded successfully',
  COUNTRY_CREATED: 'Country created successfully',
  COUNTRY_UPDATED: 'Country updated successfully',
} as const;

// Capability Categories with Labels and Weights
export const CAPABILITY_CATEGORIES = {
  launchCapability: {
    label: 'Launch Capability',
    weight: 0.20,
    description: 'Active rockets, launch frequency, payload capacity, success rate',
    icon: '🚀',
  },
  propulsionTechnology: {
    label: 'Propulsion Technology',
    weight: 0.15,
    description: 'Engine count, ISP averages, propellant diversity, advanced cycles',
    icon: '⚡',
  },
  humanSpaceflight: {
    label: 'Human Spaceflight',
    weight: 0.20,
    description: 'Crewed missions, space stations, astronaut count, duration',
    icon: '👨‍🚀',
  },
  deepSpaceExploration: {
    label: 'Deep Space Exploration',
    weight: 0.15,
    description: 'Moon/Mars missions, probes, sample return capability',
    icon: '🌙',
  },
  satelliteInfrastructure: {
    label: 'Satellite Infrastructure',
    weight: 0.15,
    description: 'Active satellites, satellite types, GNSS, constellations',
    icon: '📡',
  },
  groundInfrastructure: {
    label: 'Ground Infrastructure',
    weight: 0.10,
    description: 'Launch sites, tracking stations, manufacturing',
    icon: '🏗️',
  },
  technologicalIndependence: {
    label: 'Technological Independence',
    weight: 0.05,
    description: 'Self-reliance in space technology',
    icon: '🔧',
  },
} as const;

// Regions
export const REGIONS = {
  NORTH_AMERICA: 'North America',
  EUROPE: 'Europe',
  ASIA: 'Asia',
  OCEANIA: 'Oceania',
  SOUTH_AMERICA: 'South America',
  MIDDLE_EAST: 'Middle East',
  AFRICA: 'Africa',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  ENGINE_LIST: '/engines',
  ENGINE_DETAIL: '/engines/:id',
  COMPARE_ENGINES: '/compare/engines',
  COUNTRY_LIST: '/countries',
  COUNTRY_DETAIL: '/countries/:code',
  COUNTRY_TIMELINE: '/countries/:code/timeline',
  COMPARE_COUNTRIES: '/compare/countries',
  COMPARE: '/compare',
  ABOUT: '/about',
  NOT_FOUND: '*',
} as const;

// Page Titles
export const PAGE_TITLES = {
  HOME: 'Space Capabilities Dashboard',
  DASHBOARD: 'Global Space Overview',
  ENGINE_LIST: 'Rocket Engines',
  ENGINE_DETAIL: 'Engine Details',
  COMPARE_ENGINES: 'Compare Engines',
  COUNTRY_LIST: 'Space Programs by Country',
  COUNTRY_DETAIL: 'Country Space Program',
  COUNTRY_TIMELINE: 'Space Program Timeline',
  COMPARE_COUNTRIES: 'Compare Countries',
  COMPARE: 'Compare Engines',
  ABOUT: 'About',
  NOT_FOUND: 'Page Not Found',
} as const;

// Validation Rules
export const VALIDATION = {
  ENGINE_ID_REGEX: /^\d+$/,
  NAME_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 255,
  SORT_KEYS: Object.values(SORT_OPTIONS),
  SORT_ORDERS: Object.values(SORT_ORDER),
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  SORT_PREFERENCE: 'rocket_engine_sort_preference',
  THEME: 'rocket_engine_theme',
  RECENTLY_VIEWED: 'rocket_engine_recently_viewed',
} as const;

// Feature Flags
export const FEATURES = {
  ENABLE_COMPARISON: true,
  ENABLE_EXPORT: false,
  ENABLE_FAVORITES: false,
  ENABLE_FILTERS: false,
} as const;
