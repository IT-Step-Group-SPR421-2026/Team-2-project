import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { validatePassword } from '../../utils/passwordValidation';
import AuthInputField from './AuthInputField';

function getRegisterErrors(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = 'Login is required.';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required.';
  }

  if (!values.password) {
    errors.password = 'Password is required.';
  } else {
    const passwordErrors = validatePassword(values.password);
    if (passwordErrors.length > 0) {
      errors.password = passwordErrors[0];
    }
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirm password is required.';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords must match.';
  }

  return errors;
}

function RegisterForm({ submitLabel }) {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState('');
  const [capsLock, setCapsLock] = useState({
    password: false,
    confirmPassword: false,
  });

  const errors = getRegisterErrors(formData);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setServerMessage('');
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const createCapsLockHandler = (field) => (event) => {
    const isEnabled = event.getModifierState('CapsLock');
    setCapsLock((prev) => ({ ...prev, [field]: isEnabled }));
  };

  const hideCapsLockForField = (field) => () => {
    setCapsLock((prev) => ({ ...prev, [field]: false }));
  };

  const shouldShowError = (field) =>
    Boolean(errors[field]) && (touched[field] || isSubmitted);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);

    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      navigate('/tests', { replace: true });
    } catch (error) {
      setServerMessage(error.message || 'Unable to register.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <AuthInputField
        label="Login"
        name="name"
        type="text"
        value={formData.name}
        onChange={handleChange}
        onBlur={handleBlur}
        autoComplete="username"
        required
        error={shouldShowError('name') ? errors.name : ''}
      />
      <AuthInputField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        onBlur={handleBlur}
        autoComplete="email"
        required
        error={shouldShowError('email') ? errors.email : ''}
      />
      <AuthInputField
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        onBlur={handleBlur}
        autoComplete="new-password"
        required
        error={shouldShowError('password') ? errors.password : ''}
        capsVisible={capsLock.password}
        onCapsStateChange={createCapsLockHandler('password')}
        onCapsBlur={hideCapsLockForField('password')}
      />
      <AuthInputField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        autoComplete="new-password"
        required
        error={shouldShowError('confirmPassword') ? errors.confirmPassword : ''}
        capsVisible={capsLock.confirmPassword}
        onCapsStateChange={createCapsLockHandler('confirmPassword')}
        onCapsBlur={hideCapsLockForField('confirmPassword')}
      />
      {serverMessage && <p className="auth-feedback auth-feedback-error">{serverMessage}</p>}
      <button type="submit" className="auth-submit" disabled={isSubmitting}>
        {isSubmitting ? 'Loading...' : submitLabel}
      </button>
    </form>
  );
}

export default RegisterForm;
