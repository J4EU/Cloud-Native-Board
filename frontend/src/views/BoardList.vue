<template>
  <div class="f1-board">
    <header class="board-header">
      <div class="header-left">
        <h1 class="f1-title">PADDOCK CHATTER</h1>
        <p class="f1-subtitle">WHERE FANS DECIDE THE STRATEGY</p>
      </div>
      <router-link v-if="store.user" to="/write" class="btn-write-f1">JOIN THE TRACK</router-link>
    </header>

    <div class="discussion-list">
      <div v-for="post in posts" :key="post.id" 
           class="f1-card list-item" 
           @click="$router.push(`/detail/${post.id}`)">
        <div class="rank">NO.{{ post.id }}</div>
        <div class="post-main">
          <div class="post-meta">
            <span class="category">FAN TAKE</span>
            <span class="date">{{ formatDate(post.created_at) }}</span>
          </div>
          <h2 class="post-title">{{ post.title.toUpperCase() }}</h2>
          <div class="author-tag">
            <span class="author-icon"></span>
            {{ post.author.toUpperCase() }}
          </div>
        </div>
        <div class="arrow">VIEW</div>
      </div>
      
      <div v-if="posts.length === 0" class="empty-msg">
        NO CHATTER IN THE PADDOCK YET.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../api';
import { store } from '../store';

const posts = ref([]);

onMounted(async () => {
  try {
    const response = await api.get('/posts');
    posts.value = response.data;
  } catch (error) {
    alert('게시글 목록을 불러오는데 실패했습니다.');
  }
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getDate()} / ${date.getMonth() + 1} / ${date.getFullYear()}`;
};
</script>

<style scoped>
.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  border-bottom: 4px solid var(--f1-red);
  padding-bottom: 20px;
}
.f1-title { 
  font-size: 44px; 
  font-weight: 900; 
  font-style: italic; 
  margin: 0;
  letter-spacing: -2px;
}
.f1-subtitle {
  font-size: 14px;
  font-weight: 700;
  color: #888;
  margin: 5px 0 0 0;
  letter-spacing: 2px;
}

.btn-write-f1 {
  background-color: var(--f1-red);
  color: white;
  text-decoration: none;
  padding: 12px 30px;
  font-weight: 800;
  font-style: italic;
  font-size: 14px;
  border-radius: 4px;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  cursor: pointer;
  border-radius: 0 15px 15px 0;
}

.rank {
  font-size: 32px;
  font-weight: 900;
  font-style: italic;
  margin-right: 30px;
  color: #444;
}

.post-main { flex: 1; }
.post-meta { display: flex; gap: 15px; margin-bottom: 5px; }
.category { color: var(--f1-red); font-weight: 800; font-size: 12px; }
.date { color: #888; font-size: 12px; font-weight: 700; }

.post-title { margin: 0 0 10px 0; font-size: 20px; font-weight: 800; color: white; }

.author-tag { display: inline-flex; align-items: center; font-size: 13px; font-weight: 700; color: #aaa; }
.author-icon { width: 10px; height: 10px; border-radius: 50%; background-color: var(--f1-red); margin-right: 8px; }

.arrow { font-size: 12px; font-weight: 900; color: #666; padding: 4px 10px; border: 1px solid #444; }
.list-item:hover .arrow { border-color: var(--f1-red); color: white; background-color: var(--f1-red); }

.empty-msg { text-align: center; color: #555; padding: 100px; font-weight: 900; font-style: italic; }
</style>
