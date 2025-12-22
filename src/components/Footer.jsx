import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 py-8 mt-16">
      <div className="container mx-auto px-4">
        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/countries" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Countries</Link></li>
              <li><Link to="/engines" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Engines</Link></li>
              <li><Link to="/compare" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Compare</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Top Programs</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/countries/USA" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">United States</Link></li>
              <li><Link to="/countries/CHN" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">China</Link></li>
              <li><Link to="/countries/RUS" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">Russia</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Methodology</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-500 dark:text-gray-400">Space Capability Index (SCI)</li>
              <li className="text-gray-500 dark:text-gray-400">7 scoring categories</li>
              <li className="text-gray-500 dark:text-gray-400">Weighted composite score</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-3">About</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tracking global space development and comparing national space capabilities.
            </p>
          </div>
        </div>

        {/* Data Sources */}
        <div className="border-t border-gray-300 dark:border-gray-700 pt-8">
          <p className="text-sm leading-relaxed mb-4">
            <span className="font-semibold text-gray-800 dark:text-white">Data Sources:</span> Space program data is compiled from{' '}
            <a
              href="https://en.wikipedia.org/wiki/Comparison_of_orbital_rocket_engines"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition underline"
            >
              Wikipedia
            </a>,{' '}
            official space agency reports, and public databases. The Space Capability Index (SCI) is a composite score
            based on launch capability, propulsion technology, human spaceflight, deep space exploration, satellite
            infrastructure, ground infrastructure, and technological independence.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500">
              Last updated: December 2025 | Built with React & Tailwind CSS
            </p>
            <p className="text-xs text-gray-500">
              Space Capabilities Dashboard v2.0
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
