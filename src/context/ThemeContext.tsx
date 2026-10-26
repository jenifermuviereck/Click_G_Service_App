import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = '@clickg_service_dark_mode';

const lightColors = {
  background: '#F8F9FA',
  surface: '#FFFFFF',
  text: '#1D2939',
  secondaryText: '#667085',
  border: '#EAECF0',
  brandGreen: '#07522C',
  brandLightGreen: '#E7F4EB',
};

const darkColors = {
  background: '#121212',
  surface: '#1E1E1E',
  text: '#FFFFFF',
  secondaryText: '#98A2B3',
  border: '#2C2C2C',
  brandGreen: '#07522C',
  brandLightGreen: '#0B381E',
};

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: (value: boolean) => void;
  colors: typeof lightColors;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);
        setIsDark(savedTheme === 'true');
      } catch (e) {
        console.warn('Could not load theme preference:', e);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async (value: boolean) => {
    setIsDark(value);
    try {
      await AsyncStorage.setItem(THEME_KEY, String(value));
    } catch (e) {
      console.warn('Could not save theme preference:', e);
    }
  };

  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used inside ThemeProvider');
  }
  return context;
};
