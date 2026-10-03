import { useState, useCallback, type ReactNode } from 'react';
import { AuthContext } from './auth.context';
import { apiClient } from '../services/apiClient';
import type { ApiError } from '../types/api.types';

const TOKEN_KEY = 'admin_token';

function getStoredToken(): string | null {
  if (typeof localStorage === 'undefined' || typeof localStorage.getItem !== 'function') return null;
  return localStorage.getItem(TOKEN_KEY);
}

function clearStoredToken(): void {
  if (typeof localStorage !== 'undefined' && typeof localStorage.removeItem === 'function') {
    localStorage.removeItem(TOKEN_KEY);
  }
}

function storeToken(token: string): void {
  if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

function getAuthFailureMessage(error: unknown, fallback: string): string {
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as ApiError).message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  return fallback;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(getStoredToken()));

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { data } = await apiClient.post<{ token: string }>('/admin/login', { email, password });
      if (!data?.token) {
        throw new Error('Login succeeded but no authentication token was returned.');
      }
      storeToken(data.token);
      setIsAuthenticated(true);
    } catch (error) {
      clearStoredToken();
      setIsAuthenticated(false);
      throw new Error(getAuthFailureMessage(error, 'Unable to sign in.'));
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (getStoredToken()) {
        await apiClient.post('/admin/logout');
      }
    } catch {
      // Always clear local auth even if the server token is already invalid.
    } finally {
      clearStoredToken();
      setIsAuthenticated(false);
    }
  }, []);

  const clearSession = useCallback(() => {
    clearStoredToken();
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, clearSession }}>
      {children}
    </AuthContext.Provider>
  );
}
