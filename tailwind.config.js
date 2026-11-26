/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bakery: {
          page: '#FFFDF8',
          surface: '#FFFFFF',
          subtle: '#F5F2EB',
          muted: '#EBE6DC',
          ink: '#141414',
          secondary: '#3F3D39',
          textMuted: '#666159',
          disabled: '#918C84',
          border: '#E5E2DC',
          borderStrong: '#CFC9BE',
          red: '#D9381E',
          redHover: '#B82B14',
          redSoft: '#FDEBE7',
          gold: '#E59A1C',
          goldSoft: '#FEF3DC',
          goldInk: '#7A4B00',
          success: '#15803D',
          error: '#C81E1E',
        },
      },
      fontFamily: {
        display: ['Rubik', 'system-ui', '-apple-system', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
