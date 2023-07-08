import themeSwapper from "tailwindcss-theme-swapper";
const lightTheme = {
  colors: {
    primary: "hsla(222.2,47.4%,11.2%,1)", // sky-900
    secondary: "hsla(210,40%,96.1%,1)", // sky-100
    accent: slate[300], // sky-100
    destructive: red[400], // red-600
    border: "hsla(214.3,31.8%,91.4%,1)", // sky-200
    input: sky[300], // sky-200
    ring: "hsla(215,20.2%,65.1%,1)", // sky-400
    shadow: gray[300]
  },
  backgroundColor: {
    primary: "hsla(210,40%,96.1%,1)", // sky-100
    main: "hsla(210,40%,96.1%,1)", // sky-100
    secondary: "hsla(0,0%,100%,1)", // white
    tertiary: "hsla(0,0%,100%,1)", // white
    muted: "hsla(210,40%,96.1%,1)", // sky-100
    contrast: black,
  },
  textColor: {
    main: "hsla(222.2,47.4%,11.2%,1)", // sky-500 (text-muted)
    secondary: "hsla(222.2,47.4%,11.2%,1)", // sky-900 (text-popover and text-card)
    accent: "hsla(222.2,47.4%,11.2%,1)", // sky-900 (text-popover and text-card)
    tertiary: "hsla(210,40%,98%,1)", // sky-50 (text-primary)
    muted: "hsla(222.2,47.4%,11.2%,1)", // sky-900 (text-accent)
    contrast: white,
  },
  borderColor: {
    tab: gray[300],
    active: gray[700],
    inactive: gray[50],
  },
};

const darkTheme = {
  colors: {
    primary: "hsla(213,31%,91%,1)", // slate-200
    secondary: "hsla(210,40%,96.1%,1)", // sky-100
    accent: "hsla(216,34%,17%,1)", // slate-800
    destructive: red[900], // Custom dark destructive color
    border: slate[800], // slate-800
    input: "hsla(216,34%,17%,1)", // slate-800
    ring: "hsla(216,34%,17%,1)", // slate-800
    shadow: gray[700]
  },
  backgroundColor: {
    primary: "hsla(224,71%,4%,1)", // black (background)
    main: "hsla(224,71%,4%,1)", // black (background)
    secondary: "hsla(223,47%,11%,1)", // slate-800 (bg-muted)
    tertiary: "hsla(224,71%,4%,1)", // black (bg-popover and bg-card)
    muted: "hsla(216,34%,17%,1)", // slate-800 (border and input)
    contrast: white,
  },
  textColor: {
    main: "hsla(213,31%,91%,1)", // slate-400 (text-muted)
    secondary: "hsla(210,40%,98%,1)", // slate-50 (text-secondary)
    accent: "hsla(210,40%,98%,1)", // slate-50 (text-secondary)
    tertiary: "hsla(222.2,47.4%,1.2%,1)", // black (text-primary)
    muted: "hsla(210,40%,98%,1)", // slate-50 (text-accent)
    contrast: black,
  },
  borderColor: {
    tab: gray[600],
    active: gray[100],
    inactive: white,
  }
};

/** @type {import('tailwindcss').Config} */
export const darkMode = "class";
export const content = ["./index.html", "./ui/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"];
export const theme = {
  extend: {
    backgroundImage: {
      "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
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
