import * as commentRepository from '../data/comment.js';

export async function getComments(req, res) {
  const data = await commentRepository.getByTweetId(req.params.tweetId);
  res.status(200).json(data);
}

export async function addComment(req, res) {
  const comment = await commentRepository.create(req.params.tweetId, req.userId, req.body.text);
  res.status(201).json(comment);
}

export async function deleteComment(req, res) {
  const result = await commentRepository.remove(req.params.commentId, req.userId);
  if (!result) return res.sendStatus(404);
  if (result === 'forbidden') return res.sendStatus(403);
  res.sendStatus(204);
}
