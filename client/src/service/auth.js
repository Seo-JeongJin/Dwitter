export default class AuthService {
  // index.js에서 생성된 http(서버 통신용)와 tokenStorage(토큰 관리용) 객체를 전달받아 내부 변수로 저장
  constructor(http, tokenStorage) {
    this.http = http;
    this.tokenStorage = tokenStorage;
  }

  // 회원가입 요청을 처리
  async signup(username, password, name, email, url) {
    // 1. http 객체를 사용해 '/auth/signup' 경로로 POST 요청
    const data = await this.http.fetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
        name,
        email,
        url,
      }),
    });
    // 2. 서버가 응답으로 준 데이터 안에 있는 토큰을 tokenStorage를 이용해 브라우저에 저장
    this.tokenStorage.saveToken(data.token);
    return data; // 컴포넌트(UI) 쪽에서 쓸 수 있도록 결과 데이터를 반환
  }

  // 로그인 요청을 처리
  async login(username, password) {
    // 1. 아이디와 비밀번호를 서버로 전송
    const data = await this.http.fetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    // 2. 로그인이 성공하면 발급된 토큰을 즉시 저장소에 보관
    this.tokenStorage.saveToken(data.token);
    return data;
  }

  // 현재 로그인된 사용자의 정보를 서버에 확인하는 함수
  async me() {
    // 1. 저장소에서 현재 보관 중인 토큰을 꺼내옴
    const token = this.tokenStorage.getToken();
    // 2. 서버의 '/auth/me'로 요청을 보낼 때, 헤더(headers)에 'Bearer [토큰]' 형태로 인증서를 첨부해서 보냄
    return this.http.fetch('/auth/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // 로그아웃 요청을 처리
  async logout() {
    // 복잡한 서버 요청 없이, 단순히 브라우저 저장소에 있는 토큰만 싹 지워버리면 로그아웃이 완료
    this.tokenStorage.clearToken();
  }
}
