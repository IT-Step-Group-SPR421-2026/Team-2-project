import httpClient from './httpClient';
import { getStoredLanguage } from '../utils/language';
import { normalizeTest } from '../utils/helper';

export async function getAllTests(language = getStoredLanguage()) {
  const response = await httpClient.get('/api/quiz', {
    params: { lang: language },
  });
  const payload = response.data.payload;

  return payload.map((item) => normalizeTest(item));
}
