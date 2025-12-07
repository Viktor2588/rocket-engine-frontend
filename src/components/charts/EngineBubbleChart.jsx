import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBubbleEngineData } from '../../hooks/useVisualization';

ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

// Country colors
const COUNTRY_COLORS = {
  USA: { bg: 'rgba(59, 130, 246, 0.6)', border: 'rgb(59, 130, 246)' },
  RUS: { bg: 'rgba(239, 68, 68, 0.6)', border: 'rgb(239, 68, 68)' },
  CHN: { bg: 'rgba(234, 179, 8, 0.6)', border: 'rgb(234, 179, 8)' },
  EUR: { bg: 'rgba(34, 197, 94, 0.6)', border: 'rgb(34, 197, 94)' },
  JPN: { bg: 'rgba(168, 85, 247, 0.6)', border: 'rgb(168, 85, 247)' },
  IND: { bg: 'rgba(249, 115, 22, 0.6)', border: 'rgb(249, 115, 22)' },
  DEFAULT: { bg: 'rgba(156, 163, 175, 0.6)', border: 'rgb(156, 163, 175)' },
};

/**
 * EngineBubbleChart - Bubble chart showing engines by thrust vs ISP vs country
 *
 * X-axis: Thrust (kN)
 * Y-axis: Specific Impulse (s)
 * Bubble size: Chamber Pressure or TWR
 *
 * @param {Object} props
 * @param {Array} props.engines - Array of engine objects
 * @param {string} props.xAxis - X axis metric: 'thrust', 'mass', 'twr'
 * @param {string} props.yAxis - Y axis metric: 'isp', 'pressure', 'thrust'
 * @param {string} props.bubbleSize - Bubble size metric: 'pressure', 'twr', 'mass'
 */
export default function EngineBubbleChart({
  engines: propEngines,
  xAxis = 'thrust',
  yAxis = 'isp',
  bubbleSize = 'pressure',
  title = 'Engine Performance Comparison',
  useApi = false,
  filters = {},
}) {
  const [hoveredEngine, setHoveredEngine] = useState(null);

  // Fetch from API if useApi is true
  const { data: apiEngines, loading, error } = useBubbleEngineData(useApi ? filters : null);

  // Use API data if available, otherwise use prop engines
  const engines = useApi && apiEngines?.length > 0 ? apiEngines : (propEngines || []);

  // Axis configuration
  const axisConfig = {
    thrust: { label: 'Thrust (kN)', key: 'thrustKn', scale: 1 },
    isp: { label: 'Specific Impulse (s)', key: 'specificImpulseS', scale: 1 },
    pressure: { label: 'Chamber Pressure (MPa)', key: 'chamberPressureMpa', scale: 1 },
    mass: { label: 'Mass (kg)', key: 'massKg', scale: 1 },
    twr: { label: 'Thrust-to-Weight Ratio', key: 'thrustToWeightRatio', scale: 1 },
  };

  const chartData = useMemo(() => {
    // Group engines by country
    const countryGroups = {};

    engines.forEach(engine => {
      const countryCode = engine.countryId || engine.origin || 'OTHER';
      if (!countryGroups[countryCode]) {
        countryGroups[countryCode] = [];
      }

      const xValue = engine[axisConfig[xAxis].key] || 0;
      const yValue = engine[axisConfig[yAxis].key] || 0;
      const sizeValue = engine[axisConfig[bubbleSize].key] || 10;

      // Normalize bubble size (5-25 range)
      const normalizedSize = Math.max(5, Math.min(25, sizeValue / 5));

      countryGroups[countryCode].push({
        x: xValue,
        y: yValue,
        r: normalizedSize,
        engine,
      });
    });

    // Create datasets
    const datasets = Object.entries(countryGroups).map(([country, data]) => {
      const colors = COUNTRY_COLORS[country] || COUNTRY_COLORS.DEFAULT;
      return {
        label: country,
        data,
        backgroundColor: colors.bg,
        borderColor: colors.border,
        borderWidth: 1,
        hoverBackgroundColor: colors.border,
        hoverBorderWidth: 2,
      };
    });

    return { datasets };
  }, [engines, xAxis, yAxis, bubbleSize]);

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
            const engine = context.raw.engine;
            return [
              engine.name,
              `${axisConfig[xAxis].label}: ${context.parsed.x.toLocaleString()}`,
              `${axisConfig[yAxis].label}: ${context.parsed.y.toLocaleString()}`,
              `Cycle: ${engine.cycle || 'Unknown'}`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: axisConfig[xAxis].label,
        },
        beginAtZero: true,
      },
      y: {
        title: {
          display: true,
          text: axisConfig[yAxis].label,
        },
        beginAtZero: true,
      },
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const datasetIndex = elements[0].datasetIndex;
        const index = elements[0].index;
        const engine = chartData.datasets[datasetIndex].data[index].engine;
        setHoveredEngine(engine);
      }
    },
  };

  // Show loading state if using API
  if (useApi && loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div style={{ height: '450px' }} className="flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading engine data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if using API
  if (useApi && error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div style={{ height: '450px' }} className="flex items-center justify-center">
          <div className="text-center text-red-600">
            <p>Error loading engine data: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div style={{ height: '450px' }}>
        <Bubble data={chartData} options={options} />
      </div>

      {/* Selected engine detail */}
      {hoveredEngine && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-bold text-lg text-gray-800">{hoveredEngine.name}</h4>
              <p className="text-sm text-gray-500">{hoveredEngine.manufacturer}</p>
            </div>
            <Link
              to={`/engines/${hoveredEngine.id}`}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              View Details →
            </Link>
          </div>
          <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Thrust:</span>
              <span className="ml-2 font-semibold">{hoveredEngine.thrustKn?.toLocaleString()} kN</span>
            </div>
            <div>
              <span className="text-gray-500">ISP:</span>
              <span className="ml-2 font-semibold">{hoveredEngine.specificImpulseS} s</span>
            </div>
            <div>
              <span className="text-gray-500">Pressure:</span>
              <span className="ml-2 font-semibold">{hoveredEngine.chamberPressureMpa} MPa</span>
            </div>
            <div>
              <span className="text-gray-500">Cycle:</span>
              <span className="ml-2 font-semibold">{hoveredEngine.cycle}</span>
            </div>
          </div>
        </div>
      )}

      {/* Legend explanation */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        Click on a bubble to see engine details. Bubble size represents {axisConfig[bubbleSize].label.toLowerCase()}.
      </div>
    </div>
  );
}

/**
 * EngineScatterPlot - Simplified scatter plot for engine comparison
 */
export function EngineScatterPlot({ engines = [], xMetric = 'thrust', yMetric = 'isp' }) {
  const axisLabels = {
    thrust: 'Thrust (kN)',
    isp: 'Specific Impulse (s)',
    pressure: 'Chamber Pressure (MPa)',
    twr: 'Thrust-to-Weight Ratio',
  };

  const axisKeys = {
    thrust: 'thrustKn',
    isp: 'specificImpulseS',
    pressure: 'chamberPressureMpa',
    twr: 'thrustToWeightRatio',
  };

  const data = useMemo(() => {
    const countryGroups = {};

    engines.forEach(engine => {
      const country = engine.countryId || 'OTHER';
      if (!countryGroups[country]) countryGroups[country] = [];

      countryGroups[country].push({
        x: engine[axisKeys[xMetric]] || 0,
        y: engine[axisKeys[yMetric]] || 0,
        engine,
      });
    });

    return {
      datasets: Object.entries(countryGroups).map(([country, points]) => ({
        label: country,
        data: points,
        backgroundColor: COUNTRY_COLORS[country]?.bg || COUNTRY_COLORS.DEFAULT.bg,
        borderColor: COUNTRY_COLORS[country]?.border || COUNTRY_COLORS.DEFAULT.border,
        pointRadius: 8,
        pointHoverRadius: 12,
      })),
    };
  }, [engines, xMetric, yMetric]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.raw.engine.name}: ${ctx.parsed.x}, ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: { title: { display: true, text: axisLabels[xMetric] } },
      y: { title: { display: true, text: axisLabels[yMetric] } },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4" style={{ height: '350px' }}>
      <Bubble data={data} options={options} />
    </div>
  );
}
