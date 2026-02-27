import './Header.css';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const { pathname } = useLocation();
  const isAuthRoute = pathname === '/login' || pathname === '/register';
  const isTestsRoute = pathname.startsWith('/tests');

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">Test flow</Link>
        <Link to="/tests" className={`nav-tests-btn${isTestsRoute ? ' btn-active' : ''}`}>
          Tests
        </Link>
      </div>
      <div className="auth-buttons">
        <Link to="/login" className={`btn btn-primary${isAuthRoute ? ' btn-active' : ''}`}>
          Auth
        </Link>
      </div>
    </header>
  );
}

export default Header;
