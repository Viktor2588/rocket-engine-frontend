import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEngines } from '../hooks/useEngines';
import ComparisonTable from '../components/ComparisonTable';
import EngineChart from '../components/EngineChart';
import engineService from '../services/engineService';

export default function ComparisonPage() {
  const [searchParams] = useSearchParams();
  const { engines, loading: loadingEngines } = useEngines();
  const [selectedEngineIds, setSelectedEngineIds] = useState(() => {
    const params = [];
    if (searchParams.get('engine1')) params.push(parseInt(searchParams.get('engine1')));
    if (searchParams.get('engine2')) params.push(parseInt(searchParams.get('engine2')));
    return params;
  });
  const [comparisonData, setComparisonData] = useState(null);
  const [, setLoading] = useState(false);

  // Get selected engines
  const selectedEngines = engines.filter((e) => selectedEngineIds.includes(e.id));

  // Fetch comparison data when selections change
  useEffect(() => {
    if (selectedEngineIds.length === 2) {
      const fetchComparison = async () => {
        try {
          setLoading(true);
          const data = await engineService.compare(selectedEngineIds[0], selectedEngineIds[1]);
          setComparisonData(data);
        } catch (error) {
          console.error('Error fetching comparison:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchComparison();
    }
  }, [selectedEngineIds]);

  const handleEngineSelect = (id) => {
    setSelectedEngineIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((eid) => eid !== id);
      } else if (prev.length < 2) {
        return [...prev, id];
      } else {
        return [prev[1], id];
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🔍 Compare Engines</h1>
          <p className="text-gray-600">Select two engines to compare their specifications</p>
        </div>

        {/* Engine Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Engines</h2>

          {loadingEngines ? (
            <div className="text-center text-gray-500">Loading engines...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {engines.map((engine) => (
                <button
                  key={engine.id}
                  onClick={() => handleEngineSelect(engine.id)}
                  className={`p-4 rounded-lg border-2 transition text-left ${
                    selectedEngineIds.includes(engine.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <div className="font-semibold text-gray-900">{engine.name}</div>
                  <div className="text-xs text-gray-500">{engine.designer}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    T/W: {engine.calculateThrustToWeightRatio ? engine.calculateThrustToWeightRatio.toFixed(2) : 'N/A'} • Cycle: {engine.powerCycle || 'N/A'}
                  </div>
                </button>
              ))}
            </div>
          )}

          {selectedEngineIds.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-700">
                Selected: {selectedEngineIds.length} / 2 engines
                {selectedEngineIds.length === 2 && ' ✓'}
              </p>
            </div>
          )}
        </div>

        {/* Comparison Results */}
        {selectedEngineIds.length === 2 && (
          <>
            {/* Comparison Table */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Specifications Comparison</h2>
              <ComparisonTable engines={selectedEngines} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Thrust-to-Weight Ratio Comparison</h3>
                <EngineChart engines={selectedEngines} type="twr" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">ISP Comparison</h3>
                <EngineChart engines={selectedEngines} type="isp" />
              </div>
            </div>

            {/* Comparison Insights */}
            {comparisonData && (
              <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Comparison Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">T/W Ratio Difference</h4>
                    <p className="text-lg text-blue-600">
                      {selectedEngines[0].calculateThrustToWeightRatio && selectedEngines[1].calculateThrustToWeightRatio
                        ? (Math.abs(selectedEngines[0].calculateThrustToWeightRatio - selectedEngines[1].calculateThrustToWeightRatio)).toFixed(2)
                        : 'N/A'}
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      {selectedEngines[0].name} is{' '}
                      {(selectedEngines[0].calculateThrustToWeightRatio || 0) > (selectedEngines[1].calculateThrustToWeightRatio || 0)
                        ? 'more'
                        : 'less'}{' '}
                      efficient (by weight)
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">ISP Difference</h4>
                    <p className="text-lg text-green-600">
                      {selectedEngines[0].isp_s && selectedEngines[1].isp_s
                        ? `${Math.abs(selectedEngines[0].isp_s - selectedEngines[1].isp_s)} seconds`
                        : 'N/A'}
                    </p>
                    <p className="text-sm text-green-700 mt-1">
                      {selectedEngines[0].name} is{' '}
                      {(selectedEngines[0].isp_s || 0) > (selectedEngines[1].isp_s || 0)
                        ? 'more'
                        : 'less'}{' '}
                      efficient
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {selectedEngineIds.length < 2 && selectedEngineIds.length > 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>Select {2 - selectedEngineIds.length} more engine(s) to compare</p>
          </div>
        )}

        {selectedEngineIds.length === 0 && !loadingEngines && (
          <div className="text-center py-12 text-gray-500">
            <p>Select two engines to compare their specifications</p>
          </div>
        )}
      </div>
    </div>
  );
}
