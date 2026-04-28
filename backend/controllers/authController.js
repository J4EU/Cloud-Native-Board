const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. 회원가입
exports.signup = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const [existingUser] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (existingUser.length > 0) return res.status(400).json({ message: '이미 사용 중인 아이디입니다.' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 처음 가입 시 기본 role은 'user'
    await db.query(
      'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, email, 'user']
    );

    res.status(201).json({ message: '회원가입이 완료되었습니다!' });
  } catch (err) {
    res.status(500).json({ message: '회원가입 실패' });
  }
};

// 2. 로그인
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (users.length === 0) return res.status(401).json({ message: '아이디를 확인해주세요.' });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: '비밀번호가 틀렸습니다.' });

    // 토큰에 role 정보를 추가
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: '로그인 성공!',
      token,
      user: { id: user.id, username: user.username, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: '로그인 실패' });
  }
};

// 프로필 조회 및 수정
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const [users] = await db.query('SELECT id, username, email, role, created_at FROM users WHERE id = ?', [userId]);
    res.json(users[0]);
  } catch (err) { res.status(500).json({ message: '조회 실패' }); }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { email, password } = req.body;
    let query = 'UPDATE users SET email = ?';
    let params = [email];
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      query += ', password = ?';
      params.push(hashedPassword);
    }
    query += ' WHERE id = ?';
    params.push(userId);
    await db.query(query, params);
    res.json({ message: '수정 완료' });
  } catch (err) { res.status(500).json({ message: '수정 실패' }); }
};

// 5. 모든 유저 조회 (관리자 전용)
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, username, email, role, created_at FROM users ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: '회원 목록 조회 실패' });
  }
};
