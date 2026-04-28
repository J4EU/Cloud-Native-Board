const db = require('../config/db');

// 글 목록 조회
exports.getAllPosts = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM posts ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: '데이터를 가져오는데 실패했습니다.' });
  }
};

// 글 상세 조회
exports.getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM posts WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: '글을 찾을 수 없습니다.' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: '데이터 조회 에러' });
  }
};

// 글 작성 (이미지 포함)
exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const author = req.user.username;
    // 💡 업로드된 파일이 있으면 경로 저장, 없으면 null
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await db.query(
      'INSERT INTO posts (title, content, author, image_url) VALUES (?, ?, ?, ?)',
      [title, content, author, image_url]
    );
    res.status(201).json({ message: '게시글이 등록되었습니다.', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: '글 작성 실패', error: err.message });
  }
};

// 글 수정 (이미지 포함)
exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const currentUser = req.user.username;

    const [posts] = await db.query('SELECT author, image_url FROM posts WHERE id = ?', [id]);
    if (posts.length === 0) return res.status(404).json({ message: '글을 찾을 수 없습니다.' });
    if (posts[0].author !== currentUser) return res.status(403).json({ message: '본인만 수정 가능합니다.' });

    // 새 이미지가 업로드되면 교체, 아니면 기존 이미지 유지
    let image_url = posts[0].image_url;
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`;
    }

    await db.query(
      'UPDATE posts SET title = ?, content = ?, image_url = ? WHERE id = ?', 
      [title, content, image_url, id]
    );
    res.json({ message: '게시글이 수정되었습니다.' });
  } catch (err) {
    res.status(500).json({ message: '글 수정 실패' });
  }
};

// 글 삭제
exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = req.user.username;
    const [posts] = await db.query('SELECT author FROM posts WHERE id = ?', [id]);
    if (posts.length === 0) return res.status(404).json({ message: '글을 찾을 수 없습니다.' });
    if (posts[0].author !== currentUser && req.user.role !== 'admin') return res.status(403).json({ message: '권한이 없습니다.' });

    await db.query('DELETE FROM posts WHERE id = ?', [id]);
    res.json({ message: '글이 삭제되었습니다.' });
  } catch (err) { res.status(500).json({ message: '글 삭제 실패' }); }
};

// 관리자 삭제 및 내 글 조회
exports.adminDeletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM posts WHERE id = ?', [id]);
    res.json({ message: '강제 삭제 완료' });
  } catch (err) { res.status(500).json({ message: '관리자 삭제 실패' }); }
};

exports.getMyPosts = async (req, res) => {
  try {
    const username = req.user.username;
    const [rows] = await db.query('SELECT * FROM posts WHERE author = ? ORDER BY id DESC', [username]);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: '조회 실패' }); }
};
