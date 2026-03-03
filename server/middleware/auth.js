import jwt from 'jsonwebtoken'; // JWT(JSON Web Token)를 검증하고 해독하기 위한 라이브러리
import * as userRepository from '../data/auth.js'; // DB(또는 메모리)에서 사용자 정보를 찾기 위한 저장소 모듈을 가져옴

// 인증 실패 시 클라이언트에게 일관되게 보내줄 에러 메시지 객체를 미리 정의
const AUTH_ERROR = { message: 'Authentication Error' };

// 외부에서 이 인증 미들웨어를 사용할 수 있도록 export
export const isAuth = async (req, res, next) => {
  // 1. 클라이언트가 보낸 요청(req)의 헤더(Header)에서 'Authorization' 값을 꺼냄
  const authHeader = req.get('Authorization');

  // 2. 헤더에 값이 없거나, 그 값이 'Bearer '로 시작하지 않는다면 (정상적인 토큰 형태가 아니라면)
  if (!(authHeader && authHeader.startsWith('Bearer '))) {
    // 401(Unauthorized) 상태 코드와 함께 에러를 바로 반환하고 함수를 끝냄
    return res.status(401).json(AUTH_ERROR);
  }

  // 3. 'Bearer [토큰값]' 형태의 문자열에서 띄어쓰기를 기준으로 쪼개어, 실제 [토큰값]만 추출
  const token = authHeader.split(' ')[1];

  // TODO: Make it secure! (비밀키는 환경변수로 관리하는 것이 안전)
  // 4. jsonwebtoken 라이브러리를 사용해 추출한 토큰이 진짜 우리가 발급한 게 맞는지, 유효기간이 안 지났는지 검증
  jwt.verify(
    token,
    'F2dN7x8HVzBWaQuEEDnhsvHXRWqAR63z', // 우리가 토큰을 만들 때 사용했던 비밀키(Secret Key)
    async (error, decoded) => {
      // 4-1. 토큰이 조작되었거나 만료되어서 에러가 발생했다면?
      if (error) {
        return res.status(401).json(AUTH_ERROR); // 역시 401 에러를 응답
      }

      // 4-2. 토큰 검증에 성공했다면, 해독된 정보(decoded) 안에서 사용자 ID(id)를 꺼내 DB에 실제로 존재하는 유저인지 검색
      const user = await userRepository.findById(decoded.id);

      // 4-3. 토큰은 정상인데, 만약 그 사이에 회원이 탈퇴해서 DB에 정보가 없다면?
      if (!user) {
        return res.status(401).json(AUTH_ERROR); // 인증 에러를 냄
      }

      // 5. 모든 검증을 완벽하게 통과함!
      // 다음 미들웨어나 컨트롤러에서 이 유저가 누군지 바로 알 수 있도록, 요청(req) 객체에 'userId'라는 이름으로 직접 데이터를 달아줌
      req.userId = user.id; // req.customData 역할을 함

      // 6. 현재 미들웨어의 역할은 끝났으니, 다음 목적지(컨트롤러 등)로 무사히 넘어가라고 문을 열어줌
      next();
    },
  );
};
