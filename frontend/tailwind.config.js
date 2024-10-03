// tailwind.config.js
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",  // Adjust paths to match your project structure
  ],
  theme: {
    extend: {},  // You can extend the default theme here
  },
  plugins: [],
});
