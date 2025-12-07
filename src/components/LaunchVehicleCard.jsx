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
 * Get status badge color classes
 */
function getStatusColor(status) {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800';
    case 'Retired':
      return 'bg-gray-100 dark:bg-gray-700 text-gray-800';
    case 'Development':
      return 'bg-blue-100 text-blue-800';
    case 'Planned':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-800';
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
      className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
    >
      {/* Header with status */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 p-4 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold">{vehicle.name}</h3>
            {vehicle.variant && (
              <p className="text-slate-300 text-sm">{vehicle.variant}</p>
            )}
          </div>
          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(vehicle.status)}`}>
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
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Payload (LEO)</p>
          <p className="text-lg font-bold text-gray-800 dark:text-white dark:text-white">
            {vehicle.payloadToLeoKg ? `${formatNumber(vehicle.payloadToLeoKg)} kg` : '—'}
          </p>
        </div>

        {/* Launch Count */}
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Launches</p>
          <p className="text-lg font-bold text-gray-800 dark:text-white dark:text-white">
            {vehicle.totalLaunches ?? '—'}
          </p>
        </div>

        {/* Success Rate */}
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Success Rate</p>
          <p className={`text-lg font-bold ${
            successRate >= 95 ? 'text-green-600' :
            successRate >= 85 ? 'text-blue-600' :
            successRate >= 70 ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {successRate ? `${successRate.toFixed(1)}%` : '—'}
          </p>
        </div>

        {/* Cost per Launch */}
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Cost/Launch</p>
          <p className="text-lg font-bold text-gray-800 dark:text-white dark:text-white">
            {formatCurrency(vehicle.costPerLaunchUsd)}
          </p>
        </div>
      </div>

      {/* Capabilities badges */}
      <div className="px-4 pb-4 flex flex-wrap gap-2">
        {vehicle.reusable && (
          <span className="inline-flex items-center px-2 py-1 rounded bg-purple-100 text-purple-800 text-xs">
            ♻️ Reusable
          </span>
        )}
        {vehicle.humanRated && (
          <span className="inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-800 text-xs">
            👨‍🚀 Human-Rated
          </span>
        )}
        {vehicle.stages && (
          <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 text-xs">
            {vehicle.stages} Stage{vehicle.stages > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Footer with height */}
      <div className="bg-gray-50 dark:bg-gray-700 px-4 py-2 border-t flex justify-between text-xs text-gray-500 dark:text-gray-400 dark:text-gray-400 dark:text-gray-500">
        <span>
          {vehicle.heightMeters ? `${vehicle.heightMeters}m tall` : ''}
        </span>
        <span>
          {vehicle.firstFlight ? `Since ${vehicle.firstFlight.substring(0, 4)}` : ''}
        </span>
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
      className={`bg-white rounded-lg border p-3 cursor-pointer hover:bg-gray-50 dark:bg-gray-700 transition ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold text-gray-800 dark:text-white dark:text-white">
            {vehicle.name}
            {vehicle.variant && <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">({vehicle.variant})</span>}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-400 dark:text-gray-500">{vehicle.manufacturer}</p>
        </div>
        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(vehicle.status)}`}>
          {vehicle.status}
        </span>
      </div>
      <div className="mt-2 flex gap-4 text-sm">
        <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400 dark:text-gray-500">
          <span className="font-medium">{formatNumber(vehicle.payloadToLeoKg)}</span> kg LEO
        </span>
        <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400 dark:text-gray-500">
          <span className="font-medium">{vehicle.totalLaunches || 0}</span> launches
        </span>
      </div>
    </div>
  );
}
