import httpClient from './httpClient';

function extractMessage(data) {
  if (!data || typeof data !== 'object') {
    return 'Unexpected server response.';
  }

  return data.message ?? data.Message ?? '';
}

function buildError(error) {
  const message =
    extractMessage(error?.response?.data) ||
    error?.message ||
    'Request failed.';

  return new Error(message);
}

export async function registerApi({ name, email, password, role = 0 }) {
  try {
    const response = await httpClient.post('/api/auth/register', {
      name,
      email,
      password,
      role,
    });

    return {
      message: extractMessage(response?.data) || 'Registration successful.',
    };
  } catch (error) {
    throw buildError(error);
  }
}

export async function loginApi({ name, password }) {
  try {
    const response = await httpClient.post('/api/auth/login', {
      name,
      password,
    });

    return {
      message: extractMessage(response?.data) || 'Login successful.',
    };
  } catch (error) {
    throw buildError(error);
  }
}
