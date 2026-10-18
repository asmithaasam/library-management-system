import { createContext, useContext, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('library_user') || 'null');
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => sessionStorage.getItem('library_token'));

  const login = async (credentials) => {
    const r = await api.post('/auth/login', credentials);
    setUser(r.data.user);
    setToken(r.data.token);
    sessionStorage.setItem('library_user', JSON.stringify(r.data.user));
    sessionStorage.setItem('library_token', r.data.token);
    return r.data.user;
  };

  const register = async (userData) => {
    const r = await api.post('/auth/register', userData);
    setUser(r.data.user);
    setToken(r.data.token);
    sessionStorage.setItem('library_user', JSON.stringify(r.data.user));
    sessionStorage.setItem('library_token', r.data.token);
    return r.data.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    sessionStorage.removeItem('library_user');
    sessionStorage.removeItem('library_token');
  };

  const value = useMemo(() => ({ user, token, login, register, logout }), [user, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
