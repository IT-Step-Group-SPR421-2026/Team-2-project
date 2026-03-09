import { createContext, useContext, useMemo, useState } from 'react';
import { loginApi, registerApi } from '../api/authApi';

const AUTH_STORAGE_KEY = 'testflow_auth_user';

const AuthContext = createContext(null);

function getStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!parsed?.name) {
      return null;
    }
    console.log(parsed)
    return parsed;
  } catch {
    return null;
  }
}

function persistUser(user) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user?.name),
      async login({ name, password }) {
        const response = await loginApi({ name, password });
        const nextUser = { name, email: '' };
        setUser(nextUser);
        persistUser(nextUser);
        return response;
      },
      async register({ name, email, password }) {
        const registerResponse = await registerApi({ name, email, password, role: 0 });
        await loginApi({ name, password });
        const nextUser = { name, email };
        setUser(nextUser);
        persistUser(nextUser);
        return registerResponse;
      },
      logout() {
        setUser(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return ctx;
}
