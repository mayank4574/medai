import { createContext, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const { settings } = useAuth();
  
  useEffect(() => {
    const root = document.documentElement;
    const appearance = settings?.appearance;

    if (!appearance) return;

    // Handle Theme (dark/light)
    if (appearance.theme === 'dark' || (appearance.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Handle Accent Color via CSS variables
    // For Tailwind, we would define custom variables in index.css like `--color-primary`
    const accentMap = {
      blue: '#005a8d',
      green: '#10b981',
      orange: '#f97316',
      purple: '#8b5cf6',
      red: '#ef4444'
    };
    if (appearance.accentColor && accentMap[appearance.accentColor]) {
      root.style.setProperty('--color-primary', accentMap[appearance.accentColor]);
    }

    // Handle Font Size
    const fontSizes = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    if (appearance.fontSize && fontSizes[appearance.fontSize]) {
      root.style.fontSize = fontSizes[appearance.fontSize];
    }

    // Handle Layout
    if (appearance.layout === 'compact') {
      root.classList.add('layout-compact');
    } else {
      root.classList.remove('layout-compact');
    }

  }, [settings?.appearance]);

  return (
    <ThemeContext.Provider value={{}}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
