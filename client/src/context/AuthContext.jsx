import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check both possible storage keys for backwards compatibility
    const stored = localStorage.getItem('sahi_user') || localStorage.getItem('medscanai_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { 
        localStorage.removeItem('sahi_user'); 
        localStorage.removeItem('medscanai_user'); 
      }
    }
    setLoading(false);
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('sahi_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sahi_user');
    localStorage.removeItem('medscanai_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
