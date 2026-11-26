/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bakery: {
          page: '#F7F5F0',
          surface: '#FFFFFF',
          subtle: '#EFECE4',
          muted: '#E6E2D8',
          ink: '#161513',
          secondary: '#423F3B',
          textMuted: '#68635B',
          disabled: '#959088',
          border: '#E6E2D8',
          borderStrong: '#CBC5B8',
          charcoal: '#161513',
          charcoalHover: '#2C2A26',
          amber: '#D96B1B',
          amberHover: '#BD5A12',
          amberSoft: '#FDF1E6',
          amberInk: '#8A400B',
          success: '#16794C',
          error: '#C4281C',
        },
      },
      fontFamily: {
        display: ['Rubik', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        xs: '0 1px 2px rgba(22, 21, 19, 0.05)',
        sm: '0 6px 20px -4px rgba(22, 21, 19, 0.08)',
        sheet: '0 -8px 32px rgba(22, 21, 19, 0.14)',
      },
    },
  },
  plugins: [],
};
