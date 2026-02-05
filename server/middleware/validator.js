import { validationResult } from 'express-validator';

// 에러 없음 → next() → controller 실행
// 에러 있음 → 400 응답 → controller 안 감
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ message: errors.array()[0].msg });
};
