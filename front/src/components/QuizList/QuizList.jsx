import { Link } from 'react-router-dom';
import './QuizList.css';

const mockQuizzes = [
  { id: 1, title: 'JavaScript Basics', questions: 15, attempts: 24, date: '20.02.2026', status: 'active' },
  { id: 2, title: 'React Fundamentals', questions: 20, attempts: 18, date: '18.02.2026', status: 'active' },
  { id: 3, title: 'CSS Layouts', questions: 12, attempts: 0, date: '15.02.2026', status: 'draft' },
  { id: 4, title: 'Node.js Intro', questions: 10, attempts: 8, date: '10.02.2026', status: 'active' },
  { id: 5, title: 'TypeScript Basics', questions: 18, attempts: 12, date: '05.02.2026', status: 'active' },
  { id: 6, title: 'Database Design', questions: 25, attempts: 5, date: '01.02.2026', status: 'draft' },
];

function QuizList() {
  return (
    <div className="quiz-list">
      <div className="quiz-list-header">
        <h1>My quiz</h1>
        <Link to="/quizzes/create">
          <button className="create-btn">+ Create quiz</button>
        </Link>
      </div>
      
      <div className="quiz-grid">
        {mockQuizzes.map(quiz => (
          <div key={quiz.id} className="quiz-card">
            <h3 className="quiz-card-title">{quiz.title}</h3>
            <div className="quiz-card-info">
              <span>{quiz.questions} questions </span>
              <span>{quiz.attempts} passings </span>
            </div>
            <div className="quiz-card-footer">
              <span className="quiz-card-date">{quiz.date}</span>
              <span className={`quiz-card-status status-${quiz.status}`}>
                {quiz.status === 'active' ? 'Active' : 'The draft'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuizList;
