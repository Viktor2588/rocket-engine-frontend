import { CAPABILITY_CATEGORIES } from '../constants';

/**
 * Component displaying detailed capability scores for a country
 * Features a circular overall score and category breakdowns
 */
export default function CapabilityScoreCard({ country, scores, globalAverage, compact = false }) {
  const overallScore = country?.overallCapabilityScore || 0;

  // Calculate the stroke dasharray for circular progress
  const radius = compact ? 40 : 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  // Get color based on score
  const getScoreColor = (score) => {
    if (score >= 80) return { stroke: '#10B981', bg: 'bg-green-500', text: 'text-green-600' };
    if (score >= 60) return { stroke: '#3B82F6', bg: 'bg-blue-500', text: 'text-blue-600' };
    if (score >= 40) return { stroke: '#F59E0B', bg: 'bg-yellow-500', text: 'text-yellow-600' };
    if (score >= 20) return { stroke: '#F97316', bg: 'bg-orange-500', text: 'text-orange-600' };
    return { stroke: '#6B7280', bg: 'bg-gray-500', text: 'text-gray-600' };
  };

  const scoreColor = getScoreColor(overallScore);

  // Category scores from props or country object
  const categoryScores = scores || country?.capabilityScores || {};

  if (compact) {
    return (
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
        {/* Compact Circular Score */}
        <div className="relative flex-shrink-0">
          <svg width="90" height="90" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="45"
              cy="45"
              r={radius}
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="45"
              cy="45"
              r={radius}
              fill="none"
              stroke={scoreColor.stroke}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-xl font-bold ${scoreColor.text}`}>
              {overallScore.toFixed(0)}
            </span>
          </div>
        </div>

        {/* Compact Stats */}
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
        {/* Overall Score Circle */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <svg width="160" height="160" className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="12"
              />
              {/* Progress circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={scoreColor.stroke}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold ${scoreColor.text}`}>
                {overallScore.toFixed(0)}
              </span>
              <span className="text-sm text-gray-500">out of 100</span>
            </div>
          </div>

          {/* Global Average Comparison */}
          {globalAverage && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">Global Average: {globalAverage.toFixed(0)}</p>
              {overallScore > globalAverage ? (
                <p className="text-sm text-green-600 font-semibold">
                  +{(overallScore - globalAverage).toFixed(0)} above average
                </p>
              ) : overallScore < globalAverage ? (
                <p className="text-sm text-red-600 font-semibold">
                  {(overallScore - globalAverage).toFixed(0)} below average
                </p>
              ) : (
                <p className="text-sm text-gray-600 font-semibold">At average</p>
              )}
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">
            Category Breakdown
          </h4>
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
                    <span className={`text-sm font-semibold ${categoryColor.text}`}>
                      {categoryScore.toFixed(0)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${categoryColor.bg}`}
                      style={{ width: `${categoryScore}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {category.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Weighted Score Info */}
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
      {score.toFixed(0)}
    </span>
  );
}

/**
 * Radar chart component for category comparison (placeholder for Chart.js integration)
 */
export function CapabilityRadarChart({ countries }) {
  // This will be implemented with Chart.js radar chart
  // For now, return a placeholder
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Capability Comparison</h3>
      <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
        <p className="text-gray-500">Radar chart visualization coming soon</p>
      </div>
    </div>
  );
}
