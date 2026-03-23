// socket.io-client 라이브러리에서 소켓 연결 함수를 가져옴
import socket from 'socket.io-client';

// 소켓 연결을 관리하는 클래스
export default class Socket {
  // baseURL: 연결할 서버 주소, getAccessToken: JWT 토큰을 가져오는 함수
  constructor(baseURL, getAccessToken) {
    // 서버에 소켓 연결 시도. auth 옵션으로 연결 시 JWT 토큰을 함께 전달해 인증된 연결을 맺음
    this.io = socket(baseURL, {
      auth: (cb) => cb({ token: getAccessToken() }),
    });

    // 연결 실패 시 (인증 오류, 서버 다운 등) 에러 메시지를 콘솔에 출력
    this.io.on('connect_error', (err) => {
      console.log('socket error', err.message);
    });
  }

  // 서버에서 특정 이벤트를 수신할 때 호출할 콜백을 등록하는 메서드
  // event: 수신할 이벤트 이름 (예: 'tweets'), callback: 메시지 수신 시 실행할 함수
  onSync(event, callback) {
    // 소켓이 끊겨 있으면 재연결 시도
    if (!this.io.connected) {
      this.io.connect();
    }

    // 서버에서 해당 이벤트가 발생하면 callback 실행
    this.io.on(event, (message) => callback(message));

    // 이벤트 구독 해제 함수를 반환 → 컴포넌트 언마운트 시 호출해 메모리 누수 방지
    return () => this.io.off(event);
  }
}
