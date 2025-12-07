import { Link, useLocation } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();

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
          <Link to="/compare" className={linkClass('/compare')}>
            Compare
          </Link>
        </div>
      </div>
    </nav>
  );
}
