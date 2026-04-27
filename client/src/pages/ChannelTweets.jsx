import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Tweets from '../components/Tweets';

const ChannelTweets = ({ tweetService }) => {
  const { channel } = useParams();
  const { user } = useAuth();
  const addable = channel !== 'notice' || user.role === 'admin';
  return <Tweets tweetService={tweetService} channel={channel} addable={addable} />;
};

export default ChannelTweets;
