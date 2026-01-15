import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import GlobalSearch from './GlobalSearch';
import { ThemeToggleButton } from './ThemeToggle';
import { Public } from '@mui/icons-material';

export default function Navigation() {
  const location = useLocation();
  const [compareMenuOpen, setCompareMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Helper to check if link is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/countries';
    }
    return location.pathname.startsWith(path);
  };

  const linkClass = (path) =>
    `hover:text-indigo-600 dark:hover:text-indigo-400 transition ${isActive(path) ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''}`;

  return (
    <nav id="main-navigation" className="bg-white dark:bg-gray-900 text-gray-800 dark:text-white shadow-lg sticky top-0 z-40" role="navigation" aria-label="Main navigation">
      <div className="container mx-auto px-4">
        {/* Main Navigation Row */}
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold flex items-center gap-2 flex-shrink-0">
            <Public style={{ fontSize: '1.5rem' }} />
            <span className="hidden md:inline">Space Capabilities</span>
            <span className="md:hidden">Space</span>
          </Link>

          {/* Search Bar - Desktop (pushed right with ml-auto) */}
          <div className="hidden lg:block w-48 xl:w-64 2xl:w-80 ml-auto mr-3 xl:mr-4">
            <GlobalSearch />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2 xl:gap-3 text-sm">
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
              <span className="hidden xl:inline">Satellites</span>
              <span className="xl:hidden">Sats</span>
            </Link>
            <Link to="/launch-sites" className={linkClass('/launch-sites')}>
              Sites
            </Link>
            <Link to="/missions" className={linkClass('/missions')}>
              Missions
            </Link>
            <Link to="/rankings" className={linkClass('/rankings')}>
              <span className="hidden xl:inline">Rankings</span>
              <span className="xl:hidden">Ranks</span>
            </Link>
            <Link to="/analytics" className={linkClass('/analytics')}>
              <span className="hidden xl:inline">Analytics</span>
              <span className="xl:hidden">Stats</span>
            </Link>

            {/* Compare dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                className={`hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-1 ${isActive('/compare') ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : ''}`}
                onClick={() => setCompareMenuOpen(!compareMenuOpen)}
              >
                Compare
                <svg className={`w-4 h-4 transition-transform ${compareMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {compareMenuOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 min-w-[160px] z-50 border border-gray-200 dark:border-gray-700">
                  <Link
                    to="/compare/countries"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    onClick={() => setCompareMenuOpen(false)}
                  >
                    Countries
                  </Link>
                  <Link
                    to="/compare/engines"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    onClick={() => setCompareMenuOpen(false)}
                  >
                    Engines
                  </Link>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <ThemeToggleButton />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggleButton />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar - Mobile/Tablet */}
        <div className="lg:hidden pb-3">
          <GlobalSearch />
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col gap-2">
              <Link to="/countries" className={`py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive('/') ? 'bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400' : ''}`}>
                Countries
              </Link>
              <Link to="/engines" className={`py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive('/engines') ? 'bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400' : ''}`}>
                Engines
              </Link>
              <Link to="/vehicles" className={`py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive('/vehicles') ? 'bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400' : ''}`}>
                Vehicles
              </Link>
              <Link to="/satellites" className={`py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive('/satellites') ? 'bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400' : ''}`}>
                Satellites
              </Link>
              <Link to="/launch-sites" className={`py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive('/launch-sites') ? 'bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400' : ''}`}>
                Launch Sites
              </Link>
              <Link to="/missions" className={`py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive('/missions') ? 'bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400' : ''}`}>
                Missions
              </Link>
              <Link to="/rankings" className={`py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive('/rankings') ? 'bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400' : ''}`}>
                Rankings
              </Link>
              <Link to="/analytics" className={`py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive('/analytics') ? 'bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400' : ''}`}>
                Analytics
              </Link>
              <div className="border-t border-gray-200 dark:border-gray-800 my-2"></div>
              <Link to="/compare/countries" className={`py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive('/compare/countries') ? 'bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400' : ''}`}>
                Compare Countries
              </Link>
              <Link to="/compare/engines" className={`py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${isActive('/compare/engines') ? 'bg-gray-100 dark:bg-gray-800 text-indigo-600 dark:text-indigo-400' : ''}`}>
                Compare Engines
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
