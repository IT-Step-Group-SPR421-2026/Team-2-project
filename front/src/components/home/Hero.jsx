import './Hero.css';
import { useAppText } from '../../utils/i18n';

function Hero() {
  const { text } = useAppText();

  return (
    <section className="hero">
      <h1 className="hero-title">{text.home.title}</h1>
      <p className="hero-description">{text.home.description}</p>
    </section>
  );
}

export default Hero;
