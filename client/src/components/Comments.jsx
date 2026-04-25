import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import parseDate from '../util/date';

const Comments = ({ tweetId, tweetService, onCountChange }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const submittingRef = useRef(false);

  useEffect(() => {
    tweetService.getComments(tweetId).then(setComments);
  }, [tweetId, tweetService]);

  const handleAdd = () => {
    if (!text.trim() || submittingRef.current) return;
    submittingRef.current = true;
    tweetService
      .addComment(tweetId, text)
      .then((comment) => {
        setComments((prev) => [...prev, comment]);
        setText('');
        onCountChange(1);
      })
      .finally(() => {
        submittingRef.current = false;
      });
  };

  const handleDelete = (commentId) => {
    tweetService.deleteComment(tweetId, commentId).then(() => {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      onCountChange(-1);
    });
  };

  return (
    <div className="comments">
      <ul className="comment-list">
        {comments.map((c) => (
          <li key={c.id} className="comment-item">
            <div className="comment-meta">
              <span className="comment-author">{c.name}</span>
              <span
                className="comment-username"
                onClick={() => navigate(`/${c.username}`)}
              >
                @{c.username}
              </span>
              <span className="comment-date">{parseDate(c.createdAt)}</span>
              {c.username === user.username && (
                <button
                  className="comment-delete-btn"
                  onClick={() => handleDelete(c.id)}
                >
                  x
                </button>
              )}
            </div>
            <div className="comment-body">
              <span className="comment-text">{c.text}</span>
            </div>
          </li>
        ))}
      </ul>
      <form className="comment-form" onSubmit={(e) => e.preventDefault()}>
        <textarea
          className="comment-input"
          value={text}
          rows={1}
          onChange={(e) => {
            setText(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleAdd();
            }
          }}
          placeholder="댓글을 작성해보세요. (Shift + Enter 로 개행)"
        />
        <button
          type="button"
          className="comment-submit-btn"
          onClick={handleAdd}
        >
          등록
        </button>
      </form>
    </div>
  );
};

export default Comments;
