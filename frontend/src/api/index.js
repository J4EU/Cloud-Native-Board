import axios from 'axios';

// Vite 환경변수에서 API 주소를 가져옴 (없으면 기본값 사용)
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${baseURL}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config.url.includes('/auth/login');
    if (error.response?.status === 401 && !isLoginRequest) {
      alert('세션이 만료되었습니다. 다시 로그인해주세요.');
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
// 이미지 주소 조립을 위해 baseURL도 내보냅니다.
export { baseURL };
