/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Official Surya Stores Light Blue Palette (Banner based)
        surya: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Official Surya Stores Crimson Red Palette (Banner text based)
        suryared: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        darkslate: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#090d16',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'surya': '0 4px 16px -2px rgba(2, 132, 199, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'surya-hover': '0 12px 28px -4px rgba(2, 132, 199, 0.16), 0 4px 10px -2px rgba(220, 38, 38, 0.08)',
        'red-glow': '0 4px 20px -2px rgba(220, 38, 38, 0.25)',
      }
    },
  },
  plugins: [],
}
