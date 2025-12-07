import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCountries } from '../hooks/useCountries';
import { useEngines } from '../hooks/useEngines';
import { useStatisticsOverview } from '../hooks/useStatistics';
import { useWorldRecords, useTechnologyTrends, useEmergingNations, useLaunchesPerYear } from '../hooks/useAnalytics';
import LaunchFrequencyChart from '../components/charts/LaunchFrequencyChart';
import EngineBubbleChart from '../components/charts/EngineBubbleChart';
import CapabilityRadarChart from '../components/charts/CapabilityRadarChart';
import SpaceIcon from '../components/icons/SpaceIcons';

// Record Card Component
function RecordCard({ title, value, subtitle, icon, link, color = 'indigo' }) {
  const colorClasses = {
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  };

  const content = (
    <div className={`${colorClasses[color]} rounded-lg border-2 p-4 transition hover:shadow-md`}>
      <div className="flex items-center gap-2 mb-2">
        <SpaceIcon name={icon} size="xl" />
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 dark:text-gray-400">{title}</span>
      </div>
      <div className="text-xl font-bold">{value || 'N/A'}</div>
      {subtitle && <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</div>}
    </div>
  );

  return link ? (
    <Link to={link}>{content}</Link>
  ) : content;
}

// Trend Bar Component
function TrendBar({ label, value, maxValue, color = 'indigo' }) {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
  const colorClasses = {
    indigo: 'bg-indigo-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    cyan: 'bg-cyan-500',
  };

  return (
    <div className="flex items-center gap-3">
      <span className="w-32 text-sm text-gray-600 dark:text-gray-400 truncate">{label}</span>
      <div className="flex-1 bg-gray-200 rounded-full h-4">
        <div
          className={`${colorClasses[color]} h-4 rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className="w-10 text-sm font-medium text-gray-700 text-right">{value}</span>
    </div>
  );
}

export default function AnalyticsPage() {
  const { countries, loading: countriesLoading } = useCountries();
  const { engines, loading: enginesLoading } = useEngines();
  const { data: statsOverview, loading: statsLoading } = useStatisticsOverview();
  const { records } = useWorldRecords();
  const { trends } = useTechnologyTrends();
  const { analysis } = useEmergingNations();
  const { data: launchData } = useLaunchesPerYear();
  const [activeTab, setActiveTab] = useState('launches');

  const loading = countriesLoading || enginesLoading || statsLoading;

  // Get top 4 countries for radar chart
  const topCountries = [...countries]
    .sort((a, b) => (b.overallCapabilityScore || 0) - (a.overallCapabilityScore || 0))
    .slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Loading analytics data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Space Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 dark:text-gray-400">
            Explore trends, records, and insights across global space programs
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-indigo-600">
              {statsOverview?.totalCountries || countries.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-400">Space Programs</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-green-600">
              {statsOverview?.totalEngines || engines.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-400">Rocket Engines</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {statsOverview?.humanSpaceflightCapable || countries.filter(c => c.humanSpaceflightCapable).length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-400">Human Spaceflight</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-orange-600">
              {statsOverview?.reusableRocketCapable || countries.filter(c => c.reusableRocketCapable).length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-400">Reusable Rockets</div>
          </div>
        </div>

        {/* Additional Stats Row */}
        {statsOverview && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">
                {statsOverview.totalLaunchVehicles || 0}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-400">Launch Vehicles</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
              <div className="text-3xl font-bold text-cyan-600">
                {statsOverview.totalSatellites || 0}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-400">Satellites</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
              <div className="text-3xl font-bold text-pink-600">
                {statsOverview.totalMissions || 0}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-400">Missions</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {statsOverview.totalLaunchSites || 0}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-400">Launch Sites</div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-6">
          <div className="flex overflow-x-auto border-b dark:border-gray-700">
            {[
              { id: 'launches', label: 'Launch Activity', icon: 'rocket' },
              { id: 'records', label: 'World Records', icon: 'trophy' },
              { id: 'trends', label: 'Technology Trends', icon: 'trend-up' },
              { id: 'emerging', label: 'Emerging Nations', icon: 'globe' },
              { id: 'engines', label: 'Engine Analysis', icon: 'engine' },
              { id: 'capabilities', label: 'Capabilities', icon: 'star' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition border-b-2 ${
                  activeTab === tab.id
                    ? 'text-indigo-600 border-indigo-600'
                    : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <SpaceIcon name={tab.icon} size="md" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'launches' && (
          <div className="space-y-6">
            <LaunchFrequencyChart
              title="Global Launch Frequency by Country (2019-2024)"
              stacked={true}
            />

            {/* Launch Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">2024 Launch Leaders</h3>
                <div className="space-y-3">
                  {Object.entries(launchData.byCountry)
                    .map(([country, values]) => ({ country, launches: values[values.length - 1] }))
                    .sort((a, b) => b.launches - a.launches)
                    .slice(0, 5)
                    .map((item, idx) => (
                      <div key={item.country} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                            idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-400' : 'bg-indigo-400'
                          }`}>{idx + 1}</span>
                          <span className="font-medium">{item.country}</span>
                        </div>
                        <span className="font-bold text-indigo-600">{item.launches}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Year-over-Year Growth</h3>
                <div className="space-y-3">
                  {Object.entries(launchData.byCountry)
                    .map(([country, values]) => {
                      const current = values[values.length - 1];
                      const previous = values[values.length - 2];
                      const growth = previous > 0 ? ((current - previous) / previous * 100).toFixed(0) : 0;
                      return { country, growth: Number(growth), current };
                    })
                    .sort((a, b) => b.growth - a.growth)
                    .slice(0, 5)
                    .map(item => (
                      <div key={item.country} className="flex items-center justify-between">
                        <span className="font-medium">{item.country}</span>
                        <span className={`font-bold ${item.growth > 0 ? 'text-green-600' : item.growth < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                          {item.growth > 0 ? '+' : ''}{item.growth}%
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Key Insights</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">↑</span>
                    USA dominates with SpaceX's high cadence
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500">↑</span>
                    China maintains steady growth trajectory
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">↓</span>
                    Russia's launches declining due to sanctions
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">→</span>
                    India & Japan growing steadily
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'records' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">World Records & Achievements</h2>

            {/* Engine Records */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Engine Records</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <RecordCard
                  title="Most Powerful Engine"
                  value={records.mostPowerfulEngine?.name}
                  subtitle={records.mostPowerfulEngine?.thrustKn ? `${records.mostPowerfulEngine.thrustKn.toLocaleString()} kN` : undefined}
                  icon="speed"
                  color="orange"
                  link={records.mostPowerfulEngine ? `/engines/${records.mostPowerfulEngine.id}` : undefined}
                />
                <RecordCard
                  title="Most Efficient Engine"
                  value={records.mostEfficientEngine?.name}
                  subtitle={records.mostEfficientEngine?.specificImpulseS ? `${records.mostEfficientEngine.specificImpulseS} s ISP` : undefined}
                  icon="bolt"
                  color="green"
                  link={records.mostEfficientEngine ? `/engines/${records.mostEfficientEngine.id}` : undefined}
                />
                <RecordCard
                  title="Highest Chamber Pressure"
                  value={records.highestPressureEngine?.name}
                  subtitle={records.highestPressureEngine?.chamberPressureBar ? `${records.highestPressureEngine.chamberPressureBar} bar` : undefined}
                  icon="engine"
                  color="purple"
                  link={records.highestPressureEngine ? `/engines/${records.highestPressureEngine.id}` : undefined}
                />
              </div>
            </div>

            {/* Country Records */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Country Records</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <RecordCard
                  title="Most Capable Space Program"
                  value={records.mostCapableCountry?.name}
                  subtitle={records.mostCapableCountry?.overallCapabilityScore ? `SCI: ${records.mostCapableCountry.overallCapabilityScore.toFixed(1)}` : undefined}
                  icon="trophy"
                  color="yellow"
                  link={records.mostCapableCountry ? `/countries/${records.mostCapableCountry.isoCode}` : undefined}
                />
                <RecordCard
                  title="Most Launches"
                  value={records.mostLaunchesCountry?.name}
                  subtitle={records.mostLaunchesCountry?.totalLaunches ? `${records.mostLaunchesCountry.totalLaunches.toLocaleString()} total` : undefined}
                  icon="rocket"
                  color="indigo"
                  link={records.mostLaunchesCountry ? `/countries/${records.mostLaunchesCountry.isoCode}` : undefined}
                />
                <RecordCard
                  title="Highest Success Rate"
                  value={records.highestSuccessRate?.name}
                  subtitle={records.highestSuccessRate?.launchSuccessRate ? `${records.highestSuccessRate.launchSuccessRate.toFixed(1)}%` : undefined}
                  icon="check"
                  color="green"
                  link={records.highestSuccessRate ? `/countries/${records.highestSuccessRate.isoCode}` : undefined}
                />
              </div>
            </div>

            {/* Vehicle & Infrastructure Records */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Vehicle & Infrastructure Records</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <RecordCard
                  title="Largest Payload to LEO"
                  value={records.largestPayload?.name}
                  subtitle={records.largestPayload?.payloadToLeoKg ? `${(records.largestPayload.payloadToLeoKg / 1000).toFixed(0)} tons` : undefined}
                  icon="rocket"
                  color="blue"
                  link={records.largestPayload ? `/vehicles/${records.largestPayload.id}` : undefined}
                />
                <RecordCard
                  title="Most Reusable Vehicle"
                  value={records.mostReusable?.name}
                  subtitle={records.mostReusable?.totalLaunches ? `${records.mostReusable.totalLaunches} flights` : undefined}
                  icon="recycling"
                  color="green"
                  link={records.mostReusable ? `/vehicles/${records.mostReusable.id}` : undefined}
                />
                <RecordCard
                  title="Busiest Launch Site"
                  value={records.busiestSite?.name}
                  subtitle={records.busiestSite?.totalLaunches ? `${records.busiestSite.totalLaunches.toLocaleString()} launches` : undefined}
                  icon="construction"
                  color="orange"
                  link={records.busiestSite ? `/launch-sites/${records.busiestSite.id}` : undefined}
                />
                <RecordCard
                  title="Oldest Active Site"
                  value={records.oldestSite?.name}
                  subtitle={records.oldestSite?.established ? `Since ${records.oldestSite.established}` : undefined}
                  icon="location"
                  color="purple"
                  link={records.oldestSite ? `/launch-sites/${records.oldestSite.id}` : undefined}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Technology Trends</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Propellant Trends */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Propellant Distribution</h3>
                <div className="space-y-4">
                  <TrendBar
                    label="Kerosene/LOX"
                    value={trends.propellantTrend.traditional}
                    maxValue={Math.max(...Object.values(trends.propellantTrend))}
                    color="orange"
                  />
                  <TrendBar
                    label="Hydrogen/LOX"
                    value={trends.propellantTrend.hydrogen}
                    maxValue={Math.max(...Object.values(trends.propellantTrend))}
                    color="blue"
                  />
                  <TrendBar
                    label="Methane/LOX"
                    value={trends.propellantTrend.methane}
                    maxValue={Math.max(...Object.values(trends.propellantTrend))}
                    color="green"
                  />
                  <TrendBar
                    label="Solid"
                    value={trends.propellantTrend.solid}
                    maxValue={Math.max(...Object.values(trends.propellantTrend))}
                    color="purple"
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Methane engines are the future - cleaner, reusable-friendly, and can be produced on Mars.
                </p>
              </div>

              {/* Engine Cycle Trends */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Engine Cycle Distribution</h3>
                <div className="space-y-4">
                  <TrendBar
                    label="Gas Generator"
                    value={trends.cycleTrend.gasGenerator}
                    maxValue={Math.max(...Object.values(trends.cycleTrend))}
                    color="indigo"
                  />
                  <TrendBar
                    label="Staged Combustion"
                    value={trends.cycleTrend.stagedCombustion}
                    maxValue={Math.max(...Object.values(trends.cycleTrend))}
                    color="purple"
                  />
                  <TrendBar
                    label="Full-Flow"
                    value={trends.cycleTrend.fullFlow}
                    maxValue={Math.max(...Object.values(trends.cycleTrend))}
                    color="green"
                  />
                  <TrendBar
                    label="Expander"
                    value={trends.cycleTrend.expander}
                    maxValue={Math.max(...Object.values(trends.cycleTrend))}
                    color="cyan"
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Full-flow staged combustion represents the pinnacle of engine efficiency.
                </p>
              </div>

              {/* Reusability Trends */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Reusability Revolution</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{trends.reusabilityTrend.reusableVehicles}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-400">Reusable Vehicles</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-gray-600 dark:text-gray-400 dark:text-gray-400">{trends.reusabilityTrend.expendableVehicles}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-400">Expendable Vehicles</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{trends.reusabilityTrend.reusableEngines}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-400">Reusable Engines</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-gray-600 dark:text-gray-400 dark:text-gray-400">{trends.reusabilityTrend.expendableEngines}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 dark:text-gray-400">Expendable Engines</div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
                  <p className="text-sm text-indigo-800">
                    <strong>The Reusability Shift:</strong> SpaceX pioneered routine reusability, dropping launch costs by ~90%.
                    Now China, Europe, and others are racing to develop their own reusable systems.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'emerging' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Emerging Space Nations</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Established Powers */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <SpaceIcon name="trophy" size="xl" /> Established Powers
                </h3>
                <div className="space-y-3">
                  {analysis.established.map((country, idx) => (
                    <Link
                      key={country.id}
                      to={`/countries/${country.isoCode}`}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-2">
                        {country.flagUrl && (
                          <img src={country.flagUrl} alt="" className="w-6 h-4 object-cover rounded" />
                        )}
                        <span className="font-medium">{country.spaceAgencyAcronym || country.name}</span>
                      </div>
                      <span className="text-indigo-600 font-bold">
                        {(country.overallCapabilityScore || 0).toFixed(0)}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Emerging Powers */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <SpaceIcon name="rocket" size="xl" /> Emerging Powers
                </h3>
                <div className="space-y-3">
                  {analysis.emerging.length > 0 ? analysis.emerging.slice(0, 5).map(country => (
                    <Link
                      key={country.id}
                      to={`/countries/${country.isoCode}`}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-2">
                        {country.flagUrl && (
                          <img src={country.flagUrl} alt="" className="w-6 h-4 object-cover rounded" />
                        )}
                        <span className="font-medium">{country.spaceAgencyAcronym || country.name}</span>
                      </div>
                      <span className="text-green-600 font-bold">
                        {(country.overallCapabilityScore || 0).toFixed(0)}
                      </span>
                    </Link>
                  )) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No emerging powers in current data</p>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  Nations with launch capability developing advanced capabilities
                </p>
              </div>

              {/* Rising Contenders */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <SpaceIcon name="star" size="xl" /> Rising Contenders
                </h3>
                <div className="space-y-3">
                  {analysis.rising.length > 0 ? analysis.rising.slice(0, 5).map(country => (
                    <Link
                      key={country.id}
                      to={`/countries/${country.isoCode}`}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition"
                    >
                      <div className="flex items-center gap-2">
                        {country.flagUrl && (
                          <img src={country.flagUrl} alt="" className="w-6 h-4 object-cover rounded" />
                        )}
                        <span className="font-medium">{country.spaceAgencyAcronym || country.name}</span>
                      </div>
                      <span className="text-orange-600 font-bold">
                        {(country.overallCapabilityScore || 0).toFixed(0)}
                      </span>
                    </Link>
                  )) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No rising contenders in current data</p>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  Nations building space capabilities
                </p>
              </div>
            </div>

            {/* Achievement Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Capability Achievement Distribution</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { key: 'crewedSpaceflight', label: 'Human Spaceflight', icon: 'astronaut', color: 'purple' },
                  { key: 'reusableRockets', label: 'Reusable Rockets', icon: 'recycling', color: 'green' },
                  { key: 'deepSpaceProbes', label: 'Deep Space', icon: 'moon', color: 'indigo' },
                  { key: 'spaceStations', label: 'Space Station', icon: 'satellite', color: 'blue' },
                  { key: 'lunarLanding', label: 'Lunar Landing', icon: 'moon', color: 'yellow' },
                  { key: 'marsLanding', label: 'Mars Landing', icon: 'globe', color: 'orange' },
                ].map(item => (
                  <div key={item.key} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="mb-2"><SpaceIcon name={item.icon} size="2xl" /></div>
                    <div className={`text-2xl font-bold text-${item.color}-600`}>
                      {analysis.achievements[item.key]?.length || 0}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-400">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'engines' && (
          <div className="space-y-6">
            <EngineBubbleChart
              engines={engines}
              xAxis="thrust"
              yAxis="isp"
              bubbleSize="pressure"
              title="Engine Performance: Thrust vs Specific Impulse"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">High Thrust Engines</h3>
                <div className="space-y-2">
                  {[...engines]
                    .sort((a, b) => (b.thrustKn || 0) - (a.thrustKn || 0))
                    .slice(0, 5)
                    .map(engine => (
                      <Link
                        key={engine.id}
                        to={`/engines/${engine.id}`}
                        className="flex justify-between text-sm hover:text-indigo-600"
                      >
                        <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">{engine.name}</span>
                        <span className="font-semibold">{engine.thrustKn?.toLocaleString()} kN</span>
                      </Link>
                    ))}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">High Efficiency Engines</h3>
                <div className="space-y-2">
                  {[...engines]
                    .sort((a, b) => (b.specificImpulseS || 0) - (a.specificImpulseS || 0))
                    .slice(0, 5)
                    .map(engine => (
                      <Link
                        key={engine.id}
                        to={`/engines/${engine.id}`}
                        className="flex justify-between text-sm hover:text-indigo-600"
                      >
                        <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">{engine.name}</span>
                        <span className="font-semibold">{engine.specificImpulseS} s</span>
                      </Link>
                    ))}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Engine by Cycle Type</h3>
                <div className="space-y-2">
                  {Object.entries(
                    engines.reduce((acc, e) => {
                      const cycle = e.cycle || 'Unknown';
                      acc[cycle] = (acc[cycle] || 0) + 1;
                      return acc;
                    }, {})
                  )
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([cycle, count]) => (
                      <div key={cycle} className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400 dark:text-gray-400">{cycle}</span>
                        <span className="font-semibold">{count} engines</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'capabilities' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Top 4 Space Powers</h3>
                <CapabilityRadarChart
                  countries={topCountries}
                  size="large"
                  showLegend={true}
                />
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Capability Rankings</h3>
                <div className="space-y-4">
                  {topCountries.map((country, idx) => (
                    <Link
                      key={country.id}
                      to={`/countries/${country.isoCode}`}
                      className="flex items-center gap-4 hover:bg-gray-50 p-2 rounded-lg transition"
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                        idx === 0 ? 'bg-yellow-500' :
                        idx === 1 ? 'bg-gray-400' :
                        idx === 2 ? 'bg-orange-400' :
                        'bg-indigo-500'
                      }`}>
                        #{idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {country.flagUrl && (
                            <img src={country.flagUrl} alt="" className="w-6 h-4 object-cover rounded" />
                          )}
                          <span className="font-medium">{country.name}</span>
                        </div>
                        <div className="flex gap-2 mt-1">
                          {country.humanSpaceflightCapable && <SpaceIcon name="astronaut" size="sm" title="Human Spaceflight" />}
                          {country.independentLaunchCapable && <SpaceIcon name="rocket" size="sm" title="Launch" />}
                          {country.reusableRocketCapable && <SpaceIcon name="recycling" size="sm" title="Reusable" />}
                          {country.deepSpaceCapable && <SpaceIcon name="moon" size="sm" title="Deep Space" />}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-600">
                          {(country.overallCapabilityScore || 0).toFixed(0)}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-400">SCI Score</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Capability Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Global Capability Distribution</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { key: 'humanSpaceflightCapable', label: 'Human Spaceflight', icon: 'astronaut', color: 'green' },
                  { key: 'independentLaunchCapable', label: 'Independent Launch', icon: 'rocket', color: 'blue' },
                  { key: 'reusableRocketCapable', label: 'Reusable Rockets', icon: 'recycling', color: 'purple' },
                  { key: 'deepSpaceCapable', label: 'Deep Space', icon: 'moon', color: 'indigo' },
                  { key: 'spaceStationCapable', label: 'Space Station', icon: 'satellite', color: 'orange' },
                ].map(cap => {
                  const count = countries.filter(c => c[cap.key]).length;
                  const percentage = ((count / countries.length) * 100).toFixed(0);
                  return (
                    <div key={cap.key} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="mb-2"><SpaceIcon name={cap.icon} size="2xl" /></div>
                      <div className={`text-2xl font-bold text-${cap.color}-600`}>{count}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-400">{cap.label}</div>
                      <div className="text-xs text-gray-400">({percentage}% of programs)</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
