import { useState } from 'react';

const EditTweetForm = ({ tweet, onUpdate, onClose }) => {
  const [text, setText] = useState(tweet.text);

  const onSubmit = async (event) => {
    event.preventDefault();
    onUpdate(tweet.id, text);
    onClose();
  };

  const onChange = (event) => {
    setText(event.target.value);
  };

  return (
    <form className="edit-tweet-form" onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="글 수정..."
        value={text}
        required
        autoFocus
        onChange={onChange}
        className="form-input tweet-input"
      />
      <div className="edit-tweet-form-action">
        <button type="submit" className="form-btn-update">
          수정
        </button>
        <button type="button" className="form-btn-cancel" onClick={onClose}>
          취소
        </button>
      </div>
    </form>
  );
};

export default EditTweetForm;
