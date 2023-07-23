import themeSwapper from "tailwindcss-theme-swapper";
import {
  orange,
  green,
  yellow,
  black,
  red,
  lime,
  emerald,
  neutral,
} from "tailwindcss/colors";
const lightTheme = {
  backgroundColor: {
    DEFAULT: "#f6e9e4",
    primary: "#d8572a",
    secondary: lime[100],
    accent: emerald[100],
    muted: orange[100],

    input: neutral[100],
    contrast: red[900],
  },
  textColor: {
    DEFAULT: "#0f0805",
    primary: "#0f0805",
    secondary: "#0f0805",
    accent: "#0f0805",
    muted: red[900],

    tooltip: black,
    contrast: yellow[200],
  },
  borderColor: {
    DEFAULT: green[500],
    tab: green[500],
    active: red[700],
    inactive: yellow[200],
  },
  ringColor: {
    DEFAULT: green[400],
  },
  boxShadowColor: {
    DEFAULT: orange[700],
  },
};

const darkTheme = {
  backgroundColor: {
    DEFAULT: "#050505",
    primary: "#d8572a",
    secondary: "#061b23",
    accent: "#70f5d6",
    muted: "#D88D72",

    input: neutral[900],
    contrast: yellow[200],
  },
  textColor: {
    DEFAULT: "fafafa",
    primary: "fafafa",
    secondary: "fafafa",
    accent: "fafafa",
    tertiary: "fafafa",
    muted: "fafafa",

    tooltip: black,
    contrast: red[900],
  },
  boxShadowColor: {
    DEFAULT: orange[300],
  },
  borderColor: {
    DEFAULT: red[900],
    tab: yellow[400],
    active: yellow[200],
    inactive: red[900],
  },
  ringColor: {
    DEFAULT: yellow[400],
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
        name: "dark",
        selectors: [".dark"],
        mediaQuery: "@media (prefers-color-scheme: dark)",
        theme: darkTheme,
      },
    ],
  }),
];
