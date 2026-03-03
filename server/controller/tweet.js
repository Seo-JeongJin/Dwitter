import * as tweetRepository from '../data/tweet.js'; // 데이터 처리 담당 레이어 임포트

// 모든 트윗 혹은 특정 사용자 트윗 가져오기
export async function getTweets(req, res) {
  const username = req.query.username; // URL의 ?username=xxx 부분에서 값을 추출

  // 삼항 연산자를 사용해 쿼리에 이름이 있으면 필터링 함수를, 없으면 전체 조회 함수를 호출
  const data = await (username
    ? tweetRepository.getAllByUsername(username)
    : tweetRepository.getAll());
  res.status(200).json(data); // 성공(200) 응답과 함께 데이터 전송
}

// 특정 ID의 트윗 하나 가져오기
export async function getTweet(req, res, next) {
  const id = req.params.id; // URL 경로의 /tweets/:id 에서 id 값을 추출
  const tweet = await tweetRepository.getById(id);

  if (tweet) {
    res.status(200).json(tweet); // 트윗이 존재하면 응답
  } else {
    res.status(404).json({ message: `Tweet id(${id}) not found` }); // 없으면 404(Not Found) 에러
  }
}

// 새로운 트윗 생성하기
export async function createTweet(req, res, next) {
  const { text } = req.body; // 클라이언트가 보낸 내용(text)을 가져옴

  // 트윗을 만들 때, 누가 작성했는지 알기 위해 isAuth 미들웨어가 꽂아준 req.userId를 함께 넘김
  const tweet = await tweetRepository.create(text, req.userId);
  res.status(201).json(tweet); // 데이터가 새로 생성되었으므로 201 상태 코드를 보냄
}

// 트윗 수정하기
export async function updateTweet(req, res, next) {
  const id = req.params.id;
  const text = req.body.text;

  // 무작정 수정하지 않고, 일단 해당 트윗이 존재하는지부터 찾음
  const tweet = await tweetRepository.getById(id);
  if (!tweet) {
    return res.status(404).json({ message: `Tweet not found: ${id}` });
  }

  // ★ 권한 검사: 트윗에 적힌 작성자 ID(tweet.userId)와 현재 로그인한 유저의 ID(req.userId)가 다르면
  // 403(Forbidden, 금지됨) 에러를 반환하여 남의 글을 수정하지 못하게 막음
  if (tweet.userId !== req.userId) {
    return res.sendStatus(403);
  }

  // 모든 검사를 통과했을 때만 업데이트를 진행
  const updated = await tweetRepository.update(id, text);
  res.status(200).json(updated);
}

// 트윗 삭제하기
export async function deleteTweet(req, res, next) {
  const id = req.params.id;

  // 수정과 동일하게, 존재하는지 먼저 확인
  const tweet = await tweetRepository.getById(id);
  if (!tweet) {
    return res.status(404).json({ message: `Tweet not found: ${id}` });
  }

  // ★ 권한 검사: 남의 트윗을 마음대로 지울 수 없도록 403 에러로 차단
  if (tweet.userId !== req.userId) {
    return res.sendStatus(403);
  }

  // 안전하게 삭제를 수행
  await tweetRepository.remove(id);
  res.sendStatus(204); // 204(No Content)는 "요청이 성공했고, 클라이언트에게 돌려줄 데이터는 딱히 없다"는 의미의 표준 응답
}
