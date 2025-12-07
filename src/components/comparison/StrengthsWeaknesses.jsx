import { Link } from 'react-router-dom';
import { useStrengthsWeaknesses } from '../../hooks/useComparison';

/**
 * Score meter visualization
 */
function ScoreMeter({ score, globalAverage, label }) {
  const maxScore = 100;
  const difference = score - globalAverage;
  const isAboveAverage = difference > 0;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className={`text-sm font-semibold ${
          isAboveAverage ? 'text-green-600' : 'text-red-600'
        }`}>
          {score.toFixed(0)} ({isAboveAverage ? '+' : ''}{difference.toFixed(0)})
        </span>
      </div>
      <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
        {/* Score bar */}
        <div
          className={`absolute h-full rounded-full transition-all duration-500 ${
            isAboveAverage ? 'bg-green-500' : 'bg-blue-500'
          }`}
          style={{ width: `${Math.min(100, (score / maxScore) * 100)}%` }}
        ></div>
        {/* Global average marker */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-gray-800"
          style={{ left: `${(globalAverage / maxScore) * 100}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>0</span>
        <span>Global Avg: {globalAverage.toFixed(0)}</span>
        <span>100</span>
      </div>
    </div>
  );
}

/**
 * SWOT Quadrant Card
 */
function SwotCard({ title, items, icon, bgColor, borderColor, textColor }) {
  return (
    <div className={`rounded-lg border-2 ${borderColor} ${bgColor} p-4`}>
      <div className={`flex items-center gap-2 mb-3 ${textColor}`}>
        <span className="text-2xl">{icon}</span>
        <h4 className="font-bold text-lg">{title}</h4>
        <span className="ml-auto bg-white/50 px-2 py-0.5 rounded text-sm font-medium">
          {items.length}
        </span>
      </div>

      {items.length > 0 ? (
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className={`mt-0.5 ${textColor}`}>
                {item.level === 'major' ? '★' : '•'}
              </span>
              <div>
                <div className="font-medium text-gray-800">
                  {item.category}
                </div>
                {item.description && (
                  <div className="text-sm text-gray-600">
                    {item.description}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm italic">No items identified</p>
      )}
    </div>
  );
}

/**
 * Percentile rank badge
 */
function PercentileBadge({ percentile }) {
  let color, label;

  if (percentile >= 90) {
    color = 'bg-green-100 text-green-800 border-green-200';
    label = 'Top 10%';
  } else if (percentile >= 75) {
    color = 'bg-blue-100 text-blue-800 border-blue-200';
    label = 'Top 25%';
  } else if (percentile >= 50) {
    color = 'bg-yellow-100 text-yellow-800 border-yellow-200';
    label = 'Top 50%';
  } else if (percentile >= 25) {
    color = 'bg-orange-100 text-orange-800 border-orange-200';
    label = 'Bottom 50%';
  } else {
    color = 'bg-red-100 text-red-800 border-red-200';
    label = 'Bottom 25%';
  }

  return (
    <span className={`px-2 py-1 rounded border text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}

/**
 * Overall rating badge
 */
function OverallRatingBadge({ rating, color }) {
  const colorClasses = {
    green: 'bg-green-100 text-green-800 border-green-300',
    blue: 'bg-blue-100 text-blue-800 border-blue-300',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    orange: 'bg-orange-100 text-orange-800 border-orange-300',
    gray: 'bg-gray-100 text-gray-800 border-gray-300',
  };

  return (
    <span className={`px-4 py-2 rounded-lg border-2 text-lg font-bold ${colorClasses[color]}`}>
      {rating}
    </span>
  );
}

/**
 * Category breakdown table
 */
function CategoryBreakdown({ scores, globalAverages, percentileRanks }) {
  const categories = Object.keys(scores).map(key => ({
    key,
    label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
    score: scores[key],
    globalAvg: globalAverages[key],
    percentile: percentileRanks[key],
  }));

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <h3 className="font-bold text-gray-800">Category Performance Breakdown</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Category</th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600">Score</th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600">Global Avg</th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600">Difference</th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600">Percentile</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => {
              const diff = cat.score - cat.globalAvg;
              const isAbove = diff >= 0;

              return (
                <tr key={cat.key} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-700">{cat.label}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-semibold">{cat.score.toFixed(0)}</span>
                  </td>
                  <td className="py-3 px-4 text-center text-gray-500">
                    {cat.globalAvg.toFixed(0)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`font-medium ${isAbove ? 'text-green-600' : 'text-red-600'}`}>
                      {isAbove ? '+' : ''}{diff.toFixed(0)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <PercentileBadge percentile={cat.percentile} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * Main Strengths & Weaknesses (SWOT) component
 */
export default function StrengthsWeaknesses({ country, allCountries }) {
  const { analysis } = useStrengthsWeaknesses(country, allCountries);

  if (!analysis) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Select a Country
        </h3>
        <p className="text-gray-600">
          Choose a country to see its strengths and weaknesses analysis
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Country Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            {analysis.country.flagUrl && (
              <img
                src={analysis.country.flagUrl}
                alt=""
                className="w-16 h-12 object-cover rounded shadow"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {analysis.country.name}
              </h2>
              <p className="text-gray-500">
                {analysis.country.spaceAgencyName || 'Space Program Analysis'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">
                {(analysis.country.overallCapabilityScore || 0).toFixed(0)}
              </div>
              <div className="text-sm text-gray-500">SCI Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-800">
                #{analysis.globalRank}
              </div>
              <div className="text-sm text-gray-500">
                of {analysis.totalCountries}
              </div>
            </div>
            <OverallRatingBadge
              rating={analysis.overallRating.rating}
              color={analysis.overallRating.color}
            />
          </div>
        </div>
      </div>

      {/* SWOT Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SwotCard
          title="Strengths"
          items={analysis.strengths}
          icon="💪"
          bgColor="bg-green-50"
          borderColor="border-green-200"
          textColor="text-green-700"
        />
        <SwotCard
          title="Weaknesses"
          items={analysis.weaknesses}
          icon="⚠️"
          bgColor="bg-red-50"
          borderColor="border-red-200"
          textColor="text-red-700"
        />
        <SwotCard
          title="Opportunities"
          items={analysis.opportunities}
          icon="🚀"
          bgColor="bg-blue-50"
          borderColor="border-blue-200"
          textColor="text-blue-700"
        />
        <SwotCard
          title="Threats"
          items={analysis.threats}
          icon="⚡"
          bgColor="bg-orange-50"
          borderColor="border-orange-200"
          textColor="text-orange-700"
        />
      </div>

      {/* Performance vs Global Average */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Performance vs Global Average
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          {Object.entries(analysis.scores).map(([key, score]) => (
            <ScoreMeter
              key={key}
              score={score}
              globalAverage={analysis.globalAverages[key]}
              label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            />
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <CategoryBreakdown
        scores={analysis.scores}
        globalAverages={analysis.globalAverages}
        percentileRanks={analysis.percentileRanks}
      />

      {/* Quick Stats Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {analysis.strengths.length}
            </div>
            <div className="text-sm text-gray-600">Strengths</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {analysis.weaknesses.length}
            </div>
            <div className="text-sm text-gray-600">Weaknesses</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {analysis.opportunities.length}
            </div>
            <div className="text-sm text-gray-600">Opportunities</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {analysis.threats.length}
            </div>
            <div className="text-sm text-gray-600">Threats</div>
          </div>
        </div>
      </div>

      {/* View Full Profile Link */}
      <div className="flex justify-center">
        <Link
          to={`/countries/${analysis.country.isoCode}`}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          View Full Country Profile
        </Link>
      </div>
    </div>
  );
}
