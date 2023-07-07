"use client";
import React, { createContext, useReducer, useEffect, ReactNode } from "react";

// Define the theme enum
export enum Theme {
  Light = "light",
  Dark = "dark",
  System = "system",
}

// Define the initial state for the theme
interface State {
  theme: Theme;
}

// Define the available actions
type Action = { type: "SET_THEME"; payload: Theme };

// Create the theme reducer
const themeReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_THEME":
      return { ...state, theme: action.payload };
    default:
      return state;
  }
};

// Create the theme context
export const ThemeContext = createContext<{
  state: State;
  toggleTheme: (theme: Theme) => void;
}>({
  state: { theme: Theme.Light }, // Default theme
  toggleTheme: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}
// Create the theme provider component
const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, { theme: Theme.Light });

  useEffect(() => {
    // Retrieve the theme from localStorage if it exists
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && Object.values(Theme).includes(savedTheme as Theme)) {
      dispatch({ type: "SET_THEME", payload: savedTheme as Theme });
      document.body.className = themeClassName(state.theme);
    }
  }, []);

  useEffect(() => {
    // Save the theme to localStorage whenever it changes
    localStorage.setItem("theme", state.theme);
    document.body.className = themeClassName(state.theme);
  }, [state.theme]);

  // Function to toggle the theme
  const toggleTheme = (theme: Theme) => {
    dispatch({ type: "SET_THEME", payload: theme });
  };

  // Provide the theme state and toggle function to the children components
  return (
    <ThemeContext.Provider value={{ state, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function themeClassName(theme: Theme): "light" | "dark" | "" {
  switch (theme) {
    case Theme.Light:
      return "light";
    case Theme.Dark:
      return "dark";
    case Theme.System:
      return "";
  }
}

export default ThemeProvider;
