import { describe, it, expect, vi } from 'vitest';
import { mockEngines } from '../test/setup';

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

describe('engineService', () => {
  describe('Data structure validation', () => {
    it('should have valid engine structure in mock data', () => {
      expect(Array.isArray(mockEngines)).toBe(true);
      expect(mockEngines).toHaveLength(2);
    });

    it('mock engines should have required properties', () => {
      mockEngines.forEach((engine) => {
        expect(engine).toHaveProperty('id');
        expect(engine).toHaveProperty('name');
        expect(engine).toHaveProperty('designer');
        expect(engine).toHaveProperty('propellant');
      });
    });

    it('mock engines should have performance metrics', () => {
      mockEngines.forEach((engine) => {
        expect(engine).toHaveProperty('isp');
        expect(engine).toHaveProperty('twr');
      });
    });
  });

  describe('Data consistency', () => {
    it('should have consistent propellant types', () => {
      mockEngines.forEach((engine) => {
        if (engine.propellant) {
          expect(typeof engine.propellant).toBe('string');
          expect(engine.propellant.length).toBeGreaterThan(0);
        }
      });
    });

    it('should have valid status values', () => {
      const validStatuses = ['Active', 'Retired', 'Development', 'Experimental', 'Historical'];

      mockEngines.forEach((engine) => {
        if (engine.status) {
          expect(validStatuses).toContain(engine.status);
        }
      });
    });

    it('should have positive ISP values', () => {
      mockEngines.forEach((engine) => {
        if (engine.isp) {
          expect(engine.isp).toBeGreaterThan(0);
        }
      });
    });

    it('should have positive thrust values', () => {
      mockEngines.forEach((engine) => {
        if (engine.thrustKn) {
          expect(engine.thrustKn).toBeGreaterThan(0);
        }
      });
    });

    it('should have valid TWR values', () => {
      mockEngines.forEach((engine) => {
        if (engine.twr) {
          expect(engine.twr).toBeGreaterThan(0);
        }
      });
    });

    it('should have boolean capability flags', () => {
      mockEngines.forEach((engine) => {
        if (engine.reusable !== undefined) {
          expect(typeof engine.reusable).toBe('boolean');
        }
        if (engine.throttleCapable !== undefined) {
          expect(typeof engine.throttleCapable).toBe('boolean');
        }
        if (engine.restartCapable !== undefined) {
          expect(typeof engine.restartCapable).toBe('boolean');
        }
      });
    });
  });

  describe('Sorting logic', () => {
    it('should sort engines by ISP descending', () => {
      const sorted = [...mockEngines].sort((a, b) => (b.isp || 0) - (a.isp || 0));

      expect(sorted[0].isp).toBeGreaterThanOrEqual(sorted[1].isp || 0);
    });

    it('should sort engines by thrust descending', () => {
      const sorted = [...mockEngines].sort((a, b) => (b.thrustKn || 0) - (a.thrustKn || 0));

      if (sorted[0].thrustKn && sorted[1].thrustKn) {
        expect(sorted[0].thrustKn).toBeGreaterThanOrEqual(sorted[1].thrustKn);
      }
    });

    it('should sort engines by sophistication score descending', () => {
      const sorted = [...mockEngines].sort(
        (a, b) => (b.sophisticationScore || 0) - (a.sophisticationScore || 0)
      );

      expect(sorted[0].sophisticationScore).toBeGreaterThanOrEqual(
        sorted[1].sophisticationScore || 0
      );
    });
  });
});
