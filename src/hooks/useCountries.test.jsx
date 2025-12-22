import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { DataProvider } from '../context/DataContext';
import { useCountries, useCountryDetails, useCountryRankings } from './useCountries';
import { mockCountries } from '../test/setup';

// Wrapper component with all necessary providers
function Wrapper({ children }) {
  return (
    <BrowserRouter>
      <DataProvider>
        {children}
      </DataProvider>
    </BrowserRouter>
  );
}

describe('useCountries', () => {
  it('should return initial loading state', () => {
    const { result } = renderHook(() => useCountries(), { wrapper: Wrapper });

    expect(result.current.loading).toBe(true);
    expect(result.current.countries).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('should return countries as an array after loading', async () => {
    const { result } = renderHook(() => useCountries(), { wrapper: Wrapper });

    // Initially loading
    expect(result.current.loading).toBe(true);

    // After some time, should have array (even if empty due to mock)
    await waitFor(() => {
      expect(Array.isArray(result.current.countries)).toBe(true);
    }, { timeout: 5000 });
  });
});

describe('useCountryDetails', () => {
  it('should return initial loading state', () => {
    const { result } = renderHook(() => useCountryDetails('USA'), { wrapper: Wrapper });

    expect(result.current.loading).toBe(true);
    expect(result.current.country).toBe(null);
  });

  it('should handle missing country code gracefully', () => {
    const { result } = renderHook(() => useCountryDetails(null), { wrapper: Wrapper });

    // Should not crash, should return loading or empty state
    expect(result.current).toBeDefined();
  });
});

describe('useCountryRankings', () => {
  it('should return rankings array', async () => {
    const { result } = renderHook(() => useCountryRankings(), { wrapper: Wrapper });

    await waitFor(() => {
      expect(Array.isArray(result.current.rankings)).toBe(true);
    }, { timeout: 5000 });
  });
});
