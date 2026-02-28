import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuizEditor.css';

function QuizEditor() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: '',
      options: [
        { id: 1, text: '', isCorrect: false },
        { id: 2, text: '', isCorrect: false }
      ]
    }
  ]);

  const addQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      text: '',
      options: [
        { id: 1, text: '', isCorrect: false },
        { id: 2, text: '', isCorrect: false }
      ]
    };
    setQuestions([...questions, newQuestion]);
  };

  const deleteQuestion = (questionId) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  const updateQuestionText = (questionId, text) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, text } : q
    ));
  };

  const addOption = (questionId) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          options: [...q.options, { id: q.options.length + 1, text: '', isCorrect: false }]
        };
      }
      return q;
    }));
  };

  const updateOptionText = (questionId, optionId, text) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          options: q.options.map(o => o.id === optionId ? { ...o, text } : o)
        };
      }
      return q;
    }));
  };

  const toggleCorrectOption = (questionId, optionId) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          options: q.options.map(o => ({
            ...o,
            isCorrect: o.id === optionId ? !o.isCorrect : false
          }))
        };
      }
      return q;
    }));
  };

  const deleteOption = (questionId, optionId) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          options: q.options.filter(o => o.id !== optionId)
        };
      }
      return q;
    }));
  };

  const handleSave = () => {
    console.log({ title, description, questions });
    navigate('/quizzes');
  };

  return (
    <div className="quiz-editor">
      <div className="editor-header">
        <h1>Створити квіз</h1>
        <p>Заповніть форму для створення нового квізу</p>
      </div>

      <div className="form-section">
        <h2>Основна інформація</h2>
        <div className="form-group">
          <label className="form-label">Назва квізу</label>
          <input
            type="text"
            className="form-input"
            placeholder="Введіть назву квізу"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Опис</label>
          <textarea
            className="form-textarea"
            placeholder="Опис квізу (необов'язково)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="form-section">
        <h2>Питання</h2>
        <div className="questions-list">
          {questions.map((question, index) => (
            <div key={question.id} className="question-card">
              <div className="question-header">
                <span className="question-number">Питання {index + 1}</span>
                {questions.length > 1 && (
                  <button 
                    className="question-delete"
                    onClick={() => deleteQuestion(question.id)}
                  >
                    Видалити
                  </button>
                )}
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Текст питання"
                  value={question.text}
                  onChange={(e) => updateQuestionText(question.id, e.target.value)}
                />
              </div>
              <div className="options-list">
                {question.options.map((option) => (
                  <div key={option.id} className="option-row">
                    <input
                      type="checkbox"
                      className="option-checkbox"
                      checked={option.isCorrect}
                      onChange={() => toggleCorrectOption(question.id, option.id)}
                      title="Правильна відповідь"
                    />
                    <input
                      type="text"
                      className="form-input option-input"
                      placeholder={`Варіант ${option.id}`}
                      value={option.text}
                      onChange={(e) => updateOptionText(question.id, option.id, e.target.value)}
                    />
                    {question.options.length > 2 && (
                      <button
                        className="option-delete"
                        onClick={() => deleteOption(question.id, option.id)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  className="add-option-btn"
                  onClick={() => addOption(question.id)}
                >
                  + Додати варіант
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="add-question-btn" onClick={addQuestion}>
          + Додати питання
        </button>
      </div>

      <div className="editor-actions">
        <button className="btn-cancel" onClick={() => navigate('/quizzes')}>
          Скасувати
        </button>
        <button 
          className="btn-save" 
          onClick={handleSave}
          disabled={!title}
        >
          Зберегти квіз
        </button>
      </div>
    </div>
  );
}

export default QuizEditor;
