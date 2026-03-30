import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);
const TOKEN_KEY = 'elearning_token';
const USER_KEY = 'elearning_user';

function decodeJwt(token) {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(normalized));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return decodeJwt(localStorage.getItem(TOKEN_KEY) || '');
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      const nextUser = user || decodeJwt(token);
      if (nextUser) {
        localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
      }
    } else {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setUser(null);
    }
  }, [token, user]);

  const value = useMemo(() => ({
    token,
    user,
    isAuthenticated: Boolean(token),
    login: ({ token: nextToken, user: nextUser }) => {
      setToken(nextToken.trim());
      setUser(nextUser || decodeJwt(nextToken));
    },
    logout: () => {
      setToken('');
      setUser(null);
    }
  }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
