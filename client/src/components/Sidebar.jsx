import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CHANNELS = [
  { label: '공지사항', value: 'notice' },
  { label: '잡담', value: 'general' },
  { label: '취업', value: 'jobs' },
  { label: '시험', value: 'exam' },
  { label: '수업', value: 'class' },
];

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <nav className="sidebar">
      <NavLink
        to="/"
        end
        className={({ isActive }) => (isActive ? 'sidebar-item active' : 'sidebar-item')}
      >
        전체
      </NavLink>
      <div className="sidebar-divider" />
      {CHANNELS.map((ch) => (
        <NavLink
          key={ch.value}
          to={`/channel/${ch.value}`}
          className={({ isActive }) => (isActive ? 'sidebar-item active' : 'sidebar-item')}
        >
          {ch.label}
        </NavLink>
      ))}
      <div className="sidebar-divider" />
      <NavLink
        to="/popular"
        className={({ isActive }) => (isActive ? 'sidebar-item active' : 'sidebar-item')}
      >
        인기글
      </NavLink>
      <div className="sidebar-divider" />
      <NavLink
        to="/bookmarks"
        className={({ isActive }) => (isActive ? 'sidebar-item active' : 'sidebar-item')}
      >
        즐겨찾기
      </NavLink>
      <div className="sidebar-divider" />
      <NavLink
        to={`/${user.username}`}
        className={({ isActive }) => (isActive ? 'sidebar-item active' : 'sidebar-item')}
      >
        내 글
      </NavLink>
    </nav>
  );
};

export default Sidebar;
