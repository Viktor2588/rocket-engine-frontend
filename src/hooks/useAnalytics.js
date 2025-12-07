import { useMemo } from 'react';
import { useCountries } from './useCountries';
import { useEngines } from './useEngines';
import { useLaunchVehicles } from './useLaunchVehicles';
import { useAllMissions } from './useMissions';
import { useSatellites } from './useSatellites';
import { useLaunchSites } from './useLaunchSites';

/**
 * Hook for global space statistics
 */
export function useGlobalStatistics() {
  const { countries, loading: countriesLoading } = useCountries();
  const { engines, loading: enginesLoading } = useEngines();
  const { vehicles, loading: vehiclesLoading } = useLaunchVehicles();
  const { missions, loading: missionsLoading } = useAllMissions();
  const { satellites, loading: satellitesLoading } = useSatellites();
  const { launchSites, loading: sitesLoading } = useLaunchSites();

  const loading = countriesLoading || enginesLoading || vehiclesLoading ||
                  missionsLoading || satellitesLoading || sitesLoading;

  const statistics = useMemo(() => {
    if (loading) return null;

    return {
      // Country statistics
      totalCountries: countries.length,
      countriesWithLaunchCapability: countries.filter(c => c.independentLaunchCapable).length,
      countriesWithHumanSpaceflight: countries.filter(c => c.humanSpaceflightCapable).length,
      countriesWithReusableRockets: countries.filter(c => c.reusableRocketCapable).length,
      countriesWithDeepSpace: countries.filter(c => c.deepSpaceCapable).length,
      countriesWithSpaceStation: countries.filter(c => c.spaceStationCapable).length,

      // Engine statistics
      totalEngines: engines.length,
      enginesByPropellant: Object.entries(
        engines.reduce((acc, e) => {
          const prop = e.propellant || 'Unknown';
          acc[prop] = (acc[prop] || 0) + 1;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1]),
      enginesByCycle: Object.entries(
        engines.reduce((acc, e) => {
          const cycle = e.cycle || 'Unknown';
          acc[cycle] = (acc[cycle] || 0) + 1;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1]),

      // Vehicle statistics
      totalVehicles: vehicles.length,
      activeVehicles: vehicles.filter(v => v.status === 'Active').length,
      reusableVehicles: vehicles.filter(v => v.reusable).length,
      humanRatedVehicles: vehicles.filter(v => v.humanRated).length,

      // Mission statistics
      totalMissions: missions.length,
      crewedMissions: missions.filter(m => m.crewed).length,
      successfulMissions: missions.filter(m => m.status === 'COMPLETED' || m.status === 'SUCCESS').length,
      activeMissions: missions.filter(m => m.status === 'ACTIVE').length,

      // Satellite statistics
      totalSatellites: satellites.length,
      activeSatellites: satellites.filter(s => s.status === 'Active').length,
      satellitesByType: Object.entries(
        satellites.reduce((acc, s) => {
          const type = s.type || 'Unknown';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1]),
      satellitesByOrbit: Object.entries(
        satellites.reduce((acc, s) => {
          const orbit = s.orbitType || 'Unknown';
          acc[orbit] = (acc[orbit] || 0) + 1;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1]),

      // Launch site statistics
      totalLaunchSites: launchSites.length,
      activeLaunchSites: launchSites.filter(s => s.status === 'Active').length,
      humanRatedSites: launchSites.filter(s => s.humanRated).length,

      // Total launches across all sites
      totalLaunches: launchSites.reduce((acc, s) => acc + (s.totalLaunches || 0), 0),
      successfulLaunches: launchSites.reduce((acc, s) => acc + (s.successfulLaunches || 0), 0),
    };
  }, [countries, engines, vehicles, missions, satellites, launchSites, loading]);

  return { statistics, loading };
}

/**
 * Hook for world records
 */
export function useWorldRecords() {
  const { countries } = useCountries();
  const { engines } = useEngines();
  const { vehicles } = useLaunchVehicles();
  const { launchSites } = useLaunchSites();

  const records = useMemo(() => {
    // Most powerful engine
    const mostPowerfulEngine = [...engines].sort((a, b) =>
      (b.thrustKn || 0) - (a.thrustKn || 0)
    )[0];

    // Most efficient engine (highest ISP)
    const mostEfficientEngine = [...engines].sort((a, b) =>
      (b.specificImpulseS || 0) - (a.specificImpulseS || 0)
    )[0];

    // Highest chamber pressure
    const highestPressureEngine = [...engines].sort((a, b) =>
      (b.chamberPressureBar || 0) - (a.chamberPressureBar || 0)
    )[0];

    // Most launches (country)
    const mostLaunchesCountry = [...countries].sort((a, b) =>
      (b.totalLaunches || 0) - (a.totalLaunches || 0)
    )[0];

    // Highest success rate (min 100 launches)
    const highestSuccessRate = [...countries]
      .filter(c => (c.totalLaunches || 0) >= 100)
      .sort((a, b) => (b.launchSuccessRate || 0) - (a.launchSuccessRate || 0))[0];

    // Most capable country (highest SCI)
    const mostCapableCountry = [...countries].sort((a, b) =>
      (b.overallCapabilityScore || 0) - (a.overallCapabilityScore || 0)
    )[0];

    // Largest payload to LEO
    const largestPayload = [...vehicles].sort((a, b) =>
      (b.payloadToLeoKg || 0) - (a.payloadToLeoKg || 0)
    )[0];

    // Most reusable vehicle (most reuses)
    const mostReusable = [...vehicles]
      .filter(v => v.reusable)
      .sort((a, b) => (b.totalLaunches || 0) - (a.totalLaunches || 0))[0];

    // Busiest launch site
    const busiestSite = [...launchSites].sort((a, b) =>
      (b.totalLaunches || 0) - (a.totalLaunches || 0)
    )[0];

    // Oldest operating launch site
    const oldestSite = [...launchSites]
      .filter(s => s.status === 'Active' && s.established)
      .sort((a, b) => (a.established || 9999) - (b.established || 9999))[0];

    return {
      mostPowerfulEngine,
      mostEfficientEngine,
      highestPressureEngine,
      mostLaunchesCountry,
      highestSuccessRate,
      mostCapableCountry,
      largestPayload,
      mostReusable,
      busiestSite,
      oldestSite,
    };
  }, [countries, engines, vehicles, launchSites]);

  return { records };
}

/**
 * Hook for technology trends analysis
 */
export function useTechnologyTrends() {
  const { engines } = useEngines();
  const { vehicles } = useLaunchVehicles();

  const trends = useMemo(() => {
    // Propellant evolution
    const propellantTrend = {
      traditional: engines.filter(e =>
        ['RP-1/LOX', 'Kerosene/LOX', 'UDMH/N2O4'].includes(e.propellant)
      ).length,
      hydrogen: engines.filter(e =>
        e.propellant?.includes('LH2') || e.propellant?.includes('Hydrogen')
      ).length,
      methane: engines.filter(e =>
        e.propellant?.includes('CH4') || e.propellant?.includes('Methane')
      ).length,
      solid: engines.filter(e =>
        e.propellant?.includes('Solid') || e.propellant?.includes('HTPB')
      ).length,
    };

    // Cycle type distribution
    const cycleTrend = {
      gasGenerator: engines.filter(e =>
        e.cycle?.toLowerCase().includes('gas generator')
      ).length,
      stagedCombustion: engines.filter(e =>
        e.cycle?.toLowerCase().includes('staged combustion')
      ).length,
      fullFlow: engines.filter(e =>
        e.cycle?.toLowerCase().includes('full-flow')
      ).length,
      expander: engines.filter(e =>
        e.cycle?.toLowerCase().includes('expander')
      ).length,
      pressureFed: engines.filter(e =>
        e.cycle?.toLowerCase().includes('pressure')
      ).length,
    };

    // Reusability trend
    const reusabilityTrend = {
      reusableEngines: engines.filter(e => e.reusable).length,
      expendableEngines: engines.filter(e => !e.reusable).length,
      reusableVehicles: vehicles.filter(v => v.reusable).length,
      expendableVehicles: vehicles.filter(v => !v.reusable).length,
    };

    // Performance evolution - average ISP by decade (estimated from names/year)
    const performanceByEra = {
      early: engines.filter(e => e.firstFlightYear && e.firstFlightYear < 1970),
      mid: engines.filter(e => e.firstFlightYear && e.firstFlightYear >= 1970 && e.firstFlightYear < 2000),
      modern: engines.filter(e => e.firstFlightYear && e.firstFlightYear >= 2000),
    };

    return {
      propellantTrend,
      cycleTrend,
      reusabilityTrend,
      performanceByEra,
    };
  }, [engines, vehicles]);

  return { trends };
}

/**
 * Hook for emerging nations analysis
 */
export function useEmergingNations() {
  const { countries } = useCountries();

  const analysis = useMemo(() => {
    // Established space powers (top 5 by SCI)
    const established = [...countries]
      .sort((a, b) => (b.overallCapabilityScore || 0) - (a.overallCapabilityScore || 0))
      .slice(0, 5);

    // Emerging powers (have launch capability but lower SCI)
    const emerging = [...countries]
      .filter(c => c.independentLaunchCapable && (c.overallCapabilityScore || 0) < 70)
      .sort((a, b) => (b.overallCapabilityScore || 0) - (a.overallCapabilityScore || 0));

    // Rising contenders (no launch capability yet but active programs)
    const rising = [...countries]
      .filter(c => !c.independentLaunchCapable && (c.overallCapabilityScore || 0) > 10)
      .sort((a, b) => (b.overallCapabilityScore || 0) - (a.overallCapabilityScore || 0));

    // Countries by region
    const byRegion = countries.reduce((acc, c) => {
      const region = c.region || 'Other';
      if (!acc[region]) acc[region] = [];
      acc[region].push(c);
      return acc;
    }, {});

    // Countries with specific achievements
    const achievements = {
      crewedSpaceflight: countries.filter(c => c.humanSpaceflightCapable),
      reusableRockets: countries.filter(c => c.reusableRocketCapable),
      deepSpaceProbes: countries.filter(c => c.deepSpaceCapable),
      spaceStations: countries.filter(c => c.spaceStationCapable),
      lunarLanding: countries.filter(c => c.lunarLandingCapable),
      marsLanding: countries.filter(c => c.marsLandingCapable),
    };

    return {
      established,
      emerging,
      rising,
      byRegion,
      achievements,
    };
  }, [countries]);

  return { analysis };
}

/**
 * Hook for launches per year data
 */
export function useLaunchesPerYear() {
  // Mock data for demonstration - would come from backend
  const data = useMemo(() => ({
    years: [2019, 2020, 2021, 2022, 2023, 2024],
    byCountry: {
      USA: [21, 40, 51, 78, 109, 135],
      CHN: [34, 39, 55, 62, 67, 68],
      RUS: [25, 17, 25, 22, 19, 16],
      IND: [6, 2, 2, 5, 7, 8],
      JPN: [4, 4, 3, 1, 2, 4],
      EUR: [6, 5, 6, 5, 3, 4],
    },
    total: [102, 114, 145, 180, 212, 240],
  }), []);

  return { data };
}

export default useGlobalStatistics;
