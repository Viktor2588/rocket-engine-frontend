import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useMemo } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Country colors for consistent visualization
const COUNTRY_COLORS = {
  USA: { bg: 'rgba(59, 130, 246, 0.8)', border: 'rgb(59, 130, 246)' },
  RUS: { bg: 'rgba(239, 68, 68, 0.8)', border: 'rgb(239, 68, 68)' },
  CHN: { bg: 'rgba(234, 179, 8, 0.8)', border: 'rgb(234, 179, 8)' },
  EUR: { bg: 'rgba(34, 197, 94, 0.8)', border: 'rgb(34, 197, 94)' },
  IND: { bg: 'rgba(249, 115, 22, 0.8)', border: 'rgb(249, 115, 22)' },
  JPN: { bg: 'rgba(168, 85, 247, 0.8)', border: 'rgb(168, 85, 247)' },
  OTHER: { bg: 'rgba(156, 163, 175, 0.8)', border: 'rgb(156, 163, 175)' },
};

/**
 * LaunchFrequencyChart - Stacked bar chart showing launch frequency by country over years
 *
 * @param {Object} props
 * @param {Object} props.launchData - Launch data (year -> country -> count) - REQUIRED from API
 * @param {boolean} props.stacked - Whether to use stacked bars
 * @param {string} props.title - Chart title
 */
export default function LaunchFrequencyChart({
  launchData = {},
  stacked = true,
  title = 'Annual Launch Frequency by Country',
}) {
  const chartData = useMemo(() => {
    const years = Object.keys(launchData).sort();
    const countries = ['USA', 'CHN', 'RUS', 'EUR', 'IND', 'JPN', 'OTHER'];

    const datasets = countries.map(country => ({
      label: country === 'OTHER' ? 'Others' : country,
      data: years.map(year => launchData[year]?.[country] || 0),
      backgroundColor: COUNTRY_COLORS[country]?.bg || COUNTRY_COLORS.OTHER.bg,
      borderColor: COUNTRY_COLORS[country]?.border || COUNTRY_COLORS.OTHER.border,
      borderWidth: 1,
    }));

    return {
      labels: years,
      datasets,
    };
  }, [launchData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 15,
        },
      },
      title: {
        display: !!title,
        text: title,
        font: { size: 16, weight: '600' },
        padding: { bottom: 20 },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value} launches`;
          },
          footer: (tooltipItems) => {
            const total = tooltipItems.reduce((sum, item) => sum + item.parsed.y, 0);
            return `Total: ${total} launches`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked,
        grid: { display: false },
      },
      y: {
        stacked,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Launches',
        },
      },
    },
  };

  // Check if data is available
  const hasData = Object.keys(launchData).length > 0;

  if (!hasData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-500 py-12">
          <p className="text-lg font-medium">No launch data available</p>
          <p className="text-sm mt-2">Launch frequency data is not available from the API</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div style={{ height: '400px' }}>
        <Bar data={chartData} options={options} />
      </div>

      {/* Summary stats */}
      <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
        <div>
          <div className="text-2xl font-bold text-blue-600">
            {Object.values(launchData).reduce((sum, year) => sum + (year.USA || 0), 0)}
          </div>
          <div className="text-gray-500">USA Total</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-yellow-600">
            {Object.values(launchData).reduce((sum, year) => sum + (year.CHN || 0), 0)}
          </div>
          <div className="text-gray-500">China Total</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-red-600">
            {Object.values(launchData).reduce((sum, year) => sum + (year.RUS || 0), 0)}
          </div>
          <div className="text-gray-500">Russia Total</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-600">
            {Object.values(launchData).reduce((sum, year) =>
              sum + Object.values(year).reduce((s, v) => s + v, 0), 0
            )}
          </div>
          <div className="text-gray-500">World Total</div>
        </div>
      </div>
    </div>
  );
}

/**
 * LaunchTrendChart - Line chart showing launch trends over time
 */
export function LaunchTrendChart({
  launchData = {},
  countries = ['USA', 'CHN', 'RUS'],
  title = 'Launch Trends Over Time',
}) {
  const chartData = useMemo(() => {
    const years = Object.keys(launchData).sort();

    const datasets = countries.map((country, index) => {
      const colors = Object.values(COUNTRY_COLORS);
      const color = COUNTRY_COLORS[country] || colors[index % colors.length];

      return {
        label: country,
        data: years.map(year => launchData[year]?.[country] || 0),
        borderColor: color.border,
        backgroundColor: color.bg.replace('0.8', '0.2'),
        fill: true,
        tension: 0.3,
      };
    });

    return {
      labels: years,
      datasets,
    };
  }, [launchData, countries]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: !!title,
        text: title,
        font: { size: 16, weight: '600' },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Launches',
        },
      },
    },
  };

  // Check if data is available
  const hasData = Object.keys(launchData).length > 0;

  if (!hasData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-500 py-12">
          <p className="text-lg font-medium">No launch trend data available</p>
          <p className="text-sm mt-2">Launch trend data is not available from the API</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div style={{ height: '300px' }}>
        <Bar data={chartData} options={{ ...options, type: 'line' }} />
      </div>
    </div>
  );
}
