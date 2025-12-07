import { useState, useRef, useEffect } from 'react';

/**
 * Export button with dropdown menu for different formats
 */
export default function ExportButton({
  onExportCSV,
  onExportJSON,
  onExportPNG,
  disabled = false,
  label = 'Export',
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = (exportFn) => {
    if (exportFn) {
      exportFn();
    }
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg transition
          ${disabled
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }
        `}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        {label}
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl py-1 z-50"
          role="menu"
          aria-orientation="vertical"
        >
          {onExportCSV && (
            <button
              onClick={() => handleExport(onExportCSV)}
              className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center gap-3"
              role="menuitem"
            >
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <div className="font-medium">CSV</div>
                <div className="text-xs text-gray-400">Spreadsheet format</div>
              </div>
            </button>
          )}

          {onExportJSON && (
            <button
              onClick={() => handleExport(onExportJSON)}
              className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center gap-3"
              role="menuitem"
            >
              <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <div>
                <div className="font-medium">JSON</div>
                <div className="text-xs text-gray-400">Developer format</div>
              </div>
            </button>
          )}

          {onExportPNG && (
            <button
              onClick={() => handleExport(onExportPNG)}
              className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center gap-3"
              role="menuitem"
            >
              <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <div className="font-medium">PNG Image</div>
                <div className="text-xs text-gray-400">Visual snapshot</div>
              </div>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Simple inline export buttons (no dropdown)
 */
export function ExportButtons({
  onExportCSV,
  onExportJSON,
  onExportPNG,
  disabled = false,
  size = 'md',
}) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <div className="flex items-center gap-2">
      {onExportCSV && (
        <button
          onClick={onExportCSV}
          disabled={disabled}
          className={`${sizeClasses[size]} rounded bg-green-600/20 text-green-400 hover:bg-green-600/30 transition disabled:opacity-50`}
          title="Export as CSV"
        >
          CSV
        </button>
      )}
      {onExportJSON && (
        <button
          onClick={onExportJSON}
          disabled={disabled}
          className={`${sizeClasses[size]} rounded bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600/30 transition disabled:opacity-50`}
          title="Export as JSON"
        >
          JSON
        </button>
      )}
      {onExportPNG && (
        <button
          onClick={onExportPNG}
          disabled={disabled}
          className={`${sizeClasses[size]} rounded bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition disabled:opacity-50`}
          title="Export as PNG"
        >
          PNG
        </button>
      )}
    </div>
  );
}
