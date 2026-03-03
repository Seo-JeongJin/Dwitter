// 유저 정보를 가져오기 위해 auth.js에 있는 함수들을 userRepository라는 이름으로 몽땅 가져옴
import * as userRepository from './auth.js';

// 실제 DB를 대신할 메모리 상의 트윗 배열
let tweets = [
  {
    id: '1',
    text: '화이팅!',
    createdAt: new Date().toString(),
    userId: '1', // "이 트윗은 1번 유저(Bob)가 썼어!" 라는 정보만 가짐. (관계형 데이터베이스의 외래키 역할)
  },
  {
    id: '2',
    text: '안뇽!',
    createdAt: new Date().toString(),
    userId: '1',
  },
];

// 모든 트윗을 조회하는 함수
export async function getAll() {
  // 트윗 배열을 돌면서 각각의 트윗에 작성자의 상세 정보를 붙여줌
  return Promise.all(
    tweets.map(async (tweet) => {
      // 트윗의 userId를 이용해 userRepository에서 유저 정보를 비동기로 찾아옴
      const { username, name, url } = await userRepository.findById(
        tweet.userId,
      );
      // 기존 트윗 정보(...tweet)에 찾아온 유저 정보(username, name, url)를 덮어씌워 완전한 객체로 반환
      return { ...tweet, username, name, url };
    }),
  );
}

// 특정 사용자가 작성한 트윗만 필터링하는 함수
export async function getAllByUsername(username) {
  // 위에서 만든 getAll()을 먼저 호출해서 유저 정보가 모두 합쳐진 트윗 목록을 얻은 뒤, username으로 필터링
  return getAll().then((tweets) =>
    tweets.filter((tweet) => tweet.username === username),
  );
}

// 특정 ID의 트윗 하나만 조회하는 함수
export async function getById(id) {
  const found = tweets.find((tweet) => tweet.id === id);
  if (!found) {
    return null; // 못 찾으면 null 반환
  }
  // 찾았다면, 역시 해당 작성자의 정보를 DB(auth.js)에서 가져옴
  const { username, name, url } = await userRepository.findById(found.userId);
  return { ...found, username, name, url }; // 트윗 정보와 유저 정보를 합쳐서 반환!
}

// 새로운 트윗을 작성하는 함수
export async function create(text, userId) {
  const tweet = {
    id: Date.now().toString(),
    text,
    createdAt: new Date(),
    userId, // 컨트롤러에서 받아온 로그인된 유저의 ID를 그대로 저장
  };
  tweets = [tweet, ...tweets]; // 최신 트윗이 맨 위에 오도록 배열의 맨 앞에 추가

  // 방금 만든 트윗의 상세 정보(유저 정보가 포함된)를 반환하기 위해 getById를 재사용.
  return getById(tweet.id);
}

// 트윗 내용을 수정하는 함수
export async function update(id, text) {
  const tweet = tweets.find((tweet) => tweet.id === id);
  if (tweet) {
    tweet.text = text; // 배열 내의 객체 속성을 직접 변경
  }
  return getById(tweet.id); // 업데이트된 내용을 유저 정보와 함께 반환
}

// 트윗을 삭제하는 함수
export async function remove(id) {
  // 삭제하려는 id와 다른 트윗들만 남기는 방식(filter)으로 삭제를 구현
  tweets = tweets.filter((tweet) => tweet.id !== id);
}
