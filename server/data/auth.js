import { db } from '../db/database.js';

export async function findByUsername(username) {
  return db
    .execute('SELECT * FROM users WHERE username=?', [username])
    .then(([rows]) => rows[0]);
}

export async function findById(id) {
  return db
    .execute('SELECT * FROM users WHERE id=?', [id])
    .then(([rows]) => rows[0]);
}

export async function createUser({ username, password, name }) {
  return db
    .execute(
      'INSERT INTO users (username, password, name) VALUES (?,?,?)',
      [username, password, name],
    )
    .then(([result]) => result.insertId);
}
