import httpClient from './httpClient';
import { getStoredLanguage } from '../utils/language';
import { getAppText, formatText } from '../utils/i18n';

function extractPayload(response) {
  return response?.data?.payload ?? null;
}

function normalizeOption(rawOption, index, text) {
  return {
    id: rawOption?.id ?? `option-${index + 1}`,
    text: rawOption?.text ?? formatText(text.testSession.optionFallbackTitle, { id: index + 1 }),
    isCorrect: Boolean(rawOption?.isCorrect),
    orderIndex: Number(rawOption?.orderIndex ?? index),
  };
}

function normalizeQuestion(rawQuestion, index, text) {
  const options = Array.isArray(rawQuestion?.answerOptions)
    ? rawQuestion.answerOptions
        .map((item, itemIndex) => normalizeOption(item, itemIndex, text))
        .sort((a, b) => a.orderIndex - b.orderIndex)
    : [];

  return {
    id: rawQuestion?.id ?? `question-${index + 1}`,
    text: rawQuestion?.text ?? formatText(text.testSession.questionFallbackTitle, { id: index + 1 }),
    orderIndex: Number(rawQuestion?.orderIndex ?? index),
    quizId: rawQuestion?.quizId ?? '',
    quiz: rawQuestion?.quiz ?? null,
    options,
  };
}

function normalizeAttempt(rawAttempt, index) {
  return {
    id: rawAttempt?.id ?? `attempt-${index + 1}`,
    quizId: rawAttempt?.quizId ?? '',
    userId: rawAttempt?.userId ?? '',
    createdDate: rawAttempt?.createdDate ?? null,
  };
}

async function fetchOptionsForQuestion(questionId, language) {
  const text = getAppText(language);
  const response = await httpClient.get('/api/answeroption/by-question', {
    params: { questionId, lang: language },
  });
  const payload = extractPayload(response);
  const rawOptions = Array.isArray(payload) ? payload : [];

  return rawOptions
    .map((item, index) => normalizeOption(item, index, text))
    .sort((a, b) => a.orderIndex - b.orderIndex);
}

async function fetchQuestionsByQuizId(quizId, language) {
  const text = getAppText(language);
  const response = await httpClient.get('/api/question/by-quiz-id', {
    params: { qiuzId: quizId, lang: language },
  });
  const payload = extractPayload(response);
  const rawQuestions = Array.isArray(payload) ? payload : [];
  const normalizedQuestions = rawQuestions
    .map((item, index) => normalizeQuestion(item, index, text))
    .sort((a, b) => a.orderIndex - b.orderIndex);

  const questionsWithOptions = await Promise.all(
    normalizedQuestions.map(async (question) => {
      if (question.options.length > 0) {
        return question;
      }

      try {
        const options = await fetchOptionsForQuestion(question.id, language);
        return { ...question, options };
      } catch {
        return question;
      }
    }),
  );

  return questionsWithOptions;
}

export async function loadQuizSession({ testId, stateTest, language = getStoredLanguage() }) {
  const text = getAppText(language);
  let quizId = stateTest?.id ?? testId ?? '';
  const quiz = {
    title: stateTest?.title ?? '',
    description: stateTest?.description ?? '',
    sharedCode: stateTest?.sharedCode ?? '',
  };

  let questions = [];

  if (quiz.sharedCode) {
    try {
      const byCodeResponse = await httpClient.get('/api/quiz/by-shared-code', {
        params: { code: quiz.sharedCode, lang: language },
      });
      const byCodePayload = extractPayload(byCodeResponse);
      if (byCodePayload) {
        quizId = byCodePayload.id ?? quizId;
        quiz.title = byCodePayload.title ?? quiz.title;
        quiz.description = byCodePayload.description ?? quiz.description;
        quiz.sharedCode = byCodePayload.sharedCode ?? quiz.sharedCode;

        if (Array.isArray(byCodePayload.questions)) {
          questions = byCodePayload.questions
            .map((item, index) => normalizeQuestion(item, index, text))
            .sort((a, b) => a.orderIndex - b.orderIndex);
        }
      }
    } catch {
      // Keep fallback by quiz id below.
    }
  }

  if (questions.length === 0 && quizId) {
    questions = await fetchQuestionsByQuizId(quizId, language);
  }

  return {
    quizId,
    quiz,
    questions,
  };
}

export async function createAttemptForQuiz({ quizId, userId }) {
  if (!quizId || !userId) {
    return null;
  }

  await httpClient.post('/api/attempt', {
    maxScore: 0,
    score: null,
    percentage: null,
    durationSeconds: null,
    finishedAt: null,
    statusString: 'InProgress',
    quizId,
    userId,
  });

  const response = await httpClient.get('/api/attempt/by-quiz-id', {
    params: { qiuzId: quizId },
  });
  const payload = extractPayload(response);
  const rawAttempts = Array.isArray(payload) ? payload : [];
  const attempts = rawAttempts
    .map((item, index) => normalizeAttempt(item, index))
    .filter((item) => item.userId === userId);

  if (attempts.length === 0) {
    return null;
  }

  attempts.sort((a, b) => {
    const left = a.createdDate ? new Date(a.createdDate).getTime() : 0;
    const right = b.createdDate ? new Date(b.createdDate).getTime() : 0;
    return right - left;
  });

  return attempts[0];
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
