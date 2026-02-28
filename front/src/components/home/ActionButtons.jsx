import { Link } from 'react-router-dom';
import './ActionButtons.css';

function ActionButtons() {
  return (
    <div className="action-buttons">
      <Link to="/quizzes">
        <button className="action-btn">My Quiz</button>
      </Link>
      <Link to="/tests">
        <button className="action-btn">Tests</button>
      </Link>
    </div>
  );
}

export default ActionButtons;
