/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{tsx,ts,jsx,js}", "./components/**/*.{tsx,ts}"],
  presets: [require("nativewind/preset")],
  theme: {},
  darkMode: "class",
};
