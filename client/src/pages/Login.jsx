import React, { useState } from 'react';
import Banner from '../components/Banner';

const Login = ({ onSignUp, onLogin }) => {
  const [signup, setSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [isAlert, setIsAlert] = useState(false);

  const onSubmit = (event) => {
    event.preventDefault();
    if (signup) {
      onSignUp(username, password, name).catch(setError);
    } else {
      onLogin(username, password).catch(setError);
    }
  };

  const setError = (error) => {
    setText(error.toString());
    setIsAlert(true);
  };

  const onChange = (event) => {
    const {
      target: { name, value, checked },
    } = event;
    switch (name) {
      case 'username':
        return setUsername(value);
      case 'password':
        return setPassword(value);
      case 'name':
        return setName(value);
      case 'signup':
        return setSignup(checked);
      default:
    }
  };

  return (
    <>
      <Banner text={text} isAlert={isAlert} />
      <form className='auth-form' onSubmit={onSubmit}>
        <input
          name='username'
          type='text'
          placeholder='아이디'
          value={username}
          onChange={onChange}
          className='form-input'
          required
        />
        <input
          name='password'
          type='password'
          placeholder='비밀번호'
          value={password}
          className='form-input'
          onChange={onChange}
        />
        {signup && (
          <input
            name='name'
            type='text'
            placeholder='닉네임'
            value={name}
            onChange={onChange}
            className='form-input'
            required
          />
        )}
        <div className='form-signup'>
          <input
            name='signup'
            id='signup'
            type='checkbox'
            onChange={onChange}
            checked={signup}
          />
          <label htmlFor='signup'> 회원가입</label>
        </div>
        <button className='form-btn auth-form-btn' type='submit'>
          {signup ? '회원가입' : '로그인'}
        </button>
      </form>
    </>
  );
};

export default Login;
