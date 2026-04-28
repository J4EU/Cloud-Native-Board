const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

router.get('/:postId', commentController.getCommentsByPostId);
router.post('/:postId', auth, commentController.createComment);
router.put('/:id', auth, commentController.updateComment); // 수정 주소 추가
router.delete('/:id', auth, commentController.deleteComment);

module.exports = router;
