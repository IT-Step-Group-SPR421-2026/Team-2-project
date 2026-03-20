import { useMemo, useState } from 'react';
import { loginApi, registerApi, updateSubscriptionApi } from '../api/authApi';
import { ROLE, AUTH_STORAGE_KEY } from '../constants';
import { normalizeUserEntity } from '../utils/helper';
import { AuthContext } from './authContext';

function getStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    return normalizeUserEntity(parsed);
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
        const nextUser = normalizeUserEntity(response.user);
        setUser(nextUser);
        persistUser(nextUser);
        return response;
      },
      async register({ name, email, password }) {
        const registerResponse = await registerApi({ name, email, password, role: ROLE.USER });
        const nextUser = normalizeUserEntity(registerResponse.user);
        setUser(nextUser);
        persistUser(nextUser);
        return registerResponse;
      },
      async updateSubscription({ subscriptionStatus }) {
        if (!user?.id) {
          throw new Error('User is not authenticated.');
        }

        const response = await updateSubscriptionApi({
          userId: user.id,
          subscriptionStatus,
        });
        const nextUser = normalizeUserEntity(response.user);
        setUser(nextUser);
        persistUser(nextUser);
        return response;
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
