import jwt from 'jsonwebtoken'; // 로그인 상태를 증명할 JWT 토큰을 만들 때 사용
import bcrypt from 'bcrypt'; // 사용자의 비밀번호를 안전하게 암호화(해싱)하는 라이브러리
import {} from 'express-async-errors'; // 비동기 에러 처리를 도움
import * as userRepository from '../data/auth.js'; // DB 접근 로직이 담긴 레포지토리를 가져옴
import { config } from '../config.js';

// TODO: Make it secure! -> config.js 로 설정완료
// const jwtSecretKey = 'F2dN7x8HVzBWaQuEEDnhsvHXRWqAR63z'; // 토큰을 생성하고 검증할 때 쓸 마스터키
// const jwtExpiresInDays = 2; // 토큰 만료 시간 설정 (jsonwebtoken에서 숫자로 넘기면 기본 단위가 초(seconds)로 인식되어 2초 후 만료됨. 문자열 '2d'로 적으면 2일이 됨)
// const bcryptSaltRounds = 12; // 비밀번호 암호화를 얼마나 복잡하게 할지 결정하는 수치. (12 정도면 아주 적당하고 안전)

// 회원가입 처리를 담당하는 함수
export async function signup(req, res) {
  const { username, password, name, email, url } = req.body; // 클라이언트가 보낸 폼 데이터를 구조분해할당으로 꺼냄

  // 1. 이미 존재하는 아이디인지 확인
  const found = await userRepository.findByUsername(username);
  if (found) {
    return res.status(409).json({ message: `${username} already exists` }); // 이미 있다면 409(Conflict) 에러
  }

  // 2. 비밀번호를 암호화
  const hashed = await bcrypt.hash(password, config.bcrypt.saltRounds);

  // 3. 암호화된 비밀번호를 포함하여 새로운 유저를 DB에 생성
  const userId = await userRepository.createUser({
    username,
    password: hashed, // 원본 password 대신 해싱된 값을 넣음
    name,
    email,
    url,
  });

  // 4. 가입 성공과 동시에 로그인 상태를 만들어주기 위해 JWT 토큰을 발급
  const token = createJwtToken(userId);
  res.status(201).json({ token, username }); // 201(Created) 응답과 함께 토큰을 클라이언트에 내려줌
}

// 로그인 처리를 담당하는 함수
export async function login(req, res) {
  const { username, password } = req.body;

  // 1. 입력받은 아이디로 유저를 찾음
  const user = await userRepository.findByUsername(username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid user or password' }); // 없으면 401 에러. (보안상 아이디가 틀렸는지 비번이 틀렸는지는 모호하게 알려주는 것이 좋음)
  }

  // 2. 유저가 있다면, 입력한 비밀번호와 DB의 암호화된 비밀번호가 짝이 맞는지 비교
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid user or password' }); // 틀리면 에러
  }

  // 3. 비밀번호까지 맞다면 토큰을 발급하고 로그인에 성공
  const token = createJwtToken(user.id);
  res.status(200).json({ token, username });
}

// 내부적으로 토큰 발급을 재사용하기 위해 만든 헬퍼(Helper) 함수
function createJwtToken(id) {
  // 사용자의 id를 페이로드(내용물)로 담고, 시크릿키로 서명하여 토큰을 만듦
  return jwt.sign({ id }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
  });
}

// 클라이언트가 "나 지금 로그인 된 상태 맞아?" 하고 물어볼 때 처리하는 함수
export async function me(req, res, next) {
  // 앞선 auth 미들웨어(isAuth)가 토큰을 검증하고 req.userId를 넣어두었으므로, 여기서 바로 꺼내 쓸 수 있음
  const user = await userRepository.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  // 유효한 유저라면 정상적으로 정보를 응답 (단, req.token은 미들웨어에서 넘겨주지 않았다면 undefined일 수 있으니 확인이 필요)
  res.status(200).json({ token: req.token, username: user.username });
}
