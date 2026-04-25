import { memo, useState } from 'react';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import parseDate from '../util/date';
import Avatar from './Avatar';
import EditTweetForm from './EditTweetForm';

const TweetCard = memo(
  ({ tweet, owner, onDelete, onUpdate, onUsernameClick, onLike, onBookmark }) => {
    const { id, username, name, text, createdAt, likeCount = 0, isLiked = false, isBookmarked = false } = tweet;
    const [editing, setEditing] = useState(false);
    const [animating, setAnimating] = useState(false);
    const [bookmarkAnimating, setBookmarkAnimating] = useState(false);
    const onClose = () => setEditing(false);

    const handleLike = () => {
      setAnimating(true);
      onLike(id, !!isLiked);
    };

    const handleBookmark = () => {
      setBookmarkAnimating(true);
      onBookmark(id, !!isBookmarked);
    };

    return (
      <li className="tweet">
        <section className="tweet-container">
          <Avatar name={name} />
          <div className="tweet-body">
            <div>
              <span className="tweet-name">{name}</span>
              <span
                className="tweet-username"
                onClick={() => onUsernameClick(tweet)}
              >
                @{username}
              </span>
              <span className="tweet-date"> · {parseDate(createdAt)}</span>
              <button
                className={`tweet-like-btn${animating ? ' like-pop' : ''}`}
                onClick={handleLike}
                onAnimationEnd={() => setAnimating(false)}
              >
                {isLiked
                  ? <FaHeart className="heart-filled" />
                  : <FaRegHeart className="heart-empty" />}
                <span className="like-count">{likeCount > 0 ? likeCount : ''}</span>
              </button>
              <button
                className={`tweet-bookmark-btn${bookmarkAnimating ? ' like-pop' : ''}`}
                onClick={handleBookmark}
                onAnimationEnd={() => setBookmarkAnimating(false)}
              >
                {isBookmarked
                  ? <FaBookmark className="bookmark-filled" />
                  : <FaRegBookmark className="bookmark-empty" />}
              </button>
            </div>
            <p>{text}</p>
            {editing && (
              <EditTweetForm
                tweet={tweet}
                onUpdate={onUpdate}
                onClose={onClose}
              />
            )}
          </div>
        </section>
        {owner && (
          <div className="tweet-action">
            <button className="tweet-action-btn" onClick={() => onDelete(id)}>
              x
            </button>
            <button
              className="tweet-action-btn"
              onClick={() => setEditing(true)}
            >
              ✎
            </button>
          </div>
        )}
      </li>
    );
  },
);
export default TweetCard;
