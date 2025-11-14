import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createApiClient } from '@/lib/api';

type User = { id: string; email: string; name: string; avatarUrl?: string | null; preferences?: any };

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, preferences?: any) => Promise<void>;
  logout: () => void;
  ready: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth:token'));
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  const api = useMemo(() => createApiClient({ token }), [token]);

  useEffect(() => {
    if (!token) { setReady(true); return; }
    api.get<{ user: User }>(`/api/auth/me`).then((r) => setUser(r.user)).catch(() => setToken(null)).finally(() => setReady(true));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = useCallback(async (email: string, password: string) => {
    const r = await api.post<{ token: string; user: User }>(`/api/auth/login`, { email, password });
    setToken(r.token); localStorage.setItem('auth:token', r.token); setUser(r.user);
  }, [api]);

  const signup = useCallback(async (name: string, email: string, password: string, preferences?: any) => {
    const r = await api.post<{ token: string; user: User }>(`/api/auth/signup`, { name, email, password, preferences });
    setToken(r.token); localStorage.setItem('auth:token', r.token); setUser(r.user);
  }, [api]);

  const logout = useCallback(() => { setUser(null); setToken(null); localStorage.removeItem('auth:token'); }, []);

  const value = useMemo(() => ({ user, token, login, signup, logout, ready }), [user, token, login, signup, logout, ready]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


