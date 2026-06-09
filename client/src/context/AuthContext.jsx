import { createContext, useContext, useState, useEffect } from 'react';
import { getSettings } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await getSettings();
      setSettings(res.data);
    } catch (err) {
      console.error('Failed to load settings', err);
    }
  };

  useEffect(() => {
    // Check both possible storage keys for backwards compatibility
    const stored = localStorage.getItem('sahi_user') || localStorage.getItem('medscanai_user');
    if (stored) {
      try { 
        setUser(JSON.parse(stored)); 
      } catch { 
        localStorage.removeItem('sahi_user'); 
        localStorage.removeItem('medscanai_user'); 
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      fetchSettings();
    } else {
      setSettings(null);
    }
  }, [user]);

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('sahi_user', JSON.stringify(userData));
  };

  const updateSettingsState = (newSettings) => {
    setSettings(newSettings);
  };

  const logout = () => {
    setUser(null);
    setSettings(null);
    localStorage.removeItem('sahi_user');
    localStorage.removeItem('medscanai_user');
  };

  return (
    <AuthContext.Provider value={{ user, settings, loading, loginUser, logout, updateSettingsState }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
