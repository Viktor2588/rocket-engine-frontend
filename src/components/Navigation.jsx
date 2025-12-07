import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();
  const [compareMenuOpen, setCompareMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCompareMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          <Link to="/vehicles" className={linkClass('/vehicles')}>
            Vehicles
          </Link>
          <Link to="/satellites" className={linkClass('/satellites')}>
            Satellites
          </Link>
          <Link to="/launch-sites" className={linkClass('/launch-sites')}>
            Sites
          </Link>
          <Link to="/missions" className={linkClass('/missions')}>
            Missions
          </Link>
          <Link to="/rankings" className={linkClass('/rankings')}>
            Rankings
          </Link>
          <Link to="/analytics" className={linkClass('/analytics')}>
            Analytics
          </Link>

          {/* Compare dropdown */}
          <div
            className="relative"
            ref={dropdownRef}
          >
            <button
              className={`hover:text-indigo-400 transition flex items-center gap-1 ${isActive('/compare') ? 'text-indigo-400 font-semibold' : ''}`}
              onClick={() => setCompareMenuOpen(!compareMenuOpen)}
            >
              Compare
              <svg className={`w-4 h-4 transition-transform ${compareMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
