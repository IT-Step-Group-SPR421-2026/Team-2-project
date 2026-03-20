import './Comments.css';
import { Link } from 'react-router-dom';
import { getCommentsByQuizId } from '../../api/commentsApi';
import { useEffect, useState } from 'react';
import { buildTestDetailsRoute } from '../../constants';
import { getUserById } from '../../api/userApi';
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
    let isMounted = true;

    async function loadComments() {
      try {
        const response = await getCommentsByQuizId(testId);
        const loadedComments = response.payload;

        const uniqueUserIds = [...new Set(loadedComments.map((comment) => comment.userId))];
        const usersData = await Promise.all(
          uniqueUserIds.map((id) => getUserById(id)),
        );

        const map = {};
        usersData.forEach((user, index) => {
          map[uniqueUserIds[index]] = user.name;
        });

        if (!isMounted) {
          return;
        }

        setComments(loadedComments);
        setUsersMap(map);
      } catch (e) {
        console.error('Error loading comments', e);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    if (testId) {
      loadComments();
    }

    return () => {
      isMounted = false;
    };
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
    return <p>{text.testSession.loading}</p>;
  }

  return (
    <section className="comments-placeholder">
      <h2>{text.testSession.commentsLink}</h2>
      {comments.length > 0 ? (
        <div className="comments-list">
          {comments.map((comment) => (
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
        <Link to={buildTestDetailsRoute(testId)} className="test-placeholder-link">
          {text.testSession.commentsBack}
        </Link>
      </div>
    </section>
  );
}

export default Comments;
