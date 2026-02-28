import Header from '../components/Header';
import QuizEditor from '../components/QuizList/QuizEditor';

function QuizEditorPage() {
  return (
    <div className="app">
      <Header />
      <main>
        <QuizEditor />
      </main>
    </div>
  );
}

export default QuizEditorPage;
