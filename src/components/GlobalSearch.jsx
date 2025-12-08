import { useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGlobalSearch } from '../hooks/useGlobalSearch';
import SpaceIcon from './icons/SpaceIcons';
import { Search } from '@mui/icons-material';

/**
 * Type filter badge colors
 */
const TYPE_COLORS = {
  country: 'bg-indigo-100 text-indigo-700 border-indigo-300',
  engine: 'bg-blue-100 text-blue-700 border-blue-300',
  vehicle: 'bg-purple-100 text-purple-700 border-purple-300',
  mission: 'bg-green-100 text-green-700 border-green-300',
  satellite: 'bg-cyan-100 text-cyan-700 border-cyan-300',
  launchSite: 'bg-orange-100 text-orange-700 border-orange-300',
};

/**
 * Search result item component
 */
function SearchResultItem({ result, entityTypes, onSelect }) {
  const typeInfo = entityTypes[result.type];
  const route = typeInfo.route(result.item);

  return (
    <Link
      to={route}
      onClick={onSelect}
      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition cursor-pointer"
    >
      {/* Icon or Image */}
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
        {result.image ? (
          <img src={result.image} alt="" className="w-full h-full object-cover" />
        ) : (
          <SpaceIcon name={typeInfo.icon} size="lg" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 truncate">{result.title}</div>
        {result.subtitle && (
          <div className="text-sm text-gray-500 truncate">{result.subtitle}</div>
        )}
      </div>

      {/* Type badge */}
      <span className={`flex-shrink-0 px-2 py-1 rounded text-xs font-medium ${TYPE_COLORS[result.type]}`}>
        {typeInfo.label}
      </span>
    </Link>
  );
}

/**
 * Type filter toggles
 */
function TypeFilters({ selectedTypes, toggleType, entityTypes }) {
  return (
    <div className="flex flex-wrap gap-2 px-4 py-2 border-b border-gray-200 bg-gray-50">
      {Object.entries(entityTypes).map(([type, info]) => {
        const isSelected = selectedTypes.includes(type);
        return (
          <button
            key={type}
            onClick={() => toggleType(type)}
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border transition ${
              isSelected
                ? TYPE_COLORS[type]
                : 'bg-white text-gray-400 border-gray-200 hover:border-gray-300'
            }`}
          >
            <SpaceIcon name={info.icon} size="sm" />
            <span>{info.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/**
 * Global Search Component
 */
export default function GlobalSearch() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const {
    query,
    setQuery,
    results,
    groupedResults,
    selectedTypes,
    toggleType,
    isOpen,
    setIsOpen,
    clearSearch,
    isLoading,
    entityTypes,
    totalResults,
  } = useGlobalSearch();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + K to open search (check both lowercase and uppercase)
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 0);
      }
      // Escape to close
      if (e.key === 'Escape') {
        clearSearch();
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [setIsOpen, clearSearch]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsOpen]);

  // Handle input change
  const handleInputChange = useCallback((e) => {
    setQuery(e.target.value);
    if (!isOpen && e.target.value.length > 0) {
      setIsOpen(true);
    }
  }, [setQuery, isOpen, setIsOpen]);

  // Handle result selection
  const handleSelect = useCallback(() => {
    clearSearch();
  }, [clearSearch]);

  // Handle keyboard navigation in results
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && results.length > 0) {
      const route = entityTypes[results[0].type].route(results[0].item);
      navigate(route);
      clearSearch();
    }
  }, [results, entityTypes, navigate, clearSearch]);

  return (
    <div className="relative" ref={containerRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search..."
          className="w-full pl-10 pr-16 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm truncate"
          aria-label="Global search"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        />
        {/* Keyboard shortcut hint - shown when no query */}
        {!query && (
          <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-xs text-gray-400 bg-gray-700 border border-gray-600 rounded font-mono">
              <span>⌘</span><span>K</span>
            </kbd>
          </div>
        )}
        {/* Clear button - shown when there is a query */}
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-white"
            aria-label="Clear search"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query.length >= 2 && (
        <div
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 max-h-[70vh] overflow-y-auto"
          role="listbox"
        >
          {/* Type Filters */}
          <TypeFilters
            selectedTypes={selectedTypes}
            toggleType={toggleType}
            entityTypes={entityTypes}
          />

          {/* Loading State */}
          {isLoading && (
            <div className="px-4 py-8 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-2"></div>
              <p>Searching...</p>
            </div>
          )}

          {/* No Results */}
          {!isLoading && results.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-500">
              <div className="mb-2"><Search style={{ fontSize: '2.5rem' }} /></div>
              <p>No results found for "{query}"</p>
              <p className="text-sm mt-1">Try different keywords or check the filters</p>
            </div>
          )}

          {/* Results */}
          {!isLoading && results.length > 0 && (
            <>
              {/* Results count */}
              <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50 border-b">
                {totalResults} result{totalResults !== 1 ? 's' : ''} found
              </div>

              {/* Grouped results */}
              {Object.entries(groupedResults).map(([type, typeResults]) => (
                <div key={type}>
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                      <SpaceIcon name={entityTypes[type].icon} size="sm" /> {entityTypes[type].label}s ({typeResults.length})
                    </span>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {typeResults.map((result, idx) => (
                      <SearchResultItem
                        key={`${type}-${idx}`}
                        result={result}
                        entityTypes={entityTypes}
                        onSelect={handleSelect}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {/* Keyboard navigation hint */}
              <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-500 flex items-center justify-between">
                <span>Press <kbd className="px-1 py-0.5 bg-gray-200 rounded">Enter</kbd> to go to first result</span>
                <span>Press <kbd className="px-1 py-0.5 bg-gray-200 rounded">Esc</kbd> to close</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
