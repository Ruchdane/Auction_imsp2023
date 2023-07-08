import themeSwapper from "tailwindcss-theme-swapper";
import { orange,green, yellow, sky, slate, gray, white, black, red, purple } from "tailwindcss/colors";
const lightTheme = {
  backgroundColor: {
    main: green[500],
    primary: yellow[200],
    secondary: yellow[400],
    accent: green[600],
    muted: yellow[200],
    contrast: red[900],
    input: yellow[400],
  },
  textColor: {
    tooltip: black,
    main: green[700],
    primary: green[500],
    secondary: red[900],
    accent: red[900],
    tertiary: yellow[50],
    muted: red[900],
    contrast: yellow[200],
  },
  borderColor: {
    main: green[500],
    tab: green[500],
    active: red[700],
    inactive: yellow[200],
  },
  ringColor: {
    DEFAULT: green[400],
  },
  boxShadowColor:{
    DEFAULT: orange[700]
  },
};

const darkTheme = {
  backgroundColor: {
    main: red[900],
    primary: red[900],
    secondary: green[600],
    accent: yellow[200],
    muted: green[600],
    contrast: yellow[200],
    input: green[600],
  },
  textColor: {
    tooltip: black,
    
    main: red[900],
    primary: yellow[400],
    secondary: yellow[200],
    accent: yellow[200],
    tertiary: red[900],
    muted: yellow[200],
    contrast: red[900],
  },
  boxShadowColor:{
    DEFAULT: orange[300]
  },
  borderColor: {
    main: red[900],
    tab: yellow[400],
    active: yellow[200],
    inactive: red[900],
  },
  ringColor: {
    DEFAULT: yellow[400],
  },
};
const africanTheme = {
  backgroundColor: {
    main: "#2E7D32",      // Dark green
    primary: "#FDD835",   // Yellow
    secondary: "#FFA000", // Orange
    accent: "#FF5722",    // Deep orange
    muted: "#9E9E9E",     // Gray
    contrast: "#000000",  // Black
    input: "#FFFFFF",     // White
  },
  textColor: {
    tooltip: black,
    
    main: "#FFFFFF",      // White
    primary: "#FDD835",   // Yellow
    secondary: "#FFA000", // Orange
    accent: "#FFA000",    // Orange
    tertiary: "#000000",  // Black
    muted: "#FDD835",     // Yellow
    contrast: "#FFFFFF",  // White
  },
  borderColor: {
    main: "#2E7D32",      // Dark green
    tab: "#FDD835",       // Yellow
    active: "#FFA000",    // Orange
    inactive: "#000000",  // Black
  },
  ringColor: {
    DEFAULT: "#FDD835",   // Yellow
  },
  boxShadowColor: {
    DEFAULT: "#FF5722",   // Deep orange
  },
};

const beninTheme = {
  backgroundColor: {
    main: "#FCD116",      // Yellow
    primary: "#CE1126",   // Red
    secondary: "#009E60", // Green
    accent: "#CE1126",    // Red
    muted: "#CCCCCC",     // Light gray
    contrast: "#000000",  // Black
    input: "#FFFFFF",     // White
  },
  textColor: {
    tooltip: black,
    
    main: "#000000",      // Black
    primary: "#CE1126",   // Red
    secondary: "#009E60", // Green
    accent: "#009E60",    // Green
    tertiary: "#FFFFFF",  // White
    muted: "#CE1126",     // Red
    contrast: "#000000",  // Black
  },
  borderColor: {
    main: "#CE1126",      // Red
    tab: "#CE1126",       // Red
    active: "#009E60",    // Green
    inactive: "#000000",  // Black
  },
  ringColor: {
    DEFAULT: "#FCD116",   // Yellow
  },
  boxShadowColor: {
    DEFAULT: "#CE1126",   // Red
  },
};

/** @type {import('tailwindcss').Config} */
export const darkMode = "class";
export const content = [
  "./index.html",
  "./ui/**/*.{ts,tsx}",
  "./feature/**/*.{ts,tsx}",
  "./layout/**/*.{ts,tsx}",
  "./demo/**/*.{ts,tsx}",
  "./form/**/*.{ts,tsx}",
  "./src/**/*.{ts,tsx}",
];
export const theme = {
  extend: {
    backgroundImage: {
      "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      "gradient-conic":
        "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
    },
    animation: {
      "spin-slow": "spin 3s linear infinite",
    },
  },
};
export const plugins = [
  require("tailwindcss-animate"),
  require("tailwindcss-radix")(),
  themeSwapper({
    themes: [
      {
        name: "base",
        selectors: [".light"],
        mediaQuery: "@media (prefers-color-scheme: light)",
        theme: lightTheme,
      },
      {
        name: "african",
        selectors: [".african"],
        theme: africanTheme,
      },
      {
        name: "benin",
        selectors: [".benin"],
        theme: beninTheme,
      },
      {
        name: "dark",
        selectors: [".dark"],
        mediaQuery: "@media (prefers-color-scheme: dark)",
        theme: darkTheme,
      },
    ],
  }),
];
