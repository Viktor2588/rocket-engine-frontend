import { Link } from 'react-router-dom';

export default function EngineCard({ engine }) {
  return (
    <Link to={`/engines/${engine.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 cursor-pointer border-l-4 border-blue-500">
        <h3 className="text-xl font-bold text-gray-800 mb-1">{engine.name}</h3>
        <p className="text-sm text-gray-600 mb-4">
          <span className="font-semibold">{engine.designer}</span>
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 p-3 rounded">
            <p className="text-xs text-gray-500">T/W Ratio</p>
            <p className="text-lg font-bold text-blue-600">{engine.calculateThrustToWeightRatio ? engine.calculateThrustToWeightRatio.toFixed(2) : 'N/A'}</p>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <p className="text-xs text-gray-500">ISP (s)</p>
            <p className="text-lg font-bold text-green-600">{engine.isp_s || 'N/A'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Propellant</p>
            <p className="text-sm font-semibold text-gray-700">{engine.propellant}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Cycle</p>
            <p className="text-sm font-semibold text-gray-700">{engine.powerCycle || 'N/A'}</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-blue-500 font-semibold">View Details →</p>
        </div>
      </div>
    </Link>
  );
}
