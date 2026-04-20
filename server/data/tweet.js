import { db } from '../db/database.js';

const SELECT_JOIN = `
  SELECT tw.id, tw.text, tw.createdAt, tw.userId, tw.channel,
         u.name, u.username
  FROM tweets tw
  JOIN users u ON tw.userId = u.id
`;

export async function getAll(channel, limit, offset) {
  const lim = parseInt(limit) || 20;
  const off = parseInt(offset) || 0;
  if (channel) {
    return db
      .execute(
        `${SELECT_JOIN} WHERE tw.channel=? ORDER BY tw.createdAt DESC LIMIT ${lim} OFFSET ${off}`,
        [channel],
      )
      .then(([rows]) => rows);
  }
  return db
    .execute(`${SELECT_JOIN} ORDER BY tw.createdAt DESC LIMIT ${lim} OFFSET ${off}`)
    .then(([rows]) => rows);
}

export async function getAllByUsername(username, limit, offset) {
  const lim = parseInt(limit) || 20;
  const off = parseInt(offset) || 0;
  return db
    .execute(
      `${SELECT_JOIN} WHERE u.username=? ORDER BY tw.createdAt DESC LIMIT ${lim} OFFSET ${off}`,
      [username],
    )
    .then(([rows]) => rows);
}

export async function getById(id) {
  return db
    .execute(`${SELECT_JOIN} WHERE tw.id=?`, [id])
    .then(([rows]) => rows[0]);
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
