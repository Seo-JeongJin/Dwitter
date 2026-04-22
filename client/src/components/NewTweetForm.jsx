import { useState } from 'react';

const NewTweetForm = ({ tweetService, onError, channel }) => {
  const [tweet, setTweet] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    tweetService
      .postTweet(tweet, channel)
      .then(() => setTweet(''))
      .catch(onError);
  };

  const onChange = (event) => {
    setTweet(event.target.value);
  };

  return (
    <form className="tweet-form" onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="글 작성..."
        value={tweet}
        required
        autoFocus
        onChange={onChange}
        className="form-input tweet-input"
      />
      <button type="submit" className="form-btn">
        게시
      </button>
    </form>
  );
};

export default NewTweetForm;
