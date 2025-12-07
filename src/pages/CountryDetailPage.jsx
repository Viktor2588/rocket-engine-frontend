import { useParams, Link } from 'react-router-dom';
import { useCountryByCode, useCountryEngines, useCountryLaunchVehicles } from '../hooks/useCountries';
import { useSCIBreakdown } from '../hooks/useCapabilityScores';
import { useCountryMilestones } from '../hooks/useMilestones';
import { useCountryMissionSummary } from '../hooks/useMissions';
import CapabilityScoreCard, { CategoryMetricsDetail } from '../components/CapabilityScoreCard';
import { MilestoneCard } from '../components/Timeline';
import { MissionCardCompact } from '../components/MissionCard';
import EngineCard from '../components/EngineCard';

export default function CountryDetailPage() {
  const { code } = useParams();
  const { country, loading, error } = useCountryByCode(code);
  const { engines, loading: enginesLoading } = useCountryEngines(country?.id);
  const { vehicles, loading: vehiclesLoading } = useCountryLaunchVehicles(country?.id);
  const { breakdown: sciBreakdown, loading: sciLoading } = useSCIBreakdown(code);
  const { milestones, loading: milestonesLoading } = useCountryMilestones(code);
  const { summary: missionSummary, missions, loading: missionsLoading } = useCountryMissionSummary(code);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading country details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Country</h2>
          <p className="text-red-600">{error}</p>
          <Link to="/countries" className="mt-4 inline-block text-indigo-500 hover:text-indigo-700 font-semibold">
            ← Back to Countries
          </Link>
        </div>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Country not found</p>
          <Link to="/countries" className="mt-4 inline-block text-indigo-500 hover:text-indigo-700 font-semibold">
            ← Back to Countries
          </Link>
        </div>
      </div>
    );
  }

  // Capability badges configuration
  const capabilities = [
    { key: 'humanSpaceflightCapable', label: 'Human Spaceflight', icon: '👨‍🚀', color: 'bg-green-100 text-green-800' },
    { key: 'independentLaunchCapable', label: 'Independent Launch', icon: '🚀', color: 'bg-blue-100 text-blue-800' },
    { key: 'reusableRocketCapable', label: 'Reusable Rockets', icon: '♻️', color: 'bg-purple-100 text-purple-800' },
    { key: 'deepSpaceCapable', label: 'Deep Space Exploration', icon: '🌙', color: 'bg-indigo-100 text-indigo-800' },
    { key: 'spaceStationCapable', label: 'Space Station', icon: '🛰️', color: 'bg-orange-100 text-orange-800' },
    { key: 'lunarLandingCapable', label: 'Lunar Landing', icon: '🌕', color: 'bg-yellow-100 text-yellow-800' },
    { key: 'marsLandingCapable', label: 'Mars Landing', icon: '🔴', color: 'bg-red-100 text-red-800' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link to="/countries" className="text-indigo-500 hover:text-indigo-700 font-semibold mb-6 inline-block">
          ← Back to Countries
        </Link>

        {/* Country Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="text-6xl">
                {country.flagUrl ? (
                  <img src={country.flagUrl} alt={`${country.name} flag`} className="w-20 h-14 object-cover rounded shadow" />
                ) : (
                  <span>🏳️</span>
                )}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{country.name}</h1>
                <p className="text-lg text-gray-600">
                  {country.spaceAgencyName}
                  {country.spaceAgencyAcronym && ` (${country.spaceAgencyAcronym})`}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Region: {country.region}
                  {country.spaceAgencyFounded && ` • Established ${country.spaceAgencyFounded}`}
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-indigo-600">
                {(country.overallCapabilityScore || 0).toFixed(0)}
              </div>
              <div className="text-sm text-gray-500">Capability Score</div>
            </div>
          </div>

          {/* Capability Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {capabilities.map(cap => (
              <span
                key={cap.key}
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${
                  country[cap.key] ? cap.color : 'bg-gray-100 text-gray-400 line-through'
                }`}
              >
                <span>{cap.icon}</span>
                {cap.label}
              </span>
            ))}
          </div>

          {/* Description */}
          {country.description && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-gray-700 leading-relaxed">{country.description}</p>
            </div>
          )}

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Total Launches</p>
              <p className="text-2xl font-bold text-blue-600">{country.totalLaunches ?? '-'}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Success Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {country.launchSuccessRate
                  ? `${country.launchSuccessRate.toFixed(1)}%`
                  : '-'}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Annual Budget</p>
              <p className="text-2xl font-bold text-purple-600">
                {country.annualBudgetUsd
                  ? `$${(country.annualBudgetUsd / 1e9).toFixed(1)}B`
                  : '-'}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">% of GDP</p>
              <p className="text-2xl font-bold text-orange-600">
                {country.budgetAsPercentOfGdp
                  ? `${country.budgetAsPercentOfGdp.toFixed(3)}%`
                  : '-'}
              </p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Active Astronauts</p>
              <p className="text-2xl font-bold text-indigo-600">{country.activeAstronauts ?? '-'}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-1">Employees</p>
              <p className="text-2xl font-bold text-gray-600">
                {country.totalSpaceAgencyEmployees
                  ? country.totalSpaceAgencyEmployees.toLocaleString()
                  : '-'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Capability Score */}
          <div className="lg:col-span-2">
            {sciLoading ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading capability analysis...</p>
              </div>
            ) : sciBreakdown ? (
              <CapabilityScoreCard breakdown={sciBreakdown} />
            ) : (
              <CapabilityScoreCard country={country} scores={country.capabilityScores} />
            )}
          </div>

          {/* Right Column - Quick Actions */}
          <div className="space-y-6">
            {/* Actions Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Actions</h3>
              <div className="space-y-3">
                <Link
                  to={`/compare/countries?c1=${country.isoCode}`}
                  className="block w-full text-center bg-indigo-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-indigo-600 transition"
                >
                  Compare with Another Country
                </Link>
                <Link
                  to={`/countries/${country.isoCode}/timeline`}
                  className="block w-full text-center bg-purple-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-purple-600 transition"
                >
                  View Timeline
                </Link>
                <Link
                  to="/countries"
                  className="block w-full text-center bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Back to All Countries
                </Link>
              </div>
            </div>

            {/* Agency Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Space Agency</h3>
              <div className="space-y-3 text-sm">
                {country.spaceAgencyLogo && (
                  <div className="flex justify-center mb-4">
                    <img src={country.spaceAgencyLogo} alt={`${country.spaceAgencyName} logo`} className="h-16 object-contain" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-700">Name</p>
                  <p className="text-gray-600">{country.spaceAgencyName}</p>
                </div>
                {country.spaceAgencyAcronym && (
                  <div>
                    <p className="font-semibold text-gray-700">Acronym</p>
                    <p className="text-gray-600">{country.spaceAgencyAcronym}</p>
                  </div>
                )}
                {country.spaceAgencyFounded && (
                  <div>
                    <p className="font-semibold text-gray-700">Founded</p>
                    <p className="text-gray-600">{country.spaceAgencyFounded}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SCI Category Details */}
        {sciBreakdown && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              📊 Space Capability Index Breakdown
            </h2>
            <CategoryMetricsDetail breakdown={sciBreakdown} />
          </div>
        )}

        {/* Engines Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🔥 Rocket Engines ({engines?.length || 0})
          </h2>
          {enginesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
            </div>
          ) : engines && engines.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {engines.slice(0, 6).map(engine => (
                <EngineCard key={engine.id} engine={engine} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No engines found for this country
            </div>
          )}
          {engines && engines.length > 6 && (
            <div className="text-center mt-4">
              <Link
                to={`/engines?country=${country.isoCode}`}
                className="text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                View all {engines.length} engines →
              </Link>
            </div>
          )}
        </div>

        {/* Launch Vehicles Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🚀 Launch Vehicles ({vehicles?.length || 0})
          </h2>
          {vehiclesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
            </div>
          ) : vehicles && vehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map(vehicle => (
                <div key={vehicle.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{vehicle.name}</h3>
                      {vehicle.variant && (
                        <p className="text-sm text-gray-500">{vehicle.variant}</p>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      vehicle.status === 'Active' ? 'bg-green-100 text-green-800' :
                      vehicle.status === 'Development' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {vehicle.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{vehicle.manufacturer}</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-xs text-gray-500">LEO Payload</p>
                      <p className="font-semibold">
                        {vehicle.payloadToLeoKg ? `${(vehicle.payloadToLeoKg / 1000).toFixed(1)}t` : '-'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-xs text-gray-500">Launches</p>
                      <p className="font-semibold">{vehicle.totalLaunches ?? '-'}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-xs text-gray-500">Success Rate</p>
                      <p className="font-semibold">
                        {vehicle.successRate ? `${(vehicle.successRate * 100).toFixed(0)}%` : '-'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                      <p className="text-xs text-gray-500">Cost/Launch</p>
                      <p className="font-semibold">
                        {vehicle.costPerLaunchUsd ? `$${(vehicle.costPerLaunchUsd / 1e6).toFixed(0)}M` : '-'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    {vehicle.reusable && (
                      <span className="inline-flex items-center px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">
                        ♻️ Reusable
                      </span>
                    )}
                    {vehicle.humanRated && (
                      <span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                        👨‍🚀 Human-Rated
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No launch vehicles found for this country
            </div>
          )}
        </div>

        {/* Space Milestones Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              🏆 Space Milestones ({milestones?.length || 0})
            </h2>
            {milestones && milestones.length > 0 && (
              <Link
                to={`/countries/${country.isoCode}/timeline`}
                className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm"
              >
                View Full Timeline →
              </Link>
            )}
          </div>
          {milestonesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
            </div>
          ) : milestones && milestones.length > 0 ? (
            <>
              {/* World Firsts */}
              {milestones.filter(m => m.isFirst).length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <span>🥇</span> World First Achievements
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {milestones.filter(m => m.isFirst).slice(0, 6).map(milestone => (
                      <MilestoneCard key={milestone.id} milestone={milestone} showCountry={false} compact />
                    ))}
                  </div>
                </div>
              )}

              {/* Other Milestones */}
              {milestones.filter(m => !m.isFirst).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Other Achievements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {milestones.filter(m => !m.isFirst).slice(0, 6).map(milestone => (
                      <MilestoneCard key={milestone.id} milestone={milestone} showCountry={false} compact />
                    ))}
                  </div>
                </div>
              )}

              {milestones.length > 6 && (
                <div className="text-center mt-4">
                  <Link
                    to={`/countries/${country.isoCode}/timeline`}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    View all {milestones.length} milestones →
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No milestones recorded for this country
            </div>
          )}
        </div>

        {/* Space Missions Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              🛸 Space Missions ({missions?.length || 0})
            </h2>
            {missions && missions.length > 0 && (
              <Link
                to={`/missions?country=${country.isoCode}`}
                className="text-indigo-600 hover:text-indigo-800 font-semibold text-sm"
              >
                View All Missions →
              </Link>
            )}
          </div>

          {missionsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
            </div>
          ) : missionSummary && missions && missions.length > 0 ? (
            <>
              {/* Mission Stats Summary */}
              <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <div className="text-xl font-bold text-indigo-600">{missionSummary.totalMissions}</div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                  <div className="p-2 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">{missionSummary.activeMissions}</div>
                    <div className="text-xs text-gray-500">Active</div>
                  </div>
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">{missionSummary.crewedMissions}</div>
                    <div className="text-xs text-gray-500">Crewed</div>
                  </div>
                  <div className="p-2 bg-teal-50 rounded-lg">
                    <div className="text-xl font-bold text-teal-600">{missionSummary.successRate}%</div>
                    <div className="text-xs text-gray-500">Success</div>
                  </div>
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <div className="text-xl font-bold text-orange-600">{missionSummary.totalCrewMembers}</div>
                    <div className="text-xs text-gray-500">Astronauts</div>
                  </div>
                </div>
              </div>

              {/* Mission List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {missions.slice(0, 6).map(mission => (
                  <MissionCardCompact key={mission.id} mission={mission} showCountry={false} />
                ))}
              </div>

              {missions.length > 6 && (
                <div className="text-center mt-4">
                  <Link
                    to={`/missions?country=${country.isoCode}`}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    View all {missions.length} missions →
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
              No missions recorded for this country
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Data sources: Wikipedia, official space agency reports.
            Last updated: December 2025
          </p>
        </div>
      </div>
    </div>
  );
}
