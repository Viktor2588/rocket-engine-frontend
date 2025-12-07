import { useState, useMemo, memo } from 'react';
import { Link } from 'react-router-dom';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';

// World TopoJSON URL from unpkg
const GEO_URL = 'https://unpkg.com/world-atlas@2.0.2/countries-110m.json';

// ISO 3166-1 Alpha-3 to country name and position mapping
const COUNTRY_DATA = {
  USA: { name: 'United States', coords: [-98, 39], alpha2: 'US' },
  CHN: { name: 'China', coords: [104, 35], alpha2: 'CN' },
  RUS: { name: 'Russia', coords: [100, 60], alpha2: 'RU' },
  IND: { name: 'India', coords: [78, 21], alpha2: 'IN' },
  JPN: { name: 'Japan', coords: [138, 36], alpha2: 'JP' },
  FRA: { name: 'France', coords: [2, 46], alpha2: 'FR' },
  DEU: { name: 'Germany', coords: [10, 51], alpha2: 'DE' },
  GBR: { name: 'United Kingdom', coords: [-2, 54], alpha2: 'GB' },
  ITA: { name: 'Italy', coords: [12, 43], alpha2: 'IT' },
  ISR: { name: 'Israel', coords: [35, 31], alpha2: 'IL' },
  KOR: { name: 'South Korea', coords: [127, 36], alpha2: 'KR' },
  BRA: { name: 'Brazil', coords: [-51, -10], alpha2: 'BR' },
  CAN: { name: 'Canada', coords: [-106, 56], alpha2: 'CA' },
  AUS: { name: 'Australia', coords: [134, -25], alpha2: 'AU' },
  IRN: { name: 'Iran', coords: [53, 32], alpha2: 'IR' },
  UAE: { name: 'UAE', coords: [54, 24], alpha2: 'AE' },
  NZL: { name: 'New Zealand', coords: [174, -41], alpha2: 'NZ' },
  ARG: { name: 'Argentina', coords: [-64, -34], alpha2: 'AR' },
  ESP: { name: 'Spain', coords: [-4, 40], alpha2: 'ES' },
  UKR: { name: 'Ukraine', coords: [32, 49], alpha2: 'UA' },
  PRK: { name: 'North Korea', coords: [127, 40], alpha2: 'KP' },
  PAK: { name: 'Pakistan', coords: [69, 30], alpha2: 'PK' },
  IDN: { name: 'Indonesia', coords: [118, -2], alpha2: 'ID' },
  MYS: { name: 'Malaysia', coords: [102, 4], alpha2: 'MY' },
  TUR: { name: 'Turkey', coords: [35, 39], alpha2: 'TR' },
  SAU: { name: 'Saudi Arabia', coords: [45, 24], alpha2: 'SA' },
  MEX: { name: 'Mexico', coords: [-102, 23], alpha2: 'MX' },
  NGA: { name: 'Nigeria', coords: [8, 10], alpha2: 'NG' },
  ZAF: { name: 'South Africa', coords: [25, -29], alpha2: 'ZA' },
};

// ISO Alpha-3 to numeric code mapping for TopoJSON matching
const ISO_NUMERIC = {
  USA: '840', CHN: '156', RUS: '643', IND: '356', JPN: '392',
  FRA: '250', DEU: '276', GBR: '826', ITA: '380', ISR: '376',
  KOR: '410', BRA: '076', CAN: '124', AUS: '036', IRN: '364',
  UAE: '784', NZL: '554', ARG: '032', ESP: '724', UKR: '804',
  PRK: '408', PAK: '586', IDN: '360', MYS: '458', TUR: '792',
  SAU: '682', MEX: '484', NGA: '566', ZAF: '710',
};

/**
 * Get color based on SCI score
 */
function getScoreColor(score) {
  if (score >= 80) return '#059669'; // Emerald-600
  if (score >= 60) return '#2563eb'; // Blue-600
  if (score >= 40) return '#d97706'; // Amber-600
  if (score >= 20) return '#ea580c'; // Orange-600
  return '#9ca3af'; // Gray-400
}

/**
 * Get marker size based on score
 */
function getMarkerSize(score) {
  if (score >= 80) return 12;
  if (score >= 60) return 10;
  if (score >= 40) return 8;
  if (score >= 20) return 6;
  return 4;
}

/**
 * WorldMapView - Interactive world map showing space-faring nations
 */
function WorldMapView({
  countries = [],
  onCountrySelect,
  selectedCountry,
  showLabels = true,
  showMarkers = true,
}) {
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ coordinates: [0, 20], zoom: 1 });

  // Map countries to ISO codes for highlighting
  const countryScoreMap = useMemo(() => {
    const map = {};
    countries.forEach(country => {
      if (country.isoCode) {
        map[country.isoCode] = country;
        // Also map numeric code
        if (ISO_NUMERIC[country.isoCode]) {
          map[ISO_NUMERIC[country.isoCode]] = country;
        }
      }
    });
    return map;
  }, [countries]);

  // Countries with marker coordinates
  const countryMarkers = useMemo(() => {
    return countries
      .filter(country => COUNTRY_DATA[country.isoCode])
      .map(country => ({
        ...country,
        coords: COUNTRY_DATA[country.isoCode].coords,
        color: getScoreColor(country.overallCapabilityScore || 0),
        size: getMarkerSize(country.overallCapabilityScore || 0),
      }));
  }, [countries]);

  // Handle zoom
  const handleZoomIn = () => {
    if (position.zoom >= 4) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom * 1.5 }));
  };

  const handleZoomOut = () => {
    if (position.zoom <= 1) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom / 1.5 }));
  };

  const handleReset = () => {
    setPosition({ coordinates: [0, 20], zoom: 1 });
  };

  // Handle mouse move for tooltip
  const handleMouseMove = (e, country) => {
    const rect = e.currentTarget.closest('.map-container').getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - 80,
    });
    setHoveredCountry(country);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Global Space Programs</h3>
        <div className="flex items-center gap-4">
          {/* Legend */}
          <div className="hidden sm:flex items-center gap-3 text-xs text-gray-300">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
              <span>80+</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span>
              <span>60-79</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-amber-600"></span>
              <span>40-59</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-orange-600"></span>
              <span>20-39</span>
            </div>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleZoomIn}
              className="p-1 rounded bg-gray-700 hover:bg-gray-600 text-white transition"
              title="Zoom in"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1 rounded bg-gray-700 hover:bg-gray-600 text-white transition"
              title="Zoom out"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <button
              onClick={handleReset}
              className="p-1 rounded bg-gray-700 hover:bg-gray-600 text-white transition"
              title="Reset view"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-lg map-container" style={{ minHeight: '400px' }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 120,
            center: [0, 20],
          }}
          style={{ width: '100%', height: '400px', backgroundColor: '#1e3a5f' }}
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={(pos) => setPosition(pos)}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryId = geo.id;
                  const countryData = countryScoreMap[countryId];
                  const isSpaceFaring = !!countryData;
                  const isSelected = countryData?.isoCode === selectedCountry;
                  const score = countryData?.overallCapabilityScore || 0;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isSpaceFaring ? getScoreColor(score) : '#374151'}
                      stroke="#1f2937"
                      strokeWidth={0.5}
                      style={{
                        default: {
                          outline: 'none',
                          transition: 'fill 0.2s',
                        },
                        hover: {
                          fill: isSpaceFaring ? getScoreColor(score) : '#4b5563',
                          outline: 'none',
                          cursor: isSpaceFaring ? 'pointer' : 'default',
                        },
                        pressed: {
                          fill: isSpaceFaring ? getScoreColor(score) : '#374151',
                          outline: 'none',
                        },
                      }}
                      onMouseEnter={(e) => {
                        if (countryData) {
                          handleMouseMove(e, countryData);
                        }
                      }}
                      onMouseMove={(e) => {
                        if (countryData) {
                          handleMouseMove(e, countryData);
                        }
                      }}
                      onMouseLeave={() => setHoveredCountry(null)}
                      onClick={() => {
                        if (countryData && onCountrySelect) {
                          onCountrySelect(countryData);
                        }
                      }}
                    />
                  );
                })
              }
            </Geographies>

            {/* Markers for space-faring nations */}
            {showMarkers && countryMarkers.map((country) => (
              <Marker
                key={country.isoCode}
                coordinates={country.coords}
                onMouseEnter={(e) => handleMouseMove(e, country)}
                onMouseMove={(e) => handleMouseMove(e, country)}
                onMouseLeave={() => setHoveredCountry(null)}
                onClick={() => onCountrySelect?.(country)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  r={country.size}
                  fill={country.color}
                  stroke={selectedCountry === country.isoCode ? '#fff' : 'rgba(255,255,255,0.3)'}
                  strokeWidth={selectedCountry === country.isoCode ? 2 : 1}
                  className="transition-all duration-200"
                />
                {showLabels && country.size >= 8 && (
                  <text
                    textAnchor="middle"
                    y={country.size + 12}
                    style={{
                      fontFamily: 'system-ui',
                      fontSize: '8px',
                      fill: '#fff',
                      fontWeight: 500,
                      pointerEvents: 'none',
                    }}
                  >
                    {country.spaceAgencyAcronym || country.isoCode}
                  </text>
                )}
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>

        {/* Tooltip */}
        {hoveredCountry && (
          <div
            className="absolute bg-gray-900 rounded-lg shadow-xl p-3 z-20 pointer-events-none border border-gray-700"
            style={{
              left: `${Math.min(Math.max(tooltipPos.x, 100), window.innerWidth - 250)}px`,
              top: `${Math.max(tooltipPos.y, 10)}px`,
              minWidth: '200px',
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              {hoveredCountry.flagUrl && (
                <img
                  src={hoveredCountry.flagUrl}
                  alt=""
                  className="w-6 h-4 object-cover rounded"
                />
              )}
              <span className="font-semibold text-white">{hoveredCountry.name}</span>
            </div>
            <div className="text-sm text-gray-300 space-y-1">
              {hoveredCountry.spaceAgencyAcronym && (
                <div className="flex justify-between">
                  <span>Agency:</span>
                  <span className="font-medium text-white">{hoveredCountry.spaceAgencyAcronym}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>SCI Score:</span>
                <span
                  className="font-bold"
                  style={{ color: getScoreColor(hoveredCountry.overallCapabilityScore || 0) }}
                >
                  {(hoveredCountry.overallCapabilityScore || 0).toFixed(1)}
                </span>
              </div>
              {hoveredCountry.totalLaunches > 0 && (
                <div className="flex justify-between">
                  <span>Total Launches:</span>
                  <span className="font-medium text-white">{hoveredCountry.totalLaunches.toLocaleString()}</span>
                </div>
              )}
              <div className="flex gap-1 mt-2 pt-2 border-t border-gray-700">
                {hoveredCountry.humanSpaceflightCapable && <span title="Human Spaceflight">👨‍🚀</span>}
                {hoveredCountry.independentLaunchCapable && <span title="Independent Launch">🚀</span>}
                {hoveredCountry.reusableRocketCapable && <span title="Reusable Rockets">♻️</span>}
                {hoveredCountry.deepSpaceCapable && <span title="Deep Space">🌙</span>}
                {hoveredCountry.spaceStationCapable && <span title="Space Station">🛰️</span>}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Country list below map */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {countryMarkers
          .sort((a, b) => (b.overallCapabilityScore || 0) - (a.overallCapabilityScore || 0))
          .slice(0, 12)
          .map((country) => (
            <Link
              key={country.isoCode}
              to={`/countries/${country.isoCode}`}
              className={`flex items-center gap-2 p-2 rounded-lg transition-all bg-gray-700/50 hover:bg-gray-700 ${
                selectedCountry === country.isoCode ? 'ring-2 ring-indigo-500 bg-gray-700' : ''
              }`}
            >
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: country.color }}
              ></span>
              <span className="text-xs font-medium text-gray-200 truncate">
                {country.spaceAgencyAcronym || country.isoCode}
              </span>
              <span className="text-xs text-gray-400 ml-auto">
                {(country.overallCapabilityScore || 0).toFixed(0)}
              </span>
            </Link>
          ))}
      </div>
    </div>
  );
}

export default memo(WorldMapView);
