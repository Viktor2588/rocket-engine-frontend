/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Glass colors with alpha transparency
        glass: {
          light: 'rgba(255, 255, 255, 0.72)',
          lighter: 'rgba(255, 255, 255, 0.85)',
          heavy: 'rgba(255, 255, 255, 0.90)',
          dark: 'rgba(28, 28, 30, 0.72)',
          'dark-lighter': 'rgba(28, 28, 30, 0.85)',
          'dark-heavy': 'rgba(28, 28, 30, 0.90)',
          border: 'rgba(255, 255, 255, 0.18)',
          'border-dark': 'rgba(255, 255, 255, 0.08)',
        },
        // Vibrant accent tints for glass overlays
        vibrant: {
          indigo: 'rgba(99, 102, 241, 0.12)',
          blue: 'rgba(59, 130, 246, 0.12)',
          purple: 'rgba(139, 92, 246, 0.12)',
          pink: 'rgba(236, 72, 153, 0.12)',
          green: 'rgba(34, 197, 94, 0.12)',
          yellow: 'rgba(234, 179, 8, 0.12)',
          orange: 'rgba(249, 115, 22, 0.12)',
          red: 'rgba(239, 68, 68, 0.12)',
          cyan: 'rgba(6, 182, 212, 0.12)',
          teal: 'rgba(20, 184, 166, 0.12)',
        },
      },
      backdropBlur: {
        glass: '20px',
        'glass-heavy': '40px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        'glass-lg': '0 16px 48px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
        'glass-inset': 'inset 0 2px 8px rgba(0, 0, 0, 0.06)',
        'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'glass-dark-lg': '0 16px 48px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'glass-float': '0 12px 40px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
        'glass-float-dark': '0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
      borderRadius: {
        'glass': '16px',
        'glass-sm': '12px',
        'glass-lg': '20px',
        'glass-xl': '24px',
      },
      transitionTimingFunction: {
        'apple': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'apple-bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },
      animation: {
        'glass-in': 'glassIn 0.4s cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
        'glass-float': 'glassFloat 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        glassIn: {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        glassFloat: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
