import { useMemo } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Radar, Doughnut } from 'react-chartjs-2';
import { CATEGORY_WEIGHTS, SCI_TIER_THRESHOLDS } from '../types';
import { CAPABILITY_CATEGORIES } from '../constants';

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ArcElement
);

/**
 * Get tier color and styling
 */
function getTierInfo(tier) {
  const tierData = SCI_TIER_THRESHOLDS?.find(t => t.tier === tier);
  return tierData || { color: '#6B7280', description: 'Unknown tier' };
}

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

/**
 * Get color based on score
 */
const getScoreColor = (score) => {
  if (score >= 80) return { stroke: '#10B981', bg: 'bg-green-500', text: 'text-green-600' };
  if (score >= 60) return { stroke: '#3B82F6', bg: 'bg-blue-500', text: 'text-blue-600' };
  if (score >= 40) return { stroke: '#F59E0B', bg: 'bg-yellow-500', text: 'text-yellow-600' };
  if (score >= 20) return { stroke: '#F97316', bg: 'bg-orange-500', text: 'text-orange-600' };
  return { stroke: '#6B7280', bg: 'bg-gray-500', text: 'text-gray-600' };
};

/**
 * Main Capability Score Card Component
 * Supports both legacy format (country, scores, globalAverage) and new format (breakdown)
 */
export default function CapabilityScoreCard({
  country,
  scores,
  globalAverage,
  breakdown,
  showDetails = true,
  compact = false
}) {
  // Handle new breakdown format
  if (breakdown) {
    return <SCIBreakdownCard breakdown={breakdown} showDetails={showDetails} compact={compact} />;
  }

  // Legacy format support
  const overallScore = country?.overallCapabilityScore || 0;
  const radius = compact ? 40 : 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;
  const scoreColor = getScoreColor(overallScore);
  const categoryScores = scores || country?.capabilityScores || {};

  if (compact) {
    return (
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
        <div className="relative flex-shrink-0">
          <svg width="90" height="90" className="transform -rotate-90">
            <circle cx="45" cy="45" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="8" />
            <circle
              cx="45" cy="45" r={radius} fill="none"
              stroke={scoreColor.stroke} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xl font-bold ${scoreColor.text}`}>{overallScore.toFixed(0)}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-800">Capability Score</h4>
          <p className="text-sm text-gray-500">
            {globalAverage && (
              <>
                Global avg: {globalAverage.toFixed(0)}
                {overallScore > globalAverage ? (
                  <span className="text-green-600 ml-2">+{(overallScore - globalAverage).toFixed(0)}</span>
                ) : (
                  <span className="text-red-600 ml-2">{(overallScore - globalAverage).toFixed(0)}</span>
                )}
              </>
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Space Capability Index (SCI)</h3>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex flex-col items-center">
          <div className="relative">
            <svg width="160" height="160" className="transform -rotate-90">
              <circle cx="80" cy="80" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="12" />
              <circle
                cx="80" cy="80" r={radius} fill="none"
                stroke={scoreColor.stroke} strokeWidth="12" strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold ${scoreColor.text}`}>{overallScore.toFixed(0)}</span>
              <span className="text-sm text-gray-500">out of 100</span>
            </div>
          </div>
          {globalAverage && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">Global Average: {globalAverage.toFixed(0)}</p>
              {overallScore > globalAverage ? (
                <p className="text-sm text-green-600 font-semibold">+{(overallScore - globalAverage).toFixed(0)} above average</p>
              ) : overallScore < globalAverage ? (
                <p className="text-sm text-red-600 font-semibold">{(overallScore - globalAverage).toFixed(0)} below average</p>
              ) : (
                <p className="text-sm text-gray-600 font-semibold">At average</p>
              )}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">Category Breakdown</h4>
          <div className="space-y-3">
            {Object.entries(CAPABILITY_CATEGORIES).map(([key, category]) => {
              const categoryScore = categoryScores[key] || 0;
              const categoryColor = getScoreColor(categoryScore);
              return (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-700 flex items-center gap-2">
                      <span>{category.icon}</span>
                      {category.label}
                    </span>
                    <span className={`text-sm font-semibold ${categoryColor.text}`}>{categoryScore.toFixed(0)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all duration-500 ${categoryColor.bg}`} style={{ width: `${categoryScore}%` }} />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{category.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          <strong>Score Calculation:</strong> Weighted average of all categories.
          Launch Capability (20%), Human Spaceflight (20%), Propulsion (15%),
          Deep Space (15%), Satellites (15%), Infrastructure (10%), Independence (5%).
        </p>
      </div>
    </div>
  );
}

/**
 * New SCI Breakdown Card with Radar Chart
 */
function SCIBreakdownCard({ breakdown, showDetails = true, compact = false }) {
  const radarData = useMemo(() => {
    if (!breakdown) {
      return { labels: [], datasets: [] };
    }
    const labels = CATEGORY_WEIGHTS?.map(cw => cw.label) || [];
    const data = CATEGORY_WEIGHTS?.map(cw => {
      const catScore = breakdown.categoryScores?.find(cs => cs.category === cw.category);
      return catScore?.score || 0;
    }) || [];
    const colors = CATEGORY_WEIGHTS?.map(cw => cw.color) || [];

    return {
      labels,
      datasets: [{
        label: breakdown.countryName,
        data,
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 2,
        pointBackgroundColor: colors,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(99, 102, 241)',
      }],
    };
  }, [breakdown]);

  if (!breakdown) return null;

  const tierInfo = getTierInfo(breakdown.tier);

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: { stepSize: 20, display: !compact },
        pointLabels: { font: { size: compact ? 9 : 11 } },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (context) => `${context.label}: ${context.raw?.toFixed(1)}` } },
    },
  };

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">{getCountryFlag(breakdown.countryId)}</span>
          <div>
            <h3 className="font-bold text-gray-800">{breakdown.countryName}</h3>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: tierInfo.color + '20', color: tierInfo.color }}
            >
              {breakdown.tier}
            </span>
          </div>
          <div className="ml-auto text-right">
            <div className="text-2xl font-bold text-indigo-600">{breakdown.overallScore?.toFixed(1)}</div>
            <div className="text-xs text-gray-500">Rank #{breakdown.globalRank}</div>
          </div>
        </div>
        <div className="h-32">
          <Radar data={radarData} options={radarOptions} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{getCountryFlag(breakdown.countryId)}</span>
            <div>
              <h2 className="text-2xl font-bold">{breakdown.countryName}</h2>
              <p className="text-indigo-200">Space Capability Index</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">{breakdown.overallScore?.toFixed(1)}</div>
            <div className="text-indigo-200">/ 100</div>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4 flex-wrap">
          <span
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{ backgroundColor: tierInfo.color, color: '#000' }}
          >
            {breakdown.tier}
          </span>
          <span className="text-indigo-200">
            Global Rank: <span className="text-white font-bold">#{breakdown.globalRank}</span>
          </span>
          <span className="text-indigo-200">
            Regional Rank: <span className="text-white font-bold">#{breakdown.regionalRank}</span>
          </span>
          {breakdown.trend === 'improving' && <span className="text-green-300">↑ Improving</span>}
          {breakdown.trend === 'declining' && <span className="text-red-300">↓ Declining</span>}
          {breakdown.trend === 'stable' && <span className="text-gray-300">→ Stable</span>}
        </div>
      </div>

      {/* Radar Chart */}
      <div className="p-6">
        <div className="h-72">
          <Radar data={radarData} options={radarOptions} />
        </div>
      </div>

      {/* Category Scores */}
      {showDetails && (
        <div className="px-6 pb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Category Breakdown</h3>
          <div className="space-y-3">
            {breakdown.categoryScores?.map((catScore) => {
              const catInfo = CATEGORY_WEIGHTS?.find(cw => cw.category === catScore.category);
              return (
                <div key={catScore.category} className="flex items-center gap-3">
                  <span className="text-xl w-8">{catInfo?.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{catInfo?.label}</span>
                      <span className="text-sm font-bold" style={{ color: catInfo?.color }}>
                        {catScore.score?.toFixed(1)}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${catScore.score}%`, backgroundColor: catInfo?.color }}
                      />
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 w-12 text-right">
                    {((catInfo?.weight || 0) * 100).toFixed(0)}% wt
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Strengths & Weaknesses */}
      {showDetails && (breakdown.strengths?.length > 0 || breakdown.weaknesses?.length > 0) && (
        <div className="px-6 pb-6 grid grid-cols-2 gap-4">
          {breakdown.strengths?.length > 0 && (
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-green-800 mb-2">Strengths</h4>
              <ul className="space-y-1">
                {breakdown.strengths.map(s => {
                  const catInfo = CATEGORY_WEIGHTS?.find(cw => cw.category === s);
                  return (
                    <li key={s} className="text-sm text-green-700 flex items-center gap-2">
                      <span>{catInfo?.icon}</span>
                      {catInfo?.label}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {breakdown.weaknesses?.length > 0 && (
            <div className="bg-amber-50 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-amber-800 mb-2">Areas for Growth</h4>
              <ul className="space-y-1">
                {breakdown.weaknesses.map(w => {
                  const catInfo = CATEGORY_WEIGHTS?.find(cw => cw.category === w);
                  return (
                    <li key={w} className="text-sm text-amber-700 flex items-center gap-2">
                      <span>{catInfo?.icon}</span>
                      {catInfo?.label}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Mini version of capability score for use in lists/tables
 */
export function CapabilityScoreBadge({ score }) {
  const getColor = (s) => {
    if (s >= 80) return 'bg-green-100 text-green-800';
    if (s >= 60) return 'bg-blue-100 text-blue-800';
    if (s >= 40) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getColor(score)}`}>
      {score?.toFixed(0) || '—'}
    </span>
  );
}

/**
 * Score Tier Badge Component
 */
export function TierBadge({ tier, size = 'md' }) {
  const tierInfo = getTierInfo(tier);
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={`rounded-full font-medium ${sizeClasses[size]}`}
      style={{ backgroundColor: tierInfo.color + '20', color: tierInfo.color }}
    >
      {tier}
    </span>
  );
}

/**
 * Overall Score Gauge Component
 */
export function ScoreGauge({ score, size = 'md' }) {
  const sizeConfig = {
    sm: { width: 80, strokeWidth: 8, fontSize: 'text-lg' },
    md: { width: 120, strokeWidth: 10, fontSize: 'text-2xl' },
    lg: { width: 160, strokeWidth: 12, fontSize: 'text-4xl' },
  };
  const config = sizeConfig[size];
  const radius = (config.width - config.strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - ((score || 0) / 100) * circumference;

  let color = '#6B7280';
  if (score >= 80) color = '#FFD700';
  else if (score >= 60) color = '#C0C0C0';
  else if (score >= 40) color = '#CD7F32';
  else if (score >= 20) color = '#3B82F6';

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={config.width} height={config.width} className="-rotate-90">
        <circle
          cx={config.width / 2} cy={config.width / 2} r={radius}
          fill="none" stroke="#E5E7EB" strokeWidth={config.strokeWidth}
        />
        <circle
          cx={config.width / 2} cy={config.width / 2} r={radius}
          fill="none" stroke={color} strokeWidth={config.strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`font-bold ${config.fontSize}`} style={{ color }}>
          {(score || 0).toFixed(0)}
        </span>
      </div>
    </div>
  );
}

/**
 * Comparison Radar Chart Component
 */
export function ComparisonRadarChart({ breakdowns, height = 300 }) {
  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'];

  const data = useMemo(() => {
    if (!breakdowns || breakdowns.length === 0) return null;

    const labels = CATEGORY_WEIGHTS?.map(cw => cw.label) || [];

    const datasets = breakdowns.map((breakdown, index) => {
      const scores = CATEGORY_WEIGHTS?.map(cw => {
        const catScore = breakdown.categoryScores?.find(cs => cs.category === cw.category);
        return catScore?.score || 0;
      }) || [];

      return {
        label: breakdown.countryName,
        data: scores,
        backgroundColor: colors[index % colors.length] + '33',
        borderColor: colors[index % colors.length],
        borderWidth: 2,
        pointBackgroundColor: colors[index % colors.length],
        pointBorderColor: '#fff',
      };
    });

    return { labels, datasets };
  }, [breakdowns]);

  if (!data) return null;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: { stepSize: 20 },
        pointLabels: { font: { size: 11 } },
      },
    },
    plugins: {
      legend: { position: 'bottom' },
      tooltip: { callbacks: { label: (context) => `${context.dataset.label}: ${context.raw?.toFixed(1)}` } },
    },
  };

  return (
    <div style={{ height }}>
      <Radar data={data} options={options} />
    </div>
  );
}

/**
 * Tier Distribution Doughnut Chart
 */
export function TierDistributionChart({ tierCounts, size = 200 }) {
  const data = useMemo(() => {
    const labels = Object.keys(tierCounts || {});
    const values = Object.values(tierCounts || {});
    const colors = labels.map(tier => {
      const tierInfo = SCI_TIER_THRESHOLDS?.find(t => t.tier === tier);
      return tierInfo?.color || '#6B7280';
    });

    return {
      labels,
      datasets: [{
        data: values,
        backgroundColor: colors,
        borderColor: colors.map(() => '#fff'),
        borderWidth: 2,
      }],
    };
  }, [tierCounts]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { font: { size: 11 } } },
    },
  };

  return (
    <div style={{ height: size, width: size * 1.5 }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}

/**
 * Mini Score Card for Lists
 */
export function MiniScoreCard({ breakdown, onClick, selected }) {
  if (!breakdown) return null;

  const tierInfo = getTierInfo(breakdown.tier);

  return (
    <div
      onClick={() => onClick?.(breakdown)}
      className={`bg-white rounded-lg border p-3 cursor-pointer hover:shadow-md transition ${
        selected ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{getCountryFlag(breakdown.countryId)}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-gray-800 truncate">{breakdown.countryName}</h4>
            <span
              className="px-1.5 py-0.5 rounded text-xs font-medium shrink-0"
              style={{ backgroundColor: tierInfo.color + '20', color: tierInfo.color }}
            >
              {breakdown.tier}
            </span>
          </div>
          <p className="text-xs text-gray-500">Rank #{breakdown.globalRank}</p>
        </div>
        <div className="text-right shrink-0">
          <ScoreGauge score={breakdown.overallScore} size="sm" />
        </div>
      </div>
    </div>
  );
}

/**
 * Category Score Bar Component
 */
export function CategoryScoreBar({ category, score, showLabel = true }) {
  const catInfo = CATEGORY_WEIGHTS?.find(cw => cw.category === category);
  if (!catInfo) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-lg">{catInfo.icon}</span>
      {showLabel && (
        <span className="text-sm text-gray-600 w-28 truncate">{catInfo.label}</span>
      )}
      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${score}%`, backgroundColor: catInfo.color }}
        />
      </div>
      <span className="text-sm font-medium w-10 text-right" style={{ color: catInfo.color }}>
        {(score || 0).toFixed(0)}
      </span>
    </div>
  );
}

/**
 * Category Metrics Detail Component
 */
export function CategoryMetricsDetail({ categoryScore }) {
  if (!categoryScore || !categoryScore.metrics) return null;

  const catInfo = CATEGORY_WEIGHTS?.find(cw => cw.category === categoryScore.category);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{catInfo?.icon}</span>
        <h3 className="text-lg font-semibold text-gray-800">{catInfo?.label}</h3>
        <span className="ml-auto text-2xl font-bold" style={{ color: catInfo?.color }}>
          {categoryScore.score?.toFixed(1)}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-4">{catInfo?.description}</p>
      <div className="space-y-2">
        {categoryScore.metrics.map((metric, index) => (
          <div key={index} className="flex justify-between items-center text-sm">
            <span className="text-gray-600">{metric.name}</span>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-800">
                {typeof metric.value === 'boolean'
                  ? (metric.value ? 'Yes' : 'No')
                  : `${metric.value?.toLocaleString()}${metric.unit ? ` ${metric.unit}` : ''}`
                }
              </span>
              <span className="text-xs text-indigo-600">
                +{metric.contribution?.toFixed(1)} pts
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
