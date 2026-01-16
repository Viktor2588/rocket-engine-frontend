import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  useSCIRankings,
  useSCIComparison,
  useFilteredRankings,
  useRankingsStatistics,
  useCountrySelection,
} from '../hooks/useCapabilityScores';
import LoadingSpinner from '../components/LoadingSpinner';
import CapabilityScoreCard, {
  TierBadge,
  ScoreGauge,
  ComparisonRadarChart,
  TierDistributionChart,
  CategoryScoreBar,
} from '../components/CapabilityScoreCard';
import { SortableGridHeader } from '../components/SortableHeader';
import { CATEGORY_WEIGHTS, SCI_TIER_THRESHOLDS } from '../types';
import SpaceIcon from '../components/icons/SpaceIcons';
import { EmojiEvents } from '@mui/icons-material';

/**
 * Get flag emoji for country
 */
function getCountryFlag(isoCode) {
  const flags = {
    USA: '🇺🇸',
    CHN: '🇨🇳',
    RUS: '🇷🇺',
    EUR: '🇪🇺',
    JPN: '🇯🇵',
    IND: '🇮🇳',
    DEU: '🇩🇪',
    FRA: '🇫🇷',
    GBR: '🇬🇧',
    KOR: '🇰🇷',
    ISR: '🇮🇱',
    IRN: '🇮🇷',
  };
  return flags[isoCode] || '🏳️';
}

export default function RankingsPage() {
  const { rankings, loading, error } = useSCIRankings();
  const statistics = useRankingsStatistics(rankings);
  const {
    selectedCountries,
    toggleCountry,
    clearSelection,
    isSelected,
    canSelectMore,
    selectionCount,
  } = useCountrySelection(4);

  // Filters and sorting
  const [tierFilter, setTierFilter] = useState(null);
  const [sortBy, setSortBy] = useState('overall');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('list'); // list, grid, compare

  // Sort handler for grid headers
  const handleSort = useCallback((key, order) => {
    setSortBy(key);
    setSortOrder(order);
  }, []);

  // Sort columns configuration
  const sortColumns = [
    { key: 'overall', label: 'Score' },
    { key: 'rank', label: 'Rank' },
    { key: 'name', label: 'Name' },
  ];

  // Filter and sort rankings
  const filteredRankings = useFilteredRankings(rankings, {
    tierFilter,
    searchQuery,
    sortBy,
    sortOrder,
  });

  // Get comparison data when countries are selected
  const { comparison } = useSCIComparison(selectedCountries);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <LoadingSpinner message="Loading rankings..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="glass-tinted-red p-6 text-center">
          <h2 className="text-xl font-bold text-red-700 dark:text-red-300 mb-2">Error Loading Rankings</h2>
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Space Capability Index Rankings</h1>
        <p className="text-gray-600 dark:text-gray-400 dark:text-gray-400">
          Global rankings of national space programs based on comprehensive capability scoring
        </p>
      </div>

      {/* Global Statistics */}
      {rankings?.globalStatistics && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <div className="glass-tinted-indigo p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {rankings.globalStatistics.totalCountries}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Countries</div>
          </div>
          <div className="glass-tinted-green p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {rankings.globalStatistics.countriesWithLaunchCapability}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Launch Capable</div>
          </div>
          <div className="glass-tinted-purple p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {rankings.globalStatistics.countriesWithHumanSpaceflight}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Human Spaceflight</div>
          </div>
          <div className="glass-tinted-blue p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {rankings.globalStatistics.averageScore?.toFixed(1)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Avg Score</div>
          </div>
          <div className="glass-tinted-orange p-4 text-center">
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {rankings.globalStatistics.topScore?.toFixed(1)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Top Score</div>
          </div>
          <div className="glass-panel p-4 text-center">
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
              {rankings.globalStatistics.medianScore?.toFixed(1)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Median</div>
          </div>
          <div className="glass-tinted-red p-4 text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {rankings.globalStatistics.bottomScore?.toFixed(1)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Bottom Score</div>
          </div>
        </div>
      )}

      {/* Tier Distribution Chart */}
      {statistics?.tierDistribution && (
        <div className="glass-panel p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Tier Distribution</h2>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <TierDistributionChart tierCounts={statistics.tierDistribution} size={180} />
            <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-4">
              {SCI_TIER_THRESHOLDS.map(tier => (
                <div
                  key={tier.tier}
                  className="p-3 rounded-[12px] cursor-pointer transition hover:shadow-md border border-gray-200/30 dark:border-white/[0.08]"
                  style={{ backgroundColor: tier.color + '15' }}
                  onClick={() => setTierFilter(tierFilter === tier.tier ? null : tier.tier)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: tier.color }}
                    />
                    <span className="font-semibold text-gray-800 dark:text-white">{tier.tier}</span>
                  </div>
                  <div className="text-2xl font-bold" style={{ color: tier.color }}>
                    {statistics.tierDistribution[tier.tier] || 0}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{tier.minScore}+ points</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Controls Bar */}
      <div className="glass-panel p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search countries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input w-full"
            />
          </div>

          {/* Tier Filter */}
          <select
            value={tierFilter || ''}
            onChange={(e) => setTierFilter(e.target.value || null)}
            className="glass-select"
          >
            <option value="">All Tiers</option>
            {SCI_TIER_THRESHOLDS.map(tier => (
              <option key={tier.tier} value={tier.tier}>{tier.tier}</option>
            ))}
          </select>

          {/* View Mode */}
          <div className="flex rounded-[12px] overflow-hidden border border-gray-200/50 dark:border-white/[0.08]">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 transition ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-gray-500/10 dark:bg-white/[0.06] text-gray-700 dark:text-gray-300 hover:bg-gray-500/20 dark:hover:bg-white/[0.1]'}`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 transition ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-gray-500/10 dark:bg-white/[0.06] text-gray-700 dark:text-gray-300 hover:bg-gray-500/20 dark:hover:bg-white/[0.1]'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('compare')}
              className={`px-4 py-2 transition ${viewMode === 'compare' ? 'bg-indigo-600 text-white' : 'bg-gray-500/10 dark:bg-white/[0.06] text-gray-700 dark:text-gray-300 hover:bg-gray-500/20 dark:hover:bg-white/[0.1]'}`}
            >
              Compare
            </button>
          </div>
        </div>

        {/* Selection Info */}
        {selectionCount > 0 && (
          <div className="mt-4 flex items-center gap-4 p-3 glass-tinted-blue">
            <span className="text-indigo-700 dark:text-indigo-300">
              <strong>{selectionCount}</strong> countries selected for comparison
            </span>
            <button
              onClick={clearSelection}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
            >
              Clear Selection
            </button>
            {selectionCount >= 2 && (
              <button
                onClick={() => setViewMode('compare')}
                className="ml-auto glass-button-primary text-sm"
              >
                View Comparison
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      {viewMode === 'compare' && selectedCountries.length >= 2 && comparison ? (
        <ComparisonView comparison={comparison} />
      ) : viewMode === 'grid' ? (
        <div className="space-y-4">
          <SortableGridHeader
            columns={sortColumns}
            currentSort={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRankings.map((breakdown) => (
              <div
                key={breakdown.countryId}
                onClick={() => toggleCountry(String(breakdown.countryId))}
                className={`cursor-pointer transition ${
                  isSelected(String(breakdown.countryId)) ? 'ring-2 ring-indigo-500' : ''
                }`}
              >
                <CapabilityScoreCard breakdown={breakdown} compact />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <SortableGridHeader
            columns={sortColumns}
            currentSort={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
          <div className="space-y-2">
            {filteredRankings.map((breakdown, index) => (
              <RankingRow
                key={breakdown.countryId}
                breakdown={breakdown}
                rank={breakdown.globalRank}
                isSelected={isSelected(String(breakdown.countryId))}
                onToggleSelect={() => toggleCountry(String(breakdown.countryId))}
                canSelect={canSelectMore || isSelected(String(breakdown.countryId))}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredRankings.length === 0 && (
        <div className="glass-panel p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400">No countries match your filters.</p>
          <button
            onClick={() => {
              setTierFilter(null);
              setSearchQuery('');
            }}
            className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Ranking Row Component
 */
function RankingRow({ breakdown, rank, isSelected, onToggleSelect, canSelect }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`glass-panel transition ${
        isSelected ? 'border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-500/30' : ''
      }`}
    >
      <div className="p-4 flex items-center gap-4">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelect}
          disabled={!canSelect}
          className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
        />

        {/* Rank */}
        <div className="w-12 text-center">
          <span className={`text-2xl font-bold ${
            rank === 1 ? 'text-amber-500' :
            rank === 2 ? 'text-gray-400' :
            rank === 3 ? 'text-amber-700' :
            'text-gray-600'
          }`}>
            #{rank}
          </span>
        </div>

        {/* Flag and Country */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-3xl">{getCountryFlag(breakdown.countryId)}</span>
          <div>
            <Link
              to={`/countries/${breakdown.countryId}`}
              className="font-bold text-gray-900 hover:text-indigo-600"
            >
              {breakdown.countryName}
            </Link>
            <div className="flex items-center gap-2">
              <TierBadge tier={breakdown.tier} size="sm" />
              {breakdown.trend === 'improving' && (
                <span className="text-xs text-green-600">↑ Improving</span>
              )}
              {breakdown.trend === 'declining' && (
                <span className="text-xs text-red-600 dark:text-red-400">↓ Declining</span>
              )}
            </div>
          </div>
        </div>

        {/* Score Gauge */}
        <div className="hidden sm:block">
          <ScoreGauge score={breakdown.overallScore} size="sm" />
        </div>

        {/* Category Mini Bars */}
        <div className="hidden lg:flex flex-1 gap-1 max-w-sm">
          {breakdown.categoryScores?.slice(0, 4).map((cs) => {
            const catInfo = CATEGORY_WEIGHTS?.find(cw => cw.category === cs.category);
            return (
              <div key={cs.category} className="flex-1" title={catInfo?.label}>
                <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded relative overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-full rounded"
                    style={{
                      width: `${cs.score}%`,
                      backgroundColor: catInfo?.color,
                    }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                    <SpaceIcon name={catInfo?.icon} size="sm" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Expand Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-2 hover:bg-gray-500/10 dark:hover:bg-white/[0.06] rounded-[10px] transition"
        >
          {expanded ? '▲' : '▼'}
        </button>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-200/30 dark:border-white/[0.08]">
          <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Scores */}
            <div>
              <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Category Scores</h4>
              <div className="space-y-2">
                {breakdown.categoryScores?.map((cs) => (
                  <CategoryScoreBar key={cs.category} category={cs.category} score={cs.score} />
                ))}
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div>
              {breakdown.strengths?.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">Strengths</h4>
                  <div className="flex flex-wrap gap-2">
                    {breakdown.strengths.map(s => {
                      const catInfo = CATEGORY_WEIGHTS?.find(cw => cw.category === s);
                      return (
                        <span
                          key={s}
                          className="px-2 py-1 bg-green-500/15 dark:bg-green-500/20 text-green-800 dark:text-green-300 rounded-full text-sm flex items-center gap-1 border border-green-500/20 dark:border-green-400/20"
                        >
                          <SpaceIcon name={catInfo?.icon} size="sm" /> {catInfo?.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
              {breakdown.weaknesses?.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-2">Areas for Growth</h4>
                  <div className="flex flex-wrap gap-2">
                    {breakdown.weaknesses.map(w => {
                      const catInfo = CATEGORY_WEIGHTS?.find(cw => cw.category === w);
                      return (
                        <span
                          key={w}
                          className="px-2 py-1 bg-amber-500/15 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 rounded-full text-sm flex items-center gap-1 border border-amber-500/20 dark:border-amber-400/20"
                        >
                          <SpaceIcon name={catInfo?.icon} size="sm" /> {catInfo?.label}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              <Link
                to={`/countries/${breakdown.countryId}`}
                className="mt-4 inline-block text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium"
              >
                View Full Profile →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Comparison View Component
 */
function ComparisonView({ comparison }) {
  if (!comparison || !comparison.countries || comparison.countries.length < 2) {
    return (
      <div className="glass-panel p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">Select at least 2 countries to compare.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Radar Chart */}
      <div className="glass-panel p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Capability Comparison</h2>
        <ComparisonRadarChart breakdowns={comparison.countries} height={400} />
      </div>

      {/* Side by Side Scores */}
      <div className="glass-panel p-6">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Score Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200/30 dark:border-white/[0.08]">
                <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Category</th>
                {comparison.countries.map((c) => (
                  <th key={c.countryId} className="text-center py-3 px-4 font-medium text-gray-600 dark:text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xl">{getCountryFlag(c.countryId)}</span>
                      {c.countryName}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Overall Score */}
              <tr className="border-b border-gray-200/30 dark:border-white/[0.08] bg-indigo-500/10 dark:bg-indigo-500/15">
                <td className="py-3 px-4 font-semibold text-indigo-800 dark:text-indigo-300">Overall Score</td>
                {comparison.countries.map((c) => (
                  <td key={c.countryId} className="text-center py-3 px-4">
                    <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                      {c.overallScore?.toFixed(1)}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Category Scores */}
              {CATEGORY_WEIGHTS?.map((cw) => {
                const scores = comparison.countries.map(c => {
                  const cs = c.categoryScores?.find(cs => cs.category === cw.category);
                  return cs?.score || 0;
                });
                const maxScore = Math.max(...scores);

                return (
                  <tr key={cw.category} className="border-b border-gray-200/30 dark:border-white/[0.08] hover:bg-gray-500/5 dark:hover:bg-white/[0.03]">
                    <td className="py-3 px-4 flex items-center gap-2 text-gray-800 dark:text-white">
                      <SpaceIcon name={cw.icon} size="sm" />
                      {cw.label}
                    </td>
                    {comparison.countries.map((c, idx) => {
                      const cs = c.categoryScores?.find(cs => cs.category === cw.category);
                      const score = cs?.score || 0;
                      const isMax = score === maxScore && score > 0;

                      return (
                        <td key={c.countryId} className="text-center py-3 px-4">
                          <span
                            className={`text-lg font-semibold ${isMax ? 'text-green-600 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}
                          >
                            {score.toFixed(1)}
                            {isMax && <span className="ml-1"><EmojiEvents style={{ fontSize: '1rem', color: '#eab308' }} /></span>}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gap Analysis */}
      {comparison.gapAnalysis && (
        <div className="glass-panel p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Gap Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comparison.gapAnalysis.map((ga) => {
              const catInfo = CATEGORY_WEIGHTS?.find(cw => cw.category === ga.category);
              return (
                <div key={ga.category} className="bg-gray-500/10 dark:bg-white/[0.06] rounded-[12px] border border-gray-200/30 dark:border-white/[0.08] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <SpaceIcon name={catInfo?.icon} size="lg" />
                    <span className="font-medium text-gray-800 dark:text-white">{catInfo?.label}</span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Leader: <span className="font-semibold">{ga.leader}</span>
                    <span className="ml-2 text-green-600 dark:text-green-400">({ga.leaderScore?.toFixed(1)})</span>
                  </div>
                  <div className="space-y-1">
                    {ga.gaps?.map((gap) => {
                      const country = comparison.countries.find(c => c.countryId === gap.countryId);
                      return (
                        <div key={gap.countryId} className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">{country?.countryName}</span>
                          <span className="text-red-600 dark:text-red-400">-{gap.gap?.toFixed(1)} pts</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
