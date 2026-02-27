import { useState } from 'react';
import AuthInputField from './AuthInputField';

function LoginForm({ submitLabel }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [capsLockOn, setCapsLockOn] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateCapsLock = (event) => {
    setCapsLockOn(event.getModifierState('CapsLock'));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <AuthInputField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        autoComplete="email"
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
      <button type="submit" className="auth-submit">
        {submitLabel}
      </button>
    </form>
  );
}

export default LoginForm;
