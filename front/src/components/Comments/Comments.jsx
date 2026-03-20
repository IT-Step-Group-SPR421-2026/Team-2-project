import './Comments.css';
import { Link } from 'react-router-dom';
import { getCommentsByQuizId } from '../../api/commentsApi';
import { useEffect, useState } from 'react';
import { buildTestDetailsRoute } from '../../constants';
import { getUserById } from '../../api/userApi';
import { useAppText } from '../../utils/i18n';

function Comments({ testId }) {
  const { text } = useAppText();
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [usersMap, setUsersMap] = useState({});

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
              <small>
                {text.testSession.userLabel}: {usersMap[comment.userId]}
              </small>
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
