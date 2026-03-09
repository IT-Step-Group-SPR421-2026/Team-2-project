import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  getAttemptByQuizId,
  loadQuizSession,
  submitAnswerAttempt,
  updateAttemptResult,
} from '../../api/testSessionApi';
import './TestPlaceholder.css';
import { getStoredLanguage, subscribeToLanguageChange } from '../../utils/language';
import { formatText, useAppText } from '../../utils/i18n';

function haveSameOptions(selectedIds, correctIds) {
  if (selectedIds.length !== correctIds.length) {
    return false;
  }

  const selectedSet = new Set(selectedIds);
  return correctIds.every((id) => selectedSet.has(id));
}

function toPercentage(value) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function TestPlaceholder() {
  const { text } = useAppText();
  const { testId } = useParams();
  const location = useLocation();
  const [session, setSession] = useState({
    quizId: '',
    quiz: {
      title: '',
      description: '',
      sharedCode: '',
    },
    questions: [],
  });
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [persistMessage, setPersistMessage] = useState('');
  const [result, setResult] = useState(null);
  const [startedAt, setStartedAt] = useState(Date.now());
  const [language, setLanguage] = useState(() => getStoredLanguage());

  useEffect(() => {
    return subscribeToLanguageChange(setLanguage);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      setIsLoading(true);
      setErrorMessage('');
      setAnswers({});
      setResult(null);
      setPersistMessage('');
      setValidationMessage('');
      setAttempt(null);

      try {
        const loadedSession = await loadQuizSession({
          testId,
          stateTest: location.state?.test,
          language,
        });
        if (!isMounted) {
          return;
        }

        setSession(loadedSession);
        setStartedAt(Date.now());

        if (loadedSession.quizId) {
          const loadedAttempt = await getAttemptByQuizId(loadedSession.quizId);

          if (isMounted) {
            setAttempt(loadedAttempt);
          }
        }
      } catch {
        if (isMounted) {
          setErrorMessage(text.testSession.loadError);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSession();

    return () => {
      isMounted = false;
    };
  }, [language, location.state?.test, testId, text.testSession.loadError]);

  const title = session.quiz.title || location.state?.test?.title || formatText(text.testSession.testFallbackTitle, { id: testId });
  const description = session.quiz.description || location.state?.test?.description || '';
  const sharedCode = session.quiz.sharedCode || location.state?.test?.sharedCode || '';

  const questionsWithMeta = useMemo(() => {
    return session.questions.map((question) => {
      const options = Array.isArray(question.options) ? question.options : [];
      const correctOptions = options.filter((option) => option.isCorrect);
      return {
        ...question,
        options,
        correctOptions,
        isMultipleChoice: correctOptions.length > 1,
      };
    });
  }, [session.questions]);

  const totalQuestions = questionsWithMeta.length;

  function handleSingleSelect(questionId, optionId) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: [optionId],
    }));
    setValidationMessage('');
  }

  function handleMultiSelect(questionId, optionId) {
    setAnswers((prev) => {
      const selected = new Set(prev[questionId] ?? []);
      if (selected.has(optionId)) {
        selected.delete(optionId);
      } else {
        selected.add(optionId);
      }

      return {
        ...prev,
        [questionId]: Array.from(selected),
      };
    });
    setValidationMessage('');
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (totalQuestions === 0) {
      return;
    }

    const unanswered = questionsWithMeta.filter((question) => {
      const selected = answers[question.id] ?? [];
      return selected.length === 0;
    });

    if (unanswered.length > 0) {
      setValidationMessage(text.testSession.validation);
      return;
    }

    setIsSubmitting(true);
    setValidationMessage('');
    setPersistMessage('');

    const details = questionsWithMeta.map((question) => {
      const selectedOptionIds = answers[question.id] ?? [];
      const correctOptionIds = question.correctOptions.map((option) => option.id);
      const isCorrect = haveSameOptions(selectedOptionIds, correctOptionIds);
      const earnedPoints = isCorrect ? 1 : 0;
      const selectedOptions = question.options.filter((option) => selectedOptionIds.includes(option.id));

      return {
        questionId: question.id,
        questionText: question.text,
        selectedOptionIds,
        selectedOptions,
        correctOptions: question.correctOptions,
        isCorrect,
        earnedPoints,
      };
    });

    const score = details.reduce((sum, item) => sum + item.earnedPoints, 0);
    const correctCount = details.filter((item) => item.isCorrect).length;
    const incorrectCount = totalQuestions - correctCount;
    const correctPercent = totalQuestions > 0 ? toPercentage((score / totalQuestions) * 100) : 0;
    const incorrectPercent = totalQuestions > 0 ? toPercentage((incorrectCount / totalQuestions) * 100) : 0;
    const durationSeconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));

    let backendStatus = '';
    const canPersist = Boolean(attempt?.id && session.quizId);

    if (canPersist) {
      try {
        for (const answerDetail of details) {
          await submitAnswerAttempt({
            attemptId: attempt.id,
            questionId: answerDetail.questionId,
            selectedOptionIds: answerDetail.selectedOptionIds,
          });
        }

        await updateAttemptResult({
          attemptId: attempt.id,
          quizId: attempt.quizId || session.quizId,
          userId: attempt.userId,
          score,
          maxScore: totalQuestions,
          percentage: correctPercent,
          durationSeconds,
        });

        backendStatus = text.testSession.persistSaved;
      } catch {
        backendStatus = text.testSession.persistFailed;
      }
    } else {
      backendStatus = text.testSession.persistLocalOnly;
    }

    setPersistMessage(backendStatus);
    setResult({
      score,
      maxScore: totalQuestions,
      correctCount,
      incorrectCount,
      correctPercent,
      incorrectPercent,
      durationSeconds,
      details,
    });
    setIsSubmitting(false);
  }

  return (
    <section className="test-placeholder">
      <div className="test-head">
        <h1 className="test-placeholder-title">{title}</h1>
        {description && <p className="test-placeholder-description">{description}</p>}
        <div className="test-placeholder-meta">{text.testSession.sharedCode}: {sharedCode || text.testCard.noValue}</div>
      </div>

      {isLoading ? (
        <p className="test-placeholder-state">{text.testSession.loading}</p>
      ) : errorMessage ? (
        <p className="test-placeholder-state test-placeholder-error">{errorMessage}</p>
      ) : totalQuestions === 0 ? (
        <p className="test-placeholder-state test-placeholder-error">
          {text.testSession.noQuestions}
        </p>
      ) : result ? (
        <div className="test-results">
          <h2 className="test-results-title">{text.testSession.resultTitle}</h2>
          <div className="test-results-grid">
            <article className="test-results-card">
              <div className="test-results-label">{text.testSession.score}</div>
              <div className="test-results-value">{result.score}/{result.maxScore}</div>
            </article>
            <article className="test-results-card">
              <div className="test-results-label">{text.testSession.correctAnswers}</div>
              <div className="test-results-value">{result.correctPercent}% ({result.correctCount})</div>
            </article>
            <article className="test-results-card">
              <div className="test-results-label">{text.testSession.incorrectAnswers}</div>
              <div className="test-results-value">{result.incorrectPercent}% ({result.incorrectCount})</div>
            </article>
          </div>

          <p className="test-results-meta">{formatText(text.testSession.timeSpent, { seconds: result.durationSeconds })}</p>
          {persistMessage && <p className="test-results-meta">{persistMessage}</p>}

          <div className="test-results-breakdown">
            {result.details.map((item, index) => (
              <article
                key={`${item.questionId}-${index + 1}`}
                className={`result-question ${item.isCorrect ? 'result-correct' : 'result-incorrect'}`}
              >
                <h3 className="result-question-title">{index + 1}. {item.questionText}</h3>
                <p className="result-line">
                  <strong>{text.testSession.yourAnswer}</strong>{' '}
                  {item.selectedOptions.length > 0
                    ? item.selectedOptions.map((option) => option.text).join(', ')
                    : text.testSession.noAnswer}
                </p>
                <p className="result-line">
                  <strong>{text.testSession.correctAnswer}</strong>{' '}
                  {item.correctOptions.length > 0
                    ? item.correctOptions.map((option) => option.text).join(', ')
                    : text.testSession.notProvided}
                </p>
                <p className="result-line">
                  <strong>{text.testSession.points}</strong> {item.earnedPoints}
                </p>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <form className="test-form" onSubmit={handleSubmit}>
          {questionsWithMeta.map((question, index) => {
            const selectedIds = answers[question.id] ?? [];
            const inputType = question.isMultipleChoice ? 'checkbox' : 'radio';

            return (
              <article className="test-question-card" key={question.id || index}>
                <h2 className="test-question-title">{index + 1}. {question.text}</h2>
                {question.options.length === 0 ? (
                  <p className="test-placeholder-state test-placeholder-error">
                    {text.testSession.noOptions}
                  </p>
                ) : (
                  <div className="test-options">
                    {question.options.map((option) => {
                      const isChecked = selectedIds.includes(option.id);

                      return (
                        <label key={option.id} className="test-option-item">
                          <input
                            type={inputType}
                            name={`question-${question.id}`}
                            checked={isChecked}
                            onChange={() => {
                              if (question.isMultipleChoice) {
                                handleMultiSelect(question.id, option.id);
                              } else {
                                handleSingleSelect(question.id, option.id);
                              }
                            }}
                          />
                          <span>{option.text}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </article>
            );
          })}

          {validationMessage && (
            <p className="test-placeholder-state test-placeholder-error">{validationMessage}</p>
          )}

          <div className="test-actions">
            <button className="test-submit-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? text.testSession.submitting : text.testSession.submit}
            </button>
          </div>
        </form>
      )}

      <Link to="/tests" className="test-placeholder-link">
        {text.testSession.backToTests}
      </Link>
    </section>
  );
}

export default TestPlaceholder;
