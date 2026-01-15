import { useParams, Link } from 'react-router-dom';
import { useEngine, useEngineEvolution } from '../hooks/useEngines';

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
  };
  return names[countryId] || countryId;
}

/**
 * Format large numbers
 */
function formatNumber(num) {
  if (num === null || num === undefined) return '—';
  return num.toLocaleString();
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
    red: 'text-red-600',
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
      <div className={`text-2xl font-bold ${colorClasses[color]}`}>
        {value}
        {unit && <span className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-400 ml-1">{unit}</span>}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-400">{label}</div>
    </div>
  );
}

export default function EngineDetailPage() {
  const { id } = useParams();
  const { engine, loading, error } = useEngine(id);
  const { engines: familyEngines } = useEngineEvolution(id);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Loading engine details...</p>
        </div>
      </div>
    );
  }

  if (error || !engine) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">Engine Not Found</h2>
          <p className="text-red-600 dark:text-red-400">{error || 'The requested engine could not be found.'}</p>
          <Link
            to="/engines"
            className="inline-block mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            Back to Engines
          </Link>
        </div>
      </div>
    );
  }

  const isp = engine.ispVacuum || engine.isp_s || engine.isp;
  const ispSL = engine.ispSeaLevel || engine.isp;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Back Link */}
        <Link
          to="/engines"
          className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-6"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Engines
        </Link>

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 rounded-lg shadow-lg p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl">{getCountryFlag(engine.countryId)}</span>
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  engine.status === 'Active' ? 'bg-green-500' :
                  engine.status === 'Retired' ? 'bg-gray-500' :
                  engine.status === 'Development' ? 'bg-blue-500' :
                  'bg-purple-500'
                }`}>
                  {engine.status}
                </span>
              </div>
              <h1 className="text-4xl font-bold mb-1">
                {engine.name}
                {engine.variant && (
                  <span className="text-indigo-300 text-2xl ml-2">({engine.variant})</span>
                )}
              </h1>
              <p className="text-indigo-200 text-lg">{engine.designer}</p>
              <p className="text-indigo-300 text-sm mt-1">
                {engine.origin || getCountryName(engine.countryId)}
              </p>
            </div>

            {/* Capability Badges */}
            <div className="flex flex-wrap gap-2">
              {engine.reusable && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-purple-500 text-white text-sm">
                  ♻️ Reusable
                </span>
              )}
              {engine.advancedCycle && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500 text-white text-sm">
                  ⚡ Advanced Cycle
                </span>
              )}
              {engine.throttleCapable && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-500 text-white text-sm">
                  🎚️ Throttleable
                </span>
              )}
              {engine.restartCapable && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500 text-white text-sm">
                  🔄 Restartable
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          <StatBox
            label="ISP (Vacuum)"
            value={isp ?? '—'}
            unit="s"
            color="green"
          />
          <StatBox
            label="Thrust"
            value={engine.thrustKn ? formatNumber(engine.thrustKn) : '—'}
            unit="kN"
            color="blue"
          />
          {(engine.calculateThrustToWeightRatio || engine.twr) && (
            <StatBox
              label="T/W Ratio"
              value={(engine.calculateThrustToWeightRatio || engine.twr).toFixed(1)}
              color="purple"
            />
          )}
          {engine.reliabilityRate && (
            <StatBox
              label="Reliability"
              value={`${engine.reliabilityRate.toFixed(1)}%`}
              color={engine.reliabilityRate >= 99 ? 'green' : engine.reliabilityRate >= 95 ? 'blue' : 'orange'}
            />
          )}
          {engine.chamberPressureBar && (
            <StatBox
              label="Chamber Pressure"
              value={engine.chamberPressureBar}
              unit="bar"
              color="indigo"
            />
          )}
          {engine.massKg && (
            <StatBox
              label="Mass"
              value={formatNumber(engine.massKg)}
              unit="kg"
              color="orange"
            />
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Performance Specifications */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              🚀 Performance Specifications
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">ISP (Sea Level)</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {ispSL ? `${ispSL} s` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">ISP (Vacuum)</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {isp ? `${isp} s` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Thrust (Sea Level)</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {engine.thrustKn ? `${formatNumber(engine.thrustKn)} kN` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Thrust (Vacuum)</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {engine.thrustVacuumKn ? `${formatNumber(engine.thrustVacuumKn)} kN` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Chamber Pressure</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {engine.chamberPressureBar ? `${engine.chamberPressureBar} bar` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Nozzle Expansion Ratio</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {engine.nozzleExpansionRatio ? `${engine.nozzleExpansionRatio}:1` : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Technical Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              ⚙️ Technical Details
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Power Cycle</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {engine.powerCycle || '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Propellant</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {engine.propellant || '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">O/F Ratio</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {engine.ofRatio ?? '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Dry Mass</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {engine.massKg ? `${formatNumber(engine.massKg)} kg` : '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Vehicle</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {engine.vehicle || '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Stage Position</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {engine.use || '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Throttle & Control */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              🎚️ Throttle & Control
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Throttle Capable</span>
                <span className={`font-bold ${engine.throttleCapable ? 'text-green-600' : 'text-gray-400'}`}>
                  {engine.throttleCapable ? 'Yes' : 'No'}
                </span>
              </div>
              {engine.throttleCapable && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Throttle Range</span>
                  <span className="font-bold text-gray-800 dark:text-white">
                    {engine.throttleMinPercent && engine.throttleMaxPercent
                      ? `${engine.throttleMinPercent}% - ${engine.throttleMaxPercent}%`
                      : '—'}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Gimbal Capable</span>
                <span className={`font-bold ${engine.gimbalCapable ? 'text-green-600' : 'text-gray-400'}`}>
                  {engine.gimbalCapable ? 'Yes' : 'No'}
                </span>
              </div>
              {engine.gimbalCapable && (
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Gimbal Range</span>
                  <span className="font-bold text-gray-800 dark:text-white">
                    {engine.gimbalRangeDegrees ? `±${engine.gimbalRangeDegrees}°` : '—'}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Restart Capable</span>
                <span className={`font-bold ${engine.restartCapable ? 'text-green-600' : 'text-gray-400'}`}>
                  {engine.restartCapable ? 'Yes' : 'No'}
                </span>
              </div>
              {engine.restartCapable && engine.maxRestarts && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Max Restarts</span>
                  <span className="font-bold text-gray-800 dark:text-white">{engine.maxRestarts}</span>
                </div>
              )}
            </div>
          </div>

          {/* Reliability & Flight History */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              📊 Reliability & History
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">First Flight</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {engine.firstFlight || engine.firstFlightYear || '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Total Flights</span>
                <span className="font-bold text-gray-800 dark:text-white">
                  {engine.totalFlights ?? '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Successful Flights</span>
                <span className="font-bold text-green-600">
                  {engine.successfulFlights ?? '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Failed Flights</span>
                <span className="font-bold text-red-600 dark:text-red-400">
                  {engine.failedFlights ?? (engine.totalFlights && engine.successfulFlights
                    ? engine.totalFlights - engine.successfulFlights
                    : '—')}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Reliability Rate</span>
                <span className={`font-bold ${
                  engine.reliabilityRate >= 99 ? 'text-green-600' :
                  engine.reliabilityRate >= 95 ? 'text-blue-600' :
                  engine.reliabilityRate >= 90 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {engine.reliabilityRate ? `${engine.reliabilityRate.toFixed(1)}%` : '—'}
                </span>
              </div>
            </div>

            {/* Reliability Bar */}
            {engine.reliabilityRate && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 dark:text-gray-400 mb-1">
                  <span>0%</span>
                  <span>Reliability</span>
                  <span>100%</span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      engine.reliabilityRate >= 99 ? 'bg-green-500' :
                      engine.reliabilityRate >= 95 ? 'bg-blue-500' :
                      engine.reliabilityRate >= 90 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${engine.reliabilityRate}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Reusability */}
          {engine.reusable && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                ♻️ Reusability
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Reusable</span>
                  <span className="font-bold text-green-600">Yes</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Certified Reuse Flights</span>
                  <span className="font-bold text-gray-800 dark:text-white">
                    {engine.reusabilityFlights ?? '—'}
                  </span>
                </div>
                {engine.actualReusedFlights && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Record Reuses (Single Unit)</span>
                    <span className="font-bold text-purple-600">
                      {engine.actualReusedFlights}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Engine Family */}
          {familyEngines && familyEngines.length > 1 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                🧬 Engine Family: {engine.engineFamily}
              </h2>
              <div className="space-y-3">
                {familyEngines.map((familyEngine) => (
                  <Link
                    key={familyEngine.id}
                    to={`/engines/${familyEngine.id}`}
                    className={`block p-3 rounded-lg border transition ${
                      familyEngine.id === engine.id
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-600'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-semibold text-gray-800 dark:text-white">
                          {familyEngine.name}
                        </span>
                        {familyEngine.variant && (
                          <span className="text-gray-500 dark:text-gray-400 dark:text-gray-400 text-sm ml-1">
                            ({familyEngine.variant})
                          </span>
                        )}
                        {familyEngine.id === engine.id && (
                          <span className="ml-2 text-xs text-indigo-600 dark:text-indigo-400">(Current)</span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-400">
                        {familyEngine.firstFlightYear}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          {engine.wikiUrl && (
            <a
              href={engine.wikiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              📖 Wikipedia
            </a>
          )}
          {engine.countryId && (
            <Link
              to={`/countries/${engine.countryId}`}
              className="inline-flex items-center px-4 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded hover:bg-indigo-200 dark:hover:bg-indigo-800 transition"
            >
              {getCountryFlag(engine.countryId)} View Country Profile
            </Link>
          )}
          <Link
            to={`/compare/engines?engine1=${engine.id}`}
            className="inline-flex items-center px-4 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-800 transition"
          >
            ⚖️ Compare This Engine
          </Link>
        </div>
      </div>
    </div>
  );
}
