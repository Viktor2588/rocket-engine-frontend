import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useMemo } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Country colors
const COUNTRY_COLORS = {
  USA: { border: 'rgb(59, 130, 246)', bg: 'rgba(59, 130, 246, 0.1)' },
  CHN: { border: 'rgb(234, 179, 8)', bg: 'rgba(234, 179, 8, 0.1)' },
  RUS: { border: 'rgb(239, 68, 68)', bg: 'rgba(239, 68, 68, 0.1)' },
  EUR: { border: 'rgb(34, 197, 94)', bg: 'rgba(34, 197, 94, 0.1)' },
  JPN: { border: 'rgb(168, 85, 247)', bg: 'rgba(168, 85, 247, 0.1)' },
  IND: { border: 'rgb(249, 115, 22)', bg: 'rgba(249, 115, 22, 0.1)' },
};

/**
 * BudgetTrendChart - Line chart showing space budget trends over time
 *
 * @param {Object} props
 * @param {Object} props.budgetData - Budget data by year and country - REQUIRED from API
 * @param {Array} props.countries - Countries to display
 * @param {string} props.title - Chart title
 * @param {boolean} props.filled - Whether to fill under lines
 */
export default function BudgetTrendChart({
  budgetData = {},
  countries = ['USA', 'CHN', 'RUS', 'EUR'],
  title = 'Space Agency Budget Trends',
  filled = false,
}) {
  const chartData = useMemo(() => {
    const years = Object.keys(budgetData).sort();

    const datasets = countries.map(country => {
      const colors = COUNTRY_COLORS[country] || { border: 'rgb(156, 163, 175)', bg: 'rgba(156, 163, 175, 0.1)' };

      return {
        label: country,
        data: years.map(year => budgetData[year]?.[country] || 0),
        borderColor: colors.border,
        backgroundColor: filled ? colors.bg : 'transparent',
        borderWidth: 2,
        fill: filled,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: colors.border,
      };
    });

    return {
      labels: years,
      datasets,
    };
  }, [budgetData, countries, filled]);

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
            return `${label}: $${value.toFixed(1)}B`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Budget (Billion USD)',
        },
        ticks: {
          callback: (value) => `$${value}B`,
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  // Check if data is available
  const hasData = Object.keys(budgetData).length > 0;

  if (!hasData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-500 py-12">
          <p className="text-lg font-medium">No budget data available</p>
          <p className="text-sm mt-2">Budget trend data is not available from the API</p>
        </div>
      </div>
    );
  }

  // Calculate totals and growth
  const years = Object.keys(budgetData).sort();
  const latestYear = years[years.length - 1];
  const previousYear = years[years.length - 2];

  const calculateGrowth = (country) => {
    const latest = budgetData[latestYear]?.[country] || 0;
    const previous = budgetData[previousYear]?.[country] || 0;
    if (previous === 0) return 0;
    return ((latest - previous) / previous * 100).toFixed(1);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div style={{ height: '350px' }}>
        <Line data={chartData} options={options} />
      </div>

      {/* Growth indicators */}
      {previousYear && latestYear && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Year-over-Year Growth ({previousYear} → {latestYear})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {countries.slice(0, 4).map(country => {
              const growth = calculateGrowth(country);
              const isPositive = parseFloat(growth) >= 0;

              return (
                <div key={country} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-600">{country}</div>
                  <div className={`text-lg font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? '+' : ''}{growth}%
                  </div>
                  <div className="text-xs text-gray-500">
                    ${budgetData[latestYear]?.[country]?.toFixed(1) || 0}B
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

/**
 * BudgetComparisonBar - Horizontal bar chart comparing current budgets
 */
export function BudgetComparisonBar({
  countries = [],
  title = 'Space Agency Budgets (Current Year)',
}) {
  const chartData = useMemo(() => {
    // Sort by budget descending
    const sorted = [...countries]
      .filter(c => c.annualBudgetUsd)
      .sort((a, b) => (b.annualBudgetUsd || 0) - (a.annualBudgetUsd || 0));

    return {
      labels: sorted.map(c => c.spaceAgencyAcronym || c.isoCode),
      datasets: [{
        label: 'Budget (Billion USD)',
        data: sorted.map(c => (c.annualBudgetUsd || 0) / 1e9),
        backgroundColor: sorted.map(c => {
          const colors = COUNTRY_COLORS[c.isoCode];
          return colors ? colors.border : 'rgb(156, 163, 175)';
        }),
        borderWidth: 0,
        borderRadius: 4,
      }],
    };
  }, [countries]);

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: !!title,
        text: title,
        font: { size: 16, weight: '600' },
      },
      tooltip: {
        callbacks: {
          label: (context) => `$${context.parsed.x.toFixed(2)}B`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Budget (Billion USD)',
        },
        ticks: {
          callback: (value) => `$${value}B`,
        },
      },
      y: {
        grid: { display: false },
      },
    },
  };

  // Check if data is available
  const hasData = countries.length > 0 && countries.some(c => c.annualBudgetUsd);

  if (!hasData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-500 py-12">
          <p className="text-lg font-medium">No budget comparison data available</p>
          <p className="text-sm mt-2">Country budget data is not available from the API</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div style={{ height: `${Math.max(200, countries.length * 40)}px` }}>
        <Line data={chartData} options={{ ...options, type: 'bar' }} />
      </div>
    </div>
  );
}
