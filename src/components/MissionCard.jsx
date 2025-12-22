import { Link } from 'react-router-dom';
import { MISSION_TYPE_INFO, DESTINATION_INFO } from '../types';
import SpaceIcon from './icons/SpaceIcons';
import { Rocket, PersonOutline, EmojiEvents } from '@mui/icons-material';

// Status badge colors and labels
const STATUS_CONFIG = {
  PLANNED: { color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300', label: 'Planned' },
  IN_DEVELOPMENT: { color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300', label: 'In Development' },
  LAUNCHED: { color: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300', label: 'Launched' },
  IN_TRANSIT: { color: 'bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300', label: 'In Transit' },
  ACTIVE: { color: 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300', label: 'Active' },
  COMPLETED: { color: 'bg-teal-100 dark:bg-teal-900/40 text-teal-800 dark:text-teal-300', label: 'Completed' },
  PARTIAL_SUCCESS: { color: 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300', label: 'Partial Success' },
  FAILED: { color: 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300', label: 'Failed' },
  LOST: { color: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300', label: 'Lost' }
};

// Country flags
const COUNTRY_FLAGS = {
  USA: '🇺🇸',
  RUS: '🇷🇺',
  CHN: '🇨🇳',
  EUR: '🇪🇺',
  JPN: '🇯🇵',
  IND: '🇮🇳',
  ISR: '🇮🇱',
  DEU: '🇩🇪',
  FRA: '🇫🇷',
  GBR: '🇬🇧',
  KOR: '🇰🇷',
  IRN: '🇮🇷',
  UAE: '🇦🇪'
};

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Status Badge Component
export function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { color: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300', label: status };
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
      {config.label}
    </span>
  );
}

// Destination Badge Component
export function DestinationBadge({ destination }) {
  const info = DESTINATION_INFO[destination];
  if (!info) return null;

  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full">
      <SpaceIcon name={info.icon} size="sm" />
      <span>{info.label}</span>
    </span>
  );
}

// Mission Type Badge Component
export function MissionTypeBadge({ missionType }) {
  const info = MISSION_TYPE_INFO[missionType];
  if (!info) return null;

  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
      <SpaceIcon name={info.icon} size="sm" />
      <span>{info.label}</span>
    </span>
  );
}

// Compact Mission Card
export function MissionCardCompact({ mission, showCountry = true }) {
  const destInfo = DESTINATION_INFO[mission.destination];

  return (
    <Link
      to={`/missions/${mission.id}`}
      className="block p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {showCountry && (
              <span className="text-lg">{COUNTRY_FLAGS[mission.countryId] || '🏳️'}</span>
            )}
            <h4 className="font-semibold text-gray-900 dark:text-white truncate">{mission.name}</h4>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span>{formatDate(mission.launchDate)}</span>
            {destInfo && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1"><SpaceIcon name={destInfo.icon} size="sm" /> {destInfo.label}</span>
              </>
            )}
          </div>
        </div>
        <StatusBadge status={mission.status} />
      </div>
      {mission.crewed && (
        <div className="mt-2 text-xs text-indigo-600 flex items-center gap-1">
          <PersonOutline style={{ fontSize: '1rem' }} /> Crewed ({mission.crewSize} astronauts)
        </div>
      )}
    </Link>
  );
}

// Full Mission Card
export default function MissionCard({ mission, showCountry = true, className = '' }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
      {/* Header with status bar */}
      <div className={`h-2 ${
        mission.status === 'ACTIVE' ? 'bg-green-500' :
        mission.status === 'COMPLETED' ? 'bg-teal-500' :
        mission.status === 'FAILED' ? 'bg-red-500' :
        mission.status === 'IN_TRANSIT' ? 'bg-orange-500' :
        'bg-indigo-500'
      }`} />

      <div className="p-4">
        {/* Title row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            {showCountry && (
              <span className="text-2xl">{COUNTRY_FLAGS[mission.countryId] || '🏳️'}</span>
            )}
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{mission.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(mission.launchDate)}</p>
            </div>
          </div>
          <StatusBadge status={mission.status} />
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap gap-2 mb-3">
          <MissionTypeBadge missionType={mission.missionType} />
          <DestinationBadge destination={mission.destination} />
          {mission.crewed && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full">
              <PersonOutline style={{ fontSize: '1rem' }} /> Crewed ({mission.crewSize})
            </span>
          )}
          {mission.historicFirst && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-yellow-50 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 rounded-full">
              <EmojiEvents style={{ fontSize: '1rem' }} /> Historic First
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {mission.description}
        </p>

        {/* Crew names if crewed */}
        {mission.crewed && Array.isArray(mission.crewNames) && mission.crewNames.length > 0 && (
          <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
            <span className="font-medium text-gray-700 dark:text-gray-300">Crew: </span>
            <span className="text-gray-600 dark:text-gray-400">{mission.crewNames.join(', ')}</span>
          </div>
        )}

        {/* Objectives preview */}
        {Array.isArray(mission.objectives) && mission.objectives.length > 0 && (
          <div className="mb-3">
            <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Objectives</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              {mission.objectives.slice(0, 2).map((obj, idx) => (
                <li key={idx} className="flex items-start gap-1">
                  <span className="text-indigo-500 dark:text-indigo-400">•</span>
                  <span className="line-clamp-1">{typeof obj === 'string' ? obj : obj?.name || obj?.description || String(obj)}</span>
                </li>
              ))}
              {mission.objectives.length > 2 && (
                <li className="text-indigo-500 text-xs">+{mission.objectives.length - 2} more</li>
              )}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          {mission.launchVehicle && (
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Rocket style={{ fontSize: '1rem' }} /> {mission.launchVehicle}
            </span>
          )}
          <Link
            to={`/missions/${mission.id}`}
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 font-medium"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}

// Mission Stats Summary Card
export function MissionStatsCard({ stats }) {
  if (!stats) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Mission Statistics</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.totalMissions}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Total Missions</div>
        </div>
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.activeMissions}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Active</div>
        </div>
        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.crewedMissions}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Crewed Missions</div>
        </div>
        <div className="text-center p-3 bg-teal-50 dark:bg-teal-900/30 rounded-lg">
          <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">{stats.successRate}%</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Success Rate</div>
        </div>
      </div>

      {/* Status breakdown */}
      {stats.byStatus && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">By Status</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.byStatus).map(([status, count]) => (
              <span key={status} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                {STATUS_CONFIG[status]?.label || status}: {count}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Destination breakdown */}
      {stats.byDestination && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">By Destination</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.byDestination).map(([dest, count]) => {
              const info = DESTINATION_INFO[dest];
              return (
                <span key={dest} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded inline-flex items-center gap-1">
                  <SpaceIcon name={info?.icon} size="sm" /> {info?.label || dest}: {count}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Mission Timeline Item
export function MissionTimelineItem({ mission, isFirst = false, isLast = false }) {
  const destInfo = DESTINATION_INFO[mission.destination];

  return (
    <div className="relative pl-8 pb-6">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-3 top-6 bottom-0 w-0.5 bg-gray-200" />
      )}

      {/* Timeline dot */}
      <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
        mission.status === 'ACTIVE' ? 'bg-green-500 text-white' :
        mission.status === 'COMPLETED' ? 'bg-teal-500 text-white' :
        mission.status === 'FAILED' ? 'bg-red-500 text-white' :
        'bg-indigo-500 text-white'
      }`}>
        <SpaceIcon name={destInfo?.icon || 'rocket'} size="xs" />
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-2">
          <div>
            <Link
              to={`/missions/${mission.id}`}
              className="font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {mission.name}
            </Link>
            <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(mission.launchDate)}</p>
          </div>
          <StatusBadge status={mission.status} />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{mission.description}</p>
      </div>
    </div>
  );
}
