import { Link } from 'react-router-dom';

/**
 * View toggle buttons for switching between grid/table/map views
 */
export default function ViewToggle({
  viewMode,
  setViewMode,
  options = ['grid', 'table'],
  compareLink,
  className = ''
}) {
  const labels = {
    grid: 'Grid',
    table: 'Table',
    map: 'Map',
    list: 'List',
    timeline: 'Timeline',
    chart: 'Chart',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex gap-2">
        {options.map(option => (
          <button
            key={option}
            onClick={() => setViewMode(option)}
            className={viewMode === option ? 'glass-button-primary' : 'glass-button'}
          >
            {labels[option] || option}
          </button>
        ))}
      </div>

      {compareLink && (
        <Link
          to={compareLink}
          className="glass-button-primary bg-green-500/80 hover:bg-green-500"
        >
          Compare
        </Link>
      )}
    </div>
  );
}
