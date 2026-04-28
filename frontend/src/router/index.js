import { createRouter, createWebHistory } from 'vue-router';
import { store } from '../store'; // 저장소 불러오기
import BoardList from '../views/BoardList.vue';
import BoardWrite from '../views/BoardWrite.vue';
import BoardDetail from '../views/BoardDetail.vue';
import Signup from '../views/Signup.vue';
import Login from '../views/Login.vue';
import MyPage from '../views/MyPage.vue';
import AdminPage from '../views/AdminPage.vue';

const routes = [
  { path: '/', component: BoardList },
  { path: '/write', component: BoardWrite },
  { path: '/detail/:id', component: BoardDetail },
  { path: '/edit/:id', component: BoardWrite },
  { path: '/signup', component: Signup },
  { path: '/login', component: Login },
  { path: '/mypage', component: MyPage },
  { 
    path: '/admin', 
    component: AdminPage,
    // 라우터 진입 전 검사 (Navigation Guard)
    beforeEnter: (to, from, next) => {
      if (store.user?.role === 'admin') {
        next(); // 관리자면 통과
      } else {
        alert('관리자 전용 페이지입니다.');
        next('/'); // 홈으로 튕겨내기
      }
    }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
