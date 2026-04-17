import express from 'express';
import { body } from 'express-validator'; // 클라이언트가 보낸 요청의 'body' 데이터를 검증하기 위한 함수
import { validate } from '../middleware/validator.js'; // express-validator의 에러 결과를 최종적으로 확인하고 응답을 보내는 커스텀 미들웨어
import * as authController from '../controller/auth.js'; // 실제 회원가입, 로그인 등의 비즈니스 로직이 들어있는 컨트롤러
import { isAuth } from '../middleware/auth.js'; // 요청을 보낸 사용자가 로그인 상태인지(토큰이 유효한지) 확인하는 커스텀 미들웨어

const router = express.Router();

// 로그인과 회원가입 시 공통으로 사용되는 '아이디/비밀번호' 검증 미들웨어 배열
const validateCredential = [
  body('username') // 요청 바디의 'username' 필드를 타겟으로 잡음
    .trim() // 양끝에 실수로 들어간 공백을 제거
    .notEmpty() // 값이 비어있지 않은지 확인
    .withMessage('username should be at least 5 characters'), // 조건에 맞지 않을 때 띄워줄 에러 메시지
  body('password') // 요청 바디의 'password' 필드를 타겟으로 잡음
    .trim() // 공백을 제거
    .isLength({ min: 5 }) // 비밀번호가 최소 5글자 이상인지 확인
    .withMessage('password should be at least 5 characters'), // 조건에 맞지 않을 때의 에러 메시지
  validate, // 위에서 체인으로 연결된 검사들 중 하나라도 실패하면, 이 validate 미들웨어가 에러를 클라이언트에게 반환
];

// 회원가입 시에만 추가로 필요한 정보들을 검증하는 미들웨어 배열
const validateSignup = [
  ...validateCredential, // 위에 만들어둔 아이디/비밀번호 검증 로직을 전개 구문(...)으로 그대로 가져와 재사용
  body('name').notEmpty().withMessage('name is missing'),
  validate,
];

// POST /signup 라우트: 회원가입 요청이 오면 -> validateSignup을 거쳐 데이터가 안전한지 확인하고 -> 안전하면 authController.signup을 실행
router.post('/signup', validateSignup, authController.signup);

// POST /login 라우트: 로그인 요청이 오면 -> validateCredential을 거쳐 아이디/비번만 확인하고 -> 통과하면 authController.login을 실행
router.post('/login', validateCredential, authController.login);

// GET /me 라우트: 내 정보를 조회하는 요청이 오면 -> isAuth 미들웨어로 현재 유효한 로그인 토큰이 있는지 확인하고 -> 확인되면 authController.me를 실행
router.get('/me', isAuth, authController.me);

export default router;
