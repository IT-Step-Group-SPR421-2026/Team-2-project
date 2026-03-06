import Header from '../components/Header';
import TestPlaceholder from '../components/tests/TestPlaceholder';
import './TestDetails.css';

function TestDetailsPage() {
  return (
    <div className="app">
      <Header />
      <main className="test-details-main">
        <TestPlaceholder />
      </main>
    </div>
  );
}

export default TestDetailsPage;
