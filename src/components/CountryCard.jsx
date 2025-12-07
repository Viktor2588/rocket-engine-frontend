import { Link } from 'react-router-dom';
import SpaceIcon from './icons/SpaceIcons';

/**
 * Card component displaying a country's space program summary
 */
export default function CountryCard({ country, rank }) {
  const score = country.overallCapabilityScore || 0;

  // Determine score color based on value
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30';
    return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700';
  };

  // Determine rank badge color
  const getRankColor = (rank) => {
    if (rank === 1) return 'bg-yellow-400 text-yellow-900';
    if (rank === 2) return 'bg-gray-300 text-gray-800';
    if (rank === 3) return 'bg-orange-400 text-orange-900';
    return 'bg-blue-100 text-blue-800';
  };

  // Count active capabilities
  const capabilities = [
    { key: 'humanSpaceflightCapable', label: 'Human Spaceflight', icon: 'astronaut' },
    { key: 'independentLaunchCapable', label: 'Independent Launch', icon: 'rocket' },
    { key: 'reusableRocketCapable', label: 'Reusable Rockets', icon: 'recycling' },
    { key: 'deepSpaceCapable', label: 'Deep Space', icon: 'moon' },
    { key: 'spaceStationCapable', label: 'Space Station', icon: 'satellite' },
  ];

  const activeCapabilities = capabilities.filter(cap => country[cap.key]);

  return (
    <Link to={`/countries/${country.isoCode}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition p-6 cursor-pointer border-l-4 border-indigo-500 relative">
        {/* Rank Badge */}
        {rank && (
          <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getRankColor(rank)}`}>
            {rank}
          </div>
        )}

        {/* Header: Flag + Name + Agency */}
        <div className="flex items-start gap-3 mb-4">
          <div className="text-4xl">
            {country.flagUrl ? (
              <img src={country.flagUrl} alt={`${country.name} flag`} className="w-10 h-7 object-cover rounded" />
            ) : (
              <span className="text-3xl">🏳️</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white truncate">{country.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {country.spaceAgencyAcronym || country.spaceAgencyName}
              {country.spaceAgencyFounded && (
                <span className="text-gray-400 dark:text-gray-500 ml-1">
                  (est. {country.spaceAgencyFounded})
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Score Display */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className={`p-3 rounded ${getScoreColor(score)}`}>
            <p className="text-xs text-gray-500 dark:text-gray-400">Capability Score</p>
            <p className="text-2xl font-bold">{score.toFixed(1)}</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded">
            <p className="text-xs text-gray-500 dark:text-gray-400">Region</p>
            <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">{country.region}</p>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
            <p className="text-xs text-gray-500 dark:text-gray-400">Launches</p>
            <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
              {country.totalLaunches ?? '-'}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
            <p className="text-xs text-gray-500 dark:text-gray-400">Success</p>
            <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
              {country.launchSuccessRate
                ? `${country.launchSuccessRate.toFixed(1)}%`
                : '-'}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
            <p className="text-xs text-gray-500 dark:text-gray-400">Astronauts</p>
            <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
              {country.activeAstronauts ?? '-'}
            </p>
          </div>
        </div>

        {/* Capability Badges */}
        <div className="flex flex-wrap gap-1 mb-4">
          {activeCapabilities.map(cap => (
            <span
              key={cap.key}
              className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs rounded-full"
              title={cap.label}
            >
              <SpaceIcon name={cap.icon} size="sm" />
              <span className="hidden sm:inline">{cap.label}</span>
            </span>
          ))}
          {activeCapabilities.length === 0 && (
            <span className="text-xs text-gray-400 dark:text-gray-500">Emerging space program</span>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {country.annualBudgetUsd && (
              <span>Budget: ${(country.annualBudgetUsd / 1e9).toFixed(1)}B</span>
            )}
          </p>
          <p className="text-xs text-indigo-500 dark:text-indigo-400 font-semibold">View Details →</p>
        </div>
      </div>
    </Link>
  );
}
