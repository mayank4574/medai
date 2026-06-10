import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { updateAppearance } from '../services/api';
import toast from 'react-hot-toast';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const colors = {
  blue: { p: '#005a8d', h: '#004a75', l: '#0ea5e9' },
  purple: { p: '#7209b7', h: '#560bad', l: '#b5179e' },
  green: { p: '#06d6a0', h: '#05b88a', l: '#2d6a4f' },
  orange: { p: '#f77f00', h: '#d66c00', l: '#fcbf49' },
  red: { p: '#e63946', h: '#c1121f', l: '#ffb4a2' },
  gray: { p: '#475569', h: '#334155', l: '#94a3b8' }
};

export const ThemeProvider = ({ children }) => {
  const { settings, updateSettingsState } = useAuth();
  
  const [appearance, setAppearance] = useState({
    theme: 'light',
    accentColor: 'blue',
    fontSize: 'medium',
    layout: 'comfortable'
  });

  // Apply settings to document
  const applySettings = (config) => {
    const root = document.documentElement;

    // Theme
    let isDark = config.theme === 'dark';
    if (config.theme === 'system') {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    if (isDark) root.classList.add('dark');
    else root.classList.remove('dark');

    // Accent Color
    if (config.accentColor && colors[config.accentColor]) {
      const c = colors[config.accentColor];
      root.style.setProperty('--primary', c.p);
      root.style.setProperty('--primary-hover', c.h);
      root.style.setProperty('--primary-light', c.l);
    }

    // Layout
    if (config.layout === 'compact') root.style.setProperty('--spacing-scale', '0.2rem');
    else root.style.setProperty('--spacing-scale', '0.25rem');

    // Font Size
    if (config.fontSize === 'small') root.style.fontSize = '14px';
    else if (config.fontSize === 'large') root.style.fontSize = '18px';
    else root.style.fontSize = '16px';

    // Save to local storage for instant load next time
    localStorage.setItem('medscan_appearance', JSON.stringify(config));
  };

  // Sync with Auth Context settings (from MongoDB)
  useEffect(() => {
    if (settings?.appearance) {
      setAppearance(settings.appearance);
      applySettings(settings.appearance);
    }
  }, [settings]);

  // Handle system theme changes dynamically
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (appearance.theme === 'system') {
        const root = document.documentElement;
        if (e.matches) root.classList.add('dark');
        else root.classList.remove('dark');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [appearance.theme]);

  // Update Appearance Optimistically (Preview)
  const updateAppearancePreview = (updates) => {
    const newAppearance = { ...appearance, ...updates };
    setAppearance(newAppearance);
    applySettings(newAppearance); // Instant UI feedback
  };

  // Save to backend
  const saveAppearanceSettings = async () => {
    try {
      const res = await updateAppearance(appearance);
      updateSettingsState(res.data);
      toast.success('Appearance updated');
      return true;
    } catch (err) {
      // Revert on failure
      if (settings?.appearance) {
        setAppearance(settings.appearance);
        applySettings(settings.appearance);
      }
      toast.error('Failed to update appearance');
      return false;
    }
  };

  return (
    <ThemeContext.Provider value={{ appearance, updateAppearancePreview, saveAppearanceSettings }}>
      {children}
    </ThemeContext.Provider>
  );
};
