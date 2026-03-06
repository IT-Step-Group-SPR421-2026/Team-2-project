import './Header.css';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { pathname } = useLocation();
  const isAuthRoute = pathname === '/login' || pathname === '/register';
  const isTestsRoute = pathname.startsWith('/tests');
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">Test flow</Link>
        <Link to="/tests" className={`nav-tests-btn${isTestsRoute ? ' btn-active' : ''}`}>
          Tests
        </Link>
      </div>
      <div className="auth-buttons">
        {isAuthenticated ? (
          <>
            <span className="user-chip">{user?.name}</span>
            <button type="button" className="btn btn-secondary" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={`btn btn-secondary${isAuthRoute && pathname === '/login' ? ' btn-active' : ''}`}>
              Login
            </Link>
            <Link to="/register" className={`btn btn-primary${isAuthRoute && pathname === '/register' ? ' btn-active' : ''}`}>
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
