import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import AuthInputField from './AuthInputField';
import { useAppText } from '../../utils/i18n';
import { HEADER_ROUTES } from '../../constants';

function LoginForm({ submitLabel }) {
  const { text } = useAppText();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    password: '',
  });
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage('');
  };

  const updateCapsLock = (event) => {
    setCapsLockOn(event.getModifierState('CapsLock'));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim() || !formData.password) {
      setErrorMessage(text.auth.errors.loginRequired);
      return;
    }

    setIsSubmitting(true);
    try {
      await login({
        name: formData.name.trim(),
        password: formData.password,
      });
      const nextPath = location.state?.from?.pathname || HEADER_ROUTES.TESTS;
      navigate(nextPath, { replace: true });
    } catch (error) {
      setErrorMessage(error.message || text.auth.errors.unableToLogin);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <AuthInputField
        label={text.auth.username}
        name="name"
        type="text"
        value={formData.name}
        onChange={handleChange}
        autoComplete="username"
        required
      />
      <AuthInputField
        label={text.auth.password}
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        autoComplete="current-password"
        required
        capsVisible={capsLockOn}
        capsLabel={text.auth.capsLabel}
        onCapsStateChange={updateCapsLock}
        onCapsBlur={() => setCapsLockOn(false)}
      />
      {errorMessage && <p className="auth-feedback auth-feedback-error">{errorMessage}</p>}
      <button type="submit" className="auth-submit" disabled={isSubmitting}>
        {isSubmitting ? text.auth.loading : submitLabel}
      </button>
    </form>
  );
}

export default LoginForm;
