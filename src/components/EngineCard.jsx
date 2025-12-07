import { Link } from 'react-router-dom';

/**
 * Get country flag emoji
 */
function getCountryFlag(countryId) {
  const flags = {
    USA: '🇺🇸',
    CHN: '🇨🇳',
    RUS: '🇷🇺',
    FRA: '🇫🇷',
    JPN: '🇯🇵',
    IND: '🇮🇳',
    DEU: '🇩🇪',
    GBR: '🇬🇧',
  };
  return flags[countryId] || '🏳️';
}

/**
 * Get status badge color classes
 */
function getStatusColor(status) {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800';
    case 'Retired':
      return 'bg-gray-100 text-gray-800';
    case 'Development':
      return 'bg-blue-100 text-blue-800';
    case 'Experimental':
      return 'bg-purple-100 text-purple-800';
    case 'Historical':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

/**
 * Get cycle complexity badge color
 */
function getCycleColor(cycle) {
  if (!cycle) return 'bg-gray-100 text-gray-700';
  if (cycle.includes('Full-Flow')) return 'bg-purple-100 text-purple-800';
  if (cycle.includes('Staged')) return 'bg-indigo-100 text-indigo-800';
  if (cycle.includes('Expander')) return 'bg-blue-100 text-blue-800';
  if (cycle.includes('Electric')) return 'bg-cyan-100 text-cyan-800';
  return 'bg-gray-100 text-gray-700';
}

/**
 * Format large numbers
 */
function formatNumber(num) {
  if (num === null || num === undefined) return '—';
  return num.toLocaleString();
}

export default function EngineCard({ engine }) {
  if (!engine) return null;

  const isp = engine.ispVacuum || engine.isp_s || engine.isp;
  const thrust = engine.thrustKn;

  return (
    <Link to={`/engines/${engine.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition overflow-hidden">
        {/* Header with status */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-4 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold">{engine.name}</h3>
              {engine.variant && (
                <p className="text-indigo-200 text-sm">{engine.variant}</p>
              )}
            </div>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(engine.status)}`}>
              {engine.status || 'Unknown'}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-sm text-indigo-200">
            <span>{getCountryFlag(engine.countryId)}</span>
            <span>{engine.designer}</span>
          </div>
        </div>

        {/* Key Stats */}
        <div className="p-4 grid grid-cols-2 gap-4">
          {/* ISP */}
          <div>
            <p className="text-xs text-gray-500 uppercase">ISP (Vacuum)</p>
            <p className="text-lg font-bold text-green-600">
              {isp ? `${isp} s` : '—'}
            </p>
          </div>

          {/* Thrust */}
          <div>
            <p className="text-xs text-gray-500 uppercase">Thrust</p>
            <p className="text-lg font-bold text-blue-600">
              {thrust ? `${formatNumber(thrust)} kN` : '—'}
            </p>
          </div>

          {/* T/W Ratio */}
          <div>
            <p className="text-xs text-gray-500 uppercase">T/W Ratio</p>
            <p className="text-lg font-bold text-purple-600">
              {engine.calculateThrustToWeightRatio || engine.twr
                ? (engine.calculateThrustToWeightRatio || engine.twr).toFixed(1)
                : '—'}
            </p>
          </div>

          {/* Reliability */}
          <div>
            <p className="text-xs text-gray-500 uppercase">Reliability</p>
            <p className={`text-lg font-bold ${
              engine.reliabilityRate >= 99 ? 'text-green-600' :
              engine.reliabilityRate >= 95 ? 'text-blue-600' :
              engine.reliabilityRate >= 90 ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {engine.reliabilityRate ? `${engine.reliabilityRate.toFixed(1)}%` : '—'}
            </p>
          </div>
        </div>

        {/* Properties */}
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {/* Power Cycle */}
          {engine.powerCycle && (
            <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${getCycleColor(engine.powerCycle)}`}>
              {engine.powerCycle}
            </span>
          )}

          {/* Reusable */}
          {engine.reusable && (
            <span className="inline-flex items-center px-2 py-1 rounded bg-purple-100 text-purple-800 text-xs">
              ♻️ Reusable
            </span>
          )}

          {/* Advanced Cycle */}
          {engine.advancedCycle && (
            <span className="inline-flex items-center px-2 py-1 rounded bg-indigo-100 text-indigo-800 text-xs">
              ⚡ Advanced
            </span>
          )}

          {/* Throttleable */}
          {engine.throttleCapable && (
            <span className="inline-flex items-center px-2 py-1 rounded bg-cyan-100 text-cyan-800 text-xs">
              🎚️ Throttle
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-4 py-2 border-t flex justify-between items-center text-xs text-gray-500">
          <span>
            {engine.propellant}
          </span>
          <span>
            {engine.firstFlightYear ? `Since ${engine.firstFlightYear}` : ''}
          </span>
        </div>
      </div>
    </Link>
  );
}

/**
 * EngineCompactCard - Smaller card for lists and comparisons
 */
export function EngineCompactCard({ engine, onClick, selected }) {
  if (!engine) return null;

  const isp = engine.ispVacuum || engine.isp_s || engine.isp;

  return (
    <div
      onClick={() => onClick?.(engine)}
      className={`bg-white rounded-lg border p-3 cursor-pointer hover:bg-gray-50 transition ${
        selected ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200'
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-gray-800">
            {engine.name}
            {engine.variant && <span className="text-gray-500 text-sm ml-1">({engine.variant})</span>}
          </h4>
          <p className="text-sm text-gray-500">{engine.designer}</p>
        </div>
        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(engine.status)}`}>
          {engine.status}
        </span>
      </div>
      <div className="mt-2 flex gap-4 text-sm">
        <span className="text-gray-600">
          <span className="font-medium">{isp || '—'}</span> s ISP
        </span>
        <span className="text-gray-600">
          <span className="font-medium">{formatNumber(engine.thrustKn)}</span> kN
        </span>
        {engine.reusable && <span className="text-purple-600">♻️</span>}
      </div>
    </div>
  );
}

/**
 * EngineStatsCard - Card for displaying engine statistics summary
 */
export function EngineStatsCard({ label, value, unit, icon, color = 'indigo' }) {
  const colorClasses = {
    indigo: 'text-indigo-600 bg-indigo-50',
    green: 'text-green-600 bg-green-50',
    blue: 'text-blue-600 bg-blue-50',
    purple: 'text-purple-600 bg-purple-50',
    orange: 'text-orange-600 bg-orange-50',
  };

  return (
    <div className={`rounded-lg shadow p-4 ${colorClasses[color]}`}>
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="text-lg">{icon}</span>}
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${colorClasses[color].split(' ')[0]}`}>
        {value}
        {unit && <span className="text-sm text-gray-500 ml-1">{unit}</span>}
      </div>
    </div>
  );
}
