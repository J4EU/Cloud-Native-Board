import { reactive } from 'vue';

// 앱 전체에서 공유할 데이터 저장소
export const store = reactive({
  user: JSON.parse(localStorage.getItem('user')) || null, // 브라우저를 새로고침해도 로그인 유지되게 함
  
  // 로그인 정보를 저장하는 함수
  setUser(userData) {
    this.user = userData;
    localStorage.setItem('user', JSON.stringify(userData));
  },
  
  // 로그아웃 시 정보를 지우는 함수
  logout() {
    this.user = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
});
