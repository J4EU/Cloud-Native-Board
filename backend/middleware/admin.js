// 관리자만 통과시키는 미들웨어
module.exports = (req, res, next) => {
  // auth 미들웨어를 먼저 거치기 때문에 req.user 정보가 이미 있는 상태
  if (req.user && req.user.role === 'admin') {
    next(); // 관리자면 통과
  } else {
    res.status(403).json({ message: '관리자 권한이 필요합니다. 접근이 거부되었습니다.' });
  }
};
