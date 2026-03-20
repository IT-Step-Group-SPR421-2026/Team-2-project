import httpClient from './httpClient';
import { getStoredLanguage } from '../utils/language';
import { getAppText } from '../utils/i18n';
import { ROLE } from '../constants';
import { normalizeUserEntity, resolveDefaultRole } from '../utils/helper';

function getApiText() {
  return getAppText(getStoredLanguage()).api;
}

function extractMessage(data) {
  const apiText = getApiText();
  return data?.message ?? apiText.unexpectedResponse;
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
  return normalizeUserEntity(data.payload.user);
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
      message: extractMessage(response.data) || apiText.registrationSuccess,
      user: extractUserEntityFromResponse(response.data),
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
      message: extractMessage(response.data) || apiText.loginSuccess,
      user: extractUserEntityFromResponse(response.data),
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
      message: extractMessage(response.data) || apiText.subscriptionUpdated,
      user: extractUserEntityFromResponse(response.data),
    };
  } catch (error) {
    throw buildError(error);
  }
}
