/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    screens: {
      xs: '360px',
      sm: '390px',
      md: '414px',
      lg: '480px',
      tablet: '768px',
    },
    extend: {
      colors: {
        brand: {
          green: '#07522C',
          lightGreen: '#E8F5E9',
          darkGreen: '#04381E',
          accent: '#0A5C36',
          bg: '#F9FAFB',
          border: '#E4E7EC',
          muted: '#667085',
          text: '#101828',
          danger: '#EF4444',
          warning: '#F59E0B',
          surface: '#FFFFFF',
        },
      },
    },
  },
  plugins: [],
};

