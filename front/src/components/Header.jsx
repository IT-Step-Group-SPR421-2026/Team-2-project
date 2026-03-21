import './Header.css';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { LANGUAGE_ENG, LANGUAGE_UKR, getStoredLanguage, setStoredLanguage } from '../utils/language';
import { useEffect, useRef, useState } from 'react';
import { HEADER_ROUTES, LANGUAGE_LABELS } from '../constants';
import { useAppText } from '../utils/i18n';
import { ConnectButton } from '@mysten/dapp-kit-react/ui';
import { useCrystals } from '../context/useCrystals';

function Header() {
  const { text } = useAppText();
  const { pathname } = useLocation();
  const isAuthRoute = pathname === HEADER_ROUTES.LOGIN || pathname === HEADER_ROUTES.REGISTER;
  const isTestsRoute = pathname.startsWith(HEADER_ROUTES.TESTS);
  const isProfileRoute = pathname.startsWith(HEADER_ROUTES.PROFILE);
  const isSubscriptionRoute = pathname.startsWith(HEADER_ROUTES.SUBSCRIPTION);
  const subscriptionLabel = text.header.subscription;
  const { isAuthenticated, user, logout } = useAuth();
  const [language, setLanguage] = useState(() => getStoredLanguage());
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const languageMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const { crystals } = useCrystals();

  useEffect(() => {
    function handlePointerDown(event) {
      const target = event.target;

      if (languageMenuRef.current && !languageMenuRef.current.contains(target)) {
        setIsLanguageMenuOpen(false);
      }

      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setIsUserMenuOpen(false);
      }
    }

    function handleEscPress(event) {
      if (event.key === 'Escape') {
        setIsLanguageMenuOpen(false);
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscPress);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscPress);
    };
  }, []);

  function handleLanguageChange(nextLanguage) {
    const normalizedLanguage = setStoredLanguage(nextLanguage);
    setLanguage(normalizedLanguage);
    setIsLanguageMenuOpen(false);
  }

  return (
    <header className="header">
      <div className="header-main">
        <Link to={HEADER_ROUTES.HOME} className="logo">{text.header.brand}</Link>

        <nav className="header-nav" aria-label={text.header.mainNavAria}>
          <Link to={HEADER_ROUTES.TESTS} className={`nav-tests-btn${isTestsRoute ? ' btn-active' : ''}`}>
            {text.header.tests}
          </Link>
        </nav>
      </div>

      <div className="header-controls">
        <div className="wallet-controls">
          <ConnectButton>Connect Wallet</ConnectButton>
        </div>

        <div className="menu-wrap" ref={languageMenuRef}>
          <button
            type="button"
            className={`menu-trigger${isLanguageMenuOpen ? ' menu-trigger-open' : ''}`}
            onClick={() => setIsLanguageMenuOpen((prev) => !prev)}
            aria-haspopup="menu"
            aria-expanded={isLanguageMenuOpen}
          >
            {language === LANGUAGE_UKR ? LANGUAGE_LABELS.ukr : LANGUAGE_LABELS.eng}
          </button>
          {isLanguageMenuOpen && (
            <div className="dropdown-menu" role="menu" aria-label={text.header.languageMenuAria}>
              <button
                type="button"
                className={`dropdown-item${language === LANGUAGE_UKR ? ' dropdown-item-active' : ''}`}
                onClick={() => handleLanguageChange(LANGUAGE_UKR)}
              >
                {LANGUAGE_LABELS.ukr}
              </button>
              <button
                type="button"
                className={`dropdown-item${language === LANGUAGE_ENG ? ' dropdown-item-active' : ''}`}
                onClick={() => handleLanguageChange(LANGUAGE_ENG)}
              >
                {LANGUAGE_LABELS.eng}
              </button>
            </div>
          )}
        </div>

        {isAuthenticated ? (
          <div className="menu-wrap" ref={userMenuRef}>
            <button
              type="button"
              className={`menu-trigger user-trigger${isUserMenuOpen ? ' menu-trigger-open' : ''}`}
              onClick={() => setIsUserMenuOpen((prev) => !prev)}
              aria-haspopup="menu"
              aria-expanded={isUserMenuOpen}
            >
              <span className="user-name">{user?.name} </span>
            </button>
             <button
              type="button"
              className={`menu-trigger user-trigger user-crystals-btn ${isUserMenuOpen ? ' menu-trigger-open' : ''}`}
            >
              <span className="user-name">{"\u{1F48E}"} {crystals ?? 0}</span>
            </button>
            {isUserMenuOpen && (
              <div className="dropdown-menu user-menu" role="menu" aria-label={text.header.userMenuAria}>
                <Link
                  to={HEADER_ROUTES.PROFILE}
                  className={`dropdown-link${isProfileRoute ? ' dropdown-item-active' : ''}`}
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  {text.header.goToProfile}
                </Link>
                <Link
                  to={HEADER_ROUTES.SUBSCRIPTION}
                  className={`dropdown-link${isSubscriptionRoute ? ' dropdown-item-active' : ''}`}
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  {subscriptionLabel}
                </Link>
                <button
                  type="button"
                  className="dropdown-item dropdown-item-danger"
                  onClick={logout}
                >
                  {text.header.logout}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to={HEADER_ROUTES.LOGIN} className={`btn btn-secondary${isAuthRoute && pathname === HEADER_ROUTES.LOGIN ? ' btn-active' : ''}`}>
              {text.header.login}
            </Link>
            <Link to={HEADER_ROUTES.REGISTER} className={`btn btn-primary${isAuthRoute && pathname === HEADER_ROUTES.REGISTER ? ' btn-active' : ''}`}>
              {text.header.register}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
