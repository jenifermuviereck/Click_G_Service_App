/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#07522C',
          lightGreen: '#E8F5E9',
          darkGreen: '#04381E',
          accent: '#0A5C36',
          bg: '#F9FAFB',
        },
      },
    },
  },
  plugins: [],
};
