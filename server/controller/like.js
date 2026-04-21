import { db } from '../db/database.js';

export async function likeTweet(req, res) {
  const tweetId = req.params.id;
  await db.execute('INSERT IGNORE INTO likes (userId, tweetId) VALUES (?,?)', [req.userId, tweetId]);
  const [[{ count }]] = await db.execute('SELECT COUNT(*) AS count FROM likes WHERE tweetId=?', [tweetId]);
  res.status(200).json({ likeCount: count });
}

export async function unlikeTweet(req, res) {
  const tweetId = req.params.id;
  await db.execute('DELETE FROM likes WHERE userId=? AND tweetId=?', [req.userId, tweetId]);
  const [[{ count }]] = await db.execute('SELECT COUNT(*) AS count FROM likes WHERE tweetId=?', [tweetId]);
  res.status(200).json({ likeCount: count });
}
