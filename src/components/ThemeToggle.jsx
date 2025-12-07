import { useTheme, THEMES } from '../contexts/ThemeContext';

/**
 * Simple theme toggle button
 */
export function ThemeToggleButton() {
  const { theme, toggleTheme, themePreference } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-700 transition text-gray-300 hover:text-white"
      aria-label={`Toggle theme (currently ${theme})`}
      title={`Theme: ${themePreference}`}
    >
      {theme === 'dark' ? (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )}
    </button>
  );
}

/**
 * Theme selector dropdown
 */
export function ThemeSelector() {
  const { themePreference, setTheme } = useTheme();

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-700 transition text-gray-300 hover:text-white"
        aria-label="Select theme"
      >
        <span>{THEMES[themePreference].icon}</span>
        <span className="text-sm">{THEMES[themePreference].name}</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div className="absolute right-0 top-full mt-1 bg-gray-800 rounded-lg shadow-xl py-2 min-w-[140px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        {Object.values(THEMES).map(theme => (
          <button
            key={theme.value}
            onClick={() => setTheme(theme.value)}
            className={`w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-700 transition ${
              themePreference === theme.value ? 'text-indigo-400' : 'text-gray-300'
            }`}
          >
            <span>{theme.icon}</span>
            <span className="text-sm">{theme.name}</span>
            {themePreference === theme.value && (
              <span className="ml-auto text-indigo-400">✓</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ThemeToggleButton;
