import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('taxigo_admin_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('taxigo_admin_token');
      const storedUser = localStorage.getItem('taxigo_admin_user');

      if (storedToken && storedUser) {
        try {
          setAdmin(JSON.parse(storedUser));
          setToken(storedToken);
          // Verify with backend
          const profile = await authApi.getMe();
          setAdmin(profile);
          localStorage.setItem('taxigo_admin_user', JSON.stringify(profile));
        } catch (error) {
          console.warn('Session expired or invalid:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    const data = await authApi.login({ username, password });
    localStorage.setItem('taxigo_admin_token', data.access_token);
    localStorage.setItem('taxigo_admin_user', JSON.stringify(data.admin));
    setToken(data.access_token);
    setAdmin(data.admin);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('taxigo_admin_token');
    localStorage.removeItem('taxigo_admin_user');
    setToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, token, isAuthenticated: !!token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
