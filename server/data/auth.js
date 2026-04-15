import { db } from '../db/database.js';

// 회원가입이나 로그인 시, 입력받은 username과 일치하는 유저가 있는지 배열에서 찾아서 반환
export async function findByUsername(username) {
  // return users.find((user) => user.username === username);
  return db
    .execute('SELECT * FROM users WHERE username=?', [username]) //
    .then((result) => result[0][0]);
}

// 토큰을 검증하거나 특정 유저의 상세 정보가 필요할 때, 고유 id를 이용해 유저를 찾음
export async function findById(id) {
  // return users.find((user) => user.id === id);
  return db
    .execute('SELECT * FROM users WHERE id=?', [id]) //
    .then((result) => result[0][0]);
}

// 새로운 사용자를 생성(회원가입)하는 함수
export async function createUser(user) {
  // 클라이언트가 보낸 유저 정보에, 현재 시간(Date.now)을 문자열로 만들어 임시 고유 ID로 부여
  // const created = { ...user, id: Date.now().toString() };
  // users.push(created); // 배열에 새 유저를 추가함
  // return created.id; // 방금 생성된 유저의 ID만 컨트롤러로 반환
  const { username, password, name, email, url } = user;
  return db
    .execute(
      'INSERT INTO users (username, password, name, email, url) VALUES (?,?,?,?,?)',
      [username, password, name, email, url],
    )
    .then((result) => result[0].insertId);
}
