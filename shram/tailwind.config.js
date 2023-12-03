/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./<custom-folder>/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
