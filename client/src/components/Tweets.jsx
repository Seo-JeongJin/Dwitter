import { memo, useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Banner from './Banner';
import NewTweetForm from './NewTweetForm';
import TweetCard from './TweetCard';
import { useAuth } from '../context/AuthContext';

const LIMIT = 20;

const Tweets = memo(({ tweetService, username, addable, channel }) => {
  const [tweets, setTweets] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const offsetRef = useRef(0);
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);

  const onError = useCallback((err) => {
    setError(err.toString());
    setTimeout(() => setError(''), 3000);
  }, []);

  const updateHasMore = (val) => {
    hasMoreRef.current = val;
    setHasMore(val);
  };

  const fetchTweets = useCallback(
    (offset) => {
      if (loadingRef.current || !hasMoreRef.current) return;
      loadingRef.current = true;
      setLoading(true);
      tweetService
        .getTweets(username, channel, LIMIT, offset)
        .then((data) => {
          setTweets((prev) => (offset === 0 ? data : [...prev, ...data]));
          offsetRef.current = offset + data.length;
          updateHasMore(data.length === LIMIT);
        })
        .catch(onError)
        .finally(() => {
          loadingRef.current = false;
          setLoading(false);
        });
    },
    [tweetService, username, channel, onError],
  );

  useEffect(() => {
    offsetRef.current = 0;
    updateHasMore(true);
    setTweets([]);
    fetchTweets(0);

    const stopSync = tweetService.onSync((tweet) => {
      if (!channel || tweet.channel === channel) {
        setTweets((prev) => [tweet, ...prev]);
        offsetRef.current += 1;
      }
    });
    return () => stopSync();
  }, [fetchTweets, tweetService, user]);

  const handleScroll = useCallback(
    (e) => {
      const { scrollTop, clientHeight, scrollHeight } = e.target;
      if (scrollHeight - scrollTop <= clientHeight + 100) {
        fetchTweets(offsetRef.current);
      }
    },
    [fetchTweets],
  );

  const onDelete = (tweetId) =>
    tweetService
      .deleteTweet(tweetId)
      .then(() => {
        setTweets((prev) => prev.filter((t) => t.id !== tweetId));
        offsetRef.current -= 1;
      })
      .catch(onError);

  const onUpdate = (tweetId, text) =>
    tweetService
      .updateTweet(tweetId, text)
      .then((updated) =>
        setTweets((prev) => prev.map((t) => (t.id === updated.id ? updated : t))),
      )
      .catch(onError);

  const onLike = (tweetId, isLiked) => {
    const action = isLiked ? tweetService.unlikeTweet(tweetId) : tweetService.likeTweet(tweetId);
    action
      .then(({ likeCount }) =>
        setTweets((prev) =>
          prev.map((t) => (t.id === tweetId ? { ...t, likeCount, isLiked: !isLiked } : t)),
        ),
      )
      .catch(onError);
  };

  const onUsernameClick = (tweet) => navigate(`/${tweet.username}`);

  return (
    <>
      {addable && (
        <NewTweetForm tweetService={tweetService} onError={onError} channel={channel} />
      )}
      <div className="tweets-scroll" onScroll={handleScroll}>
        {error && <Banner text={error} isAlert={true} />}
        {tweets.length === 0 && !loading && (
          <p className="tweets-empty">No Tweets Yet</p>
        )}
        <ul className="tweets">
          {tweets.map((tweet) => (
            <TweetCard
              key={tweet.id}
              tweet={tweet}
              owner={tweet.username === user.username}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onUsernameClick={onUsernameClick}
              onLike={onLike}
            />
          ))}
          {loading && <li className="tweets-loading">불러오는 중...</li>}
        </ul>
      </div>
    </>
  );
});

export default Tweets;
