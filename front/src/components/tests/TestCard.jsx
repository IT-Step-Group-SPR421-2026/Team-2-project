import { Link } from 'react-router-dom';
import './TestCard.css';

function TestCard({ test }) {
  return (
    <Link className="test-card" to={`/tests/${encodeURIComponent(test.id)}`} state={{ test }}>
      <div className="test-card-top">
        <h3 className="test-card-title">{test.title}</h3>
        <span className={`test-card-visibility ${test.isPublic ? 'test-card-public' : 'test-card-private'}`}>
          {test.isPublic ? 'Public' : 'Private'}
        </span>
      </div>
      <p className="test-card-description">
        {test.description || 'No description yet.'}
      </p>
      <div className="test-card-meta">
        <span>Code: {test.sharedCode || 'N/A'}</span>
        <span>
          {test.timeLimitSeconds
            ? `Time limit: ${Math.floor(test.timeLimitSeconds / 60)} min`
            : 'No time limit'}
        </span>
      </div>
    </Link>
  );
}

export default TestCard;
