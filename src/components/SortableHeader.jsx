import { ArrowUpward, ArrowDownward, UnfoldMore } from '@mui/icons-material';

/**
 * Reusable sortable table header component
 * @param {Object} props
 * @param {string} props.label - Display label for the column
 * @param {string} props.sortKey - Key used for sorting (null if not sortable)
 * @param {string} props.currentSort - Currently active sort key
 * @param {string} props.sortOrder - Current sort order ('asc' or 'desc')
 * @param {function} props.onSort - Callback when header is clicked
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.align - Text alignment ('left', 'center', 'right')
 */
export default function SortableHeader({
  label,
  sortKey,
  currentSort,
  sortOrder,
  onSort,
  className = '',
  align = 'left',
}) {
  const isActive = sortKey && currentSort === sortKey;
  const isSortable = sortKey && onSort;

  const handleClick = () => {
    if (!isSortable) return;

    if (isActive) {
      // Toggle order if already sorting by this column
      onSort(sortKey, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to descending for numeric fields, ascending for text
      const defaultOrder = ['name', 'country', 'title', 'mission'].some(k =>
        sortKey.toLowerCase().includes(k)
      ) ? 'asc' : 'desc';
      onSort(sortKey, defaultOrder);
    }
  };

  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align];

  return (
    <th
      className={`px-6 py-3 text-xs font-medium uppercase tracking-wider ${alignClass} ${
        isSortable
          ? 'cursor-pointer select-none hover:bg-gray-500/10 dark:hover:bg-white/[0.05] transition-colors'
          : ''
      } ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-300'} ${className}`}
      onClick={handleClick}
    >
      <div className={`flex items-center gap-1 ${align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : ''}`}>
        <span>{label}</span>
        {isSortable && (
          <span className="inline-flex">
            {isActive ? (
              sortOrder === 'asc' ? (
                <ArrowUpward style={{ fontSize: '1rem' }} />
              ) : (
                <ArrowDownward style={{ fontSize: '1rem' }} />
              )
            ) : (
              <UnfoldMore style={{ fontSize: '1rem' }} className="opacity-40" />
            )}
          </span>
        )}
      </div>
    </th>
  );
}

/**
 * Sortable grid/card header for grid views
 */
export function SortableGridHeader({
  columns,
  currentSort,
  sortOrder,
  onSort,
  className = '',
}) {
  return (
    <div className={`flex flex-wrap gap-2 items-center ${className}`}>
      <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Sort by:</span>
      {columns.map((col) => {
        const isActive = currentSort === col.key;
        return (
          <button
            key={col.key}
            onClick={() => {
              if (isActive) {
                onSort(col.key, sortOrder === 'asc' ? 'desc' : 'asc');
              } else {
                const defaultOrder = ['name', 'country', 'title'].some(k =>
                  col.key.toLowerCase().includes(k)
                ) ? 'asc' : 'desc';
                onSort(col.key, defaultOrder);
              }
            }}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition ${
              isActive
                ? 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30'
                : 'bg-gray-500/10 dark:bg-white/[0.06] text-gray-600 dark:text-gray-400 border border-gray-200/30 dark:border-white/[0.08] hover:bg-gray-500/20 dark:hover:bg-white/[0.1]'
            }`}
          >
            {col.label}
            {isActive && (
              sortOrder === 'asc' ? (
                <ArrowUpward style={{ fontSize: '0.875rem' }} />
              ) : (
                <ArrowDownward style={{ fontSize: '0.875rem' }} />
              )
            )}
          </button>
        );
      })}
    </div>
  );
}
