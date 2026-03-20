import "./Comments.css";
import { useParams,Link } from "react-router-dom";
import { getCommentsByQuizId } from "../../api/commentsApi";
import { useEffect, useState } from "react";
import { useAppText } from '../../utils/i18n';
import {getLikes,getDislikes,likeComment,dislikeComment,} from "../../api/commentReactionsApi";

function Comments({testId})
{
const { text } = useAppText();
   const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
const [usersMap, setUsersMap] = useState({});
 const [likesMap, setLikesMap] = useState({});
  const [dislikesMap, setDislikesMap] = useState({}); 
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

 useEffect(() => {
    async function loadReactions() {
      const newLikes = {};
      const newDislikes = {};

      for (const comment of comments) {
        const l = await getLikes(comment.id);
        const d = await getDislikes(comment.id);

        newLikes[comment.id] = l;
        newDislikes[comment.id] = d;
      }

      setLikesMap(newLikes);
      setDislikesMap(newDislikes);
    }

    if (comments?.length) {
      loadReactions();
    }
  }, [comments]);

  const handleLike = async (commentId) => {
  try {
    await likeComment(commentId); // робимо POST
    const updatedLikes = await getLikes(commentId); // беремо справжню кількість лайків
    const updatedDislikes = await getDislikes(commentId); // справжню кількість дизлайків
    setLikesMap(prev => ({ ...prev, [commentId]: updatedLikes }));
    setDislikesMap(prev => ({ ...prev, [commentId]: updatedDislikes }));
  } catch (err) {
    console.error(err);
  }
};

const handleDislike = async (commentId) => {
  try {
    await dislikeComment(commentId); // робимо POST
    const updatedLikes = await getLikes(commentId);
    const updatedDislikes = await getDislikes(commentId);
    setLikesMap(prev => ({ ...prev, [commentId]: updatedLikes }));
    setDislikesMap(prev => ({ ...prev, [commentId]: updatedDislikes }));
  } catch (err) {
    console.error(err);
  }
};
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

              <div  key={comment.id} className="comment-actions">
          <span onClick={() => handleLike(comment.id)} className="like-btn">
            👍 {likesMap[comment.id] || 0} 
          </span>

          <span onClick={() => handleDislike(comment.id)} className="dislike-btn">
            👎 {dislikesMap[comment.id] || 0}
          </span>
        </div>

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