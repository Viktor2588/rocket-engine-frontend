import { useParams, Link } from 'react-router-dom';
import { useMissionById, useCountryMissions } from '../hooks/useMissions';
import { StatusBadge, MissionTypeBadge, DestinationBadge, MissionCardCompact } from '../components/MissionCard';
import { MISSION_TYPE_INFO, DESTINATION_INFO } from '../types';

// Country flags and names
const COUNTRY_INFO = {
  USA: { flag: '🇺🇸', name: 'United States' },
  RUS: { flag: '🇷🇺', name: 'Russia' },
  CHN: { flag: '🇨🇳', name: 'China' },
  EUR: { flag: '🇪🇺', name: 'European Space Agency' },
  JPN: { flag: '🇯🇵', name: 'Japan' },
  IND: { flag: '🇮🇳', name: 'India' },
  ISR: { flag: '🇮🇱', name: 'Israel' },
  UAE: { flag: '🇦🇪', name: 'UAE' }
};

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Calculate mission duration
function getMissionDuration(launchDate, endDate) {
  const start = new Date(launchDate);
  const end = endDate ? new Date(endDate) : new Date();
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 30) {
    return `${diffDays} days`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''}`;
  } else {
    const years = Math.floor(diffDays / 365);
    const remainingMonths = Math.floor((diffDays % 365) / 30);
    return `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? `, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`;
  }
}

export default function MissionDetailPage() {
  const { id } = useParams();
  const { mission, loading, error } = useMissionById(id);
  const { missions: relatedMissions } = useCountryMissions(mission?.countryId);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 dark:text-gray-400">Loading mission details...</p>
        </div>
      </div>
    );
  }

  if (error || !mission) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="glass-tinted-red p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">Mission Not Found</h2>
          <p className="text-red-600 dark:text-red-400 mb-4">{error || 'The requested mission could not be found.'}</p>
          <Link
            to="/missions"
            className="text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold"
          >
            ← Back to Missions
          </Link>
        </div>
      </div>
    );
  }

  const countryInfo = COUNTRY_INFO[mission.countryId] || { flag: '🏳️', name: mission.countryId };
  const typeInfo = MISSION_TYPE_INFO[mission.missionType];
  const destInfo = DESTINATION_INFO[mission.destination];
  const otherMissions = relatedMissions?.filter(m => m.id !== mission.id).slice(0, 4) || [];

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/missions"
            className="text-indigo-500 hover:text-indigo-700 font-semibold"
          >
            ← Back to Missions
          </Link>
        </div>

        {/* Header */}
        <div className="glass-panel overflow-hidden mb-8">
          {/* Status bar */}
          <div className={`h-1 ${
            mission.status === 'ACTIVE' ? 'bg-green-500' :
            mission.status === 'COMPLETED' ? 'bg-teal-500' :
            mission.status === 'FAILED' ? 'bg-red-500' :
            mission.status === 'IN_TRANSIT' ? 'bg-orange-500' :
            'bg-indigo-500'
          }`} />

          <div className="p-6">
            <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
              <div className="flex items-start gap-4">
                {/* Mission Patch */}
                {mission.patchUrl ? (
                  <img
                    src={mission.patchUrl}
                    alt={`${mission.name} mission patch`}
                    className="w-20 h-20 object-contain rounded-lg bg-white shadow"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <span className="text-5xl">{countryInfo.flag}</span>
                )}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{mission.name}</h1>
                    {mission.isHistoricFirst && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                        🥇 {mission.historicFirstType || 'Historic First'}
                      </span>
                    )}
                    {mission.successLevel && mission.successLevel !== 'Full' && (
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        mission.successLevel === 'Partial' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {mission.successLevel} Success
                      </span>
                    )}
                  </div>
                  {mission.missionDesignation && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-mono mb-1">{mission.missionDesignation}</p>
                  )}
                  <p className="text-gray-600 dark:text-gray-400 dark:text-gray-400">{countryInfo.name}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <StatusBadge status={mission.status} />
                    <MissionTypeBadge missionType={mission.missionType} />
                    <DestinationBadge destination={mission.destination} />
                    {mission.crewed && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded-full">
                        👨‍🚀 Crewed Mission
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Key stats */}
              <div className="flex gap-4">
                <div className="text-center px-4 py-2 bg-gray-500/10 dark:bg-white/[0.06] rounded-[12px] border border-gray-200/30 dark:border-white/[0.08]">
                  <div className="text-lg font-bold text-gray-800 dark:text-white">{formatDate(mission.launchDate)}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Launch Date</div>
                </div>
                {mission.status === 'ACTIVE' && (
                  <div className="glass-tinted-green text-center px-4 py-2">
                    <div className="text-lg font-bold text-green-700 dark:text-green-400">
                      {getMissionDuration(mission.launchDate)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Duration</div>
                  </div>
                )}
                {mission.crewed && mission.crewSize && (
                  <div className="glass-tinted-purple text-center px-4 py-2">
                    <div className="text-lg font-bold text-purple-700 dark:text-purple-400">{mission.crewSize}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Crew Members</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="glass-panel p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Mission Overview</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{mission.description}</p>
            </div>

            {/* Crew */}
            {mission.crewed && mission.crewNames && mission.crewNames.length > 0 && (
              <div className="glass-panel p-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">👨‍🚀 Crew Members</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {mission.crewNames.map((name, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-gray-500/10 dark:bg-white/[0.06] rounded-[12px] border border-gray-200/30 dark:border-white/[0.08]">
                      <div className="w-10 h-10 bg-indigo-500/20 dark:bg-indigo-500/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                        {name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-800 dark:text-white">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Objectives */}
            {mission.objectives && mission.objectives.length > 0 && (
              <div className="glass-panel p-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">🎯 Mission Objectives</h2>
                <ul className="space-y-3">
                  {mission.objectives.map((objective, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-indigo-500/20 dark:bg-indigo-500/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-sm font-semibold">
                        {idx + 1}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Achievements */}
            {mission.achievements && mission.achievements.length > 0 && (
              <div className="glass-tinted-yellow p-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">🏆 Key Achievements</h2>
                <ul className="space-y-2">
                  {mission.achievements.map((achievement, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-yellow-500">★</span>
                      <span className="text-gray-700 dark:text-gray-300">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mission Outcomes */}
            {mission.outcomes && (
              <div className="glass-panel p-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">📋 Mission Outcomes</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{mission.outcomes}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mission Details */}
            <div className="glass-panel p-6">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Mission Details</h2>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Launch Date</dt>
                  <dd className="font-medium text-gray-800 dark:text-white">{formatDate(mission.launchDate)}</dd>
                </div>
                {mission.endDate && (
                  <div>
                    <dt className="text-sm text-gray-500 dark:text-gray-400">End Date</dt>
                    <dd className="font-medium text-gray-800 dark:text-white">{formatDate(mission.endDate)}</dd>
                  </div>
                )}
                {mission.launchVehicle && (
                  <div>
                    <dt className="text-sm text-gray-500 dark:text-gray-400">Launch Vehicle</dt>
                    <dd className="font-medium text-gray-800 dark:text-white">🚀 {mission.launchVehicle}</dd>
                  </div>
                )}
                {mission.launchSite && (
                  <div>
                    <dt className="text-sm text-gray-500 dark:text-gray-400">Launch Site</dt>
                    <dd className="font-medium text-gray-800 dark:text-white">{mission.launchSite}</dd>
                  </div>
                )}
                {mission.missionMassKg && (
                  <div>
                    <dt className="text-sm text-gray-500 dark:text-gray-400">Mission Mass</dt>
                    <dd className="font-medium text-gray-800 dark:text-white">{mission.missionMassKg.toLocaleString()} kg</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Mission Type</dt>
                  <dd className="font-medium text-gray-800 dark:text-white">
                    {typeInfo?.icon} {typeInfo?.label || mission.missionType}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-400">Destination</dt>
                  <dd className="font-medium text-gray-800 dark:text-white">
                    {destInfo?.icon} {destInfo?.label || mission.destination}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Destination Info */}
            {destInfo && (
              <div className="glass-panel p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{destInfo.icon}</span>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white">{destInfo.label}</h2>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{destInfo.description}</p>
              </div>
            )}

            {/* Country Link */}
            <div className="glass-panel p-6">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Space Program</h2>
              <Link
                to={`/countries/${mission.countryId}`}
                className="flex items-center gap-3 p-3 bg-gray-500/10 dark:bg-white/[0.06] rounded-[12px] hover:bg-gray-500/15 dark:hover:bg-white/[0.08] transition border border-gray-200/30 dark:border-white/[0.08]"
              >
                <span className="text-3xl">{countryInfo.flag}</span>
                <div>
                  <div className="font-medium text-gray-800 dark:text-white">{countryInfo.name}</div>
                  <div className="text-sm text-indigo-600 dark:text-indigo-400">View Space Program →</div>
                </div>
              </Link>
            </div>

            {/* Related Missions */}
            {otherMissions.length > 0 && (
              <div className="glass-panel p-6">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Related Missions</h2>
                <div className="space-y-3">
                  {otherMissions.map(m => (
                    <MissionCardCompact key={m.id} mission={m} showCountry={false} />
                  ))}
                </div>
                <Link
                  to={`/missions?country=${mission.countryId}`}
                  className="block mt-4 text-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                >
                  View all {countryInfo.name} missions →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          <Link
            to="/missions"
            className="glass-button px-4 py-2"
          >
            ← All Missions
          </Link>
          <Link
            to={`/countries/${mission.countryId}`}
            className="glass-button-primary px-4 py-2"
          >
            {countryInfo.name} Space Program →
          </Link>
        </div>
      </div>
    </div>
  );
}
