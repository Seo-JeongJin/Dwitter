import dotenv from 'dotenv'; // .env 파일에 적힌 비밀스러운 환경변수들을 읽어오기 위한 라이브러리
dotenv.config(); // 이 함수를 호출하는 순간, .env 파일의 내용들이 Node.js의 process.env 객체 안으로 들어감

// 환경변수를 읽어올 때 사용하는 필수 검사기(Helper) 함수
// key: 찾고자 하는 환경변수 이름 / defaultValue: 만약 값이 없을 때 대신 사용할 기본값
function required(key, defaultValue = undefined) {
  // process.env에서 값을 찾거나, 없으면 기본값을 사용
  const value = process.env[key] || defaultValue;

  // 값도 없고 기본값도 지정되지 않았다면 (null 또는 undefined)
  if (value == null) {
    // 서버가 실행되자마자 에러를 뿜고 강제로 멈추게 함. (필수 값이 없으면 어차피 나중에 버그가 나니까 미리 막는 것!)
    throw new Error(`Key ${key} is undefined`);
  }
  return value; // 무사히 값을 찾았다면 반환
}

// 외부 파일에서 이 설정값들을 쉽게 꺼내 쓸 수 있도록 객체 형태로 모아서 export
export const config = {
  // JWT 토큰 관련 설정들을 모아둔 그룹
  jwt: {
    // 필수값이므로 기본값 없이 required를 호출. .env에 JWT_SECRET이 없으면 서버가 켜지지 않음
    secretKey: required('JWT_SECRET'),
    // 기본값으로 172800초(2일)를 주었고, dotenv가 읽어온 문자열을 안전하게 정수형(int)으로 변환
    expiresInSec: parseInt(required('JWT_EXPIRES_SEC', 172800)),
  },
  // 비밀번호 암호화(Bcrypt) 관련 설정 그룹
  bcrypt: {
    // 주석에 적어주신 대로, 암호화 반복 횟수는 반드시 숫자여야 하므로 parseInt로 감싸 문자열 에러를 방지(기본값 12)
    saltRounds: parseInt(required('BCRYPT_SALT_ROUNDS', 12)),
  },
  // 서버 호스팅 관련 설정 그룹
  host: {
    // 서버가 실행될 포트 번호. 환경변수가 없으면 기본으로 8080 포트를 사용하도록 설정
    port: parseInt(required('HOST_PORT', 8080)),
  },
};
