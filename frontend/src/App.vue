<template>
  <div id="app">
    <!-- F1 상단 레드 바 -->
    <div class="f1-top-line"></div>
    
    <nav class="f1-nav">
      <div class="nav-content">
        <router-link to="/" class="nav-logo">
          <span class="f1-logo-text">F1</span> <span class="board-text">PADDOCK</span>
        </router-link>
        
        <div class="nav-links">
          <router-link to="/" class="nav-item">THE CHATTER</router-link>
          
          <!-- 관리자 전용 메뉴 -->
          <router-link v-if="store.user?.role === 'admin'" to="/admin" class="nav-item admin-link">ADMIN PANEL</router-link>
          
          <template v-if="!store.user">
            <router-link to="/login" class="nav-item">SIGN IN</router-link>
            <router-link to="/signup" class="btn-signup-f1">JOIN PADDOCK</router-link>
          </template>
          
          <template v-else>
            <router-link to="/mypage" class="user-info">
              <span class="user-rank">{{ store.user.role === 'admin' ? 'ADM' : 'DRV' }}</span>
              <span class="username">{{ store.user.username.toUpperCase() }}</span>
            </router-link>
            <button @click="handleLogout" class="btn-logout">EXIT</button>
          </template>
        </div>
      </div>
    </nav>

    <main class="f1-container">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { store } from './store';
import { useRouter } from 'vue-router';

const router = useRouter();

const handleLogout = () => {
  if (confirm('패독을 떠나시겠습니까?')) {
    store.logout();
    router.push('/login');
  }
};
</script>

<style>
/* 전역 스타일 변수는 style.css에서 로드됨 */

.f1-top-line {
  height: 5px;
  background-color: var(--f1-red);
}

.f1-nav {
  background-color: var(--f1-black);
  border-bottom: 2px solid var(--f1-grey);
  padding: 15px 0;
}

.nav-content {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.nav-logo {
  text-decoration: none;
  display: flex;
  align-items: center;
}

.f1-logo-text {
  background-color: var(--f1-red);
  color: white;
  padding: 2px 10px;
  font-weight: 900;
  font-style: italic;
  font-size: 26px;
  border-radius: 4px;
  margin-right: 10px;
}

.board-text {
  color: white;
  font-weight: 900;
  font-size: 22px;
  letter-spacing: 2px;
  font-style: italic;
}

.nav-links { display: flex; align-items: center; gap: 25px; }

.nav-item { 
  color: var(--f1-white);
  text-decoration: none; 
  font-weight: 800; 
  font-size: 14px;
  letter-spacing: 1px;
  transition: color 0.2s;
  padding-bottom: 4px;
  border-bottom: 2px solid transparent;
}
.nav-item:hover { 
  color: var(--f1-red);
  border-bottom-color: var(--f1-red);
}

/* 관리자 링크 특별 스타일 */
.admin-link {
  color: #f9d806 !important; /* 옐로우 포인트 */
}
.admin-link:hover {
  border-bottom-color: #f9d806 !important;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.05);
  padding: 6px 14px;
  border-radius: 4px;
  border: 1px solid var(--f1-grey);
}
.user-rank {
  background: #f9d806;
  color: black;
  font-size: 10px;
  font-weight: 900;
  padding: 2px 6px;
  border-radius: 2px;
}
.username {
  color: white;
  font-weight: 800;
  font-size: 13px;
}

.btn-logout {
  background: none;
  border: 1px solid rgba(240, 68, 82, 0.3);
  color: #ff4d4d;
  font-weight: 900;
  font-size: 12px;
  letter-spacing: 1px;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.2s;
  font-style: italic;
}
.btn-logout:hover { 
  background-color: #f04452;
  color: white;
  border-color: #f04452;
}

.btn-signup-f1 {
  background-color: var(--f1-red);
  color: white !important;
  padding: 10px 20px;
  font-weight: 900;
  font-style: italic;
  font-size: 13px;
  text-decoration: none;
}

.f1-container {
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 20px;
}
</style>
