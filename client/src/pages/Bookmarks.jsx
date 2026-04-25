import Tweets from '../components/Tweets';

const Bookmarks = ({ tweetService }) => (
  <Tweets tweetService={tweetService} bookmarksOnly={true} addable={false} />
);

export default Bookmarks;
