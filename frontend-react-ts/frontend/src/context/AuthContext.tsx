import { useState, useCallback, type ReactNode } from 'react';
import { AuthContext } from './auth.context';
import { apiClient } from '../services/apiClient';

const TOKEN_KEY = 'admin_token';

function getStoredToken(): string | null {
  if (typeof localStorage === 'undefined' || typeof localStorage.getItem !== 'function') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(getStoredToken()));

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await apiClient.post<{ token: string }>('/admin/login', { email, password });
    if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
      localStorage.setItem(TOKEN_KEY, data.token);
    }
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    if (typeof localStorage !== 'undefined' && typeof localStorage.removeItem === 'function') {
      localStorage.removeItem(TOKEN_KEY);
    }
    setIsAuthenticated(false);
  }, []);

  return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>;
}
