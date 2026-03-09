import {
  LANGUAGE_CHANGE_EVENT,
  LANGUAGE_STORAGE_KEY,
  LANGUAGE_VALUES,
} from '../constants';

export const LANGUAGE_UKR = LANGUAGE_VALUES.UKR;
export const LANGUAGE_ENG = LANGUAGE_VALUES.ENG;

/**
 * @typedef {import('../types').AppLanguage} AppLanguage
 */

/**
 * @param {unknown} value
 * @returns {AppLanguage}
 */
function normalizeLanguage(value) {
  return value === LANGUAGE_UKR ? LANGUAGE_UKR : LANGUAGE_ENG;
}

/**
 * @returns {AppLanguage}
 */
export function getStoredLanguage() {
  if (typeof window === 'undefined') {
    return LANGUAGE_ENG;
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return normalizeLanguage(storedLanguage);
}

/**
 * @param {unknown} language
 * @returns {AppLanguage}
 */
export function setStoredLanguage(language) {
  if (typeof window === 'undefined') {
    return normalizeLanguage(language);
  }

  const normalizedLanguage = normalizeLanguage(language);
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizedLanguage);
  window.dispatchEvent(
    new CustomEvent(LANGUAGE_CHANGE_EVENT, {
      detail: normalizedLanguage,
    }),
  );

  return normalizedLanguage;
}

/**
 * @param {(language: AppLanguage) => void} callback
 * @returns {() => void}
 */
export function subscribeToLanguageChange(callback) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handler = (event) => {
    callback(normalizeLanguage(event?.detail));
  };

  window.addEventListener(LANGUAGE_CHANGE_EVENT, handler);
  return () => {
    window.removeEventListener(LANGUAGE_CHANGE_EVENT, handler);
  };
}
