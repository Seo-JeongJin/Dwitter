import * as tweetRepository from '../data/tweet.js'; // 데이터 처리 담당 레이어 임포트

// 모든 트윗 혹은 특정 사용자 트윗 가져오기
export async function getTweets(req, res) {
  const username = req.query.username; // 쿼리 스트링에서 사용자 이름 추출
  const data = await (username
    ? tweetRepository.getAllByUsername(username) // 이름이 있으면 필터링 요청
    : tweetRepository.getAll()); // 이름이 없으면 전체 요청
  res.status(200).json(data); // 성공(200) 응답과 함께 데이터 전송
}

// 특정 ID의 트윗 하나 가져오기
export async function getTweet(req, res, next) {
  const id = req.params.id; // URL 파라미터에서 ID 추출
  const tweet = await tweetRepository.getById(id);
  if (tweet) {
    res.status(200).json(tweet); // 트윗이 존재하면 응답
  } else {
    res.status(404).json({ message: `Tweet id(${id}) not found` }); // 없으면 404 에러
  }
}

// 새로운 트윗 생성하기
export async function createTweet(req, res, next) {
  const { text, name, username } = req.body; // 요청 본문(body)에서 데이터 추출
  const tweet = await tweetRepository.create(text, name, username);
  res.status(201).json(tweet); // 생성 성공(201) 응답
}

// 트윗 수정하기
export async function updateTweet(req, res, next) {
  const id = req.params.id;
  const text = req.body.text;
  const tweet = await tweetRepository.update(id, text);
  if (tweet) {
    res.status(200).json(tweet);
  } else {
    res.status(404).json({ message: `Tweet id(${id}) not found` });
  }
}

// 트윗 삭제하기
export async function deleteTweet(req, res, next) {
  const id = req.params.id;
  await tweetRepository.remove(id);
  res.sendStatus(204); // 성공했지만 보낼 콘텐츠가 없음(204) 처리
}
