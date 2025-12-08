import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { LightMode, DarkMode, Computer } from '@mui/icons-material';

const ThemeContext = createContext(null);

/**
 * Theme options
 */
export const THEMES = {
  light: {
    name: 'Light',
    icon: 'light-mode',
    IconComponent: LightMode,
    value: 'light',
  },
  dark: {
    name: 'Dark',
    icon: 'dark-mode',
    IconComponent: DarkMode,
    value: 'dark',
  },
  system: {
    name: 'System',
    icon: 'computer',
    IconComponent: Computer,
    value: 'system',
  },
};

/**
 * Get system preference
 */
function getSystemTheme() {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

/**
 * Theme Provider Component
 */
export function ThemeProvider({ children }) {
  // Get initial theme from localStorage or default to dark
  const [themePreference, setThemePreference] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme-preference');
      return stored || 'dark';
    }
    return 'dark';
  });

  // Resolved theme (actual light/dark value)
  const [resolvedTheme, setResolvedTheme] = useState(() => {
    if (themePreference === 'system') {
      return getSystemTheme();
    }
    return themePreference;
  });

  // Update resolved theme when preference changes
  useEffect(() => {
    if (themePreference === 'system') {
      setResolvedTheme(getSystemTheme());
    } else {
      setResolvedTheme(themePreference);
    }
  }, [themePreference]);

  // Listen for system preference changes
  useEffect(() => {
    if (themePreference !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setResolvedTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themePreference]);

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;

    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [resolvedTheme]);

  // Save preference to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme-preference', themePreference);
    }
  }, [themePreference]);

  // Set theme
  const setTheme = useCallback((theme) => {
    if (THEMES[theme]) {
      setThemePreference(theme);
    }
  }, []);

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    setThemePreference(prev => {
      if (prev === 'dark') return 'light';
      if (prev === 'light') return 'dark';
      // If system, toggle to opposite of current resolved theme
      return resolvedTheme === 'dark' ? 'light' : 'dark';
    });
  }, [resolvedTheme]);

  // Cycle through themes
  const cycleTheme = useCallback(() => {
    setThemePreference(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  }, []);

  const value = {
    theme: resolvedTheme,
    themePreference,
    setTheme,
    toggleTheme,
    cycleTheme,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
    isSystem: themePreference === 'system',
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Theme hook
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext;
