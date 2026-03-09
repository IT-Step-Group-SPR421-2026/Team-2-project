import httpClient from './httpClient';
import { getStoredLanguage } from '../utils/language';
import { getAppText } from '../utils/i18n';

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

export async function registerApi({ name, email, password, role = 0 }) {
  const apiText = getApiText();
  try {
    const response = await httpClient.post('/api/auth/register', {
      name,
      email,
      password,
      role,
    });

    return {
      message: extractMessage(response?.data) || apiText.registrationSuccess,
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
    };
  } catch (error) {
    throw buildError(error);
  }
}
