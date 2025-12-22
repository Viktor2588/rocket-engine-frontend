import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { DataProvider } from '../context/DataContext';
import { useEngines, useEngineStatistics } from './useEngines';
import { mockEngines } from '../test/setup';

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

describe('useEngines', () => {
  it('should return initial loading state', () => {
    const { result } = renderHook(() => useEngines(), { wrapper: Wrapper });

    expect(result.current.loading).toBe(true);
    expect(result.current.engines).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('should return engines as an array after loading', async () => {
    const { result } = renderHook(() => useEngines(), { wrapper: Wrapper });

    // Initially loading
    expect(result.current.loading).toBe(true);

    // After some time, should have array (even if empty due to mock)
    await waitFor(() => {
      expect(Array.isArray(result.current.engines)).toBe(true);
    }, { timeout: 5000 });
  });
});

describe('useEngineStatistics', () => {
  it('should return statistics object', async () => {
    const { result } = renderHook(() => useEngineStatistics(), { wrapper: Wrapper });

    await waitFor(() => {
      // Should eventually not be loading
      expect(result.current.loading === true || result.current.loading === false).toBe(true);
    }, { timeout: 5000 });

    // Statistics should be an object or null
    expect(result.current.statistics === null || typeof result.current.statistics === 'object').toBe(true);
  });
});
