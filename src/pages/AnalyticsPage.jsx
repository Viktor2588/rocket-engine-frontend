import { useState } from 'react';
import { useCountries } from '../hooks/useCountries';
import { useEngines } from '../hooks/useEngines';
import { useStatisticsOverview } from '../hooks/useStatistics';
import LaunchFrequencyChart from '../components/charts/LaunchFrequencyChart';
import EngineBubbleChart from '../components/charts/EngineBubbleChart';
import BudgetTrendChart from '../components/charts/BudgetTrendChart';
import CapabilityRadarChart from '../components/charts/CapabilityRadarChart';

export default function AnalyticsPage() {
  const { countries, loading: countriesLoading } = useCountries();
  const { engines, loading: enginesLoading } = useEngines();
  const { data: statsOverview, loading: statsLoading } = useStatisticsOverview();
  const [activeTab, setActiveTab] = useState('launches');

  const loading = countriesLoading || enginesLoading || statsLoading;

  // Get top 4 countries for radar chart
  const topCountries = [...countries]
    .sort((a, b) => (b.overallCapabilityScore || 0) - (a.overallCapabilityScore || 0))
    .slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📊 Space Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Explore trends, comparisons, and insights across global space programs
          </p>
        </div>

        {/* Quick Stats - Use API data if available, fallback to local data */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-indigo-600">
              {statsOverview?.totalCountries || countries.length}
            </div>
            <div className="text-sm text-gray-500">Space Programs</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-green-600">
              {statsOverview?.totalEngines || engines.length}
            </div>
            <div className="text-sm text-gray-500">Rocket Engines</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-purple-600">
              {statsOverview?.humanSpaceflightCapable || countries.filter(c => c.humanSpaceflightCapable).length}
            </div>
            <div className="text-sm text-gray-500">Human Spaceflight</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-orange-600">
              {statsOverview?.reusableRocketCapable || countries.filter(c => c.reusableRocketCapable).length}
            </div>
            <div className="text-sm text-gray-500">Reusable Rockets</div>
          </div>
        </div>

        {/* Additional Stats Row - from Statistics API */}
        {statsOverview && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">
                {statsOverview.totalLaunchVehicles || 0}
              </div>
              <div className="text-sm text-gray-500">Launch Vehicles</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-3xl font-bold text-cyan-600">
                {statsOverview.totalSatellites || 0}
              </div>
              <div className="text-sm text-gray-500">Satellites</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-3xl font-bold text-pink-600">
                {statsOverview.totalMissions || 0}
              </div>
              <div className="text-sm text-gray-500">Missions</div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {statsOverview.totalLaunchSites || 0}
              </div>
              <div className="text-sm text-gray-500">Launch Sites</div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex overflow-x-auto border-b">
            {[
              { id: 'launches', label: 'Launch Activity', icon: '🚀' },
              { id: 'budgets', label: 'Budget Trends', icon: '💰' },
              { id: 'engines', label: 'Engine Analysis', icon: '🔥' },
              { id: 'capabilities', label: 'Capability Comparison', icon: '📈' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition border-b-2 ${
                  activeTab === tab.id
                    ? 'text-indigo-600 border-indigo-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
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
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Insights</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">↑</span>
                  USA has seen dramatic growth in launch cadence, largely driven by SpaceX
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500">↑</span>
                  China has steadily increased launches, now competing for second place globally
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">↓</span>
                  Russia's launch frequency has declined due to various factors
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">→</span>
                  India and Japan maintain steady but lower launch rates
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'budgets' && (
          <div className="space-y-6">
            <BudgetTrendChart
              title="Space Agency Budget Trends (2015-2024)"
              countries={['USA', 'CHN', 'EUR', 'RUS']}
              filled={true}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Budget Leaders</h3>
                <div className="space-y-3">
                  {topCountries.slice(0, 5).map((country, idx) => (
                    <div key={country.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-400 w-6">#{idx + 1}</span>
                        <span className="font-medium">{country.spaceAgencyAcronym || country.name}</span>
                      </div>
                      <span className="font-semibold text-indigo-600">
                        ${((country.annualBudgetUsd || 0) / 1e9).toFixed(1)}B
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Budget per Capita Insight</h3>
                <p className="text-gray-600 text-sm mb-4">
                  While the USA leads in absolute budget, some smaller nations invest more per capita
                  in their space programs, indicating strong national commitment to space exploration.
                </p>
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600">$85.5</div>
                  <div className="text-sm text-gray-500">USA per capita (approx.)</div>
                </div>
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
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">High Thrust Engines</h3>
                <div className="space-y-2">
                  {[...engines]
                    .sort((a, b) => (b.thrustKn || 0) - (a.thrustKn || 0))
                    .slice(0, 5)
                    .map(engine => (
                      <div key={engine.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">{engine.name}</span>
                        <span className="font-semibold">{engine.thrustKn?.toLocaleString()} kN</span>
                      </div>
                    ))}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">High Efficiency Engines</h3>
                <div className="space-y-2">
                  {[...engines]
                    .sort((a, b) => (b.specificImpulseS || 0) - (a.specificImpulseS || 0))
                    .slice(0, 5)
                    .map(engine => (
                      <div key={engine.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">{engine.name}</span>
                        <span className="font-semibold">{engine.specificImpulseS} s</span>
                      </div>
                    ))}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Engine by Cycle Type</h3>
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
                        <span className="text-gray-600">{cycle}</span>
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
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 4 Space Powers</h3>
                <CapabilityRadarChart
                  countries={topCountries}
                  size="large"
                  showLegend={true}
                />
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Capability Rankings</h3>
                <div className="space-y-4">
                  {topCountries.map((country, idx) => (
                    <div key={country.id} className="flex items-center gap-4">
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
                          {country.humanSpaceflightCapable && <span title="Human Spaceflight">👨‍🚀</span>}
                          {country.independentLaunchCapable && <span title="Launch">🚀</span>}
                          {country.reusableRocketCapable && <span title="Reusable">♻️</span>}
                          {country.deepSpaceCapable && <span title="Deep Space">🌙</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-600">
                          {(country.overallCapabilityScore || 0).toFixed(0)}
                        </div>
                        <div className="text-xs text-gray-500">SCI Score</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Capability Distribution */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Global Capability Distribution</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { key: 'humanSpaceflightCapable', label: 'Human Spaceflight', icon: '👨‍🚀', color: 'green' },
                  { key: 'independentLaunchCapable', label: 'Independent Launch', icon: '🚀', color: 'blue' },
                  { key: 'reusableRocketCapable', label: 'Reusable Rockets', icon: '♻️', color: 'purple' },
                  { key: 'deepSpaceCapable', label: 'Deep Space', icon: '🌙', color: 'indigo' },
                  { key: 'spaceStationCapable', label: 'Space Station', icon: '🛰️', color: 'orange' },
                ].map(cap => {
                  const count = countries.filter(c => c[cap.key]).length;
                  const percentage = ((count / countries.length) * 100).toFixed(0);
                  return (
                    <div key={cap.key} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-3xl mb-2">{cap.icon}</div>
                      <div className={`text-2xl font-bold text-${cap.color}-600`}>{count}</div>
                      <div className="text-xs text-gray-500">{cap.label}</div>
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
