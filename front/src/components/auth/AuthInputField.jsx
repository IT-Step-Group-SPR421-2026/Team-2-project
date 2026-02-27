function AuthInputField({
  label,
  name,
  value,
  onChange,
  onBlur,
  type = 'text',
  autoComplete,
  required = false,
  error = '',
  capsVisible = false,
  onCapsStateChange,
  onCapsBlur,
}) {
  const isPassword = type === 'password';
  const inputClassName = `auth-input${isPassword ? ' auth-input-password' : ''}${error ? ' auth-input-error' : ''}`;

  const handleBlur = (event) => {
    if (onBlur) {
      onBlur(event);
    }

    if (isPassword && onCapsBlur) {
      onCapsBlur(event);
    }
  };

  return (
    <label className="auth-field">
      <span className="auth-label">{label}</span>
      {isPassword ? (
        <div className="auth-input-wrap">
          <input
            className={inputClassName}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={handleBlur}
            onKeyDown={onCapsStateChange}
            onKeyUp={onCapsStateChange}
            onFocus={onCapsStateChange}
            autoComplete={autoComplete}
            required={required}
          />
          <span className={`auth-caps${capsVisible ? ' auth-caps-visible' : ''}`}>
            CAPS
          </span>
        </div>
      ) : (
        <input
          className={inputClassName}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={handleBlur}
          autoComplete={autoComplete}
          required={required}
        />
      )}
      {error && <span className="auth-error">{error}</span>}
    </label>
  );
}

export default AuthInputField;
