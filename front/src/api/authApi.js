import httpClient from './httpClient';
import { getStoredLanguage } from '../utils/language';
import { getAppText } from '../utils/i18n';
import { normalizeUserEntity, resolveDefaultRole, ROLE } from './userEntity';

function getApiText() {
  return getAppText(getStoredLanguage()).api;
}

function extractMessage(data) {
  const apiText = getApiText();
  if (!data || typeof data !== 'object') {
    return apiText.unexpectedResponse;
  }

  return data.message ?? data.Message ?? '';
}

function buildError(error) {
  const apiText = getApiText();
  const message =
    extractMessage(error?.response?.data) ||
    error?.message ||
    apiText.requestFailed;

  return new Error(message);
}

function extractUserEntityFromResponse(data) {
  const candidate =
    data?.payload?.user ??
    data?.payload?.User ??
    data?.payload?.userEntity ??
    data?.payload?.UserEntity ??
    data?.user ??
    data?.User ??
    data?.userEntity ??
    data?.UserEntity ??
    data?.payload;

  return normalizeUserEntity(candidate);
}

export async function registerApi({ name, email, password, role = ROLE.USER }) {
  const apiText = getApiText();
  try {
    const response = await httpClient.post('/api/auth/register', {
      name,
      email,
      password,
      role: resolveDefaultRole(role),
    });

    return {
      message: extractMessage(response?.data) || apiText.registrationSuccess,
      user: extractUserEntityFromResponse(response?.data),
    };
  } catch (error) {
    throw buildError(error);
  }
}

export async function loginApi({ name, password }) {
  const apiText = getApiText();
  try {
    const response = await httpClient.post('/api/auth/login', {
      name,
      password,
    });

    return {
      message: extractMessage(response?.data) || apiText.loginSuccess,
      user: extractUserEntityFromResponse(response?.data),
    };
  } catch (error) {
    throw buildError(error);
  }
}

export async function updateSubscriptionApi({ userId, subscriptionStatus }) {
  const apiText = getApiText();
  try {
    const response = await httpClient.put('/api/auth/subscription', {
      userId,
      subscriptionStatus,
    });

    return {
      message: extractMessage(response?.data) || apiText.subscriptionUpdated,
      user: extractUserEntityFromResponse(response?.data),
    };
  } catch (error) {
    throw buildError(error);
  }
}
