import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import AllTweets from './pages/AllTweets';
import MyTweets from './pages/MyTweets';
import { useAuth } from './context/AuthContext';

function App({ tweetService }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const onAllTweets = () => {
    navigate('/');
  };

  const onMyTweets = () => {
    navigate(`/${user.username}`);
  };

  const onLogout = () => {
    if (window.confirm('Do you want to log out?')) {
      logout();
      navigate('/');
    }
  };

  return (
    <div className='app'>
      <Header
        username={user.username}
        onLogout={onLogout}
        onAllTweets={onAllTweets}
        onMyTweets={onMyTweets}
      />
      <Routes>
        <Route path='/' element={<AllTweets tweetService={tweetService} />} />
        <Route path='/:username' element={<MyTweets tweetService={tweetService} />} />
      </Routes>
    </div>
  );
}

export default App;
