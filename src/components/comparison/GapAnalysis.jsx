import { Link } from 'react-router-dom';
import { useGapAnalysis } from '../../hooks/useComparison';

/**
 * Gap bar visualization showing the difference between two countries
 */
function GapBar({ gap, maxGap = 100, country1Name, country2Name }) {
  const normalizedGap = Math.min(Math.abs(gap), maxGap);
  const percentage = (normalizedGap / maxGap) * 100;
  const isCountry1Leading = gap > 0;

  return (
    <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
      {/* Center line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 z-10"></div>

      {/* Gap indicator */}
      {gap !== 0 && (
        <div
          className={`absolute top-0 bottom-0 transition-all duration-300 ${
            isCountry1Leading
              ? 'bg-gradient-to-r from-indigo-300 to-indigo-500 rounded-r-full'
              : 'bg-gradient-to-l from-purple-300 to-purple-500 rounded-l-full'
          }`}
          style={{
            left: isCountry1Leading ? '50%' : `${50 - percentage / 2}%`,
            width: `${percentage / 2}%`,
          }}
        ></div>
      )}

      {/* Labels */}
      <div className="absolute inset-0 flex items-center justify-between px-2 text-xs font-medium">
        <span className={gap < 0 ? 'text-purple-700' : 'text-gray-500'}>
          {country2Name}
        </span>
        <span className="text-gray-400">|</span>
        <span className={gap > 0 ? 'text-indigo-700' : 'text-gray-500'}>
          {country1Name}
        </span>
      </div>
    </div>
  );
}

/**
 * Category gap card
 */
function CategoryGapCard({ categoryGap, country1Name, country2Name }) {
  const significanceColors = {
    critical: 'border-red-200 bg-red-50',
    significant: 'border-orange-200 bg-orange-50',
    moderate: 'border-yellow-200 bg-yellow-50',
    minimal: 'border-green-200 bg-green-50',
  };

  const significanceBadgeColors = {
    critical: 'bg-red-100 text-red-800',
    significant: 'bg-orange-100 text-orange-800',
    moderate: 'bg-yellow-100 text-yellow-800',
    minimal: 'bg-green-100 text-green-800',
  };

  return (
    <div className={`rounded-lg border-2 p-4 ${significanceColors[categoryGap.significance]}`}>
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-gray-800">{categoryGap.category}</h4>
        <span className={`px-2 py-1 rounded text-xs font-medium ${significanceBadgeColors[categoryGap.significance]}`}>
          {categoryGap.significance}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3 text-center">
        <div>
          <div className="text-lg font-bold text-indigo-600">
            {categoryGap.country1Score.toFixed(0)}
          </div>
          <div className="text-xs text-gray-500">{country1Name}</div>
        </div>
        <div>
          <div className={`text-lg font-bold ${categoryGap.gap > 0 ? 'text-indigo-600' : categoryGap.gap < 0 ? 'text-purple-600' : 'text-gray-600'}`}>
            {categoryGap.gap > 0 ? '+' : ''}{categoryGap.gap.toFixed(0)}
          </div>
          <div className="text-xs text-gray-500">Gap</div>
        </div>
        <div>
          <div className="text-lg font-bold text-purple-600">
            {categoryGap.country2Score.toFixed(0)}
          </div>
          <div className="text-xs text-gray-500">{country2Name}</div>
        </div>
      </div>

      <GapBar
        gap={categoryGap.gap}
        maxGap={50}
        country1Name={country1Name}
        country2Name={country2Name}
      />

      <div className="mt-2 text-center text-sm">
        <span className="text-gray-600">Leader: </span>
        <span className="font-medium">{categoryGap.leader}</span>
      </div>
    </div>
  );
}

/**
 * Capability comparison row
 */
function CapabilityRow({ capability, country1Has, country2Has, country1Name, country2Name }) {
  const bothHave = country1Has && country2Has;
  const neitherHave = !country1Has && !country2Has;

  return (
    <tr className="border-b border-gray-100">
      <td className="py-3 px-4 font-medium text-gray-700">{capability}</td>
      <td className="py-3 px-4 text-center">
        {country1Has ? (
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
            <span className="text-green-600">✓</span>
          </span>
        ) : (
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
            <span className="text-gray-400">✗</span>
          </span>
        )}
      </td>
      <td className="py-3 px-4 text-center">
        {country2Has ? (
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
            <span className="text-green-600">✓</span>
          </span>
        ) : (
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
            <span className="text-gray-400">✗</span>
          </span>
        )}
      </td>
      <td className="py-3 px-4 text-center">
        {bothHave && (
          <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-medium">
            Both
          </span>
        )}
        {neitherHave && (
          <span className="px-2 py-1 rounded bg-gray-100 text-gray-600 text-xs font-medium">
            Neither
          </span>
        )}
        {country1Has && !country2Has && (
          <span className="px-2 py-1 rounded bg-indigo-100 text-indigo-800 text-xs font-medium">
            {country1Name}
          </span>
        )}
        {!country1Has && country2Has && (
          <span className="px-2 py-1 rounded bg-purple-100 text-purple-800 text-xs font-medium">
            {country2Name}
          </span>
        )}
      </td>
    </tr>
  );
}

/**
 * Main Gap Analysis component
 */
export default function GapAnalysis({ country1, country2 }) {
  const { analysis } = useGapAnalysis(country1, country2);

  if (!analysis) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Select Two Countries
        </h3>
        <p className="text-gray-600">
          Choose exactly two countries to see a detailed gap analysis
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Gap Analysis: {analysis.country1.name} vs {analysis.country2.name}
        </h3>

        {/* Overall Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-indigo-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              {analysis.country1.flagUrl && (
                <img src={analysis.country1.flagUrl} alt="" className="w-8 h-6 object-cover rounded" />
              )}
              <span className="font-semibold text-gray-800">{analysis.country1.name}</span>
            </div>
            <div className="text-3xl font-bold text-indigo-600">
              {analysis.overallScore1.toFixed(0)}
            </div>
            <div className="text-sm text-gray-500">SCI Score</div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Overall Gap</div>
            <div className={`text-3xl font-bold ${
              analysis.overallGap > 0 ? 'text-indigo-600' :
              analysis.overallGap < 0 ? 'text-purple-600' : 'text-gray-600'
            }`}>
              {analysis.overallGap > 0 ? '+' : ''}{analysis.overallGap.toFixed(0)}
            </div>
            <div className={`mt-2 px-3 py-1 rounded-full text-sm font-medium inline-block ${
              analysis.gapSummary === 'Near Parity' ? 'bg-green-100 text-green-800' :
              analysis.gapSummary === 'Minor Gap' ? 'bg-blue-100 text-blue-800' :
              analysis.gapSummary === 'Moderate Gap' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {analysis.gapSummary}
            </div>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              {analysis.country2.flagUrl && (
                <img src={analysis.country2.flagUrl} alt="" className="w-8 h-6 object-cover rounded" />
              )}
              <span className="font-semibold text-gray-800">{analysis.country2.name}</span>
            </div>
            <div className="text-3xl font-bold text-purple-600">
              {analysis.overallScore2.toFixed(0)}
            </div>
            <div className="text-sm text-gray-500">SCI Score</div>
          </div>
        </div>

        {/* Key Differentiators */}
        {analysis.keyDifferentiators.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-3">Key Differentiators</h4>
            <div className="flex flex-wrap gap-2">
              {analysis.keyDifferentiators.map((diff, idx) => (
                <div
                  key={idx}
                  className={`px-4 py-2 rounded-lg ${
                    diff.gap > 0
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  <span className="font-medium">{diff.category}</span>
                  <span className="mx-2">•</span>
                  <span>{diff.leader} leads by {diff.absGap.toFixed(0)} pts</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Capability Advantage Summary */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-indigo-50 rounded-lg">
            <div className="text-2xl font-bold text-indigo-600">
              {analysis.country1Capabilities}
            </div>
            <div className="text-sm text-gray-500">
              Exclusive to {analysis.country1.name}
            </div>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {analysis.sharedCapabilities}
            </div>
            <div className="text-sm text-gray-500">
              Shared Capabilities
            </div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {analysis.country2Capabilities}
            </div>
            <div className="text-sm text-gray-500">
              Exclusive to {analysis.country2.name}
            </div>
          </div>
        </div>
      </div>

      {/* Category Gaps */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Category-by-Category Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analysis.categoryGaps.map((gap, idx) => (
            <CategoryGapCard
              key={idx}
              categoryGap={gap}
              country1Name={analysis.country1.name}
              country2Name={analysis.country2.name}
            />
          ))}
        </div>
      </div>

      {/* Capability Comparison Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-bold text-gray-800">Capability Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">
                  Capability
                </th>
                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600">
                  <div className="flex items-center justify-center gap-2">
                    {analysis.country1.flagUrl && (
                      <img src={analysis.country1.flagUrl} alt="" className="w-5 h-4 object-cover rounded" />
                    )}
                    {analysis.country1.name}
                  </div>
                </th>
                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600">
                  <div className="flex items-center justify-center gap-2">
                    {analysis.country2.flagUrl && (
                      <img src={analysis.country2.flagUrl} alt="" className="w-5 h-4 object-cover rounded" />
                    )}
                    {analysis.country2.name}
                  </div>
                </th>
                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600">
                  Advantage
                </th>
              </tr>
            </thead>
            <tbody>
              {analysis.capabilityComparison.map((cap, idx) => (
                <CapabilityRow
                  key={idx}
                  capability={cap.capability}
                  country1Has={cap.country1}
                  country2Has={cap.country2}
                  country1Name={analysis.country1.name}
                  country2Name={analysis.country2.name}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Full Profiles */}
      <div className="flex justify-center gap-4">
        <Link
          to={`/countries/${analysis.country1.isoCode}`}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          View {analysis.country1.name} Profile
        </Link>
        <Link
          to={`/countries/${analysis.country2.isoCode}`}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          View {analysis.country2.name} Profile
        </Link>
      </div>
    </div>
  );
}
