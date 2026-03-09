import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { useAppText } from '../utils/i18n';

function ProfilePage() {
  const { text } = useAppText();
  const { user } = useAuth();

  return (
    <div className="app">
      <Header />
      <main>
        <section className="hero-card" style={{ width: 'min(560px, 92vw)' }}>
          <h1 style={{ marginBottom: '0.75rem', color: 'var(--color-brand-dark)' }}>{text.profile.title}</h1>
          <p style={{ color: '#2a5f56' }}><strong>{text.profile.name}:</strong> {user?.name || text.profile.noValue}</p>
          <p style={{ color: '#2a5f56' }}><strong>{text.profile.email}:</strong> {user?.email || text.profile.noValue}</p>
        </section>
      </main>
    </div>
  );
}

export default ProfilePage;
