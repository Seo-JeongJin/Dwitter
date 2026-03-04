// 로컬 스토리지에 토큰을 저장할 때 사용할 '키(Key)' 이름을 문자열 상수로 미리 정의
const TOKEN = 'token';

// 외부에서 이 클래스를 생성해서 쓸 수 있도록 export default로 내보냄
export default class TokenStorage {
  // 1. 발급받은 토큰 저장하기
  saveToken(token) {
    // 브라우저가 기본적으로 제공하는 Web Storage API인 localStorage를 사용
    // setItem('키', '값') 형태로 데이터를 영구적으로(브라우저를 꺼도 유지됨) 저장
    localStorage.setItem(TOKEN, token);
  }

  // 2. 저장된 토큰 불러오기
  getToken() {
    // getItem('키')를 사용해 로컬 스토리지에 저장된 해당 키의 값을 읽어와서 반환
    // 만약 저장된 토큰이 없다면 null을 반환
    return localStorage.getItem(TOKEN);
  }

  // 3. 토큰 삭제하기 (로그아웃 시 사용)
  clearToken() {
    // ⚠️ 여기서 한 가지 중요한 리팩토링 꿀팁을 드릴게요!
    // localStorage.clear()는 브라우저 로컬 스토리지의 '모든 데이터'를 통째로 날려버리는 함수라서, 원래 괄호 안에 인자를 받지 않습니다.
    // 만약 다른 데이터는 남겨두고 토큰만 딱 골라서 삭제하고 싶다면 `localStorage.removeItem(TOKEN);` 을 사용하는 것이 웹 표준에 맞는 훨씬 안전하고 정확한 방법입니다!
    localStorage.clear(TOKEN);
  }
}
