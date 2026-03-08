/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#030712',
        accent: '#00FFB2',
        secondary: '#FF6B35',
        'text-main': '#E8EDF5',
        muted: '#3A4A5C',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        mono: ['"DM Mono"', 'monospace'],
        label: ['"Bebas Neue"', 'sans-serif'],
      },
      backdropBlur: {
        glass: '20px',
      },
    },
  },
  plugins: [],
};
