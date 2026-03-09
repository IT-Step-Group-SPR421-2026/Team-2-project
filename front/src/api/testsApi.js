import httpClient from './httpClient';
import { getStoredLanguage } from '../utils/language';
import { formatText, getAppText } from '../utils/i18n';

function getField(source, ...keys) {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null) {
      return source[key];
    }
  }

  return undefined;
}

function normalizeTest(rawTest, index, text) {
  const sharedCode = getField(rawTest, 'sharedCode', 'SharedCode');
  const fallbackId = `test-${index + 1}`;
  const identifier = getField(rawTest, 'id', 'Id') ?? sharedCode ?? fallbackId;

  return {
    id: identifier,
    title: getField(rawTest, 'title', 'Title') ?? formatText(text.testSession.testFallbackTitle, { id: index + 1 }),
    description: getField(rawTest, 'description', 'Description') ?? '',
    isPublic: Boolean(getField(rawTest, 'isPublic', 'IsPublic')),
    sharedCode: sharedCode ?? '',
    timeLimitSeconds: getField(rawTest, 'timeLimitSeconds', 'TimeLimitSeconds') ?? null,
  };
}

export async function getAllTests(language = getStoredLanguage()) {
  const text = getAppText(language);
  const response = await httpClient.get('/api/quiz', {
    params: { lang: language },
  });
  const payload = response?.data?.payload;


  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.map((item, index) => normalizeTest(item, index, text)).filter(Boolean);
}
