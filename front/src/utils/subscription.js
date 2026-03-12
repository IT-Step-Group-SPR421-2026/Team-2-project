import { SUBSCRIPTION_STATUS } from '../api/userEntity';

const DAILY_TESTS_STORAGE_KEY = 'testflow_daily_test_usage';
const STANDARD_DAILY_TEST_LIMIT = 2;
const PREMIUM_DAILY_TEST_LIMIT = 5;

function getTodayDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getUsageStorageKey(user) {
  const id = typeof user?.id === 'string' ? user.id.trim() : '';
  if (id) {
    return `id:${id}`;
  }

  const name = typeof user?.name === 'string' ? user.name.trim().toLowerCase() : '';
  if (name) {
    return `name:${name}`;
  }

  return '';
}

function safeParseCount(value) {
  const normalized = Number(value);
  return Number.isFinite(normalized) && normalized > 0 ? Math.floor(normalized) : 0;
}

function readDailyUsageStore() {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(DAILY_TESTS_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return {};
    }

    return parsed;
  } catch {
    return {};
  }
}

function writeDailyUsageStore(store) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(DAILY_TESTS_STORAGE_KEY, JSON.stringify(store));
}

export function isPremiumSubscriptionStatus(status) {
  return status === SUBSCRIPTION_STATUS.PREMIUM;
}

export function isPremiumUser(user) {
  return isPremiumSubscriptionStatus(user?.subscriptionStatus);
}

function normalizePositiveInt(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return null;
  }

  const normalized = Math.floor(numeric);
  return normalized > 0 ? normalized : null;
}

export function getDailyTestLimit(status, explicitLimit = null) {
  const safeExplicitLimit = normalizePositiveInt(explicitLimit);
  if (safeExplicitLimit !== null) {
    return safeExplicitLimit;
  }

  return isPremiumSubscriptionStatus(status) ? PREMIUM_DAILY_TEST_LIMIT : STANDARD_DAILY_TEST_LIMIT;
}

export function getSubscriptionPlanName(status) {
  return isPremiumSubscriptionStatus(status) ? 'Premium' : 'Standart';
}

export function getDailyTestLimitForUser(user) {
  return getDailyTestLimit(user?.subscriptionStatus, user?.testLimit);
}

export function getCompletedTestsToday(user) {
  const userKey = getUsageStorageKey(user);
  if (!userKey) {
    return 0;
  }

  const usageStore = readDailyUsageStore();
  const entry = usageStore[userKey];
  const today = getTodayDateKey();
  if (!entry || entry.date !== today) {
    return 0;
  }

  return safeParseCount(entry.count);
}

export function getRemainingTestsToday(user) {
  const limit = getDailyTestLimitForUser(user);
  const completed = getCompletedTestsToday(user);
  return Math.max(0, limit - completed);
}

export function consumeDailyTestAttempt(user) {
  const userKey = getUsageStorageKey(user);
  if (!userKey) {
    return 0;
  }

  const usageStore = readDailyUsageStore();
  const today = getTodayDateKey();
  const currentEntry = usageStore[userKey];
  const currentCount = currentEntry?.date === today ? safeParseCount(currentEntry.count) : 0;
  const nextCount = currentCount + 1;

  usageStore[userKey] = {
    date: today,
    count: nextCount,
  };

  writeDailyUsageStore(usageStore);
  return nextCount;
}
