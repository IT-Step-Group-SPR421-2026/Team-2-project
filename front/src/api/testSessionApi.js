import httpClient from './httpClient';

function getField(source, ...keys) {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null) {
      return source[key];
    }
  }

  return undefined;
}

function extractPayload(response) {
  const body = response?.data;

  if (body && typeof body === 'object') {
    if (Object.prototype.hasOwnProperty.call(body, 'payload')) {
      return body.payload;
    }

    if (Object.prototype.hasOwnProperty.call(body, 'Payload')) {
      return body.Payload;
    }
  }

  return body;
}

function isLikelyEntityId(value) {
  if (!value || typeof value !== 'string') {
    return false;
  }

  const normalized = value.trim();
  const guidWithDashes = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const guidCompact = /^[0-9a-f]{32}$/i;

  return guidWithDashes.test(normalized) || guidCompact.test(normalized);
}

function normalizeOption(rawOption, index) {
  return {
    id: getField(rawOption, 'id', 'Id') ?? `option-${index + 1}`,
    text: getField(rawOption, 'text', 'Text') ?? 'Untitled option',
    isCorrect: Boolean(getField(rawOption, 'isCorrect', 'IsCorrect')),
    orderIndex: Number(getField(rawOption, 'orderIndex', 'OrderIndex') ?? index),
  };
}

function normalizeQuestion(rawQuestion, index) {
  const rawOptions = getField(rawQuestion, 'answerOptions', 'AnswerOptions');
  const options = Array.isArray(rawOptions)
    ? rawOptions.map(normalizeOption).sort((a, b) => a.orderIndex - b.orderIndex)
    : [];

  return {
    id: getField(rawQuestion, 'id', 'Id', 'questionId', 'QuestionId') ?? `question-${index + 1}`,
    text: getField(rawQuestion, 'text', 'Text') ?? `Question ${index + 1}`,
    orderIndex: Number(getField(rawQuestion, 'orderIndex', 'OrderIndex') ?? index),
    quizId: getField(rawQuestion, 'quizId', 'QuizId') ?? '',
    quiz: getField(rawQuestion, 'quiz', 'Quiz') ?? null,
    options,
  };
}

function normalizeAttempt(rawAttempt, index) {
  return {
    id: getField(rawAttempt, 'id', 'Id') ?? `attempt-${index + 1}`,
    quizId: getField(rawAttempt, 'quizId', 'QuizId') ?? '',
    userId: getField(rawAttempt, 'userId', 'UserId') ?? '',
  };
}

async function fetchOptionsForQuestion(questionId) {
  const response = await httpClient.get('/api/answeroption/by-question', {
    params: { questionId },
  });
  const payload = extractPayload(response);
  const rawOptions = Array.isArray(payload) ? payload : [];

  return rawOptions.map(normalizeOption).sort((a, b) => a.orderIndex - b.orderIndex);
}

async function fetchQuestionsByQuizId(quizId) {
  const response = await httpClient.get('/api/question/by-quiz-id', {
    params: { qiuzId: quizId },
  });
  const payload = extractPayload(response);
  const rawQuestions = Array.isArray(payload) ? payload : [];
  const normalizedQuestions = rawQuestions
    .map(normalizeQuestion)
    .sort((a, b) => a.orderIndex - b.orderIndex);

  const withOptions = await Promise.all(
    normalizedQuestions.map(async (question) => {
      if (!question.id || question.id.startsWith('question-')) {
        return question;
      }

      if (question.options.length > 0) {
        return question;
      }

      try {
        const options = await fetchOptionsForQuestion(question.id);
        return { ...question, options };
      } catch {
        return question;
      }
    }),
  );

  return withOptions;
}

async function fetchQuestionsBySharedCode(sharedCode) {
  if (!sharedCode) {
    return [];
  }

  const response = await httpClient.get('/api/question');
  const payload = extractPayload(response);
  const rawQuestions = Array.isArray(payload) ? payload : [];
  const normalized = rawQuestions.map(normalizeQuestion);

  const filtered = normalized.filter((question) => {
    const quiz = getField(question, 'quiz', 'Quiz');
    const questionSharedCode = getField(quiz, 'sharedCode', 'SharedCode');
    return String(questionSharedCode ?? '').toLowerCase() === String(sharedCode).toLowerCase();
  });

  return filtered.sort((a, b) => a.orderIndex - b.orderIndex);
}

export async function loadQuizSession({ testId, stateTest }) {
  const quiz = {
    title: getField(stateTest, 'title', 'Title') ?? '',
    description: getField(stateTest, 'description', 'Description') ?? '',
    sharedCode: getField(stateTest, 'sharedCode', 'SharedCode') ?? '',
  };
  const quizIdCandidates = [];
  const pushCandidate = (value) => {
    if (!isLikelyEntityId(value)) {
      return;
    }

    if (!quizIdCandidates.includes(value)) {
      quizIdCandidates.push(value);
    }
  };

  pushCandidate(getField(stateTest, 'id', 'Id'));
  pushCandidate(testId);

  const sharedCodeCandidate = quiz.sharedCode || '';
  if (sharedCodeCandidate) {
    try {
      const byCodeResponse = await httpClient.get('/api/quiz/by-shared-code', {
        params: { code: sharedCodeCandidate },
      });
      const byCodePayload = extractPayload(byCodeResponse);
      const byCodeQuizId = getField(byCodePayload, 'id', 'Id');
      const byCodeQuestions = getField(byCodePayload, 'questions', 'Questions');

      quiz.title = getField(byCodePayload, 'title', 'Title') ?? quiz.title;
      quiz.description = getField(byCodePayload, 'description', 'Description') ?? quiz.description;
      quiz.sharedCode = getField(byCodePayload, 'sharedCode', 'SharedCode') ?? quiz.sharedCode;

      if (byCodeQuizId) {
        pushCandidate(byCodeQuizId);
      }

      if (Array.isArray(byCodeQuestions) && byCodeQuestions.length > 0) {
        const normalizedQuestions = byCodeQuestions
          .map(normalizeQuestion)
          .sort((a, b) => a.orderIndex - b.orderIndex);
        const questionsWithOptions = await Promise.all(
          normalizedQuestions.map(async (question) => {
            if (question.options.length > 0 || !question.id || question.id.startsWith('question-')) {
              return question;
            }

            try {
              const options = await fetchOptionsForQuestion(question.id);
              return { ...question, options };
            } catch {
              return question;
            }
          }),
        );

        const quizIdFromQuestions = questionsWithOptions[0]?.quizId ?? '';

        return {
          quizId: isLikelyEntityId(byCodeQuizId)
            ? byCodeQuizId
            : isLikelyEntityId(quizIdFromQuestions)
              ? quizIdFromQuestions
              : '',
          quiz,
          questions: questionsWithOptions,
        };
      }
    } catch {
      // No-op: keep trying by quiz id candidates below.
    }
  }

  for (const candidateId of quizIdCandidates) {
    try {
      const questions = await fetchQuestionsByQuizId(candidateId);
      if (questions.length > 0) {
        return {
          quizId: candidateId,
          quiz,
          questions,
        };
      }
    } catch {
      // Try next candidate.
    }
  }

  // Fallback when route contains shared code but backend does not expose quiz id in /api/quiz DTO.
  const sharedCodeFromRouteOrState = quiz.sharedCode || testId;
  if (sharedCodeFromRouteOrState) {
    try {
      const questionsByCode = await fetchQuestionsBySharedCode(sharedCodeFromRouteOrState);
      if (questionsByCode.length > 0) {
        const quizIdFromQuestions = questionsByCode[0]?.quizId ?? '';
        return {
          quizId: isLikelyEntityId(quizIdFromQuestions) ? quizIdFromQuestions : '',
          quiz: {
            ...quiz,
            sharedCode: sharedCodeFromRouteOrState,
          },
          questions: questionsByCode,
        };
      }
    } catch {
      // Ignore and return empty fallback below.
    }
  }

  return {
    quizId: quizIdCandidates[0] ?? '',
    quiz,
    questions: [],
  };
}

export async function getAttemptByQuizId(quizId) {
  if (!quizId) {
    return null;
  }

  try {
    const response = await httpClient.get('/api/attempt/by-quiz-id', {
      params: { qiuzId: quizId },
    });
    const payload = extractPayload(response);
    const rawAttempts = Array.isArray(payload) ? payload : [];
    const attempt = rawAttempts.map(normalizeAttempt).find((item) => item.id && item.userId);

    return attempt ?? null;
  } catch {
    return null;
  }
}

export async function submitAnswerAttempt({ attemptId, questionId, selectedOptionIds }) {
  if (!attemptId || !questionId) {
    return;
  }

  await httpClient.post(
    '/api/answerattempt/create',
    {
      questionId,
      selectedOptionIds,
      textAnswer: null,
    },
    {
      params: { attemptId },
    },
  );
}

export async function updateAttemptResult({
  attemptId,
  quizId,
  userId,
  score,
  maxScore,
  percentage,
  durationSeconds,
}) {
  if (!attemptId || !quizId || !userId) {
    return;
  }

  await httpClient.put('/api/attempt', {
    id: attemptId,
    maxScore,
    score,
    percentage,
    durationSeconds,
    finishedAt: new Date().toISOString(),
    statusString: 'Submitted',
    quizId,
    userId,
  });
}
