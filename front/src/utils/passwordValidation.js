import { MIN_PASSWORD_LENGTH } from '../constants';

function formatTemplate(template, params = {}) {
  if (typeof template !== 'string') {
    return '';
  }

  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const value = params[key];
    return value === undefined || value === null ? '' : String(value);
  });
}

export function validatePassword(password, messages = {}) {
  const errors = [];
  const minLengthMessage = messages.minLength ?? `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  const uppercaseMessage = messages.uppercase ?? 'Password must include at least one uppercase letter.';
  const lowercaseMessage = messages.lowercase ?? 'Password must include at least one lowercase letter.';
  const numberMessage = messages.number ?? 'Password must include at least one number.';

  if (password.length < MIN_PASSWORD_LENGTH) {
    errors.push(formatTemplate(minLengthMessage, { min: MIN_PASSWORD_LENGTH }));
  }

  if (!/[A-Z]/.test(password)) {
    errors.push(uppercaseMessage);
  }

  if (!/[a-z]/.test(password)) {
    errors.push(lowercaseMessage);
  }

  if (!/\d/.test(password)) {
    errors.push(numberMessage);
  }

  return errors;
}
