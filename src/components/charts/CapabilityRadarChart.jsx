import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { CAPABILITY_CATEGORIES } from '../../constants';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// Color palette for multiple countries
const COUNTRY_COLORS = [
  { bg: 'rgba(59, 130, 246, 0.3)', border: 'rgb(59, 130, 246)' },   // Blue
  { bg: 'rgba(239, 68, 68, 0.3)', border: 'rgb(239, 68, 68)' },     // Red
  { bg: 'rgba(34, 197, 94, 0.3)', border: 'rgb(34, 197, 94)' },     // Green
  { bg: 'rgba(168, 85, 247, 0.3)', border: 'rgb(168, 85, 247)' },   // Purple
  { bg: 'rgba(249, 115, 22, 0.3)', border: 'rgb(249, 115, 22)' },   // Orange
];

/**
 * Generate mock capability scores for a country based on its overall score
 * This simulates category breakdown until backend provides real data
 */
function generateCategoryScores(country) {
  const baseScore = country.overallCapabilityScore || 0;

  // Generate varied scores based on capabilities
  const scores = {
    launchCapability: country.independentLaunchCapable ? baseScore * (0.9 + Math.random() * 0.2) : baseScore * 0.3,
    propulsionTech: baseScore * (0.8 + Math.random() * 0.3),
    humanSpaceflight: country.humanSpaceflightCapable ? baseScore * (0.85 + Math.random() * 0.2) : baseScore * 0.1,
    deepSpace: country.deepSpaceCapable ? baseScore * (0.8 + Math.random() * 0.25) : baseScore * 0.15,
    satelliteInfra: baseScore * (0.75 + Math.random() * 0.3),
    groundInfra: baseScore * (0.7 + Math.random() * 0.35),
    techIndependence: baseScore * (0.65 + Math.random() * 0.4),
  };

  // Clamp all values to 0-100
  Object.keys(scores).forEach(key => {
    scores[key] = Math.min(100, Math.max(0, scores[key]));
  });

  return scores;
}

/**
 * CapabilityRadarChart - Multi-axis capability comparison using radar chart
 *
 * @param {Object} props
 * @param {Array} props.countries - Array of country objects to compare
 * @param {boolean} props.showLegend - Whether to show the legend
 * @param {string} props.size - Chart size: 'small', 'medium', 'large'
 */
export default function CapabilityRadarChart({
  countries = [],
  showLegend = true,
  size = 'medium'
}) {
  if (!countries || countries.length === 0) {
    return (
      <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-500">
        Select countries to compare their capabilities
      </div>
    );
  }

  // Category labels for the radar chart axes
  const labels = Object.values(CAPABILITY_CATEGORIES).map(cat => cat.label);

  // Generate datasets for each country
  const datasets = countries.map((country, index) => {
    const colorIndex = index % COUNTRY_COLORS.length;
    const colors = COUNTRY_COLORS[colorIndex];

    // Use real capability scores if available, otherwise generate from overall score
    const scores = country.capabilityScores
      ? [
          country.capabilityScores.launchCapability || 0,
          country.capabilityScores.propulsionTechnology || 0,
          country.capabilityScores.humanSpaceflight || 0,
          country.capabilityScores.deepSpaceExploration || 0,
          country.capabilityScores.satelliteInfrastructure || 0,
          country.capabilityScores.groundInfrastructure || 0,
          country.capabilityScores.technologicalIndependence || 0,
        ]
      : (() => {
          const generated = generateCategoryScores(country);
          return [
            generated.launchCapability,
            generated.propulsionTech,
            generated.humanSpaceflight,
            generated.deepSpace,
            generated.satelliteInfra,
            generated.groundInfra,
            generated.techIndependence,
          ];
        })();

    return {
      label: country.name,
      data: scores,
      backgroundColor: colors.bg,
      borderColor: colors.border,
      borderWidth: 2,
      pointBackgroundColor: colors.border,
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: colors.border,
      pointRadius: 4,
      pointHoverRadius: 6,
    };
  });

  const chartData = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: showLegend,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: size === 'small' ? 10 : 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.r;
            return `${label}: ${value.toFixed(1)}`;
          },
        },
      },
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        beginAtZero: true,
        ticks: {
          stepSize: 20,
          display: size !== 'small',
          font: {
            size: size === 'small' ? 8 : 10,
          },
        },
        pointLabels: {
          font: {
            size: size === 'small' ? 9 : size === 'medium' ? 11 : 13,
            weight: '500',
          },
          color: '#374151',
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.3)',
        },
        angleLines: {
          color: 'rgba(156, 163, 175, 0.3)',
        },
      },
    },
  };

  const sizeClasses = {
    small: 'h-48',
    medium: 'h-80',
    large: 'h-96',
  };

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md ${sizeClasses[size]}`}>
      <Radar data={chartData} options={options} />
    </div>
  );
}

/**
 * CapabilityComparisonTable - Table view of capability scores
 */
export function CapabilityComparisonTable({ countries = [] }) {
  if (!countries || countries.length === 0) {
    return null;
  }

  const categories = Object.values(CAPABILITY_CATEGORIES);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            {countries.map(country => (
              <th key={country.id} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {country.spaceAgencyAcronym || country.name.substring(0, 6)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.map((category, idx) => {
            const categoryKey = Object.keys(CAPABILITY_CATEGORIES)[idx];
            return (
              <tr key={categoryKey} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <span className="mr-2">{category.icon}</span>
                  {category.label}
                </td>
                {countries.map(country => {
                  const scores = country.capabilityScores || generateCategoryScores(country);
                  const scoreKey = categoryKey.replace('_', '');
                  const scoreValue = scores[scoreKey.charAt(0).toLowerCase() + scoreKey.slice(1)] ||
                                    scores[Object.keys(scores)[idx]] || 0;

                  return (
                    <td key={country.id} className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        scoreValue >= 80 ? 'bg-green-100 text-green-800' :
                        scoreValue >= 60 ? 'bg-blue-100 text-blue-800' :
                        scoreValue >= 40 ? 'bg-yellow-100 text-yellow-800' :
                        scoreValue >= 20 ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {scoreValue.toFixed(0)}
                      </span>
                    </td>
                  );
                })}
              </tr>
            );
          })}
          {/* Overall Score Row */}
          <tr className="bg-indigo-50 font-semibold">
            <td className="px-4 py-3 text-sm text-indigo-700">
              🏆 Overall Score
            </td>
            {countries.map(country => (
              <td key={country.id} className="px-4 py-3 text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-indigo-100 text-indigo-800">
                  {(country.overallCapabilityScore || 0).toFixed(0)}
                </span>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
