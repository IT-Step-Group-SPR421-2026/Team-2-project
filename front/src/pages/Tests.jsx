import Header from '../components/Header';
import TestsCatalog from '../components/tests/TestsCatalog';

function TestsPage() {
  return (
    <div className="app">
      <Header />
      <main>
        <TestsCatalog />
      </main>
    </div>
  );
}

export default TestsPage;
