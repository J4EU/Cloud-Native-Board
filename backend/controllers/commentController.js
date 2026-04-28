const db = require('../config/db');

// 특정 게시글의 모든 댓글 가져오기
exports.getCommentsByPostId = async (req, res) => {
  try {
    const { postId } = req.params;
    const [rows] = await db.query('SELECT * FROM comments WHERE post_id = ? ORDER BY id ASC', [postId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: '댓글을 불러오는데 실패했습니다.' });
  }
};

// 댓글 작성 (로그인 필요)
exports.createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const author = req.user.username; // 로그인한 사람의 아이디

    await db.query(
      'INSERT INTO comments (post_id, author, content) VALUES (?, ?, ?)',
      [postId, author, content]
    );
    res.status(201).json({ message: '댓글이 등록되었습니다.' });
  } catch (err) {
    res.status(500).json({ message: '댓글 등록 실패' });
  }
};

// 댓글 삭제 (본인만 가능)
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user.username;

    // 작성자 확인
    const [comments] = await db.query('SELECT author FROM comments WHERE id = ?', [id]);
    if (comments.length === 0) return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });

    if (comments[0].author !== currentUser) {
      return res.status(403).json({ message: '본인의 댓글만 삭제할 수 있습니다.' });
    }

    await db.query('DELETE FROM comments WHERE id = ?', [id]);
    res.json({ message: '댓글이 삭제되었습니다.' });
  } catch (err) {
    res.status(500).json({ message: '댓글 삭제 실패' });
  }
};

// 댓글 수정 (본인만 가능)
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const currentUser = req.user.username;

    // 1. 작성자 확인
    const [comments] = await db.query('SELECT author FROM comments WHERE id = ?', [id]);
    if (comments.length === 0) return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });

    // 2. 권한 확인
    if (comments[0].author !== currentUser) {
      return res.status(403).json({ message: '본인의 댓글만 수정할 수 있습니다.' });
    }

    // 3. 수정 진행
    await db.query('UPDATE comments SET content = ? WHERE id = ?', [content, id]);
    res.json({ message: '댓글이 수정되었습니다.' });
  } catch (err) {
    res.status(500).json({ message: '댓글 수정 실패' });
  }
};
