import { Link, useLocation, useParams } from 'react-router-dom';
import './TestPlaceholder.css';

function TestPlaceholder() {
  const { testId } = useParams();
  const location = useLocation();
  const title = location.state?.test?.title ?? `Test ${testId}`;

  return (
    <section className="test-placeholder">
      <h1 className="test-placeholder-title">{title}</h1>
      <p className="test-placeholder-description">
        Test page is under construction. You will be able to pass this test here soon.
      </p>
      <div className="test-placeholder-meta">Test code: {testId}</div>
      <Link to="/tests" className="test-placeholder-link">
        Back to all tests
      </Link>
    </section>
  );
}

export default TestPlaceholder;
