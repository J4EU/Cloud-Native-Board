# F1 Board - Backend

F1 Board API 서버입니다. Node.js와 Express를 사용하여 구축되었습니다.

## 📁 주요 구조

- `controllers/`: 비즈니스 로직 처리 (로그인, 게시글 관리, 댓글 등)
- `routes/`: API 엔드포인트 정의
- `middleware/`: 인증(JWT) 및 파일 업로드 처리
- `config/`: 데이터베이스 연결 설정
- `uploads/`: 로컬 파일 업로드 저장소

## 🛠 실행 방법

1. **의존성 설치**

   ```bash
   npm install
   ```

2. **환경 변수 설정**
   - `.env.example` 파일을 복사하여 `.env` 파일을 만듭니다.
   - DB 정보 및 AWS S3 설정을 입력합니다.

3. **데이터베이스 초기화** (테이블 생성 등)

   ```bash
   node setup-db.js
   ```

4. **서버 실행**
   ```bash
   node index.js
   ```

   - 기본적으로 `http://localhost:3000`에서 실행됩니다.

## 🔑 환경 변수 주요 항목

- `DB_*`: MySQL/RDS 연결 정보
- `USE_S3`: 파일 저장소 선택 (true: S3, false: 로컬)
- `JWT_SECRET`: 인증용 비밀 키
