/**
 * Theme Context
 * 
 * Manages dark/light theme across the application
 * Syncs with user preferences from settings
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {}
});

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const { settings } = useSelector((state) => state.settings);
  const [theme, setThemeState] = useState('light');

  // Initialize theme from localStorage or settings
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const preferredTheme = settings?.preferences?.theme || savedTheme || 'light';
    setThemeState(preferredTheme);
    applyTheme(preferredTheme);
  }, []);

  // Sync with Redux settings
  useEffect(() => {
    if (settings?.preferences?.theme) {
      setThemeState(settings.preferences.theme);
      applyTheme(settings.preferences.theme);
    }
  }, [settings?.preferences?.theme]);

  const applyTheme = (newTheme) => {
    const root = window.document.documentElement;
    
    if (newTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    localStorage.setItem('theme', newTheme);
  };

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const value = {
    theme,
    toggleTheme,
    setTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
