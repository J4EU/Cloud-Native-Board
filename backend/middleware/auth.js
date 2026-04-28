const jwt = require('jsonwebtoken');

// 로그인한 사용자만 통과시키는 미들웨어
module.exports = (req, res, next) => {
  try {
    // 1. 헤더에서 토큰을 가져옴 (보통 'Authorization: Bearer 토큰내용' 형식)
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(403).json({ message: '로그인이 필요한 서비스입니다.' });
    }

    // 2. 토큰이 유효한지 검사
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. 토큰 안에 들어있던 유저 정보(id, username)를 req 객체에 담아서 다음 단계로 넘김
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: '인증되지 않은 사용자입니다.' });
  }
};
