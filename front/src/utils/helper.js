import { LANGUAGE_VALUES, ROLE, SUBSCRIPTION_STATUS } from '../constants';

export function normalizeLanguage(value) {
  return value === LANGUAGE_VALUES.UKR ? LANGUAGE_VALUES.UKR : LANGUAGE_VALUES.ENG;
}

export function normalizeRole(value) {
  if (value === ROLE.ADMIN || value === ROLE.USER) {
    return value;
  }

  return null;
}

export function normalizeSubscriptionStatus(value) {
  if (value === SUBSCRIPTION_STATUS.PREMIUM || value === SUBSCRIPTION_STATUS.STANDARD) {
    return value;
  }

  return null;
}

export function normalizePositiveInt(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return null;
  }

  const normalized = Math.floor(numeric);
  return normalized > 0 ? normalized : null;
}

export function normalizeTestLimit(value) {
  return normalizePositiveInt(value);
}

export function normalizeUserEntity(rawUser) {
  if (!rawUser || typeof rawUser !== 'object') {
    return null;
  }

  const name = rawUser.name;
  if (typeof name !== 'string' || !name.trim()) {
    return null;
  }

  return {
    id: rawUser.id,
    name: name.trim(),
    email: rawUser.email,
    role: normalizeRole(rawUser.role),
    subscriptionStatus: normalizeSubscriptionStatus(rawUser.subscriptionStatus),
    testLimit: normalizeTestLimit(rawUser.testLimit),
  };
}

export function resolveDefaultRole(value) {
  return normalizeRole(value) ?? ROLE.USER;
}

export function normalizeTest(rawTest) {
  return {
    id: rawTest.id,
    title: rawTest.title,
    description: rawTest.description,
    isPublic: Boolean(rawTest.isPublic),
    sharedCode: rawTest.sharedCode,
    timeLimitSeconds: rawTest.timeLimitSeconds,
  };
}

export function normalizeOption(rawOption) {
  return {
    id: rawOption.id,
    text: rawOption.text,
    isCorrect: Boolean(rawOption.isCorrect),
    orderIndex: Number(rawOption.orderIndex),
  };
}

export function normalizeQuestion(rawQuestion) {
  const options = rawQuestion.answerOptions
    .map((item) => normalizeOption(item))
    .sort((a, b) => a.orderIndex - b.orderIndex);

  return {
    id: rawQuestion.id,
    text: rawQuestion.text,
    orderIndex: Number(rawQuestion.orderIndex),
    quizId: rawQuestion.quizId,
    quiz: rawQuestion.quiz,
    options,
  };
}

export function normalizeAttempt(rawAttempt) {
  return {
    id: rawAttempt.id,
    quizId: rawAttempt.quizId,
    userId: rawAttempt.userId,
    createdDate: rawAttempt.createdDate,
  };
}

export function normalizeText(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function normalizeAddress(value) {
  return normalizeText(value).toLowerCase();
}

export function normalizeType(value) {
  return normalizeText(value).toLowerCase();
}
