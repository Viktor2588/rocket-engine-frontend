import { Link } from 'react-router-dom';

/**
 * Format large numbers with commas
 */
function formatNumber(num) {
  if (num === null || num === undefined) return '—';
  return num.toLocaleString();
}

/**
 * Format currency in millions/billions
 */
function formatCurrency(amount) {
  if (!amount) return '—';
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(0)}M`;
  return `$${formatNumber(amount)}`;
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
    case 'In Development':
      return 'glass-badge-info';
    case 'Cancelled':
      return 'glass-badge-error';
    default:
      return 'glass-badge';
  }
}

/**
 * Get country flag emoji (fallback)
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
    ITA: '🇮🇹',
    ISR: '🇮🇱',
    KOR: '🇰🇷',
  };
  return flags[countryId] || '🏳️';
}

/**
 * LaunchVehicleCard - Display card for a launch vehicle
 */
export default function LaunchVehicleCard({ vehicle }) {
  if (!vehicle) return null;

  const successRate = vehicle.successRate ||
    (vehicle.totalLaunches && vehicle.successfulLaunches
      ? (vehicle.successfulLaunches / vehicle.totalLaunches * 100)
      : null);

  return (
    <Link
      to={`/vehicles/${vehicle.id}`}
      className="block"
    >
      <div className="glass-panel glass-float overflow-hidden">
        {/* Header with status */}
        <div className="bg-gradient-to-r from-slate-700/90 to-slate-900/90 backdrop-blur-sm p-4 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold">{vehicle.name}</h3>
              {vehicle.variant && (
                <p className="text-slate-300 text-sm">{vehicle.variant}</p>
              )}
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
              {vehicle.status}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-sm text-slate-300">
            <span>{getCountryFlag(vehicle.countryId)}</span>
            <span>{vehicle.manufacturer}</span>
          </div>
        </div>

        {/* Key Stats */}
        <div className="p-4 grid grid-cols-2 gap-4">
          {/* Payload to LEO */}
          <div className="bg-gray-500/10 dark:bg-white/[0.06] rounded-[12px] p-3 border border-gray-200/30 dark:border-white/[0.08]">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Payload (LEO)</p>
            <p className="text-lg font-bold text-gray-800 dark:text-white">
              {vehicle.payloadToLeoKg ? `${formatNumber(vehicle.payloadToLeoKg)} kg` : '—'}
            </p>
          </div>

          {/* Launch Count */}
          <div className="bg-gray-500/10 dark:bg-white/[0.06] rounded-[12px] p-3 border border-gray-200/30 dark:border-white/[0.08]">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Launches</p>
            <p className="text-lg font-bold text-gray-800 dark:text-white">
              {vehicle.totalLaunches ?? '—'}
            </p>
          </div>

          {/* Success Rate */}
          <div className={`rounded-[12px] p-3 border ${
            successRate >= 95 ? 'bg-green-500/10 dark:bg-green-500/15 border-green-400/20' :
            successRate >= 85 ? 'bg-blue-500/10 dark:bg-blue-500/15 border-blue-400/20' :
            successRate >= 70 ? 'bg-yellow-500/10 dark:bg-yellow-500/15 border-yellow-400/20' :
            'bg-red-500/10 dark:bg-red-500/15 border-red-400/20'
          }`}>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Success Rate</p>
            <p className={`text-lg font-bold ${
              successRate >= 95 ? 'text-green-600 dark:text-green-400' :
              successRate >= 85 ? 'text-blue-600 dark:text-blue-400' :
              successRate >= 70 ? 'text-yellow-600 dark:text-yellow-400' :
              'text-red-600 dark:text-red-400'
            }`}>
              {successRate ? `${successRate.toFixed(1)}%` : '—'}
            </p>
          </div>

          {/* Cost per Launch */}
          <div className="bg-gray-500/10 dark:bg-white/[0.06] rounded-[12px] p-3 border border-gray-200/30 dark:border-white/[0.08]">
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Cost/Launch</p>
            <p className="text-lg font-bold text-gray-800 dark:text-white">
              {formatCurrency(vehicle.costPerLaunchUsd)}
            </p>
          </div>
        </div>

        {/* Capabilities badges */}
        <div className="px-4 pb-4 flex flex-wrap gap-2">
          {vehicle.reusable && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-purple-500/15 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-400/20 text-xs backdrop-blur-sm">
              ♻️ Reusable
            </span>
          )}
          {vehicle.humanRated && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-500/15 dark:bg-green-500/20 text-green-700 dark:text-green-300 border border-green-400/20 text-xs backdrop-blur-sm">
              👨‍🚀 Human-Rated
            </span>
          )}
          {vehicle.stages && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-500/15 dark:bg-gray-500/20 text-gray-700 dark:text-gray-300 border border-gray-400/20 text-xs backdrop-blur-sm">
              {vehicle.stages} Stage{vehicle.stages > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Footer with height */}
        <div className="glass-header-gradient px-4 py-2.5 flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>
            {vehicle.heightMeters ? `${vehicle.heightMeters}m tall` : ''}
          </span>
          <span>
            {vehicle.firstFlight ? `Since ${vehicle.firstFlight.substring(0, 4)}` : ''}
          </span>
        </div>
      </div>
    </Link>
  );
}

/**
 * LaunchVehicleCompactCard - Smaller card for lists
 */
export function LaunchVehicleCompactCard({ vehicle, onClick }) {
  if (!vehicle) return null;

  return (
    <div
      onClick={() => onClick?.(vehicle)}
      className={`glass-panel p-3 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:bg-white/80 dark:hover:bg-white/[0.1]' : ''
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-gray-800 dark:text-white">
            {vehicle.name}
            {vehicle.variant && <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">({vehicle.variant})</span>}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">{vehicle.manufacturer}</p>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(vehicle.status)}`}>
          {vehicle.status}
        </span>
      </div>
      <div className="mt-2 flex gap-4 text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          <span className="font-medium">{formatNumber(vehicle.payloadToLeoKg)}</span> kg LEO
        </span>
        <span className="text-gray-600 dark:text-gray-400">
          <span className="font-medium">{vehicle.totalLaunches || 0}</span> launches
        </span>
      </div>
    </div>
  );
}
