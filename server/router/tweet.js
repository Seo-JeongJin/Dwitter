import express from 'express';
import 'express-async-errors';
import { body } from 'express-validator';
import * as tweetController from '../controller/tweet.js';
import { isAuth } from '../middleware/auth.js'; // 트윗 조작 전에 사용자의 로그인 여부를 확인하기 위해 가져옴
import { validate } from '../middleware/validator.js';

const router = express.Router();

// 트윗 생성 및 수정 시 클라이언트가 보낸 텍스트 내용을 검증하는 로직
// ✅ isLength에서 실패 → 바로 응답 안 함 → 에러를 내부에 저장 → 마지막 validate에서 한꺼번에 확인 → 에러 응답
const validateTweet = [
  body('text')
    .trim()
    .isLength({ min: 3 })
    .withMessage('text should be at least 3 characters.'),
  validate,
];

// GET /tweets -> 전체 트윗 조회
// GET /tweets?username=:username -> 특정 사용자가 작성한 트윗만 필터링 -> username(key), =:username(value)
// isAuth 미들웨어가 먼저 실행되어, 로그인한 사용자만 트윗 목록을 볼 수 있게 흐름을 제어
router.get('/', isAuth, tweetController.getTweets); // 함수를 호출하면 안됨, 값이 연결되는게 아니라 함수를 연결해주어야 함

// GET /tweets/:id -> 특정 트윗 하나만 상세히 보고싶을 때
// 마찬가지로 토큰 인증(isAuth)을 거친 후에만 컨트롤러에 접근할 수 있음
router.get('/:id', isAuth, tweetController.getTweet);
// POST /tweets -> request body로부터 받아서 새로운 tweet 생성
// 인증 확인(isAuth) -> 입력된 트윗 내용 검증(validateTweet) -> 통과 시 실제 DB 생성 로직(tweetController.createTweet) 순서로 실행됨
router.post('/', isAuth, validateTweet, tweetController.createTweet);

// PUT /tweets/:id -> 이미 작성된 특정 트윗의 내용을 수정
// 새 트윗 작성과 똑같이 로그인 확인 후, 입력받은 수정 내용이 3글자 이상인지 검증한 뒤 로직을 처리
router.put('/:id', isAuth, validateTweet, tweetController.updateTweet);

// DELETE /tweets/:id -> 특정 트윗 삭제
// 삭제는 별도로 body에 text를 보내지 않으므로 내용 검증(validateTweet)은 뺐고, 로그인 권한(isAuth)만 확인
router.delete('/:id', isAuth, tweetController.deleteTweet);

export default router;

// 🔹 1단계 — isLength 실패

// 여기서 일어나는 일:

// ❌ 조건 실패
// → 에러 객체 생성
// → req 안에 저장됨
// → 다음 체인으로 계속 진행

// ⚠️ 여기서 응답 안 보냄
// ⚠️ 여기서 멈추지도 않음

// 🔹 2단계 — withMessage 적용
// 기본 에러 메시지 대신
// "text should be at least 3 characters." 저장

// 🔹 3단계 — validate 미들웨어 도착
// const errors = validationResult(req);

// 여기서:
// 지금까지 누적된 검증 에러들 전부 가져옴

// 🔹 4단계 — validate가 판정
// if (!errors.isEmpty()) {
//   return res.status(400).json({
//     message: errors.array()[0].msg
//   });
// }
// → 여기서 처음으로 응답을 보낸다
