import "./Comments.css";
import { useParams,Link } from "react-router-dom";
import { getCommentsByQuizId } from "../../api/commentsApi";
import { useEffect, useState } from "react";
import { useAppText } from '../../utils/i18n';
function Comments({testId})
{
const { text } = useAppText();
   const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
const [usersMap, setUsersMap] = useState({}); 
console.log("testId:", testId);
  useEffect(() => {
    async function loadComments() {
      try {
      const response = await getCommentsByQuizId(testId);
      const loadedComments = Array.isArray(response.payload) ? response.payload : [];
      setComments(loadedComments);

            const uniqueUserIds = [...new Set(loadedComments.map(c => c.userId))];
      const usersData = await Promise.all(
        uniqueUserIds.map(id =>
          fetch(`http://localhost:5043/api/User/get-user-by-id?userId=${id}`)
            .then(res => res.json())
        )
      );

const map = {};
      usersData.forEach((userRes, index) => {
        map[uniqueUserIds[index]] = userRes.payload?.name ?? uniqueUserIds[index];
      });

      setUsersMap(map);
    } catch (e) {
      console.error("Error loading comments", e);
    } finally {
      setLoading(false);
    }
  }

  if (testId) {
    loadComments();
  }
}, [testId]);


  if (loading) {
    return <p>{text.testSession.setLoading}</p>;
  }
    return(
    <section className="comments-placeholder">
        <h2>{text.testSession.commentsLink}</h2>
      {Array.isArray(comments) && comments.length > 0 ? (
        <div className="comments-list">
          {comments.map((comment) => (
            <div className="comments-placeholder">
            <div key={comment.id} className="comment-item">
              <p>{comment.text}</p>
              <small>{text.testSession.userLabel}: {usersMap[comment.userId]}</small>
            </div>
            </div>
          ))}
        </div>
      ) : (
        <p>{text.testSession.noComments}</p>
      )}
       <div className="comments-back">
      <Link to={`/tests/${encodeURIComponent(testId)}`}  className="test-placeholder-link">
        {text.testSession.commentsBack}
      </Link>
    </div>
     </section>
    )
     

}
export default Comments