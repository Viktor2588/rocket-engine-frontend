import { useState, useMemo, useCallback } from 'react';
import { useCountries } from './useCountries';
import { useEngines } from './useEngines';
import { useLaunchVehicles } from './useLaunchVehicles';
import { useAllMissions } from './useMissions';
import { useSatellites } from './useSatellites';
import { useLaunchSites } from './useLaunchSites';

/**
 * Entity type definitions with icons and routes
 */
const ENTITY_TYPES = {
  country: {
    label: 'Country',
    icon: '🌍',
    route: (item) => `/countries/${item.isoCode}`,
    color: 'indigo',
  },
  engine: {
    label: 'Engine',
    icon: '🚀',
    route: (item) => `/engines/${item.id}`,
    color: 'blue',
  },
  vehicle: {
    label: 'Vehicle',
    icon: '🛸',
    route: (item) => `/vehicles/${item.id}`,
    color: 'purple',
  },
  mission: {
    label: 'Mission',
    icon: '🛰️',
    route: (item) => `/missions/${item.id}`,
    color: 'green',
  },
  satellite: {
    label: 'Satellite',
    icon: '📡',
    route: (item) => `/satellites/${item.id}`,
    color: 'cyan',
  },
  launchSite: {
    label: 'Launch Site',
    icon: '🏗️',
    route: (item) => `/launch-sites/${item.id}`,
    color: 'orange',
  },
};

/**
 * Search scoring function
 */
function calculateScore(item, searchTerms, fields) {
  let score = 0;
  const lowerFields = fields.map(f => (item[f] || '').toString().toLowerCase());

  searchTerms.forEach(term => {
    lowerFields.forEach((fieldValue, idx) => {
      if (fieldValue === term) {
        score += 100; // Exact match
      } else if (fieldValue.startsWith(term)) {
        score += 50; // Starts with
      } else if (fieldValue.includes(term)) {
        score += 25; // Contains
      }
      // Boost for primary fields (first field gets higher weight)
      if (idx === 0) score *= 1.5;
    });
  });

  return score;
}

/**
 * Global search hook
 */
export function useGlobalSearch() {
  const [query, setQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState(Object.keys(ENTITY_TYPES));
  const [isOpen, setIsOpen] = useState(false);

  const { countries, loading: countriesLoading } = useCountries();
  const { engines, loading: enginesLoading } = useEngines();
  const { vehicles, loading: vehiclesLoading } = useLaunchVehicles();
  const { missions, loading: missionsLoading } = useAllMissions();
  const { satellites, loading: satellitesLoading } = useSatellites();
  const { launchSites, loading: sitesLoading } = useLaunchSites();

  const isLoading = countriesLoading || enginesLoading || vehiclesLoading ||
                    missionsLoading || satellitesLoading || sitesLoading;

  // Search results
  const results = useMemo(() => {
    if (!query || query.length < 2) return [];

    const searchTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 0);
    const allResults = [];

    // Search countries
    if (selectedTypes.includes('country')) {
      countries.forEach(country => {
        const score = calculateScore(country, searchTerms, [
          'name', 'isoCode', 'spaceAgencyName', 'spaceAgencyAcronym', 'region'
        ]);
        if (score > 0) {
          allResults.push({
            type: 'country',
            item: country,
            score,
            title: country.name,
            subtitle: country.spaceAgencyName || country.isoCode,
            image: country.flagUrl,
          });
        }
      });
    }

    // Search engines
    if (selectedTypes.includes('engine')) {
      engines.forEach(engine => {
        const score = calculateScore(engine, searchTerms, [
          'name', 'manufacturer', 'propellant', 'cycle', 'countryId'
        ]);
        if (score > 0) {
          allResults.push({
            type: 'engine',
            item: engine,
            score,
            title: engine.name,
            subtitle: `${engine.manufacturer || ''} • ${engine.propellant || ''}`.trim(),
          });
        }
      });
    }

    // Search vehicles
    if (selectedTypes.includes('vehicle')) {
      vehicles.forEach(vehicle => {
        const score = calculateScore(vehicle, searchTerms, [
          'name', 'manufacturer', 'countryId', 'status'
        ]);
        if (score > 0) {
          allResults.push({
            type: 'vehicle',
            item: vehicle,
            score,
            title: vehicle.name,
            subtitle: `${vehicle.manufacturer || ''} • ${vehicle.status || ''}`.trim(),
          });
        }
      });
    }

    // Search missions
    if (selectedTypes.includes('mission')) {
      missions.forEach(mission => {
        const score = calculateScore(mission, searchTerms, [
          'name', 'missionType', 'destination', 'countryId', 'status'
        ]);
        if (score > 0) {
          allResults.push({
            type: 'mission',
            item: mission,
            score,
            title: mission.name,
            subtitle: `${mission.missionType || ''} • ${mission.status || ''}`.trim(),
          });
        }
      });
    }

    // Search satellites
    if (selectedTypes.includes('satellite')) {
      satellites.forEach(satellite => {
        const score = calculateScore(satellite, searchTerms, [
          'name', 'type', 'operator', 'countryId', 'constellation'
        ]);
        if (score > 0) {
          allResults.push({
            type: 'satellite',
            item: satellite,
            score,
            title: satellite.name,
            subtitle: `${satellite.type || ''} • ${satellite.operator || ''}`.trim(),
          });
        }
      });
    }

    // Search launch sites
    if (selectedTypes.includes('launchSite')) {
      launchSites.forEach(site => {
        const score = calculateScore(site, searchTerms, [
          'name', 'operator', 'countryId', 'region'
        ]);
        if (score > 0) {
          allResults.push({
            type: 'launchSite',
            item: site,
            score,
            title: site.name,
            subtitle: `${site.operator || ''} • ${site.countryId || ''}`.trim(),
          });
        }
      });
    }

    // Sort by score and limit results
    return allResults
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
  }, [query, selectedTypes, countries, engines, vehicles, missions, satellites, launchSites]);

  // Group results by type
  const groupedResults = useMemo(() => {
    const groups = {};
    results.forEach(result => {
      if (!groups[result.type]) {
        groups[result.type] = [];
      }
      groups[result.type].push(result);
    });
    return groups;
  }, [results]);

  // Toggle type filter
  const toggleType = useCallback((type) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      }
      return [...prev, type];
    });
  }, []);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
    setIsOpen(false);
  }, []);

  return {
    query,
    setQuery,
    results,
    groupedResults,
    selectedTypes,
    toggleType,
    setSelectedTypes,
    isOpen,
    setIsOpen,
    clearSearch,
    isLoading,
    entityTypes: ENTITY_TYPES,
    totalResults: results.length,
  };
}

export default useGlobalSearch;
