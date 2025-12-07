/**
 * Skip Links component for keyboard accessibility
 * Allows users to skip to main content or navigation
 */
export default function SkipLinks() {
  return (
    <div className="skip-links">
      <a
        href="#main-content"
        className="
          sr-only focus:not-sr-only
          fixed top-0 left-0 z-[100]
          bg-indigo-600 text-white
          px-4 py-2 m-2 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-indigo-400
          transform -translate-y-full focus:translate-y-0
          transition-transform
        "
      >
        Skip to main content
      </a>
      <a
        href="#main-navigation"
        className="
          sr-only focus:not-sr-only
          fixed top-0 left-40 z-[100]
          bg-indigo-600 text-white
          px-4 py-2 m-2 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-indigo-400
          transform -translate-y-full focus:translate-y-0
          transition-transform
        "
      >
        Skip to navigation
      </a>
    </div>
  );
}

/**
 * Screen reader only utility class
 * Add this to index.css or App.css
 *
 * .sr-only {
 *   position: absolute;
 *   width: 1px;
 *   height: 1px;
 *   padding: 0;
 *   margin: -1px;
 *   overflow: hidden;
 *   clip: rect(0, 0, 0, 0);
 *   white-space: nowrap;
 *   border-width: 0;
 * }
 *
 * .sr-only:focus,
 * .not-sr-only {
 *   position: static;
 *   width: auto;
 *   height: auto;
 *   padding: inherit;
 *   margin: inherit;
 *   overflow: visible;
 *   clip: auto;
 *   white-space: normal;
 * }
 */
