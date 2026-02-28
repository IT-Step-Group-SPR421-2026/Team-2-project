import './Hero.css';
import ActionButtons from './ActionButtons';

function Hero() {
  return (
    <section className="hero">
      <h1 className="hero-title">Create tests easily</h1>
      <p className="hero-description">
        A platform for creating and taking tests. Save notes, share knowledge,
        and test your skills.
      </p>
      <ActionButtons />
    </section>
  );
}

export default Hero;
