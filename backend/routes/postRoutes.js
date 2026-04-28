const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../middleware/upload'); // 업로드 미들웨어 추가

router.get('/', postController.getAllPosts);
router.get('/my', auth, postController.getMyPosts);
router.get('/:id', postController.getPostById);

// 이미지를 하나만(single) 받으며, 필드 이름은 'image'로 설정
router.post('/', auth, upload.single('image'), postController.createPost);
router.put('/:id', auth, upload.single('image'), postController.updatePost);

router.delete('/:id', auth, postController.deletePost);
router.delete('/admin/:id', auth, admin, postController.adminDeletePost);

module.exports = router;
