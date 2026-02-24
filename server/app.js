import express from 'express'; // Express 프레임워크 임포트
import cors from 'cors'; // Cross-Origin Resource Sharing(CORS) 설정을 위한 미들웨어
import morgan from 'morgan'; // HTTP 요청 로깅을 위한 미들웨어
import helmet from 'helmet'; // 공통적인 보안 헤더 설정을 통해 앱을 보호하는 미들웨어
import 'express-async-errors'; // 비동기 에러 처리를 간편하게 해주는 라이브러리
import tweetRouter from './router/tweet.js'; // 트윗 관련 라우터 임포트

const app = express(); // Express 애플리케이션 객체 생성

// --- 미들웨어 설정 ---
app.use(express.json()); // 요청의 본문(body)을 JSON으로 파싱할 수 있게 해줌
app.use(helmet()); // 보안 관련 HTTP 헤더 설정
app.use(cors()); // 모든 도메인에서의 리소스 요청을 허용 (CORS 설정)
app.use(morgan('tiny')); // 터미널에 최소한의 정보로 요청 로그를 남김

// --- 라우팅 설정 ---
app.use('/tweets', tweetRouter); // '/tweets'로 시작하는 모든 요청은 tweetRouter에서 처리

// --- 에러 처리 설정 ---
// 1. 요청한 페이지나 경로가 없을 때 (404 Not Found)
app.use((req, res, next) => {
  res.sendStatus(404);
});

// 2. 서버 내부에서 에러가 발생했을 때 (500 Internal Server Error)
app.use((error, req, res, next) => {
  console.error(error); // 에러 내용을 콘솔에 출력
  res.sendStatus(500); // 클라이언트에게 500 상태 코드 전송
});

// 서버 실행
app.listen(8080); // 8080 포트에서 서버를 대기시킴
