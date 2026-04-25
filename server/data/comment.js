import { db } from '../db/database.js';

export async function getByTweetId(tweetId) {
  const [rows] = await db.execute(
    `SELECT c.id, c.text, c.createdAt, c.userId, u.name, u.username
     FROM comments c
     JOIN users u ON c.userId = u.id
     WHERE c.tweetId = ?
     ORDER BY c.createdAt ASC`,
    [tweetId],
  );
  return rows;
}

export async function create(tweetId, userId, text) {
  const [result] = await db.execute(
    'INSERT INTO comments (text, createdAt, userId, tweetId) VALUES (?, NOW(), ?, ?)',
    [text, userId, tweetId],
  );
  const [rows] = await db.execute(
    `SELECT c.id, c.text, c.createdAt, c.userId, u.name, u.username
     FROM comments c JOIN users u ON c.userId = u.id
     WHERE c.id = ?`,
    [result.insertId],
  );
  return rows[0];
}

export async function remove(commentId, userId) {
  const [[comment]] = await db.execute('SELECT userId FROM comments WHERE id=?', [commentId]);
  if (!comment) return null;
  if (comment.userId !== userId) return 'forbidden';
  await db.execute('DELETE FROM comments WHERE id=?', [commentId]);
  return 'ok';
}
