import { Link } from 'react-router-dom';
import SpaceIcon from './icons/SpaceIcons';

/**
 * Card component displaying a country's space program summary
 */
export default function CountryCard({ country, rank }) {
  const score = country.overallCapabilityScore || 0;

  // Determine score color based on value
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400 bg-green-500/15 dark:bg-green-500/20 border-green-400/20';
    if (score >= 60) return 'text-blue-600 dark:text-blue-400 bg-blue-500/15 dark:bg-blue-500/20 border-blue-400/20';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400 bg-yellow-500/15 dark:bg-yellow-500/20 border-yellow-400/20';
    return 'text-gray-600 dark:text-gray-400 bg-gray-500/10 dark:bg-gray-500/15 border-gray-400/20';
  };

  // Determine rank badge color
  const getRankColor = (rank) => {
    if (rank === 1) return 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-yellow-900 shadow-lg shadow-yellow-500/30';
    if (rank === 2) return 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800 shadow-lg shadow-gray-400/30';
    if (rank === 3) return 'bg-gradient-to-br from-orange-400 to-orange-500 text-orange-900 shadow-lg shadow-orange-500/30';
    return 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-400/30';
  };

  // Count active capabilities (boolean flags)
  const booleanCapabilities = [
    { key: 'humanSpaceflightCapable', label: 'Human Spaceflight', icon: 'astronaut' },
    { key: 'independentLaunchCapable', label: 'Independent Launch', icon: 'rocket' },
    { key: 'deepSpaceCapable', label: 'Deep Space', icon: 'moon' },
    { key: 'spaceStationCapable', label: 'Space Station', icon: 'satellite' },
  ];

  const activeBooleanCapabilities = booleanCapabilities.filter(cap => country[cap.key]);

  // Handle reusable rocket status separately (Yes/In Development/No)
  const reusableStatus = country.reusableRocketStatus;
  const hasReusableCapability = reusableStatus === 'Yes' || reusableStatus === 'In Development';

  const activeCapabilities = [
    ...activeBooleanCapabilities,
    ...(hasReusableCapability ? [{
      key: 'reusableRocketStatus',
      label: reusableStatus === 'Yes' ? 'Reusable Rockets' : 'Reusable (Dev)',
      icon: 'recycling',
      inDevelopment: reusableStatus === 'In Development'
    }] : [])
  ];

  return (
    <Link to={`/countries/${country.isoCode}`}>
      <div className="glass-panel glass-float p-6 cursor-pointer border-l-4 border-indigo-500 relative">
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
              <img src={country.flagUrl} alt={`${country.name} flag`} className="w-10 h-7 object-cover rounded shadow-sm" />
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
          <div className={`p-3 rounded-[12px] border ${getScoreColor(score)}`}>
            <p className="text-xs text-gray-500 dark:text-gray-400">Capability Score</p>
            <p className="text-2xl font-bold">{score.toFixed(1)}</p>
          </div>
          <div className="bg-purple-500/15 dark:bg-purple-500/20 p-3 rounded-[12px] border border-purple-400/20">
            <p className="text-xs text-gray-500 dark:text-gray-400">Region</p>
            <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">{country.region}</p>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div className="bg-gray-500/10 dark:bg-white/[0.06] p-2 rounded-[10px] border border-gray-200/30 dark:border-white/[0.08]">
            <p className="text-xs text-gray-500 dark:text-gray-400">Launches</p>
            <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
              {country.totalLaunches ?? '-'}
            </p>
          </div>
          <div className="bg-gray-500/10 dark:bg-white/[0.06] p-2 rounded-[10px] border border-gray-200/30 dark:border-white/[0.08]">
            <p className="text-xs text-gray-500 dark:text-gray-400">Success</p>
            <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
              {country.launchSuccessRate
                ? `${country.launchSuccessRate.toFixed(1)}%`
                : '-'}
            </p>
          </div>
          <div className="bg-gray-500/10 dark:bg-white/[0.06] p-2 rounded-[10px] border border-gray-200/30 dark:border-white/[0.08]">
            <p className="text-xs text-gray-500 dark:text-gray-400">Astronauts</p>
            <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
              {country.activeAstronauts ?? '-'}
            </p>
          </div>
        </div>

        {/* Capability Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {activeCapabilities.map(cap => (
            <span
              key={cap.key}
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full backdrop-blur-sm border ${
                cap.inDevelopment
                  ? 'bg-yellow-500/15 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-400/20'
                  : 'bg-indigo-500/15 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-400/20'
              }`}
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
        <div className="pt-4 border-t border-gray-200/50 dark:border-white/[0.08] flex justify-between items-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {country.annualBudgetUsd && (
              <span>Budget: ${(country.annualBudgetUsd / 1e9).toFixed(1)}B</span>
            )}
          </p>
          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">View Details →</p>
        </div>
      </div>
    </Link>
  );
}
