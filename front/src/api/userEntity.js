const ROLE = Object.freeze({
  USER: 0,
  ADMIN: 1,
});

const SUBSCRIPTION_STATUS = Object.freeze({
  STANDARD: 0,
  PREMIUM: 1,
});

function pickField(source, keys) {
  for (const key of keys) {
    const value = source?.[key];
    if (value !== undefined && value !== null) {
      return value;
    }
  }

  return undefined;
}

function normalizeRole(value) {
  if (typeof value === 'number') {
    if (value === ROLE.ADMIN || value === ROLE.USER) {
      return value;
    }
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === '1') {
      return ROLE.ADMIN;
    }
    if (normalized === '0') {
      return ROLE.USER;
    }
    if (normalized === 'admin') {
      return ROLE.ADMIN;
    }
    if (normalized === 'user') {
      return ROLE.USER;
    }
  }

  return null;
}

function normalizeSubscriptionStatus(value) {
  if (typeof value === 'number') {
    if (value === SUBSCRIPTION_STATUS.PREMIUM) {
      return SUBSCRIPTION_STATUS.PREMIUM;
    }
    if (value === SUBSCRIPTION_STATUS.STANDARD) {
      return SUBSCRIPTION_STATUS.STANDARD;
    }
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized === '1') {
      return SUBSCRIPTION_STATUS.PREMIUM;
    }
    if (normalized === '0') {
      return SUBSCRIPTION_STATUS.STANDARD;
    }
    if (normalized === 'premium') {
      return SUBSCRIPTION_STATUS.PREMIUM;
    }
    if (normalized === 'standard' || normalized === 'standart') {
      return SUBSCRIPTION_STATUS.STANDARD;
    }
  }

  return null;
}

function normalizeTestLimit(value) {
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return null;
  }

  const normalized = Math.floor(numericValue);
  return normalized > 0 ? normalized : null;
}

export function normalizeUserEntity(rawUser) {
  if (!rawUser || typeof rawUser !== 'object') {
    return null;
  }

  const name = pickField(rawUser, ['name', 'Name', 'userName', 'UserName']);
  if (!name || typeof name !== 'string' || !name.trim()) {
    return null;
  }

  const email = pickField(rawUser, ['email', 'Email']);
  const role = pickField(rawUser, ['role', 'Role']);
  const subscriptionStatus = pickField(rawUser, ['subscriptionStatus', 'SubscriptionStatus']);
  const testLimit = pickField(rawUser, ['testLimit', 'TestLimit']);
  const id = pickField(rawUser, ['id', 'Id']);

  return {
    id: typeof id === 'string' ? id : '',
    name: name.trim(),
    email: typeof email === 'string' ? email : '',
    role: normalizeRole(role),
    subscriptionStatus: normalizeSubscriptionStatus(subscriptionStatus),
    testLimit: normalizeTestLimit(testLimit),
  };
}

export function resolveDefaultRole(value) {
  return normalizeRole(value) ?? ROLE.USER;
}

export { ROLE, SUBSCRIPTION_STATUS };
