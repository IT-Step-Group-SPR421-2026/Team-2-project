import './Header.css';

function Header() {
  return (
    <header className="header">
      <a href="/" className="logo">qauiz</a>
      <div className="auth-buttons">
        <button className="btn btn-secondary">Зареєструватися</button>
        <button className="btn btn-primary">Створити</button>
      </div>
    </header>
  );
}

export default Header;
