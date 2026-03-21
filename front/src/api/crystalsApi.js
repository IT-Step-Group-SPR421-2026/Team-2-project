import { AUTH_STORAGE_KEY, CRYSTALS_API_URL } from '../constants';

function getStoredUser() {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

function resolveUserId(explicitUserId) {
  return explicitUserId ?? getStoredUser()?.id ?? '';
}

async function sendCrystalsRequest(path, { method = 'GET', userId, amount } = {}) {
  const resolvedUserId = resolveUserId(userId);
  if (!resolvedUserId) {
    throw new Error('User not found');
  }

  const amountQuery = amount !== undefined ? `&amount=${amount}` : '';
  const res = await fetch(`${CRYSTALS_API_URL}${path}?userId=${resolvedUserId}${amountQuery}`, {
    method,
  });

  if (!res.ok) {
    throw new Error('Crystals request failed');
  }

  const data = await res.json();
  return data.payload;
}

export async function getCrystals(userId) {
  return sendCrystalsRequest('', { userId });
}

export async function addCrystals(amount, userId) {
  return sendCrystalsRequest('/add', { method: 'POST', amount, userId });
}

export async function spendCrystals(amount, userId) {
  return sendCrystalsRequest('/spend', { method: 'POST', amount, userId });
}
