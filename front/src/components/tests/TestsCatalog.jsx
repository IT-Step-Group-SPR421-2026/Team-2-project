import { useEffect, useMemo, useState } from 'react';
import { getAllTests } from '../../api/testsApi';
import TestCard from './TestCard';
import './TestsCatalog.css';

function TestsCatalog() {
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchCode, setSearchCode] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadTests() {
      try {
        const data = await getAllTests();

        if (!isMounted) {
          return;
        }

        setTests(data);
        setErrorMessage('');
      } catch {
        if (!isMounted) {
          return;
        }

        setErrorMessage('Unable to load tests. Try again later.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadTests();

    return () => {
      isMounted = false;
    };
  }, []);

  const normalizedQuery = searchCode.trim().toLowerCase();
  const filteredTests = useMemo(() => {
    if (!normalizedQuery) {
      return tests;
    }

    return tests.filter((test) =>
      (test.sharedCode ?? '').toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery, tests]);

  const noSearchResults = !isLoading && !errorMessage && tests.length > 0 && filteredTests.length === 0;

  if (isLoading) {
    return (
      <section className="tests-catalog">
        <h1 className="tests-catalog-title">Tests</h1>
        <p className="tests-catalog-state">Loading tests...</p>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="tests-catalog">
        <h1 className="tests-catalog-title">Tests</h1>
        <p className="tests-catalog-state tests-catalog-error">{errorMessage}</p>
      </section>
    );
  }

  if (tests.length === 0) {
    return (
      <section className="tests-catalog">
        <h1 className="tests-catalog-title">Tests</h1>
        <p className="tests-catalog-state">No tests found.</p>
      </section>
    );
  }

  return (
    <section className="tests-catalog">
      <h1 className="tests-catalog-title">Tests</h1>
      <div className="tests-search">
        <label className="tests-search-label" htmlFor="tests-shared-code-search">
          Search by Shared Code
        </label>
        <input
          id="tests-shared-code-search"
          className="tests-search-input"
          type="text"
          value={searchCode}
          onChange={(event) => setSearchCode(event.target.value)}
          placeholder="Enter shared code"
        />
      </div>
      {noSearchResults ? (
        <p className="tests-catalog-state">No tests found for this shared code.</p>
      ) : (
        <div className="tests-grid">
          {filteredTests.map((test) => (
            <TestCard key={test.id} test={test} />
          ))}
        </div>
      )}
    </section>
  );
}

export default TestsCatalog;
