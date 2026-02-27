const MIN_PASSWORD_LENGTH = 8;

export function validatePassword(password) {
  const errors = [];

  if (password.length < MIN_PASSWORD_LENGTH) {
    errors.push(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must include at least one uppercase letter.');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must include at least one lowercase letter.');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must include at least one number.');
  }

  return errors;
}
