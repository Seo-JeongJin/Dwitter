import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AllTweets from './pages/AllTweets';
import MyTweets from './pages/MyTweets';
import ChannelTweets from './pages/ChannelTweets';
import Bookmarks from './pages/Bookmarks';
import { useAuth } from './context/AuthContext';

function App({ tweetService }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const onLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      logout();
      navigate('/');
    }
  };

  return (
    <div className='app'>
      <Header username={user.username} onLogout={onLogout} />
      <div className='app-body'>
        <Sidebar />
        <main className='main-content'>
          <Routes>
            <Route path='/' element={<AllTweets tweetService={tweetService} />} />
            <Route path='/channel/:channel' element={<ChannelTweets tweetService={tweetService} />} />
            <Route path='/bookmarks' element={<Bookmarks />} />
            <Route path='/:username' element={<MyTweets tweetService={tweetService} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
