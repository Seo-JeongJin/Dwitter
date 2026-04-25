import { useState, useRef } from 'react';

const NewTweetForm = ({ tweetService, onError, channel }) => {
  const [tweet, setTweet] = useState('');
  const textareaRef = useRef(null);
  const submittingRef = useRef(false);

  const submit = () => {
    if (!tweet.trim() || submittingRef.current) return;
    submittingRef.current = true;
    tweetService
      .postTweet(tweet, channel)
      .then(() => {
        setTweet('');
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
      })
      .catch(onError)
      .finally(() => {
        submittingRef.current = false;
      });
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const onChange = (e) => {
    setTweet(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  return (
    <form className="tweet-form" onSubmit={(e) => e.preventDefault()}>
      <textarea
        placeholder="글을 작성해보세요. (Shift + Enter 로 개행)"
        value={tweet}
        required
        autoFocus
        ref={textareaRef}
        rows={1}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className="form-input tweet-input"
      />
      <button type="button" className="form-btn" onClick={submit}>
        게시
      </button>
    </form>
  );
};

export default NewTweetForm;
