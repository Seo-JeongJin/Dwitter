import { db } from '../db/database.js';

export async function bookmarkTweet(req, res) {
  const tweetId = req.params.id;
  await db.execute('INSERT IGNORE INTO bookmarks (userId, tweetId) VALUES (?,?)', [req.userId, tweetId]);
  res.status(200).json({ isBookmarked: true });
}

export async function unbookmarkTweet(req, res) {
  const tweetId = req.params.id;
  await db.execute('DELETE FROM bookmarks WHERE userId=? AND tweetId=?', [req.userId, tweetId]);
  res.status(200).json({ isBookmarked: false });
}
