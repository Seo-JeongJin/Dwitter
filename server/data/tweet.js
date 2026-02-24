// 메모리 내 임시 저장소 (실제 서비스에선 DB로 대체됨)
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

// 데이터 전체 조회
export async function getAll() {
  return tweets;
}

// 사용자 이름으로 필터링 조회
export async function getAllByUsername(username) {
  return tweets.filter((tweet) => tweet.username === username);
}

// ID로 단일 조회
export async function getById(id) {
  return tweets.find((tweet) => tweet.id === id);
}

// 데이터 생성 및 추가
export async function create(text, name, username) {
  const tweet = {
    id: Date.now().toString(), // 임시 ID 생성
    text,
    createdAt: new Date(),
    name,
    username,
  };
  tweets = [tweet, ...tweets]; // 배열 맨 앞에 추가
  return tweet;
}

// 데이터 수정
export async function update(id, text) {
  const tweet = tweets.find((tweet) => tweet.id === id);
  if (tweet) {
    tweet.text = text;
  }
  return tweet;
}

// 데이터 삭제
export async function remove(id) {
  tweets = tweets.filter((tweet) => tweet.id !== id);
}
