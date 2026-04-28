const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin'); // 관리자 미들웨어 추가

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, authController.updateProfile);

// 관리자 전용: 회원 목록 조회
router.get('/users', auth, admin, authController.getAllUsers);

module.exports = router;
