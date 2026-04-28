<template>
  <div class="f1-admin">
    <header class="page-header">
      <h1 class="f1-title">COMMAND CENTER</h1>
      <p class="f1-subtitle">ADMINISTRATIVE TELEMETRY CONTROL</p>
    </header>

    <!-- 탭 메뉴 -->
    <div class="admin-tabs">
      <button :class="['tab-btn', { active: activeTab === 'users' }]" @click="activeTab = 'users'">
        USER MANAGEMENT
      </button>
      <button :class="['tab-btn', { active: activeTab === 'posts' }]" @click="activeTab = 'posts'">
        POST MANAGEMENT
      </button>
    </div>

    <!-- 탭 내용: 유저 관리 -->
    <div v-if="activeTab === 'users'" class="f1-card admin-card">
      <h2 class="section-title">ACTIVE DRIVERS <span class="count">[{{ users.length }}]</span></h2>
      <div class="table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>USERNAME</th>
              <th>EMAIL</th>
              <th>ROLE</th>
              <th>JOINED</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td class="dim">#{{ user.id }}</td>
              <td class="bold">{{ user.username.toUpperCase() }}</td>
              <td>{{ user.email }}</td>
              <td><span :class="['role-tag', user.role]">{{ user.role.toUpperCase() }}</span></td>
              <td class="dim">{{ new Date(user.created_at).toLocaleDateString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 탭 내용: 게시글 관리 -->
    <div v-if="activeTab === 'posts'" class="f1-card admin-card">
      <h2 class="section-title">SESSION LOGS <span class="count">[{{ posts.length }}]</span></h2>
      <div class="table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>NO</th>
              <th>AUTHOR</th>
              <th>TITLE</th>
              <th>DATE</th>
              <th class="center">ACTION</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in posts" :key="post.id">
              <td class="dim">{{ post.id }}</td>
              <td class="bold">{{ post.author.toUpperCase() }}</td>
              <td class="post-title-cell" @click="$router.push(`/detail/${post.id}`)">{{ post.title }}</td>
              <td class="dim">{{ new Date(post.created_at).toLocaleDateString() }}</td>
              <td class="center">
                <button @click="deletePostByAdmin(post.id)" class="btn-force-delete">DELETE</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import api from '../api';
import { useRouter } from 'vue-router';
import { store } from '../store';

const activeTab = ref('users'); // 현재 활성화된 탭
const users = ref([]);
const posts = ref([]);
const router = useRouter();

// 데이터 불러오기 함수
const fetchData = async () => {
  try {
    if (activeTab.value === 'users') {
      const res = await api.get('/auth/users');
      users.value = res.data;
    } else {
      const res = await api.get('/posts');
      posts.value = res.data;
    }
  } catch (err) {
    alert('데이터를 가져오는데 실패했습니다. 권한이 없거나 서버 에러입니다.');
  }
};

onMounted(() => {
  if (store.user?.role !== 'admin') {
    router.push('/');
    return;
  }
  fetchData();
});

// 탭이 바뀔 때마다 데이터 다시 불러오기
watch(activeTab, fetchData);

// 관리자 권한 게시글 삭제
const deletePostByAdmin = async (id) => {
  if (confirm('정말로 이 게시글을 강제 삭제하시겠습니까? 삭제 후에는 복구할 수 없습니다.')) {
    try {
      await api.delete(`/posts/admin/${id}`);
      alert('게시글이 영구적으로 삭제되었습니다.');
      fetchData(); // 목록 새로고침
    } catch (err) {
      alert('강제 삭제에 실패했습니다.');
    }
  }
};
</script>

<style scoped>
.admin-tabs { display: flex; gap: 5px; margin-bottom: 20px; }
.tab-btn {
  background: #222;
  border: none;
  color: #666;
  padding: 12px 24px;
  font-weight: 900;
  font-style: italic;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}
.tab-btn.active { background: #f9d806; color: black; }
.tab-btn:hover:not(.active) { background: #333; color: white; }

.admin-card { border-left: 10px solid #f9d806; }
.section-title { font-size: 20px; font-weight: 900; font-style: italic; color: #f9d806; margin-bottom: 25px; }
.count { color: #555; font-style: normal; margin-left: 10px; }

.admin-table { width: 100%; border-collapse: collapse; }
.admin-table th, .admin-table td { padding: 15px; text-align: left; border-bottom: 1px solid #333; font-size: 14px; }
.admin-table th { font-size: 11px; color: #888; letter-spacing: 1px; font-weight: 900; }

.dim { color: #555; }
.bold { font-weight: 800; color: white; }
.center { text-align: center; }

.post-title-cell { color: #ccc; cursor: pointer; }
.post-title-cell:hover { color: #f9d806; text-decoration: underline; }

.role-tag { padding: 2px 8px; font-size: 10px; font-weight: 900; border-radius: 2px; }
.role-tag.admin { background: #f9d806; color: black; }
.role-tag.user { background: #333; color: #888; }

.btn-force-delete {
  background: none;
  border: 1px solid #f04452;
  color: #f04452;
  font-weight: 900;
  font-size: 11px;
  padding: 4px 10px;
  cursor: pointer;
}
.btn-force-delete:hover { background: #f04452; color: white; }

.table-container { overflow-x: auto; }
</style>
