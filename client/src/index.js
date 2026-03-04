import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AuthService from './service/auth';
import TweetService from './service/tweet';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuthErrorEventBus } from './context/AuthContext';
import HttpClient from './network/http';
import TokenStorage from './db/token'; // 🌟 새로 추가됨: 브라우저에 토큰을 저장하고 읽어오는 역할을 담당하는 클래스

// 환경 변수에서 백엔드 서버의 주소를 가져오기
const baseURL = process.env.REACT_APP_BASE_URL;

// 1. 필요한 도구(인스턴스)들을 독립적으로 하나씩 생성
const tokenStorage = new TokenStorage(); // 토큰 저장소 객체 생성
const httpClient = new HttpClient(baseURL); // 서버 통신용 HTTP 객체 생성
const authErrorEventBus = new AuthErrorEventBus(); // 인증 에러 발생 시 앱 전체에 알림을 주는 이벤트 버스 생성

// 2. 서비스 객체들을 생성할 때, 앞서 만든 도구들을 '부품처럼 끼워 넣어(주입)' 줌
// 이제 authService와 tweetService는 내부적으로 tokenStorage를 사용해 안전하게 토큰을 꺼내 쓸 수 있게 됨
const authService = new AuthService(httpClient, tokenStorage);
const tweetService = new TweetService(httpClient, tokenStorage);

// 3. 만들어진 도구와 서비스들을 리액트 앱의 최상단에 제공하며 렌더링을 시작
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* AuthProvider에 authService와 에러 이벤트 버스를 전달하여, 앱 전역에서 로그인 상태를 관리하게 함 */}
      <AuthProvider
        authService={authService}
        authErrorEventBus={authErrorEventBus}
      >
        {/* App 컴포넌트에는 트윗 관련 로직을 처리하는 tweetService를 전달 */}
        <App tweetService={tweetService} />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'), // index.html의 <div id="root"></div> 부분에 이 모든 화면을 그림
);
