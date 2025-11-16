export default function ComparisonTable({ engines }) {
  if (!engines || engines.length === 0) {
    return (
      <div className="bg-gray-100 p-8 rounded-lg text-center text-gray-500">
        Select engines to compare
      </div>
    );
  }

  const specifications = [
    { key: 'name', label: 'Engine' },
    { key: 'designer', label: 'Designer' },
    { key: 'calculateThrustToWeightRatio', label: 'T/W Ratio' },
    { key: 'isp_s', label: 'ISP (s)' },
    { key: 'propellant', label: 'Propellant' },
    { key: 'powerCycle', label: 'Cycle' },
  ];

  const getSpecValue = (engine, key) => {
    const value = engine[key];
    if (key === 'calculateThrustToWeightRatio' && value !== null && value !== undefined) {
      return value.toFixed(2);
    }
    return value || 'N/A';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="w-full border-collapse">
        <tbody>
          {specifications.map((spec) => (
            <tr key={spec.key} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="px-6 py-4 font-semibold text-gray-700 bg-gray-50 w-1/4">
                {spec.label}
              </td>
              {engines.map((engine, idx) => (
                <td
                  key={idx}
                  className="px-6 py-4 text-gray-600 border-r border-gray-200 last:border-r-0"
                >
                  {getSpecValue(engine, spec.key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
