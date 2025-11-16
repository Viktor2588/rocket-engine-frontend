export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="border-t border-gray-700 pt-8">
          <p className="text-sm leading-relaxed mb-4">
            <span className="font-semibold text-white">Data Source:</span> The rocket engine data and specifications displayed in this application are sourced from{' '}
            <a
              href="https://en.wikipedia.org/wiki/Comparison_of_orbital_rocket_engines"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition underline"
            >
              Wikipedia's Comparison of Orbital Rocket Engines
            </a>{' '}
            article. This comprehensive resource provides detailed technical specifications and performance metrics for various rocket engines used in orbital missions.
          </p>
          <p className="text-xs text-gray-500">
            Last updated: October 2025 | Build with React & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
