import { useState } from 'react';
import { FilterList } from '@mui/icons-material';
import FilterTag from './FilterTag';
import FilterToggle from './FilterToggle';

/**
 * A single filter section within the panel
 */
export function FilterSection({ title, children }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {children}
      </div>
    </div>
  );
}

/**
 * Collapsible filter panel with active filters display
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Filter sections
 * @param {Array} props.activeFilters - Array of active filter objects { key, label, color, onRemove }
 * @param {Function} props.onClearAll - Callback to clear all filters
 * @param {React.ReactNode} props.headerActions - Additional actions to show in header (view toggles, etc.)
 * @param {boolean} props.defaultExpanded - Whether filters are expanded by default
 */
export default function FilterPanel({
  children,
  activeFilters = [],
  onClearAll,
  headerActions,
  defaultExpanded = true,
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className="glass-panel mb-8 overflow-hidden">
      {/* Filter Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/50 dark:border-white/[0.08]">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-semibold"
        >
          <FilterList />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="px-2 py-0.5 rounded-full text-xs bg-indigo-500 text-white">
              {activeFilters.length}
            </span>
          )}
          <svg
            className={`w-5 h-5 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {headerActions && (
          <div className="flex items-center gap-3">
            {headerActions}
          </div>
        )}
      </div>

      {/* Expandable Filter Sections */}
      {expanded && (
        <div className="px-6 py-4 space-y-4">
          {children}

          {/* Clear all button */}
          {hasActiveFilters && onClearAll && (
            <div className="pt-2 border-t border-gray-200/50 dark:border-white/[0.08]">
              <button
                onClick={onClearAll}
                className="text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Active Filters Tags */}
      {hasActiveFilters && (
        <div className="px-6 py-3 glass-header-gradient border-t border-gray-200/50 dark:border-white/[0.08]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Active filters:</span>
            {activeFilters.map((filter) => (
              <FilterTag
                key={filter.key}
                label={filter.label}
                onRemove={filter.onRemove}
                color={filter.color}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { FilterToggle, FilterTag };
