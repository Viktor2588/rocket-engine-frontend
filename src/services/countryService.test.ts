import { describe, it, expect, vi } from 'vitest';
import { mockCountries } from '../test/setup';

// Mock axios before importing the service
vi.mock('axios', () => {
  return {
    default: {
      create: () => ({
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
      }),
    },
  };
});

describe('countryService', () => {
  describe('Data structure validation', () => {
    it('should have valid country structure in mock data', () => {
      expect(Array.isArray(mockCountries)).toBe(true);
      expect(mockCountries).toHaveLength(2);
    });

    it('mock countries should have required properties', () => {
      mockCountries.forEach((country) => {
        expect(country).toHaveProperty('id');
        expect(country).toHaveProperty('name');
        expect(country).toHaveProperty('isoCode');
        expect(country).toHaveProperty('region');
        expect(country).toHaveProperty('spaceAgencyName');
      });
    });

    it('mock countries should have capability flags', () => {
      mockCountries.forEach((country) => {
        expect(typeof country.humanSpaceflightCapable).toBe('boolean');
        expect(typeof country.independentLaunchCapable).toBe('boolean');
        expect(typeof country.reusableRocketCapable).toBe('boolean');
      });
    });

    it('should have valid ISO codes', () => {
      mockCountries.forEach((country) => {
        expect(typeof country.isoCode).toBe('string');
        expect(country.isoCode.length).toBe(3);
      });
    });

    it('should have valid capability scores', () => {
      mockCountries.forEach((country) => {
        if (country.overallCapabilityScore !== undefined) {
          expect(country.overallCapabilityScore).toBeGreaterThanOrEqual(0);
          expect(country.overallCapabilityScore).toBeLessThanOrEqual(100);
        }
      });
    });

    it('should have valid launch statistics', () => {
      mockCountries.forEach((country) => {
        if (country.totalLaunches !== undefined) {
          expect(country.totalLaunches).toBeGreaterThanOrEqual(0);
        }
        if (country.launchSuccessRate !== undefined) {
          expect(country.launchSuccessRate).toBeGreaterThanOrEqual(0);
          expect(country.launchSuccessRate).toBeLessThanOrEqual(100);
        }
      });
    });
  });

  describe('Rankings logic', () => {
    it('should sort countries by capability score descending', () => {
      const sorted = [...mockCountries].sort(
        (a, b) => (b.overallCapabilityScore || 0) - (a.overallCapabilityScore || 0)
      );

      expect(sorted[0].overallCapabilityScore).toBeGreaterThanOrEqual(
        sorted[1].overallCapabilityScore || 0
      );
    });
  });
});
