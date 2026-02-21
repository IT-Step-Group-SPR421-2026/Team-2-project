import Header from './components/Header';
import Hero from './components/Hero';
import ActionButtons from './components/ActionButtons';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
      </main>
      <footer>
        <ActionButtons />
      </footer>
    </div>
  );
}

export default App;
