// tailwind.config.js
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        fill: 'fillAnimation 2s ease-in-out forwards',
      },
      keyframes: {
        fillAnimation: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
    },
  },
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Adjust paths to match your project structure
  ],
  theme: {
    extend: {},  // You can extend the default theme here
  },
  plugins: [],
});
