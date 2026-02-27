import httpClient from './httpClient';

function getField(source, ...keys) {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null) {
      return source[key];
    }
  }

  return undefined;
}

function normalizeTest(rawTest, index) {
  const sharedCode = getField(rawTest, 'sharedCode', 'SharedCode');
  const fallbackId = `test-${index + 1}`;
  const identifier = getField(rawTest, 'id', 'Id') ?? sharedCode ?? fallbackId;

  return {
    id: identifier,
    title: getField(rawTest, 'title', 'Title') ?? 'Untitled test',
    description: getField(rawTest, 'description', 'Description') ?? '',
    isPublic: Boolean(getField(rawTest, 'isPublic', 'IsPublic')),
    sharedCode: sharedCode ?? '',
    timeLimitSeconds: getField(rawTest, 'timeLimitSeconds', 'TimeLimitSeconds') ?? null,
  };
}

export async function getAllTests() {
  const response = await httpClient.get('/api/quiz');
  const payload = response?.data?.payload;

  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.map(normalizeTest).filter(Boolean);
}
