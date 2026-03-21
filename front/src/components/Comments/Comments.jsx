import './Comments.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getCommentsByQuizId } from '../../api/commentsApi';
import { getUserById } from '../../api/userApi';
import {
  dislikeComment,
  getDislikes,
  getLikes,
  likeComment,
} from '../../api/commentReactionsApi';
import { buildTestDetailsRoute } from '../../constants';
import { useAppText } from '../../utils/i18n';

function Comments({ testId }) {
  const { text } = useAppText();
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [likesMap, setLikesMap] = useState({});
  const [dislikesMap, setDislikesMap] = useState({});

  useEffect(() => {
    let isMounted = true;

    async function loadComments() {
      try {
        const response = await getCommentsByQuizId(testId);
        const loadedComments = response.payload;

        const uniqueUserIds = [...new Set(loadedComments.map((comment) => comment.userId))];
        const usersData = await Promise.all(uniqueUserIds.map((id) => getUserById(id)));

        const map = {};
        usersData.forEach((user, index) => {
          map[uniqueUserIds[index]] = user.name;
        });

        if (!isMounted) {
          return;
        }

        setComments(loadedComments);
        setUsersMap(map);
      } catch (error) {
        console.error('Error loading comments', error);
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
        const likes = await getLikes(comment.id);
        const dislikes = await getDislikes(comment.id);

        newLikes[comment.id] = likes;
        newDislikes[comment.id] = dislikes;
      }

      setLikesMap(newLikes);
      setDislikesMap(newDislikes);
    }

    if (comments.length > 0) {
      loadReactions();
    }
  }, [comments]);

  const handleLike = async (commentId) => {
    try {
      await likeComment(commentId);
      const updatedLikes = await getLikes(commentId);
      const updatedDislikes = await getDislikes(commentId);
      setLikesMap((prev) => ({ ...prev, [commentId]: updatedLikes }));
      setDislikesMap((prev) => ({ ...prev, [commentId]: updatedDislikes }));
    } catch (error) {
      console.error(error);
    }
  };

  const handleDislike = async (commentId) => {
    try {
      await dislikeComment(commentId);
      const updatedLikes = await getLikes(commentId);
      const updatedDislikes = await getDislikes(commentId);
      setLikesMap((prev) => ({ ...prev, [commentId]: updatedLikes }));
      setDislikesMap((prev) => ({ ...prev, [commentId]: updatedDislikes }));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <p className="comments-state">{text.testSession.loading}</p>;
  }

  return (
    <section className="comments-placeholder">
      <h2 className="comments-title">{text.testSession.commentsLink}</h2>
      {comments.length > 0 ? (
        <div className="comments-list">
          {comments.map((comment) => (
            <article key={comment.id} className="comment-item">
              <p className="comment-text">{comment.text}</p>
              <small className="comment-author">
                {text.testSession.userLabel}: {usersMap[comment.userId]}
              </small>

              <div className="comment-actions">
                <button
                  type="button"
                  onClick={() => handleLike(comment.id)}
                  className="comment-reaction-btn like-btn"
                  aria-label="Like comment"
                >
                  <span aria-hidden="true">&#128077;</span>
                  <span>{likesMap[comment.id] || 0}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDislike(comment.id)}
                  className="comment-reaction-btn dislike-btn"
                  aria-label="Dislike comment"
                >
                  <span aria-hidden="true">&#128078;</span>
                  <span>{dislikesMap[comment.id] || 0}</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="comments-empty">{text.testSession.noComments}</p>
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
