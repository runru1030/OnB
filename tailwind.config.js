/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      blue: {
        DEFAULT: "#3D91FF",
        200: "#DFEDFF",
        300: "#73B0FF",
        400: "#3D91FF",
        500: "#2373DD",
      },
      red: {
        DEFAULT: "#FF3F3F",
        50: "#FFF8F7",
        100: "#FBE9E8",
        200: "#F6CBC8",
        300: "#FE9797",
        400: "#E6766D",
        500: "#DF4C42",
        600: "#FF3F3F",
        700: "#B81F14",
        800: "#991A11",
        900: "#7B150E",
      },
      grey: {
        DEFAULT: "#434343",
        0: "#F3F3F3",
        50: "#ECECEC",
        100: "#C5C5C5",
        200: "#A9A9A9",
        300: "#818181",
        400: "#696969",
        500: "#434343",
        600: "#3D3D3D",
        700: "#303030",
        800: "#252525",
        900: "#1C1C1C",
        light: {
          50: "#FEFEFE",
          100: "#FDFCFB",
          200: "#FBFAF9",
          300: "#F6F7F9",
          400: "#EFF2F7",
          500: "#F7F5F1",
          600: "#E1DFDB",
          700: "#AFAEAB",
          800: "#888785",
          900: "#686765",
        },
      },
      white: { DEFAULT: "#FFFFFF" },
      black: { DEFAULT: "#000000" },
      transparent: "#00000000",
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        normal: "2px 2px 8px 0px rgba(0,0,0,0.05)",
      },
    },
  },
  plugins: [],
};
