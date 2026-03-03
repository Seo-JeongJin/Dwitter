// abcd1234: $2b$12$G9xf8SFq3oTEgdj7ozHQ/uhDOyeQcUEDU8tnOcvpvApuadr3nE5Vm
// 실제 DB를 대신할 메모리 상의 사용자 배열. 서버가 재시작되면 초기화됨
let users = [
  {
    id: '1',
    username: 'bob',
    // 비밀번호는 절대 원본(평문)으로 저장하면 안됨. bcrypt 등을 사용해 암호화된 상태로 저장된 모습
    password: '$2b$12$G9xf8SFq3oTEgdj7ozHQ/uhDOyeQcUEDU8tnOcvpvApuadr3nE5Vm',
    name: 'Bob',
    email: 'bob@gmail.com',
    url: 'https://widgetwhats.com/app/uploads/2019/11/free-profile-photo-whatsapp-1.png',
  },
];

// 회원가입이나 로그인 시, 입력받은 username과 일치하는 유저가 있는지 배열에서 찾아서 반환
export async function findByUsername(username) {
  return users.find((user) => user.username === username);
}

// 토큰을 검증하거나 특정 유저의 상세 정보가 필요할 때, 고유 id를 이용해 유저를 찾음
export async function findById(id) {
  return users.find((user) => user.id === id);
}

// 새로운 사용자를 생성(회원가입)하는 함수
export async function createUser(user) {
  // 클라이언트가 보낸 유저 정보에, 현재 시간(Date.now)을 문자열로 만들어 임시 고유 ID로 부여
  const created = { ...user, id: Date.now().toString() };
  users.push(created); // 배열에 새 유저를 추가함
  return created.id; // 방금 생성된 유저의 ID만 컨트롤러로 반환
}
