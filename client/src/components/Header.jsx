import { memo } from 'react';

const Header = memo(({ username, onLogout }) => {
  return (
    <header className="header">
      <div className="logo">
        <img src="/img/logo.png" alt="GSChat Logo" className="logo-img" />
        <h1 className="logo-name">GSChat</h1>
      </div>
      {username && (
        <nav className="menu">
          <div className="header-user">
            <div className="avatar-txt">{username.charAt(0)}</div>
            <span className="logo-user">@{username}</span>
          </div>
          <button className="menu-item" onClick={onLogout}>
            로그아웃
          </button>
        </nav>
      )}
    </header>
  );
});

export default Header;
