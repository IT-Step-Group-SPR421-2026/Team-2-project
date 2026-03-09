import { useEffect, useMemo, useState } from 'react';
import { APP_TEXT } from '../constants';
import { getStoredLanguage, subscribeToLanguageChange } from './language';

export function formatText(template, params = {}) {
  if (typeof template !== 'string') {
    return '';
  }

  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const value = params[key];
    return value === undefined || value === null ? '' : String(value);
  });
}

export function getAppText(language) {
  return APP_TEXT[language] ?? APP_TEXT.eng;
}

export function useAppText() {
  const [language, setLanguage] = useState(() => getStoredLanguage());

  useEffect(() => {
    return subscribeToLanguageChange(setLanguage);
  }, []);

  const text = useMemo(() => getAppText(language), [language]);
  return { language, text };
}
