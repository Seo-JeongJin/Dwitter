import { db } from '../db/database.js';

const buildQuery = (userId, where = '') => `
  SELECT tw.id, tw.text, tw.createdAt, tw.userId, tw.channel,
         u.name, u.username,
         COUNT(l.id) AS likeCount,
         EXISTS(SELECT 1 FROM likes WHERE userId=${parseInt(userId) || 0} AND tweetId=tw.id) AS isLiked,
         EXISTS(SELECT 1 FROM bookmarks WHERE userId=${parseInt(userId) || 0} AND tweetId=tw.id) AS isBookmarked
  FROM tweets tw
  JOIN users u ON tw.userId = u.id
  LEFT JOIN likes l ON l.tweetId = tw.id
  ${where}
  GROUP BY tw.id, tw.text, tw.createdAt, tw.userId, tw.channel, u.name, u.username
`;

export async function getAll(channel, limit, offset, userId) {
  const lim = parseInt(limit) || 20;
  const off = parseInt(offset) || 0;
  if (channel) {
    return db
      .execute(
        `${buildQuery(userId, 'WHERE tw.channel=?')} ORDER BY tw.createdAt DESC LIMIT ${lim} OFFSET ${off}`,
        [channel],
      )
      .then(([rows]) => rows);
  }
  return db
    .execute(`${buildQuery(userId)} ORDER BY tw.createdAt DESC LIMIT ${lim} OFFSET ${off}`)
    .then(([rows]) => rows);
}

export async function getAllByUsername(username, limit, offset, userId) {
  const lim = parseInt(limit) || 20;
  const off = parseInt(offset) || 0;
  return db
    .execute(
      `${buildQuery(userId, 'WHERE u.username=?')} ORDER BY tw.createdAt DESC LIMIT ${lim} OFFSET ${off}`,
      [username],
    )
    .then(([rows]) => rows);
}

export async function getById(id, userId = 0) {
  return db
    .execute(`${buildQuery(userId, 'WHERE tw.id=?')} ORDER BY tw.createdAt DESC`, [id])
    .then(([rows]) => rows[0]);
}

export async function getBookmarked(userId, limit, offset) {
  const lim = parseInt(limit) || 20;
  const off = parseInt(offset) || 0;
  return db
    .execute(
      `${buildQuery(userId, 'JOIN bookmarks b ON b.tweetId = tw.id WHERE b.userId=?')} ORDER BY tw.createdAt DESC LIMIT ${lim} OFFSET ${off}`,
      [userId],
    )
    .then(([rows]) => rows);
}

export async function create(text, userId, channel = 'general') {
  return db
    .execute(
      'INSERT INTO tweets (text, userId, createdAt, channel) VALUES (?,?,NOW(),?)',
      [text, userId, channel],
    )
    .then(([result]) => getById(result.insertId));
}

export async function update(id, text) {
  return db
    .execute('UPDATE tweets SET text=? WHERE id=?', [text, id])
    .then(() => getById(id));
}

export async function remove(id) {
  return db.execute('DELETE FROM tweets WHERE id=?', [id]);
}
