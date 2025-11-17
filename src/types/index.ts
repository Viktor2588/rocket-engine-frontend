/**
 * Type definitions for Rocket Engine API and application state
 */

export interface Engine {
  id: string | number;
  name: string;
  designer: string;
  type: string;
  isp: number;
  twr: number;
  propellant: string;
  status?: string;
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
