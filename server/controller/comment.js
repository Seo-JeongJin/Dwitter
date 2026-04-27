import { db } from '../db/database.js';
import * as commentRepository from '../data/comment.js';

async function tweetExists(tweetId) {
  const [[row]] = await db.execute('SELECT id FROM tweets WHERE id=?', [tweetId]);
  return !!row;
}

export async function getComments(req, res) {
  const data = await commentRepository.getByTweetId(req.params.tweetId);
  res.status(200).json(data);
}

export async function addComment(req, res) {
  if (!(await tweetExists(req.params.tweetId))) {
    return res.status(404).json({ message: '글을 찾을 수 없습니다' });
  }
  const comment = await commentRepository.create(req.params.tweetId, req.userId, req.body.text);
  res.status(201).json(comment);
}

export async function deleteComment(req, res) {
  const result = await commentRepository.remove(req.params.commentId, req.userId);
  if (!result) return res.status(404).json({ message: '댓글을 찾을 수 없습니다' });
  if (result === 'forbidden') return res.status(403).json({ message: '삭제 권한이 없습니다' });
  res.sendStatus(204);
}
