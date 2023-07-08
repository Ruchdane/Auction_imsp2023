"use client";
import React, { createContext, useReducer, useEffect, ReactNode } from "react";
import { themes } from "./themes";


// Define the initial state for the theme
interface State {
  className: string;
}

// Define the available actions
type Action = { type: "SET_THEME"; payload: string };

// Create the theme reducer
const themeReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_THEME":
      return { ...state, className: action.payload };
    default:
      return state;
  }
};

// Create the theme context
export const ThemeContext = createContext<{
  state: State;
  toggleTheme: (className: string) => void;
}>({
  state: { className: themes[0].className }, // Default theme
  toggleTheme: () => { },
});

interface ThemeProviderProps {
  children: ReactNode;
}
// Create the theme provider component
const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, { className: themes[0].className });

  useEffect(() => {
    // Retrieve the theme from localStorage if it exists
    const savedThemeClassName = localStorage.getItem("theme_class_name");
    if (savedThemeClassName) {
      dispatch({ type: "SET_THEME", payload: savedThemeClassName });
      document.body.className = savedThemeClassName;
    }
  }, []);

  useEffect(() => {
    // Save the theme to localStorage whenever it changes
    localStorage.setItem("theme_class_name", state.className);
    document.body.className = state.className;
  }, [state.className]);

  // Function to toggle the theme
  const toggleTheme = (className: string) => {
    dispatch({ type: "SET_THEME", payload: className });
  };

  // Provide the theme state and toggle function to the children components
  return (
    <ThemeContext.Provider value={{ state, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};


export default ThemeProvider;
