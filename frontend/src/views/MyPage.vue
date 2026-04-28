<template>
  <div class="f1-mypage">
    <header class="page-header">
      <h1 class="f1-title">DRIVER PROFILE</h1>
      <p class="f1-subtitle">MANAGE YOUR PADDOCK ACCOUNT</p>
    </header>
    
    <!-- 개인정보 수정 섹션 -->
    <section class="f1-card profile-section">
      <h2 class="section-title">ACCOUNT SETTINGS</h2>
      <form @submit.prevent="updateProfile" class="f1-form">
        <div class="form-group">
          <label>ID (PERMANENT)</label>
          <input :value="userProfile.username.toUpperCase()" type="text" class="f1-input disabled" disabled>
        </div>
        <div class="form-group">
          <label>EMAIL ADDRESS</label>
          <input v-model="userProfile.email" type="email" class="f1-input" required>
        </div>
        <div class="form-group">
          <label>NEW PASSWORD (OPTIONAL)</label>
          <input v-model="newPassword" type="password" class="f1-input" placeholder="LEAVE BLANK TO KEEP CURRENT">
        </div>
        <button type="submit" class="btn-f1-red">UPDATE PROFILE</button>
      </form>
    </section>

    <!-- 내가 쓴 글 목록 섹션 -->
    <section class="my-posts-section">
      <h2 class="section-title">MY GARAGE <span class="count">[{{ myPosts.length }} POSTS]</span></h2>
      <div class="post-list">
        <div v-for="post in myPosts" :key="post.id" class="f1-card post-item" @click="$router.push(`/detail/${post.id}`)">
          <div class="post-info">
            <span class="post-date">{{ new Date(post.created_at).toLocaleDateString() }}</span>
            <h3 class="post-title">{{ post.title.toUpperCase() }}</h3>
          </div>
          <div class="post-arrow">VIEW</div>
        </div>
        <div v-if="myPosts.length === 0" class="empty-state">
          NO POSTS IN YOUR GARAGE.
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';

const userProfile = ref({ username: '', email: '' });
const myPosts = ref([]);
const newPassword = ref('');

onMounted(async () => {
  try {
    const profileRes = await api.get('/auth/profile');
    userProfile.value = profileRes.data;

    const postsRes = await api.get('/posts/my');
    myPosts.value = postsRes.data;
  } catch (err) {
    alert('프로필 정보를 불러오는데 실패했습니다.');
  }
});

const updateProfile = async () => {
  try {
    await api.put('/auth/profile', {
      email: userProfile.value.email,
      password: newPassword.value || undefined
    });
    alert('회원 정보가 성공적으로 수정되었습니다.');
    newPassword.value = '';
  } catch (err) {
    alert('수정에 실패했습니다. 입력 내용을 확인해주세요.');
  }
};
</script>

<style scoped>
.f1-mypage { max-width: 800px; margin: 0 auto; }

.page-header {
  border-bottom: 4px solid var(--f1-red);
  padding-bottom: 20px;
  margin-bottom: 40px;
}
.f1-title { font-size: 40px; font-weight: 900; font-style: italic; margin: 0; letter-spacing: -2px; }
.f1-subtitle { font-size: 14px; font-weight: 700; color: #888; margin: 5px 0 0 0; letter-spacing: 2px; }

.section-title { font-size: 20px; font-weight: 900; font-style: italic; color: var(--f1-red); margin-bottom: 25px; }

/* 프로필 수정 폼 */
.profile-section { border-left: 10px solid var(--f1-red); }
.f1-form { display: flex; flex-direction: column; gap: 20px; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group label { font-size: 12px; font-weight: 900; color: #888; letter-spacing: 1px; }

.f1-input {
  background-color: #000;
  border: 1px solid #333;
  color: white;
  padding: 12px 15px;
  font-family: inherit;
  font-size: 15px;
  transition: border-color 0.2s;
}
.f1-input:focus { border-color: var(--f1-red); outline: none; }
.f1-input.disabled { background-color: #1a1a1a; color: #555; cursor: not-allowed; }

.btn-f1-red {
  background-color: var(--f1-red);
  color: white;
  border: none;
  padding: 15px;
  font-weight: 900;
  font-style: italic;
  cursor: pointer;
  margin-top: 10px;
  transition: opacity 0.2s;
}
.btn-f1-red:hover { opacity: 0.8; }

/* 내 글 목록 */
.my-posts-section { margin-top: 60px; }
.count { color: #555; font-style: normal; font-size: 0.8em; margin-left: 10px; }

.post-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 24px;
  cursor: pointer;
  border-left: 5px solid #333;
  margin-bottom: 15px;
}
.post-item:hover { border-left-color: var(--f1-red); }

.post-date { font-size: 12px; font-weight: 700; color: #555; }
.post-title { margin: 5px 0 0 0; font-size: 18px; font-weight: 800; color: white; }

.post-arrow { font-size: 12px; font-weight: 900; color: #444; border: 1px solid #444; padding: 2px 8px; }
.post-item:hover .post-arrow { color: white; background: var(--f1-red); border-color: var(--f1-red); }

.empty-state { text-align: center; color: #444; padding: 40px; font-weight: 800; font-style: italic; }
</style>
