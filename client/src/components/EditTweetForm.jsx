import { useState, useRef, useEffect } from 'react';

const EditTweetForm = ({ tweet, onUpdate, onClose }) => {
  const [text, setText] = useState(tweet.text);
  const textareaRef = useRef(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, []);

  const submit = () => {
    if (!text.trim() || submittingRef.current) return;
    submittingRef.current = true;
    onUpdate(tweet.id, text);
    onClose();
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const onChange = (e) => {
    setText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  };

  return (
    <form className="edit-tweet-form" onSubmit={(e) => e.preventDefault()}>
      <textarea
        placeholder="글 수정..."
        value={text}
        required
        autoFocus
        ref={textareaRef}
        rows={1}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className="form-input tweet-input"
      />
      <div className="edit-tweet-form-action">
        <button type="button" className="form-btn-update" onClick={submit}>
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
