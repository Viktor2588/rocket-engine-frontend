import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

// ISO code to approximate position mapping for major space-faring nations
const COUNTRY_POSITIONS = {
  USA: { x: 150, y: 180, name: 'United States' },
  CHN: { x: 680, y: 200, name: 'China' },
  RUS: { x: 600, y: 120, name: 'Russia' },
  IND: { x: 600, y: 240, name: 'India' },
  JPN: { x: 750, y: 190, name: 'Japan' },
  FRA: { x: 420, y: 160, name: 'France' },
  DEU: { x: 430, y: 150, name: 'Germany' },
  GBR: { x: 410, y: 140, name: 'United Kingdom' },
  ITA: { x: 440, y: 170, name: 'Italy' },
  ISR: { x: 500, y: 210, name: 'Israel' },
  KOR: { x: 720, y: 190, name: 'South Korea' },
  BRA: { x: 260, y: 310, name: 'Brazil' },
  CAN: { x: 180, y: 120, name: 'Canada' },
  AUS: { x: 740, y: 360, name: 'Australia' },
  IRN: { x: 540, y: 210, name: 'Iran' },
  UAE: { x: 530, y: 230, name: 'UAE' },
  NZL: { x: 810, y: 390, name: 'New Zealand' },
  ARG: { x: 240, y: 380, name: 'Argentina' },
  ESP: { x: 400, y: 175, name: 'Spain' },
  UKR: { x: 490, y: 150, name: 'Ukraine' },
  // European Space Agency (multi-national)
  ESA: { x: 430, y: 155, name: 'ESA' },
};

/**
 * Get color based on SCI score
 */
function getScoreColor(score) {
  if (score >= 80) return '#059669'; // Emerald-600
  if (score >= 60) return '#2563eb'; // Blue-600
  if (score >= 40) return '#d97706'; // Amber-600
  if (score >= 20) return '#ea580c'; // Orange-600
  return '#6b7280'; // Gray-500
}

/**
 * Get marker size based on score
 */
function getMarkerSize(score) {
  if (score >= 80) return 18;
  if (score >= 60) return 14;
  if (score >= 40) return 11;
  return 8;
}

/**
 * WorldMapView - SVG-based world map showing space-faring nations
 *
 * @param {Object} props
 * @param {Array} props.countries - Array of country objects with space programs
 * @param {Function} props.onCountrySelect - Callback when a country is selected
 * @param {string} props.selectedCountry - Currently selected country ISO code
 * @param {boolean} props.showLabels - Whether to show country labels
 */
export default function WorldMapView({
  countries = [],
  onCountrySelect,
  selectedCountry,
  showLabels = true,
}) {
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Map countries to their positions with scores
  const countryMarkers = useMemo(() => {
    return countries
      .filter(country => COUNTRY_POSITIONS[country.isoCode])
      .map(country => ({
        ...country,
        position: COUNTRY_POSITIONS[country.isoCode],
        color: getScoreColor(country.overallCapabilityScore || 0),
        size: getMarkerSize(country.overallCapabilityScore || 0),
      }));
  }, [countries]);

  // Handle mouse move for tooltip positioning
  const handleMouseMove = (e, country) => {
    const rect = e.currentTarget.closest('svg').getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - 60,
    });
    setHoveredCountry(country);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Global Space Programs</h3>
        <div className="flex items-center gap-4 text-xs">
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
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-gray-500"></span>
            <span>&lt;20</span>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-lg bg-slate-100">
        <svg
          viewBox="0 0 900 450"
          className="w-full h-auto"
          style={{ minHeight: '300px' }}
        >
          {/* Simplified world map background */}
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
            </pattern>
          </defs>

          {/* Ocean background */}
          <rect width="900" height="450" fill="#e0f2fe" />

          {/* Simplified continent outlines - stylized shapes */}
          {/* North America */}
          <path
            d="M 60,80 Q 100,60 160,80 L 220,100 Q 240,120 230,180 L 200,220 Q 180,280 140,320 L 80,340 Q 40,320 30,280 L 20,200 Q 30,120 60,80 Z"
            fill="#d1d5db"
            stroke="#9ca3af"
            strokeWidth="1"
          />

          {/* South America */}
          <path
            d="M 200,300 Q 220,290 250,320 L 280,380 Q 290,420 260,440 L 220,430 Q 190,400 180,360 L 200,300 Z"
            fill="#d1d5db"
            stroke="#9ca3af"
            strokeWidth="1"
          />

          {/* Europe */}
          <path
            d="M 380,100 Q 420,80 480,100 L 500,130 Q 490,160 460,180 L 420,190 Q 380,180 370,150 L 380,100 Z"
            fill="#d1d5db"
            stroke="#9ca3af"
            strokeWidth="1"
          />

          {/* Africa */}
          <path
            d="M 400,200 Q 450,190 500,210 L 520,280 Q 510,360 470,400 L 420,390 Q 380,340 390,280 L 400,200 Z"
            fill="#d1d5db"
            stroke="#9ca3af"
            strokeWidth="1"
          />

          {/* Asia */}
          <path
            d="M 500,80 Q 600,60 720,100 L 780,150 Q 800,200 780,250 L 700,280 Q 620,300 540,260 L 500,200 Q 490,140 500,80 Z"
            fill="#d1d5db"
            stroke="#9ca3af"
            strokeWidth="1"
          />

          {/* Australia */}
          <path
            d="M 700,320 Q 740,310 780,330 L 800,370 Q 790,410 750,420 L 710,400 Q 690,360 700,320 Z"
            fill="#d1d5db"
            stroke="#9ca3af"
            strokeWidth="1"
          />

          {/* Grid overlay for reference */}
          <rect width="900" height="450" fill="url(#grid)" opacity="0.3" />

          {/* Country markers */}
          {countryMarkers.map((country) => (
            <g
              key={country.isoCode}
              className="cursor-pointer transition-all duration-200"
              onMouseEnter={(e) => handleMouseMove(e, country)}
              onMouseMove={(e) => handleMouseMove(e, country)}
              onMouseLeave={() => setHoveredCountry(null)}
              onClick={() => onCountrySelect?.(country)}
            >
              {/* Pulse animation for top countries */}
              {country.overallCapabilityScore >= 70 && (
                <circle
                  cx={country.position.x}
                  cy={country.position.y}
                  r={country.size + 6}
                  fill={country.color}
                  opacity="0.2"
                  className="animate-ping"
                  style={{ animationDuration: '2s' }}
                />
              )}

              {/* Main marker */}
              <circle
                cx={country.position.x}
                cy={country.position.y}
                r={country.size}
                fill={country.color}
                stroke={selectedCountry === country.isoCode ? '#1e40af' : 'white'}
                strokeWidth={selectedCountry === country.isoCode ? 3 : 2}
                className="transition-all duration-200 hover:opacity-80"
              />

              {/* Country label */}
              {showLabels && (
                <text
                  x={country.position.x}
                  y={country.position.y + country.size + 12}
                  textAnchor="middle"
                  className="text-xs font-medium fill-gray-700"
                  style={{ fontSize: '10px' }}
                >
                  {country.spaceAgencyAcronym || country.isoCode}
                </text>
              )}

              {/* Score label inside large markers */}
              {country.size >= 14 && (
                <text
                  x={country.position.x}
                  y={country.position.y + 4}
                  textAnchor="middle"
                  className="font-bold fill-white"
                  style={{ fontSize: '10px' }}
                >
                  {Math.round(country.overallCapabilityScore || 0)}
                </text>
              )}
            </g>
          ))}
        </svg>

        {/* Tooltip */}
        {hoveredCountry && (
          <div
            className="absolute bg-white rounded-lg shadow-lg p-3 z-10 pointer-events-none border border-gray-200"
            style={{
              left: `${Math.min(tooltipPos.x, 700)}px`,
              top: `${Math.max(tooltipPos.y, 10)}px`,
              minWidth: '180px',
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
              <span className="font-semibold text-gray-800">{hoveredCountry.name}</span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Agency:</span>
                <span className="font-medium">{hoveredCountry.spaceAgencyAcronym}</span>
              </div>
              <div className="flex justify-between">
                <span>SCI Score:</span>
                <span className="font-bold" style={{ color: hoveredCountry.color }}>
                  {(hoveredCountry.overallCapabilityScore || 0).toFixed(0)}
                </span>
              </div>
              <div className="flex gap-1 mt-2">
                {hoveredCountry.humanSpaceflightCapable && <span title="Human Spaceflight">👨‍🚀</span>}
                {hoveredCountry.independentLaunchCapable && <span title="Launch">🚀</span>}
                {hoveredCountry.reusableRocketCapable && <span title="Reusable">♻️</span>}
                {hoveredCountry.deepSpaceCapable && <span title="Deep Space">🌙</span>}
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
              className={`flex items-center gap-2 p-2 rounded-lg transition-all hover:bg-gray-100 ${
                selectedCountry === country.isoCode ? 'bg-indigo-50 ring-2 ring-indigo-500' : ''
              }`}
            >
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: country.color }}
              ></span>
              <span className="text-xs font-medium text-gray-700 truncate">
                {country.spaceAgencyAcronym || country.isoCode}
              </span>
              <span className="text-xs text-gray-500 ml-auto">
                {(country.overallCapabilityScore || 0).toFixed(0)}
              </span>
            </Link>
          ))}
      </div>
    </div>
  );
}
