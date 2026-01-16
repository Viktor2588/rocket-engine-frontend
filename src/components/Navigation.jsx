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
    `glass-nav-link ${isActive(path) ? 'glass-nav-link-active' : ''}`;

  return (
    <nav id="main-navigation" className="glass-nav fixed top-0 left-0 right-0 z-40" role="navigation" aria-label="Main navigation">
      <div className="container mx-auto px-4">
        {/* Main Navigation Row */}
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold flex items-center gap-2 flex-shrink-0 text-gray-800 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <Public style={{ fontSize: '1.5rem' }} />
            <span className="hidden md:inline">Space Capabilities</span>
            <span className="md:hidden">Space</span>
          </Link>

          {/* Search Bar - Desktop (pushed right with ml-auto) */}
          <div className="hidden lg:block w-48 xl:w-64 2xl:w-80 ml-auto mr-3 xl:mr-4">
            <GlobalSearch />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-1.5 text-sm">
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
                className={`glass-nav-link flex items-center gap-1 ${isActive('/compare') ? 'glass-nav-link-active' : ''}`}
                onClick={() => setCompareMenuOpen(!compareMenuOpen)}
              >
                Compare
                <svg className={`w-4 h-4 transition-transform duration-200 ${compareMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {compareMenuOpen && (
                <div className="absolute top-full right-0 mt-2 glass-dropdown py-2 min-w-[160px] z-50 animate-glass-in">
                  <Link
                    to="/compare/countries"
                    className="glass-dropdown-item block"
                    onClick={() => setCompareMenuOpen(false)}
                  >
                    Countries
                  </Link>
                  <Link
                    to="/compare/engines"
                    className="glass-dropdown-item block"
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
              className="glass-button-icon"
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
          <div className="md:hidden py-4 border-t border-white/10 dark:border-white/[0.06] animate-glass-in">
            <div className="flex flex-col gap-1">
              <Link to="/countries" className={`${linkClass('/')} block`}>
                Countries
              </Link>
              <Link to="/engines" className={`${linkClass('/engines')} block`}>
                Engines
              </Link>
              <Link to="/vehicles" className={`${linkClass('/vehicles')} block`}>
                Vehicles
              </Link>
              <Link to="/satellites" className={`${linkClass('/satellites')} block`}>
                Satellites
              </Link>
              <Link to="/launch-sites" className={`${linkClass('/launch-sites')} block`}>
                Launch Sites
              </Link>
              <Link to="/missions" className={`${linkClass('/missions')} block`}>
                Missions
              </Link>
              <Link to="/rankings" className={`${linkClass('/rankings')} block`}>
                Rankings
              </Link>
              <Link to="/analytics" className={`${linkClass('/analytics')} block`}>
                Analytics
              </Link>
              <div className="border-t border-white/10 dark:border-white/[0.06] my-2"></div>
              <Link to="/compare/countries" className={`${linkClass('/compare/countries')} block`}>
                Compare Countries
              </Link>
              <Link to="/compare/engines" className={`${linkClass('/compare/engines')} block`}>
                Compare Engines
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
