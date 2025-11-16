import { Link } from 'react-router-dom';

export default function Navigation() {
  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          <span>🚀</span>
          Rocket Engines
        </Link>
        <div className="flex gap-6">
          <Link to="/" className="hover:text-blue-400 transition">
            Engines
          </Link>
          <Link to="/compare" className="hover:text-blue-400 transition">
            Compare
          </Link>
        </div>
      </div>
    </nav>
  );
}
