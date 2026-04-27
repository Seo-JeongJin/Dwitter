import { db } from '../db/database.js';

async function tweetExists(tweetId) {
  const [[row]] = await db.execute('SELECT id FROM tweets WHERE id=?', [tweetId]);
  return !!row;
}

export async function likeTweet(req, res) {
  const tweetId = req.params.id;
  if (!(await tweetExists(tweetId))) return res.status(404).json({ message: '글을 찾을 수 없습니다' });
  await db.execute('INSERT IGNORE INTO likes (userId, tweetId) VALUES (?,?)', [req.userId, tweetId]);
  const [[{ count }]] = await db.execute('SELECT COUNT(*) AS count FROM likes WHERE tweetId=?', [tweetId]);
  res.status(200).json({ likeCount: count });
}

export async function unlikeTweet(req, res) {
  const tweetId = req.params.id;
  if (!(await tweetExists(tweetId))) return res.status(404).json({ message: '글을 찾을 수 없습니다' });
  await db.execute('DELETE FROM likes WHERE userId=? AND tweetId=?', [req.userId, tweetId]);
  const [[{ count }]] = await db.execute('SELECT COUNT(*) AS count FROM likes WHERE tweetId=?', [tweetId]);
  res.status(200).json({ likeCount: count });
}
