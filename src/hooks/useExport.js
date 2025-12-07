import { useCallback } from 'react';

/**
 * Hook for exporting data in various formats
 */
export function useExport() {
  /**
   * Export data as CSV
   */
  const exportAsCSV = useCallback((data, filename = 'export') => {
    if (!data || data.length === 0) {
      console.warn('No data to export');
      return;
    }

    // Get headers from the first object's keys
    const headers = Object.keys(data[0]);

    // Build CSV content
    const csvContent = [
      // Header row
      headers.join(','),
      // Data rows
      ...data.map(row =>
        headers.map(header => {
          const value = row[header];
          // Handle special characters and commas
          if (value === null || value === undefined) return '';
          const stringValue = String(value);
          // Escape quotes and wrap in quotes if contains comma, newline, or quote
          if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        }).join(',')
      )
    ].join('\n');

    // Create and download the file
    downloadFile(csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
  }, []);

  /**
   * Export data as JSON
   */
  const exportAsJSON = useCallback((data, filename = 'export') => {
    const jsonContent = JSON.stringify(data, null, 2);
    downloadFile(jsonContent, `${filename}.json`, 'application/json');
  }, []);

  /**
   * Export element as PNG using html2canvas
   */
  const exportAsPNG = useCallback(async (elementId, filename = 'export') => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Element with id "${elementId}" not found`);
      return;
    }

    try {
      // Dynamically import html2canvas
      const html2canvas = (await import('html2canvas')).default;

      const canvas = await html2canvas(element, {
        backgroundColor: '#1f2937', // Match dark theme
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
      });

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${filename}.png`;
          link.click();
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    } catch (error) {
      console.error('Failed to export as PNG:', error);
      // Fallback: show alert
      alert('PNG export requires the html2canvas library. Please install it with: npm install html2canvas');
    }
  }, []);

  /**
   * Export table data for countries
   */
  const exportCountriesCSV = useCallback((countries) => {
    const data = countries.map(country => ({
      Name: country.name,
      Code: country.isoCode,
      Region: country.region || '',
      SpaceAgency: country.spaceAgencyName || '',
      Founded: country.spaceAgencyFounded || '',
      TotalLaunches: country.totalLaunches || 0,
      SuccessRate: country.launchSuccessRate ? `${country.launchSuccessRate.toFixed(1)}%` : '',
      HumanSpaceflight: country.humanSpaceflightCapable ? 'Yes' : 'No',
      IndependentLaunch: country.independentLaunchCapable ? 'Yes' : 'No',
      ReusableRockets: country.reusableRocketCapable ? 'Yes' : 'No',
      DeepSpace: country.deepSpaceCapable ? 'Yes' : 'No',
      OverallScore: country.overallCapabilityScore?.toFixed(1) || '',
    }));
    exportAsCSV(data, 'space-countries');
  }, [exportAsCSV]);

  /**
   * Export table data for engines
   */
  const exportEnginesCSV = useCallback((engines) => {
    const data = engines.map(engine => ({
      Name: engine.name,
      Country: engine.countryName || engine.origin || '',
      Manufacturer: engine.manufacturer || '',
      Propellant: engine.propellant || '',
      Cycle: engine.cycle || '',
      ThrustKN: engine.thrustKn || '',
      SpecificImpulseSec: engine.specificImpulseS || '',
      ChamberPressureBar: engine.chamberPressureBar || '',
      TWR: engine.thrustToWeightRatio || '',
      Reusable: engine.reusable ? 'Yes' : 'No',
      Status: engine.status || '',
      FirstFlight: engine.firstFlightYear || '',
    }));
    exportAsCSV(data, 'rocket-engines');
  }, [exportAsCSV]);

  /**
   * Export table data for vehicles
   */
  const exportVehiclesCSV = useCallback((vehicles) => {
    const data = vehicles.map(vehicle => ({
      Name: vehicle.name,
      Variant: vehicle.variant || '',
      Country: vehicle.countryName || '',
      Manufacturer: vehicle.manufacturer || '',
      Status: vehicle.status || '',
      FirstFlight: vehicle.firstFlight || '',
      TotalLaunches: vehicle.totalLaunches || 0,
      SuccessRate: vehicle.successRate ? `${vehicle.successRate.toFixed(1)}%` : '',
      PayloadToLEO_kg: vehicle.payloadToLeoKg || '',
      PayloadToGTO_kg: vehicle.payloadToGtoKg || '',
      HeightM: vehicle.heightMeters || '',
      Stages: vehicle.stages || '',
      Reusable: vehicle.reusable ? 'Yes' : 'No',
      HumanRated: vehicle.humanRated ? 'Yes' : 'No',
    }));
    exportAsCSV(data, 'launch-vehicles');
  }, [exportAsCSV]);

  /**
   * Export comparison data
   */
  const exportComparisonCSV = useCallback((countries, categories) => {
    const headers = ['Category', ...countries.map(c => c.name)];
    const rows = categories.map(cat => {
      const row = { Category: cat.label };
      countries.forEach(country => {
        row[country.name] = cat.getValue(country);
      });
      return row;
    });

    // Add overall scores
    const overallRow = { Category: 'Overall Score' };
    countries.forEach(country => {
      overallRow[country.name] = country.overallCapabilityScore?.toFixed(1) || 'N/A';
    });
    rows.push(overallRow);

    exportAsCSV(rows, 'country-comparison');
  }, [exportAsCSV]);

  return {
    exportAsCSV,
    exportAsJSON,
    exportAsPNG,
    exportCountriesCSV,
    exportEnginesCSV,
    exportVehiclesCSV,
    exportComparisonCSV,
  };
}

/**
 * Helper function to download a file
 */
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default useExport;
