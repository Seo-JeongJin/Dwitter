import express from 'express';
import 'express-async-errors';

// db 모르는 상태이므로 일단 배열에
let tweets = [
  {
    id: '1',
    text: '첫 게시물',
    createdAt: Date.now().toString(),
    name: 'Bob',
    username: 'bob',
    url: 'https://widgetwhats.com/app/uploads/2019/11/free-profile-photo-whatsapp-1.png',
  },
  {
    id: '2',
    text: 'Hi',
    createdAt: Date.now().toString(),
    name: 'Ellie',
    username: 'ellie',
  },
];
const router = express.Router();

// GET /tweets -> 전체 트윗 조회
// GET /tweets?username=:username -> 특정 사용자가 작성한 트윗만 필터링 -> username(key), =:username(value)
router.get('/', (req, res, next) => {
  const username = req.query.username;
  const data = username
    ? tweets.filter((tweet) => tweet.username === username)
    : tweets;
  res.status(200).json(data);
});

// GET /tweets/:id -> 특정 트윗 하나만 상세히 보고싶을 때
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  const tweet = tweets.find((tweet) => tweet.id === id);
  if (tweet) {
    res.status(200).json(tweet);
  } else {
    res.status(404).json({ message: `Tweet id(${id}) not found` });
  }
});
// POST /tweets -> request body로부터 받아서 새로운 tweet 생성
router.post('/', (req, res, next) => {
  const { text, name, username } = req.body;
  const tweet = {
    id: Date.now().toString(),
    text,
    createdAt: new Date(),
    name,
    username,
  };
  tweets = [tweet, ...tweets];
  res.status(201).json(tweet);
});

// PUT /tweets/:id -> 이미 작성된 특정 트윗의 내용을 수정
router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  const text = req.body.text;
  const tweet = tweets.find((tweet) => tweet.id === id);
  if (tweet) {
    tweet.text = text;
    res.status(200).json(tweet);
  } else {
    res.status(404).json({ message: `Tweet id(${id}) not found` });
  }
});

// DELETE /tweets/:id -> 특정 트윗 삭제
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  tweets = tweets.filter((tweet) => tweet.id !== id);
  res.sendStatus(204);
});
export default router;
