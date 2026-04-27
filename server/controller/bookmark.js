import { db } from '../db/database.js';

async function tweetExists(tweetId) {
  const [[row]] = await db.execute('SELECT id FROM tweets WHERE id=?', [tweetId]);
  return !!row;
}

export async function bookmarkTweet(req, res) {
  const tweetId = req.params.id;
  if (!(await tweetExists(tweetId))) return res.status(404).json({ message: '글을 찾을 수 없습니다' });
  await db.execute('INSERT IGNORE INTO bookmarks (userId, tweetId) VALUES (?,?)', [req.userId, tweetId]);
  res.status(200).json({ isBookmarked: true });
}

export async function unbookmarkTweet(req, res) {
  const tweetId = req.params.id;
  if (!(await tweetExists(tweetId))) return res.status(404).json({ message: '글을 찾을 수 없습니다' });
  await db.execute('DELETE FROM bookmarks WHERE userId=? AND tweetId=?', [req.userId, tweetId]);
  res.status(200).json({ isBookmarked: false });
}
