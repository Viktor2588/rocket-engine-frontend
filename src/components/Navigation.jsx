import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();
  const [compareMenuOpen, setCompareMenuOpen] = useState(false);

  // Helper to check if link is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/countries';
    }
    return location.pathname.startsWith(path);
  };

  const linkClass = (path) =>
    `hover:text-indigo-400 transition ${isActive(path) ? 'text-indigo-400 font-semibold' : ''}`;

  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <span>🌍</span>
          <span className="hidden sm:inline">Space Capabilities</span>
          <span className="sm:hidden">Space</span>
        </Link>
        <div className="flex gap-4 md:gap-6 text-sm md:text-base">
          <Link to="/countries" className={linkClass('/')}>
            Countries
          </Link>
          <Link to="/engines" className={linkClass('/engines')}>
            Engines
          </Link>

          {/* Compare dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setCompareMenuOpen(true)}
            onMouseLeave={() => setCompareMenuOpen(false)}
          >
            <button className={`hover:text-indigo-400 transition flex items-center gap-1 ${isActive('/compare') ? 'text-indigo-400 font-semibold' : ''}`}>
              Compare
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {compareMenuOpen && (
              <div className="absolute top-full left-0 mt-1 bg-gray-800 rounded-lg shadow-xl py-2 min-w-[160px] z-50">
                <Link
                  to="/compare/countries"
                  className="block px-4 py-2 hover:bg-gray-700 transition"
                  onClick={() => setCompareMenuOpen(false)}
                >
                  🌍 Countries
                </Link>
                <Link
                  to="/compare/engines"
                  className="block px-4 py-2 hover:bg-gray-700 transition"
                  onClick={() => setCompareMenuOpen(false)}
                >
                  🚀 Engines
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
