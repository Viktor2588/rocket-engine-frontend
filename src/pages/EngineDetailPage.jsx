import { useParams, Link } from 'react-router-dom';
import { useEngine } from '../hooks/useEngines';

export default function EngineDetailPage() {
  const { id } = useParams();
  const { engine, loading, error } = useEngine(id);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading engine details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Engine</h2>
          <p className="text-red-600">{error}</p>
          <Link to="/" className="mt-4 inline-block text-blue-500 hover:text-blue-700 font-semibold">
            ← Back to Engines
          </Link>
        </div>
      </div>
    );
  }

  if (!engine) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Engine not found</p>
          <Link to="/" className="mt-4 inline-block text-blue-500 hover:text-blue-700 font-semibold">
            ← Back to Engines
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link to="/" className="text-blue-500 hover:text-blue-700 font-semibold mb-6 inline-block">
          ← Back to Engines
        </Link>

        {/* Engine Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{engine.name}</h1>
              <p className="text-lg text-gray-600">{engine.designer} • {engine.origin}</p>
              <p className="text-sm text-gray-500 mt-1">Status: <span className="font-semibold">{engine.status}</span></p>
            </div>
            <div className="text-5xl">🚀</div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
              <p className="text-sm text-gray-600 mb-1">T/W Ratio</p>
              <p className="text-3xl font-bold text-blue-600">{engine.calculateThrustToWeightRatio ? engine.calculateThrustToWeightRatio.toFixed(2) : 'N/A'}</p>
              <p className="text-xs text-gray-500 mt-1">thrust/weight</p>
            </div>

            <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
              <p className="text-sm text-gray-600 mb-1">ISP</p>
              <p className="text-3xl font-bold text-green-600">{engine.isp_s || 'N/A'}</p>
              <p className="text-xs text-gray-500 mt-1">{engine.isp_s ? 'seconds' : ''}</p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-500">
              <p className="text-sm text-gray-600 mb-1">Cycle</p>
              <p className="text-lg font-bold text-purple-600">{engine.powerCycle || 'N/A'}</p>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg border-l-4 border-orange-500">
              <p className="text-sm text-gray-600 mb-1">Propellant</p>
              <p className="text-lg font-bold text-orange-600">{engine.propellant}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Specifications */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Specifications</h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-semibold text-gray-700">Vehicle</span>
                  <span className="text-gray-600">{engine.vehicle || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-semibold text-gray-700">Thrust (N)</span>
                  <span className="text-gray-600">{engine.thrustN ? `${engine.thrustN.toLocaleString()}` : 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-semibold text-gray-700">T/W Ratio</span>
                  <span className="text-gray-600">{engine.calculateThrustToWeightRatio ? engine.calculateThrustToWeightRatio.toFixed(2) : 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-semibold text-gray-700">ISP (Sea Level)</span>
                  <span className="text-gray-600">{engine.isp_s ? `${engine.isp_s} s` : 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-semibold text-gray-700">Power Cycle</span>
                  <span className="text-gray-600">{engine.powerCycle || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-semibold text-gray-700">Propellant</span>
                  <span className="text-gray-600">{engine.propellant}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-semibold text-gray-700">Chamber Pressure (bar)</span>
                  <span className="text-gray-600">{engine.chamberPressureBar || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-semibold text-gray-700">Mass (kg)</span>
                  <span className="text-gray-600">{engine.massKg ? `${engine.massKg.toLocaleString()}` : 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Additional Information</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">Designer</p>
                    <p className="text-gray-600">{engine.designer}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">Origin</p>
                    <p className="text-gray-600">{engine.origin}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">Status</p>
                    <p className="text-gray-600">{engine.status}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">Use</p>
                    <p className="text-gray-600">{engine.use || 'N/A'}</p>
                  </div>
                  {engine.ofRatio && (
                    <div>
                      <p className="font-semibold text-gray-700 mb-1">O/F Ratio</p>
                      <p className="text-gray-600">{engine.ofRatio}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Link
            to={`/compare?engine1=${engine.id}`}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Compare This Engine
          </Link>
          <Link
            to="/"
            className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition"
          >
            Back to List
          </Link>
        </div>
      </div>
    </div>
  );
}
