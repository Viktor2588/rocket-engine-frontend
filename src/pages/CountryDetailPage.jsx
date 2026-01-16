import { useParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import { useCountryDetails } from '../hooks/useCountries';
import { useSCIBreakdown } from '../hooks/useCapabilityScores';
import CapabilityScoreCard, { CategoryMetricsDetail } from '../components/CapabilityScoreCard';
import { MilestoneCard } from '../components/Timeline';
import { MissionCardCompact } from '../components/MissionCard';
import EngineCard from '../components/EngineCard';
import {
  PersonOutline,
  Rocket,
  Recycling,
  NightlightRound,
  SatelliteAlt,
  Flag,
  Circle,
  LocalFireDepartment,
  Assessment,
  EmojiEvents,
  FlightTakeoff,
} from '@mui/icons-material';

export default function CountryDetailPage() {
  const { code } = useParams();

  // Single aggregated API call for country details (replaces 5+ separate calls)
  const { country, engines, vehicles, missions, milestones, loading, error } = useCountryDetails(code);

  // SCI breakdown still requires separate call (not included in aggregated endpoint)
  const { breakdown: sciBreakdown, loading: sciLoading } = useSCIBreakdown(code);

  // Compute mission summary from missions data
  const missionSummary = useMemo(() => {
    if (!missions || missions.length === 0) return null;

    const byStatus = {};
    let crewedCount = 0;
    let totalCrew = 0;

    missions.forEach(m => {
      byStatus[m.status] = (byStatus[m.status] || 0) + 1;
      if (m.crewed) {
        crewedCount++;
        totalCrew += m.crewSize || 0;
      }
    });

    return {
      totalMissions: missions.length,
      crewedMissions: crewedCount,
      totalCrewMembers: totalCrew,
      activeMissions: missions.filter(m => m.status === 'ACTIVE' || m.status === 'IN_TRANSIT').length,
      successRate: missions.length > 0
        ? ((missions.filter(m => m.status === 'COMPLETED' || m.status === 'ACTIVE').length / missions.length) * 100).toFixed(1)
        : 0
    };
  }, [missions]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading country details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">Error Loading Country</h2>
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <Link to="/countries" className="mt-4 inline-block text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold">
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
          <p className="text-gray-500 dark:text-gray-400 text-lg">Country not found</p>
          <Link to="/countries" className="mt-4 inline-block text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold">
            ← Back to Countries
          </Link>
        </div>
      </div>
    );
  }

  // Capability badges configuration (boolean capabilities)
  const booleanCapabilities = [
    { key: 'humanSpaceflightCapable', label: 'Human Spaceflight', IconComponent: PersonOutline, color: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' },
    { key: 'independentLaunchCapable', label: 'Independent Launch', IconComponent: Rocket, color: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300' },
    { key: 'deepSpaceCapable', label: 'Deep Space Exploration', IconComponent: NightlightRound, color: 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-300' },
    { key: 'spaceStationCapable', label: 'Space Station', IconComponent: SatelliteAlt, color: 'bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-300' },
    { key: 'lunarLandingCapable', label: 'Lunar Landing', IconComponent: NightlightRound, color: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300' },
    { key: 'marsLandingCapable', label: 'Mars Landing', IconComponent: Circle, color: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300' },
  ];

  // Handle reusable rocket status separately (Yes/In Development/No)
  const reusableStatus = country.reusableRocketStatus;
  const reusableCapability = reusableStatus === 'Yes' || reusableStatus === 'In Development'
    ? {
        key: 'reusableRocketStatus',
        label: reusableStatus === 'Yes' ? 'Reusable Rockets' : 'Reusable (In Dev)',
        IconComponent: Recycling,
        color: reusableStatus === 'Yes'
          ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300'
          : 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300',
        isActive: true
      }
    : {
        key: 'reusableRocketStatus',
        label: 'Reusable Rockets',
        IconComponent: Recycling,
        color: 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500',
        isActive: false
      };

  // Combine all capabilities
  const capabilities = [
    booleanCapabilities[0], // Human Spaceflight
    booleanCapabilities[1], // Independent Launch
    reusableCapability,     // Reusable Rockets (special handling)
    ...booleanCapabilities.slice(2) // Rest of boolean capabilities
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link to="/countries" className="text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold mb-6 inline-block">
          ← Back to Countries
        </Link>

        {/* Country Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="text-6xl">
                {country.flagUrl ? (
                  <img src={country.flagUrl} alt={`${country.name} flag`} className="w-20 h-14 object-cover rounded shadow" />
                ) : (
                  <Flag style={{ fontSize: '3rem' }} className="text-gray-400" />
                )}
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{country.name}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  {country.spaceAgencyName}
                  {country.spaceAgencyAcronym && ` (${country.spaceAgencyAcronym})`}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Region: {country.region}
                  {country.spaceAgencyFounded && ` • Established ${country.spaceAgencyFounded}`}
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">
                {(country.overallCapabilityScore || 0).toFixed(0)}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Capability Score</div>
            </div>
          </div>

          {/* Capability Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            {capabilities.map(cap => {
              // For reusable capability, use isActive; for others, check country[cap.key]
              const isActive = cap.isActive !== undefined ? cap.isActive : country[cap.key];
              return (
                <span
                  key={cap.key}
                  className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${
                    isActive ? cap.color : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 line-through'
                  }`}
                >
                  <cap.IconComponent style={{ fontSize: '1rem' }} />
                  {cap.label}
                </span>
              );
            })}
          </div>

          {/* Description */}
          {country.description && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{country.description}</p>
            </div>
          )}

          {/* Key Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Launches</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{country.totalLaunches ?? '-'}</p>
            </div>
            <div className="bg-teal-50 dark:bg-teal-900/30 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Successful</p>
              <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{country.successfulLaunches ?? '-'}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Success Rate</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {country.launchSuccessRate
                  ? `${country.launchSuccessRate.toFixed(1)}%`
                  : '-'}
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Annual Budget</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {country.annualBudgetUsd
                  ? `$${(country.annualBudgetUsd / 1e9).toFixed(1)}B`
                  : '-'}
              </p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/30 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">% of GDP</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {country.budgetAsPercentOfGdp
                  ? `${country.budgetAsPercentOfGdp.toFixed(3)}%`
                  : '-'}
              </p>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Astronauts</p>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{country.activeAstronauts ?? '-'}</p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Employees</p>
              <p className="text-2xl font-bold text-gray-600 dark:text-gray-300">
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
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Loading capability analysis...</p>
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Actions</h3>
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
                  className="block w-full text-center bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-3 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Back to All Countries
                </Link>
              </div>
            </div>

            {/* Agency Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Space Agency</h3>
              <div className="space-y-3 text-sm">
                {country.spaceAgencyLogo && (
                  <div className="flex justify-center mb-4">
                    <img src={country.spaceAgencyLogo} alt={`${country.spaceAgencyName} logo`} className="h-16 object-contain" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-700 dark:text-gray-300">Name</p>
                  <p className="text-gray-600 dark:text-gray-400">{country.spaceAgencyName}</p>
                </div>
                {country.spaceAgencyAcronym && (
                  <div>
                    <p className="font-semibold text-gray-700 dark:text-gray-300">Acronym</p>
                    <p className="text-gray-600 dark:text-gray-400">{country.spaceAgencyAcronym}</p>
                  </div>
                )}
                {country.spaceAgencyFounded && (
                  <div>
                    <p className="font-semibold text-gray-700 dark:text-gray-300">Founded</p>
                    <p className="text-gray-600 dark:text-gray-400">{country.spaceAgencyFounded}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SCI Category Details */}
        {sciBreakdown && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Assessment style={{ fontSize: '1.75rem' }} className="text-indigo-600 dark:text-indigo-400" /> Space Capability Index Breakdown
            </h2>
            <CategoryMetricsDetail breakdown={sciBreakdown} />
          </div>
        )}

        {/* Engines Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <LocalFireDepartment style={{ fontSize: '1.75rem' }} className="text-orange-500" /> Rocket Engines ({engines?.length || 0})
          </h2>
          {engines && engines.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {engines.slice(0, 6).map(engine => (
                <EngineCard key={engine.id} engine={engine} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center text-gray-500 dark:text-gray-400">
              No engines found for this country
            </div>
          )}
          {engines && engines.length > 6 && (
            <div className="text-center mt-4">
              <Link
                to={`/engines?country=${country.isoCode}`}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold"
              >
                View all {engines.length} engines →
              </Link>
            </div>
          )}
        </div>

        {/* Launch Vehicles Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Rocket style={{ fontSize: '1.75rem' }} className="text-blue-600" /> Launch Vehicles ({vehicles?.length || 0})
          </h2>
          {vehicles && vehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map(vehicle => (
                <div key={vehicle.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">{vehicle.name}</h3>
                      {vehicle.variant && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">{vehicle.variant}</p>
                      )}
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      vehicle.status === 'Active' ? 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300' :
                      vehicle.status === 'In Development' ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300' :
                      vehicle.status === 'Cancelled' ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300' :
                      'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                    }`}>
                      {vehicle.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{vehicle.manufacturer}</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      <p className="text-xs text-gray-500 dark:text-gray-400">LEO Payload</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {vehicle.payloadToLeoKg ? `${(vehicle.payloadToLeoKg / 1000).toFixed(1)}t` : '-'}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Launches</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{vehicle.totalLaunches ?? '-'}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Success Rate</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {vehicle.successRate ? `${(vehicle.successRate * 100).toFixed(0)}%` : '-'}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Cost/Launch</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {vehicle.costPerLaunchUsd ? `$${(vehicle.costPerLaunchUsd / 1e6).toFixed(0)}M` : '-'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    {vehicle.reusable && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                        <Recycling style={{ fontSize: '0.875rem' }} /> Reusable
                      </span>
                    )}
                    {vehicle.humanRated && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs rounded-full">
                        <PersonOutline style={{ fontSize: '0.875rem' }} /> Human-Rated
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center text-gray-500 dark:text-gray-400">
              No launch vehicles found for this country
            </div>
          )}
        </div>

        {/* Space Milestones Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <EmojiEvents style={{ fontSize: '1.75rem' }} className="text-yellow-500" /> Space Milestones ({milestones?.length || 0})
            </h2>
            {milestones && milestones.length > 0 && (
              <Link
                to={`/countries/${country.isoCode}/timeline`}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold text-sm"
              >
                View Full Timeline →
              </Link>
            )}
          </div>
          {milestones && milestones.length > 0 ? (
            <>
              {/* World Firsts */}
              {milestones.filter(m => m.isFirst).length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                    <EmojiEvents style={{ fontSize: '1.25rem' }} className="text-yellow-500" /> World First Achievements
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
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Other Achievements</h3>
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
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold"
                  >
                    View all {milestones.length} milestones →
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center text-gray-500 dark:text-gray-400">
              No milestones recorded for this country
            </div>
          )}
        </div>

        {/* Space Missions Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FlightTakeoff style={{ fontSize: '1.75rem' }} className="text-indigo-600 dark:text-indigo-400" /> Space Missions ({missions?.length || 0})
            </h2>
            {missions && missions.length > 0 && (
              <Link
                to={`/missions?country=${country.isoCode}`}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold text-sm"
              >
                View All Missions →
              </Link>
            )}
          </div>

          {missionSummary && missions && missions.length > 0 ? (
            <>
              {/* Mission Stats Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                    <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{missionSummary.totalMissions}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Total</div>
                  </div>
                  <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
                    <div className="text-xl font-bold text-green-600 dark:text-green-400">{missionSummary.activeMissions}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Active</div>
                  </div>
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                    <div className="text-xl font-bold text-purple-600 dark:text-purple-400">{missionSummary.crewedMissions}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Crewed</div>
                  </div>
                  <div className="p-2 bg-teal-50 dark:bg-teal-900/30 rounded-lg">
                    <div className="text-xl font-bold text-teal-600 dark:text-teal-400">{missionSummary.successRate}%</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Success</div>
                  </div>
                  <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg">
                    <div className="text-xl font-bold text-orange-600 dark:text-orange-400">{missionSummary.totalCrewMembers}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Astronauts</div>
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
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold"
                  >
                    View all {missions.length} missions →
                  </Link>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center text-gray-500 dark:text-gray-400">
              No missions recorded for this country
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Data sources: Wikipedia, official space agency reports.
            Last updated: December 2025
          </p>
        </div>
      </div>
    </div>
  );
}
