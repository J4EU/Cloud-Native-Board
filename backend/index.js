require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();
const port = process.env.PORT || 3000;

// 1. 보안 미들웨어 설정
app.use(helmet({
  crossOriginResourcePolicy: false, // 다른 도메인에서 이미지 리소스를 읽을 수 있게 함
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// 업로드된 파일 접근 허용
app.use('/uploads', express.static('uploads'));

// 2. 라우터 연결
app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/comments', commentRoutes);

app.use((req, res) => {
  res.status(404).json({ message: '요청하신 경로를 찾을 수 없습니다.' });
});

app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err.stack);
  res.status(500).json({ message: '서버 내부 에러가 발생했습니다.' });
});

app.listen(port, () => {
  console.log(`F1 Board Server is running on port ${port}`);
});
