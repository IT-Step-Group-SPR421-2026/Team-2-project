import { Link } from 'react-router-dom';
import './TestCard.css';
import { formatText, useAppText } from '../../utils/i18n';

function TestCard({ test }) {
  const { text } = useAppText();
  const minutes = Math.floor(test.timeLimitSeconds / 60);

  return (
    <Link className="test-card" to={`/tests/${encodeURIComponent(test.id)}`} state={{ test }}>
      <div className="test-card-top">
        <h3 className="test-card-title">{test.title}</h3>
        <span className={`test-card-visibility ${test.isPublic ? 'test-card-public' : 'test-card-private'}`}>
          {test.isPublic ? text.testCard.public : text.testCard.private}
        </span>
      </div>
      <p className="test-card-description">
        {test.description || text.testCard.noDescription}
      </p>
      <div className="test-card-meta">
        <span>{text.testCard.code}: {test.sharedCode || text.testCard.noValue}</span>
        <span>
          {test.timeLimitSeconds
            ? formatText(text.testCard.timeLimit, { minutes })
            : text.testCard.noTimeLimit}
        </span>
      </div>
    </Link>
  );
}

export default TestCard;
