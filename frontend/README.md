# F1 PADDOCK - Frontend

F1 Board 프론트엔드 인터페이스입니다. Vue 3와 Vite를 사용하여 구축되었습니다.

## 📁 주요 구조

- `src/views/`: 주요 페이지 컴포넌트 (목록, 상세, 로그인 등)
- `src/components/`: 재사용 가능한 UI 컴포넌트
- `src/api/`: 백엔드 API와의 통신 로직 (Axios)
- `src/store.js`: 전역 상태 관리 (사용자 정보 등)
- `public/`: 정적 자원 (파비콘 등)

## 🛠 실행 방법

1. **의존성 설치**

   ```bash
   npm install
   ```

2. **개발 서버 실행**

   ```bash
   npm run dev
   ```

   - 기본적으로 `http://localhost:5173`에서 실행됩니다.

3. **빌드 (배포용)**
   ```bash
   npm run build
   ```

## 🌐 환경 변수

- `VITE_API_URL`: 백엔드 서버 주소 (기본값: http://localhost:3000)
