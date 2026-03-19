 import './Comments.css';
 import Comments from '../components/Comments/Comments'
 import Header from '../components/Header'
 import { useParams } from "react-router-dom";
 function CommentsPage() {
     const { testId } = useParams();
 return (
   
    <div className="app">
      <Header/>
      <main>
            <Comments testId={testId}/>
      </main>

    </div>
 )
 }
 export  default CommentsPage;