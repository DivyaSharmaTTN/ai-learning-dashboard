/**
 * @branch feature/stretch-auth-rbac
 * @history 2026-07-09 — JWT auth context with login/logout and role helpers
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { authApi } from '../api/auth';
import {
  clearStoredAuth,
  loadStoredAuth,
  saveStoredAuth,
  setAuthTokenGetter,
  setOnUnauthorized,
  type StoredAuth,
} from '../api/client';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isUser: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<StoredAuth | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    clearStoredAuth();
    setAuth(null);
  }, []);

  useEffect(() => {
    setAuth(loadStoredAuth());
    setLoading(false);
  }, []);

  useEffect(() => {
    setAuthTokenGetter(() => auth?.token ?? null);
    setOnUnauthorized(() => logout());
  }, [auth, logout]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    const stored: StoredAuth = {
      token: response.token,
      expiresAt: response.expiresAt,
      user: response.user,
    };
    saveStoredAuth(stored);
    setAuth(stored);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: auth?.user ?? null,
      token: auth?.token ?? null,
      isAuthenticated: Boolean(auth?.token),
      isAdmin: auth?.user.role === 'Admin',
      isUser: auth?.user.role === 'User',
      loading,
      login,
      logout,
    }),
    [auth, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
