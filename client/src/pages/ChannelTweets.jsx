import { useParams } from 'react-router-dom';
import Tweets from '../components/Tweets';

const ChannelTweets = ({ tweetService }) => {
  const { channel } = useParams();
  return <Tweets tweetService={tweetService} channel={channel} addable={true} />;
};

export default ChannelTweets;
