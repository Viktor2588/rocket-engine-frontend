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
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  ENGINE_CREATED: 'Engine created successfully',
  ENGINE_UPDATED: 'Engine updated successfully',
  ENGINE_DELETED: 'Engine deleted successfully',
  COMPARISON_LOADED: 'Comparison loaded successfully',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  ENGINE_DETAIL: '/engines/:id',
  COMPARE: '/compare',
  ABOUT: '/about',
  NOT_FOUND: '*',
} as const;

// Page Titles
export const PAGE_TITLES = {
  HOME: 'Rocket Engine Comparison',
  ENGINE_DETAIL: 'Engine Details',
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
