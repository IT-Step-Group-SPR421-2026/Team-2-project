import Header from '../Header';
import AuthCard from './AuthCard';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import './Auth.css';

function AuthPage({ variant }) {
  const isLogin = variant === 'login';
  const isRegister = variant === 'register';

  if (!isLogin && !isRegister) {
    return null;
  }

  const FormComponent = isLogin ? LoginForm : RegisterForm;
  const title = isLogin ? 'Login' : 'Register';
  const description = isLogin ? 'Sign in to continue.' : 'Create your account.';
  const submitLabel = isLogin ? 'Login' : 'Register';
  const footerLink = isLogin
    ? { to: '/register', label: 'No account yet? Register' }
    : { to: '/login', label: 'Already have an account? Login' };

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
