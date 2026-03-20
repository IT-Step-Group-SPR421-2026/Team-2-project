import httpClient from './httpClient';

export async function getUserById(userId) {
  const response = await httpClient.get('/api/User/get-user-by-id', {
    params: { userId },
  });

  return response.data.payload;
}
