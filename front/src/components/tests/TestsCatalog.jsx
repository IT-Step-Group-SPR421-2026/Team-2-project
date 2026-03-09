import { useEffect, useMemo, useState } from 'react';
import { getAllTests } from '../../api/testsApi';
import TestCard from './TestCard';
import './TestsCatalog.css';
import { getStoredLanguage, subscribeToLanguageChange } from '../../utils/language';
import { useAppText } from '../../utils/i18n';

function TestsCatalog() {
  const { text } = useAppText();
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchCode, setSearchCode] = useState('');
  const [language, setLanguage] = useState(() => getStoredLanguage());

  useEffect(() => {
    return subscribeToLanguageChange(setLanguage);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadTests() {
      if (isMounted) {
        setIsLoading(true);
      }

      try {
        const data = await getAllTests(language);

        if (!isMounted) {
          return;
        }

        setTests(data);
        setErrorMessage('');
      } catch {
        if (!isMounted) {
          return;
        }

        setErrorMessage(text.testsCatalog.loadError);
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
  }, [language, text.testsCatalog.loadError]);

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
        <h1 className="tests-catalog-title">{text.testsCatalog.title}</h1>
        <p className="tests-catalog-state">{text.testsCatalog.loading}</p>
      </section>
    );
  }

  if (errorMessage) {
    return (
      <section className="tests-catalog">
        <h1 className="tests-catalog-title">{text.testsCatalog.title}</h1>
        <p className="tests-catalog-state tests-catalog-error">{errorMessage}</p>
      </section>
    );
  }

  if (tests.length === 0) {
    return (
      <section className="tests-catalog">
        <h1 className="tests-catalog-title">{text.testsCatalog.title}</h1>
        <p className="tests-catalog-state">{text.testsCatalog.empty}</p>
      </section>
    );
  }

  return (
    <section className="tests-catalog">
      <h1 className="tests-catalog-title">{text.testsCatalog.title}</h1>
      <div className="tests-search">
        <label className="tests-search-label" htmlFor="tests-shared-code-search">
          {text.testsCatalog.searchLabel}
        </label>
        <input
          id="tests-shared-code-search"
          className="tests-search-input"
          type="text"
          value={searchCode}
          onChange={(event) => setSearchCode(event.target.value)}
          placeholder={text.testsCatalog.searchPlaceholder}
        />
      </div>
      {noSearchResults ? (
        <p className="tests-catalog-state">{text.testsCatalog.noSearchResults}</p>
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
