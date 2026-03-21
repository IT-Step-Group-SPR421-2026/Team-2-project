import httpClient from './httpClient';

export async function getCommentsByQuizId(quizId) {
  const response = await httpClient.get('/api/comments/quiz', {
    params: { quizId },
  });

  return response.data;
}
