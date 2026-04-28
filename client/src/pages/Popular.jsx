import Tweets from '../components/Tweets';

const Popular = ({ tweetService }) => (
  <Tweets tweetService={tweetService} popularOnly={true} addable={false} />
);

export default Popular;
