import { Link } from 'react-router-dom';

function AuthCard({ title, description, footerLink, children }) {
  return (
    <section className="auth-placeholder">
      <h1 className="auth-title">{title}</h1>
      <p className="auth-description">{description}</p>
      {children}
      <Link className="auth-link" to={footerLink.to}>
        {footerLink.label}
      </Link>
    </section>
  );
}

export default AuthCard;
