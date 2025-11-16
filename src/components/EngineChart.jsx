import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function EngineChart({ engines, type = 'twr' }) {
  if (!engines || engines.length === 0) {
    return (
      <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-500">
        No data available
      </div>
    );
  }

  let chartLabel = '';
  let chartData_values = [];
  let bgColor = '';
  let borderColor = '';
  let chartTitle = '';

  if (type === 'twr') {
    chartLabel = 'Thrust-to-Weight Ratio';
    chartData_values = engines.map((e) => e.calculateThrustToWeightRatio || 0);
    bgColor = 'rgba(59, 130, 246, 0.5)';
    borderColor = 'rgb(59, 130, 246)';
    chartTitle = 'Engine Thrust-to-Weight Ratio Comparison';
  } else if (type === 'isp') {
    chartLabel = 'ISP (s)';
    chartData_values = engines.map((e) => e.isp_s || 0);
    bgColor = 'rgba(34, 197, 94, 0.5)';
    borderColor = 'rgb(34, 197, 94)';
    chartTitle = 'Engine ISP Comparison';
  }

  const chartData = {
    labels: engines.map((e) => e.name),
    datasets: [
      {
        label: chartLabel,
        data: chartData_values,
        backgroundColor: bgColor,
        borderColor: borderColor,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: chartTitle,
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Bar data={chartData} options={options} />
    </div>
  );
}
