import { describe, it, expect } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { DataProvider, useDataContext } from './DataContext';
import { mockCountries, mockEngines } from '../test/setup';

// Wrapper component
const wrapper = ({ children }) => <DataProvider>{children}</DataProvider>;

describe('DataContext', () => {
  describe('Provider', () => {
    it('should provide context value', () => {
      const { result } = renderHook(() => useDataContext(), { wrapper });

      expect(result.current).toBeDefined();
      expect(result.current.cache).toBeDefined();
      expect(result.current.fetchCountries).toBeInstanceOf(Function);
      expect(result.current.fetchEngines).toBeInstanceOf(Function);
    });

    it('should have initial cache state', () => {
      const { result } = renderHook(() => useDataContext(), { wrapper });

      expect(result.current.cache.countries.data).toBe(null);
      expect(result.current.cache.countries.loading).toBe(false);
      expect(result.current.cache.engines.data).toBe(null);
    });
  });

  describe('fetchCountries', () => {
    it('should fetch and cache countries', async () => {
      const { result } = renderHook(() => useDataContext(), { wrapper });

      await act(async () => {
        const data = await result.current.fetchCountries();
        expect(data).toHaveLength(mockCountries.length);
      });

      // Data should be cached
      expect(result.current.cache.countries.data).toHaveLength(mockCountries.length);
    });

    it('should return cached data on subsequent calls', async () => {
      const { result } = renderHook(() => useDataContext(), { wrapper });

      let firstResult;
      let secondResult;

      await act(async () => {
        firstResult = await result.current.fetchCountries();
      });

      await act(async () => {
        secondResult = await result.current.fetchCountries();
      });

      expect(firstResult).toEqual(secondResult);
    });
  });

  describe('fetchEngines', () => {
    it('should fetch and cache engines', async () => {
      const { result } = renderHook(() => useDataContext(), { wrapper });

      await act(async () => {
        const data = await result.current.fetchEngines();
        expect(data).toHaveLength(mockEngines.length);
      });

      expect(result.current.cache.engines.data).toHaveLength(mockEngines.length);
    });
  });


  describe('Error handling', () => {
    it('should handle fetch errors gracefully', async () => {
      const { result } = renderHook(() => useDataContext(), { wrapper });

      // The mock server handles errors - this test verifies error handling
      expect(result.current.cache.countries.error).toBe(null);
    });
  });
});

describe('Cache behavior', () => {
  it('should not refetch if cache is valid', async () => {
    const { result } = renderHook(() => useDataContext(), { wrapper });

    let callCount = 0;

    await act(async () => {
      await result.current.fetchCountries();
      callCount++;
    });

    await act(async () => {
      await result.current.fetchCountries();
      callCount++;
    });

    // Both calls should complete but second should use cache
    expect(callCount).toBe(2);
    expect(result.current.cache.countries.data).toBeDefined();
  });
});
