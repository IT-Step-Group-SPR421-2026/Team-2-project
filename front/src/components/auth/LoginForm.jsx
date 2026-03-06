import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthInputField from './AuthInputField';

function LoginForm({ submitLabel }) {
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
      setErrorMessage('Login and password are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login({
        name: formData.name.trim(),
        password: formData.password,
      });
      const nextPath = location.state?.from?.pathname || '/tests';
      navigate(nextPath, { replace: true });
    } catch (error) {
      setErrorMessage(error.message || 'Unable to login.');
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
        autoComplete="username"
        required
      />
      <AuthInputField
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        autoComplete="current-password"
        required
        capsVisible={capsLockOn}
        onCapsStateChange={updateCapsLock}
        onCapsBlur={() => setCapsLockOn(false)}
      />
      {errorMessage && <p className="auth-feedback auth-feedback-error">{errorMessage}</p>}
      <button type="submit" className="auth-submit" disabled={isSubmitting}>
        {isSubmitting ? 'Loading...' : submitLabel}
      </button>
    </form>
  );
}

export default LoginForm;
