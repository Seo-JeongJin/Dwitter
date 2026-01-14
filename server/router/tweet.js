import express from 'express';
import 'express-async-errors';
import * as tweetController from '../controller/tweet.js';
const router = express.Router();

// GET /tweets -> 전체 트윗 조회
// GET /tweets?username=:username -> 특정 사용자가 작성한 트윗만 필터링 -> username(key), =:username(value)
router.get('/', tweetController.getTweets); // 함수를 호출하면 안됨, 값이 연결되는게 아니라 함수를 연결해주어야 함

// GET /tweets/:id -> 특정 트윗 하나만 상세히 보고싶을 때
router.get('/:id', tweetController.getTweet);
// POST /tweets -> request body로부터 받아서 새로운 tweet 생성
router.post('/', tweetController.createTweet);

// PUT /tweets/:id -> 이미 작성된 특정 트윗의 내용을 수정
router.put('/:id', tweetController.updateTweet);

// DELETE /tweets/:id -> 특정 트윗 삭제
router.delete('/:id', tweetController.deleteTweet);

export default router;
