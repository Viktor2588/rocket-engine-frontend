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

// Mock budget data (billions USD)
const MOCK_BUDGET_DATA = {
  2015: { USA: 18.0, CHN: 6.0, RUS: 3.5, EUR: 5.5, JPN: 1.8, IND: 1.2 },
  2016: { USA: 19.3, CHN: 6.5, RUS: 2.8, EUR: 5.6, JPN: 1.9, IND: 1.3 },
  2017: { USA: 19.5, CHN: 7.2, RUS: 3.0, EUR: 5.8, JPN: 2.0, IND: 1.4 },
  2018: { USA: 20.7, CHN: 8.0, RUS: 3.3, EUR: 6.0, JPN: 2.1, IND: 1.5 },
  2019: { USA: 22.6, CHN: 8.9, RUS: 3.5, EUR: 6.3, JPN: 2.2, IND: 1.6 },
  2020: { USA: 23.3, CHN: 9.8, RUS: 3.2, EUR: 6.5, JPN: 2.3, IND: 1.7 },
  2021: { USA: 23.7, CHN: 10.5, RUS: 3.0, EUR: 7.0, JPN: 2.4, IND: 1.8 },
  2022: { USA: 25.4, CHN: 11.5, RUS: 2.8, EUR: 7.4, JPN: 2.5, IND: 1.9 },
  2023: { USA: 27.2, CHN: 12.5, RUS: 2.5, EUR: 8.0, JPN: 2.7, IND: 2.1 },
  2024: { USA: 28.5, CHN: 14.0, RUS: 2.3, EUR: 8.5, JPN: 2.8, IND: 2.3 },
};

/**
 * BudgetTrendChart - Line chart showing space budget trends over time
 *
 * @param {Object} props
 * @param {Object} props.budgetData - Budget data by year and country
 * @param {Array} props.countries - Countries to display
 * @param {string} props.title - Chart title
 * @param {boolean} props.filled - Whether to fill under lines
 */
export default function BudgetTrendChart({
  budgetData = MOCK_BUDGET_DATA,
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div style={{ height: `${Math.max(200, countries.length * 40)}px` }}>
        <Line data={chartData} options={{ ...options, type: 'bar' }} />
      </div>
    </div>
  );
}
