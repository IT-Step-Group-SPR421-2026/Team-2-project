import Header from '../components/Header';
import { useAuth } from '../context/useAuth';
import { useAppText } from '../utils/i18n';
import { ROLE, SUBSCRIPTION_STATUS } from '../constants';
import './Profile.css';

function getRoleLabel(value, fallback) {
  if (value === ROLE.USER) {
    return 'User';
  }
  if (value === ROLE.ADMIN) {
    return 'Admin';
  }
  return fallback;
}

function getSubscriptionLabel(value, fallback) {
  if (value === SUBSCRIPTION_STATUS.STANDARD) {
    return 'Standard';
  }
  if (value === SUBSCRIPTION_STATUS.PREMIUM) {
    return 'Premium';
  }
  return fallback;
}

function ProfilePage() {
  const { text } = useAppText();
  const { user } = useAuth();

  return (
    <div className="app">
      <Header />
      <main>
        <section className="hero-card profile-card">
          <h1 className="profile-title">{text.profile.title}</h1>
          <p className="profile-line">
            <strong>{text.profile.name}:</strong> {user?.name || text.profile.noValue}
          </p>
          <p className="profile-line">
            <strong>{text.profile.email}:</strong> {user?.email || text.profile.noValue}
          </p>
          <p className="profile-line">
            <strong>Role:</strong> {getRoleLabel(user?.role, text.profile.noValue)}
          </p>
          <p className="profile-line">
            <strong>Subscription:</strong>{' '}
            {getSubscriptionLabel(user?.subscriptionStatus, text.profile.noValue)}
          </p>
        </section>
      </main>
    </div>
  );
}

export default ProfilePage;
