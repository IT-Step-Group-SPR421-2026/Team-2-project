import httpClient from './httpClient';
import { getStoredLanguage } from '../utils/language';
import { normalizeAttempt, normalizeOption, normalizeQuestion } from '../utils/helper';

async function fetchOptionsForQuestion(questionId, language) {
  const response = await httpClient.get('/api/answeroption/by-question', {
    params: { questionId, lang: language },
  });
  const payload = response.data.payload;

  return payload.map((item) => normalizeOption(item)).sort((a, b) => a.orderIndex - b.orderIndex);
}

async function fetchQuestionsByQuizId(quizId, language) {
  const response = await httpClient.get('/api/question/by-quiz-id', {
    params: { qiuzId: quizId, lang: language },
  });
  const payload = response.data.payload;
  const normalizedQuestions = payload
    .map((item) => normalizeQuestion(item))
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
      const byCodePayload = byCodeResponse.data.payload;
      quizId = byCodePayload.id ?? quizId;
      quiz.title = byCodePayload.title ?? quiz.title;
      quiz.description = byCodePayload.description ?? quiz.description;
      quiz.sharedCode = byCodePayload.sharedCode ?? quiz.sharedCode;

      questions = byCodePayload.questions
        .map((item) => normalizeQuestion(item))
        .sort((a, b) => a.orderIndex - b.orderIndex);
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
  const payload = response.data.payload;
  const attempts = payload
    .map((item) => normalizeAttempt(item))
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
