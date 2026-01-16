import { useParams, Link } from 'react-router-dom';
import { useLaunchVehicle } from '../hooks/useLaunchVehicles';

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
  if (amount >= 1e9) return `$${(amount / 1e9).toFixed(2)}B`;
  if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
  return `$${formatNumber(amount)}`;
}

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
    ITA: '🇮🇹',
    ISR: '🇮🇱',
    KOR: '🇰🇷',
  };
  return flags[countryId] || '🏳️';
}

/**
 * Get country name
 */
function getCountryName(countryId) {
  const names = {
    USA: 'United States',
    CHN: 'China',
    RUS: 'Russia',
    FRA: 'France / ESA',
    JPN: 'Japan',
    IND: 'India',
    DEU: 'Germany',
    GBR: 'United Kingdom',
    ITA: 'Italy',
    ISR: 'Israel',
    KOR: 'South Korea',
  };
  return names[countryId] || countryId;
}

/**
 * Stat Box Component
 */
function StatBox({ label, value, unit, color = 'indigo' }) {
  const colorClasses = {
    indigo: 'text-indigo-600',
    green: 'text-green-600',
    blue: 'text-blue-600',
    orange: 'text-orange-600',
    purple: 'text-purple-600',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
      <div className={`text-2xl font-bold ${colorClasses[color]}`}>
        {value}
        {unit && <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">{unit}</span>}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-400">{label}</div>
    </div>
  );
}

export default function LaunchVehicleDetailPage() {
  const { id } = useParams();
  const { vehicle, loading, error } = useLaunchVehicle(id);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">Vehicle Not Found</h2>
          <p className="text-red-600 dark:text-red-400">{error || 'The requested launch vehicle could not be found.'}</p>
          <Link
            to="/vehicles"
            className="inline-block mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            Back to Vehicles
          </Link>
        </div>
      </div>
    );
  }

  const successRate = vehicle.successRate ||
    (vehicle.totalLaunches && vehicle.successfulLaunches
      ? (vehicle.successfulLaunches / vehicle.totalLaunches * 100)
      : null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Back Link */}
        <Link
          to="/vehicles"
          className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-6"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Launch Vehicles
        </Link>

        {/* Header */}
        <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-lg shadow-lg p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            {/* Vehicle Image */}
            {vehicle.imageUrl && (
              <div className="flex-shrink-0">
                <img
                  src={vehicle.imageUrl}
                  alt={vehicle.name}
                  className="w-32 h-48 md:w-40 md:h-60 object-contain rounded-lg bg-white/10"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl">{getCountryFlag(vehicle.countryId)}</span>
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  vehicle.status === 'Active' ? 'bg-green-500' :
                  vehicle.status === 'Retired' ? 'bg-gray-500' :
                  vehicle.status === 'In Development' ? 'bg-blue-500' :
                  'bg-red-500'
                }`}>
                  {vehicle.status}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-1">
                {vehicle.name}
                {vehicle.variant && (
                  <span className="text-slate-300 text-2xl ml-2">({vehicle.variant})</span>
                )}
              </h1>
              <p className="text-slate-300 text-lg">{vehicle.manufacturer}</p>
              <p className="text-slate-400 text-sm mt-1">
                {getCountryName(vehicle.countryId)}
              </p>
            </div>

            {/* Capability Badges */}
            <div className="flex flex-wrap gap-2">
              {vehicle.reusable && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500 text-white text-sm">
                  ♻️ Reusable
                </span>
              )}
              {vehicle.humanRated && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500 text-white text-sm">
                  👨‍🚀 Human-Rated
                </span>
              )}
              {vehicle.partiallyReusable && !vehicle.reusable && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500 text-white text-sm">
                  Partially Reusable
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {vehicle.description && (
            <p className="mt-4 text-slate-300 max-w-3xl">
              {vehicle.description}
            </p>
          )}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <StatBox
            label="Payload to LEO"
            value={vehicle.payloadToLeoKg ? formatNumber(vehicle.payloadToLeoKg) : '—'}
            unit="kg"
            color="indigo"
          />
          <StatBox
            label="Total Launches"
            value={vehicle.totalLaunches ?? '—'}
            color="blue"
          />
          <StatBox
            label="Success Rate"
            value={successRate ? `${successRate.toFixed(1)}%` : '—'}
            color={successRate >= 95 ? 'green' : 'orange'}
          />
          <StatBox
            label="Cost per Launch"
            value={formatCurrency(vehicle.costPerLaunchUsd)}
            color="purple"
          />
          <StatBox
            label="Height"
            value={vehicle.heightMeters ?? '—'}
            unit="m"
            color="blue"
          />
          <StatBox
            label="Stages"
            value={vehicle.stages ?? '—'}
            color="indigo"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payload Capabilities */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              🎯 Payload Capabilities
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Low Earth Orbit (LEO)</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {vehicle.payloadToLeoKg ? `${formatNumber(vehicle.payloadToLeoKg)} kg` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Geostationary Transfer (GTO)</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {vehicle.payloadToGtoKg ? `${formatNumber(vehicle.payloadToGtoKg)} kg` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Trans-Lunar Injection (TLI)</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {vehicle.payloadToTliKg ? `${formatNumber(vehicle.payloadToTliKg)} kg` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Mars Transfer</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {vehicle.payloadToMarsKg ? `${formatNumber(vehicle.payloadToMarsKg)} kg` : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Physical Specifications */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              📐 Physical Specifications
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Height</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {vehicle.heightMeters ? `${vehicle.heightMeters} m` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Diameter</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {vehicle.diameterMeters ? `${vehicle.diameterMeters} m` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Liftoff Mass</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {vehicle.liftoffMassKg ? `${formatNumber(vehicle.liftoffMassKg)} kg` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Liftoff Thrust</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {vehicle.liftoffThrustKn ? `${formatNumber(vehicle.liftoffThrustKn)} kN` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Number of Stages</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {vehicle.stages ?? '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Launch Statistics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              📊 Launch Statistics
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">First Flight</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {vehicle.firstFlight || '—'}
                </span>
              </div>
              {vehicle.lastFlight && (
                <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Last Flight</span>
                  <span className="font-bold text-gray-800 dark:text-white">{vehicle.lastFlight}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Total Launches</span>
                <span className="font-bold text-gray-800 dark:text-white">{vehicle.totalLaunches ?? '—'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Successful Launches</span>
                <span className="font-bold text-green-600">{vehicle.successfulLaunches ?? '—'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Failed Launches</span>
                <span className="font-bold text-red-600 dark:text-red-400">
                  {vehicle.failedLaunches ?? (vehicle.totalLaunches && vehicle.successfulLaunches
                    ? vehicle.totalLaunches - vehicle.successfulLaunches
                    : '—')}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Success Rate</span>
                <span className={`font-bold ${
                  successRate >= 95 ? 'text-green-600' :
                  successRate >= 85 ? 'text-blue-600' :
                  successRate >= 70 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {successRate ? `${successRate.toFixed(1)}%` : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Economics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              💰 Economics
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Cost per Launch</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {formatCurrency(vehicle.costPerLaunchUsd)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Cost per kg to LEO</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {vehicle.costPerKgToLeoUsd ? `$${formatNumber(vehicle.costPerKgToLeoUsd)}` : '—'}
                </span>
              </div>
            </div>

            {/* Cost Comparison Bar */}
            {vehicle.costPerKgToLeoUsd && (
              <div className="mt-6">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Cost Efficiency ($/kg to LEO)</p>
                <div className="relative h-8 bg-gray-200 rounded">
                  <div
                    className={`absolute h-full rounded ${
                      vehicle.costPerKgToLeoUsd < 3000 ? 'bg-green-500' :
                      vehicle.costPerKgToLeoUsd < 7000 ? 'bg-blue-500' :
                      vehicle.costPerKgToLeoUsd < 15000 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, (30000 - vehicle.costPerKgToLeoUsd) / 300)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Very Efficient</span>
                  <span>Expensive</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Engines Section */}
        {((vehicle.engines && vehicle.engines.length > 0) || (vehicle.engineIds && vehicle.engineIds.length > 0)) && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              🔥 Propulsion System
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicle.engines ? (
                vehicle.engines.map((engine) => (
                  <Link
                    key={engine.id}
                    to={`/engines/${engine.id}`}
                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                  >
                    <div className="text-3xl">🚀</div>
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-white">{engine.name}</div>
                      {engine.thrustKn && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {formatNumber(engine.thrustKn)} kN thrust
                        </div>
                      )}
                      {engine.propellant && (
                        <div className="text-xs text-gray-400 dark:text-gray-500">{engine.propellant}</div>
                      )}
                    </div>
                  </Link>
                ))
              ) : (
                vehicle.engineIds.map((engineId) => (
                  <Link
                    key={engineId}
                    to={`/engines/${engineId}`}
                    className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                  >
                    <div className="text-3xl">🚀</div>
                    <div className="font-semibold text-gray-800 dark:text-white">
                      Engine #{engineId}
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        )}

        {/* Related Links */}
        <div className="mt-8 flex flex-wrap gap-4">
          {vehicle.wikiUrl && (
            <a
              href={vehicle.wikiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
            >
              📖 Wikipedia
            </a>
          )}
          {vehicle.countryId && (
            <Link
              to={`/countries/${vehicle.countryId}`}
              className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition"
            >
              {getCountryFlag(vehicle.countryId)} View Country Profile
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
