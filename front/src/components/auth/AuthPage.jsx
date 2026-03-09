import Header from '../Header';
import AuthCard from './AuthCard';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import './Auth.css';
import { HEADER_ROUTES } from '../../constants';
import { useAppText } from '../../utils/i18n';

function AuthPage({ variant }) {
  const { text } = useAppText();
  const isLogin = variant === 'login';
  const isRegister = variant === 'register';

  if (!isLogin && !isRegister) {
    return null;
  }

  const FormComponent = isLogin ? LoginForm : RegisterForm;
  const title = isLogin ? text.auth.loginTitle : text.auth.registerTitle;
  const description = isLogin ? text.auth.loginDescription : text.auth.registerDescription;
  const submitLabel = isLogin ? text.auth.loginTitle : text.auth.registerTitle;
  const footerLink = isLogin
    ? { to: HEADER_ROUTES.REGISTER, label: text.auth.noAccount }
    : { to: HEADER_ROUTES.LOGIN, label: text.auth.alreadyAccount };

  return (
    <div>
      <Header />
      <main>
        <AuthCard title={title} description={description} footerLink={footerLink}>
          <FormComponent submitLabel={submitLabel} />
        </AuthCard>
      </main>
    </div>
  );
}

export default AuthPage;
