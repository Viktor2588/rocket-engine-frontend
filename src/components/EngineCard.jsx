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
 * Get status badge glass color classes
 */
function getStatusColor(status) {
  switch (status) {
    case 'Active':
      return 'glass-badge-success';
    case 'Retired':
      return 'glass-badge';
    case 'Development':
      return 'glass-badge-info';
    case 'Experimental':
      return 'bg-purple-500/20 dark:bg-purple-500/25 text-purple-700 dark:text-purple-300 border border-purple-400/30 dark:border-purple-400/20 backdrop-blur-sm';
    case 'Historical':
      return 'bg-amber-500/20 dark:bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-400/30 dark:border-amber-400/20 backdrop-blur-sm';
    default:
      return 'glass-badge';
  }
}

/**
 * Get cycle complexity badge color
 */
function getCycleColor(cycle) {
  if (!cycle) return 'bg-gray-500/15 dark:bg-gray-500/20 text-gray-700 dark:text-gray-300 border border-gray-400/20';
  if (cycle.includes('Full-Flow')) return 'bg-purple-500/15 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-400/20';
  if (cycle.includes('Staged')) return 'bg-indigo-500/15 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-400/20';
  if (cycle.includes('Expander')) return 'bg-blue-500/15 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-400/20';
  if (cycle.includes('Electric')) return 'bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-400/20';
  return 'bg-gray-500/15 dark:bg-gray-500/20 text-gray-700 dark:text-gray-300 border border-gray-400/20';
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
      <div className="glass-panel glass-float overflow-hidden">
        {/* Header with status */}
        <div className="bg-gradient-to-r from-indigo-600/90 to-indigo-800/90 backdrop-blur-sm p-4 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold">{engine.name}</h3>
              {engine.variant && (
                <p className="text-indigo-200 text-sm">{engine.variant}</p>
              )}
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(engine.status)}`}>
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
          <div className="bg-green-500/10 dark:bg-green-500/15 rounded-[12px] p-3 border border-green-400/20">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">ISP (Vacuum)</p>
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              {isp ? `${isp} s` : '—'}
            </p>
          </div>

          {/* Thrust */}
          <div className="bg-blue-500/10 dark:bg-blue-500/15 rounded-[12px] p-3 border border-blue-400/20">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Thrust</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {thrust ? `${formatNumber(thrust)} kN` : '—'}
            </p>
          </div>

          {/* T/W Ratio - only show if data exists */}
          {(engine.calculateThrustToWeightRatio || engine.twr) && (
            <div className="bg-purple-500/10 dark:bg-purple-500/15 rounded-[12px] p-3 border border-purple-400/20">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">T/W Ratio</p>
              <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {(engine.calculateThrustToWeightRatio || engine.twr).toFixed(1)}
              </p>
            </div>
          )}

          {/* Reliability - only show if data exists */}
          {engine.reliabilityRate && (
            <div className={`rounded-[12px] p-3 border ${
              engine.reliabilityRate >= 99 ? 'bg-green-500/10 dark:bg-green-500/15 border-green-400/20' :
              engine.reliabilityRate >= 95 ? 'bg-blue-500/10 dark:bg-blue-500/15 border-blue-400/20' :
              engine.reliabilityRate >= 90 ? 'bg-yellow-500/10 dark:bg-yellow-500/15 border-yellow-400/20' :
              'bg-red-500/10 dark:bg-red-500/15 border-red-400/20'
            }`}>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Reliability</p>
              <p className={`text-lg font-bold ${
                engine.reliabilityRate >= 99 ? 'text-green-600 dark:text-green-400' :
                engine.reliabilityRate >= 95 ? 'text-blue-600 dark:text-blue-400' :
                engine.reliabilityRate >= 90 ? 'text-yellow-600 dark:text-yellow-400' :
                'text-red-600 dark:text-red-400'
              }`}>
                {`${engine.reliabilityRate.toFixed(1)}%`}
              </p>
            </div>
          )}
        </div>

        {/* Properties */}
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {/* Power Cycle */}
          {engine.powerCycle && (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs backdrop-blur-sm ${getCycleColor(engine.powerCycle)}`}>
              {engine.powerCycle}
            </span>
          )}

          {/* Reusable */}
          {engine.reusable && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-purple-500/15 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-400/20 text-xs backdrop-blur-sm">
              ♻️ Reusable
            </span>
          )}

          {/* Advanced Cycle */}
          {engine.advancedCycle && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-indigo-500/15 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-400/20 text-xs backdrop-blur-sm">
              ⚡ Advanced
            </span>
          )}

          {/* Throttleable */}
          {engine.throttleCapable && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-cyan-500/15 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-400/20 text-xs backdrop-blur-sm">
              🎚️ Throttle
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="glass-header-gradient px-4 py-2.5 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
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
      className={`glass-panel p-3 cursor-pointer transition-all duration-200 ${
        selected ? 'ring-2 ring-indigo-500 border-indigo-500/50' : ''
      } hover:bg-white/80 dark:hover:bg-white/[0.1]`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-gray-800 dark:text-white">
            {engine.name}
            {engine.variant && <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">({engine.variant})</span>}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{engine.designer}</p>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(engine.status)}`}>
          {engine.status}
        </span>
      </div>
      <div className="mt-2 flex gap-4 text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          <span className="font-medium">{isp || '—'}</span> s ISP
        </span>
        <span className="text-gray-600 dark:text-gray-400">
          <span className="font-medium">{formatNumber(engine.thrustKn)}</span> kN
        </span>
        {engine.reusable && <span className="text-purple-600 dark:text-purple-400">♻️</span>}
      </div>
    </div>
  );
}

/**
 * EngineStatsCard - Card for displaying engine statistics summary
 */
export function EngineStatsCard({ label, value, unit, icon, color = 'indigo' }) {
  const colorClasses = {
    indigo: 'glass-tinted-indigo text-indigo-600 dark:text-indigo-400',
    green: 'glass-tinted-green text-green-600 dark:text-green-400',
    blue: 'glass-tinted-blue text-blue-600 dark:text-blue-400',
    purple: 'glass-tinted-purple text-purple-600 dark:text-purple-400',
    orange: 'glass-tinted-orange text-orange-600 dark:text-orange-400',
  };

  return (
    <div className={`p-4 ${colorClasses[color]}`}>
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="text-lg">{icon}</span>}
        <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      </div>
      <div className={`text-2xl font-bold`}>
        {value}
        {unit && <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{unit}</span>}
      </div>
    </div>
  );
}
