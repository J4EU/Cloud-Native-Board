<template>
  <div class="f1-detail" v-if="post">
    <article class="f1-card main-article">
      <header class="article-header">
        <div class="category-tag">FAN TAKE</div>
        <h1 class="article-title">{{ post.title.toUpperCase() }}</h1>
        <div class="article-meta">
          <div class="author-info">
            <span class="avatar">{{ post.author[0].toUpperCase() }}</span>
            <span class="author-name">{{ post.author.toUpperCase() }}</span>
          </div>
          <span class="date">{{
            new Date(post.created_at).toLocaleDateString()
          }}</span>
        </div>
      </header>

      <div class="article-content">
        <!-- 💡 동적 baseURL 사용 -->
        <div v-if="post.image_url" class="post-image">
          <img :src="`${baseURL}${post.image_url}`" alt="Post Intel" />
        </div>
        {{ post.content }}
      </div>

      <footer
        class="article-footer"
        v-if="store.user && store.user.username === post.author"
      >
        <button @click="$router.push(`/edit/${post.id}`)" class="btn-f1-sub">
          MODIFY
        </button>
        <button @click="deletePost" class="btn-f1-danger">DELETE</button>
      </footer>
    </article>

    <section class="f1-card comment-section">
      <h3 class="section-title">
        PADDOCK RADIO <span class="count">[{{ comments.length }}]</span>
      </h3>

      <div class="comment-list">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <div class="comment-header">
            <span class="radio-status"></span>
            <span class="comment-author">{{
              comment.author.toUpperCase()
            }}</span>
            <span class="comment-date">{{
              new Date(comment.created_at).toLocaleTimeString()
            }}</span>
          </div>

          <div v-if="editId === comment.id" class="edit-box">
            <textarea v-model="editContent" class="f1-textarea"></textarea>
            <div class="edit-btns">
              <button @click="cancelEdit" class="btn-f1-sub-sm">CANCEL</button>
              <button @click="saveEdit(comment.id)" class="btn-f1-red-sm">
                SEND
              </button>
            </div>
          </div>
          <p v-else class="comment-body">{{ comment.content }}</p>

          <div
            v-if="
              store.user &&
              store.user.username === comment.author &&
              editId !== comment.id
            "
            class="comment-actions"
          >
            <button @click="startEdit(comment)">EDIT</button>
            <button @click="deleteComment(comment.id)" class="danger">
              DELETE
            </button>
          </div>
        </div>
      </div>

      <div class="comment-form">
        <textarea
          v-model="newComment"
          class="f1-textarea"
          :placeholder="
            store.user
              ? 'TRANSMIT YOUR MESSAGE TO THE PADDOCK...'
              : 'LOGIN TO ACCESS RADIO'
          "
          :disabled="!store.user"
        ></textarea>
        <button
          @click="submitComment"
          class="btn-f1-red"
          :disabled="!store.user || !newComment.trim()"
        >
          PUSH TO TALK
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api, { baseURL } from "../api"; // baseURL 추가
import { store } from "../store";

const route = useRoute();
const router = useRouter();
const post = ref(null);
const comments = ref([]);
const newComment = ref("");
const editId = ref(null);
const editContent = ref("");

const loadData = async () => {
  try {
    const postId = route.params.id;
    const [pRes, cRes] = await Promise.all([
      api.get(`/posts/${postId}`),
      api.get(`/comments/${postId}`),
    ]);
    post.value = pRes.data;
    comments.value = cRes.data;
  } catch (error) {
    alert("데이터를 불러오는 중 문제가 발생했습니다.");
  }
};

onMounted(loadData);

const deletePost = async () => {
  if (confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
    await api.delete(`/posts/${route.params.id}`);
    router.push("/");
  }
};

const submitComment = async () => {
  await api.post(`/comments/${route.params.id}`, { content: newComment.value });
  newComment.value = "";
  await loadData();
};

const deleteComment = async (id) => {
  if (confirm("댓글을 삭제하시겠습니까?")) {
    await api.delete(`/comments/${id}`);
    await loadData();
  }
};

const startEdit = (c) => {
  editId.value = c.id;
  editContent.value = c.content;
};
const cancelEdit = () => {
  editId.value = null;
};
const saveEdit = async (id) => {
  await api.put(`/comments/${id}`, { content: editContent.value });
  editId.value = null;
  await loadData();
};
</script>

<style scoped>
.main-article {
  border-left: 10px solid var(--f1-red);
  padding: 40px;
  border-radius: 0 20px 20px 0;
}
.category-tag {
  background: var(--f1-red);
  display: inline-block;
  padding: 2px 10px;
  font-weight: 900;
  font-style: italic;
  font-size: 12px;
  margin-bottom: 15px;
}
.article-title {
  font-size: 32px;
  font-weight: 900;
  font-style: italic;
  margin: 0 0 20px 0;
  line-height: 1.1;
  letter-spacing: -1px;
}
.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #333;
  padding-bottom: 15px;
  margin-bottom: 25px;
}
.author-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
.avatar {
  width: 30px;
  height: 30px;
  background: white;
  color: black;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
}
.author-name {
  font-weight: 800;
  font-size: 14px;
}
.date {
  font-weight: 700;
  color: #666;
  font-size: 12px;
}

.article-content {
  font-size: 17px;
  line-height: 1.6;
  color: #ddd;
  white-space: pre-wrap;
}
.post-image {
  margin-bottom: 20px;
  width: 100%;
  text-align: center;
}
.post-image img {
  max-width: 100%;
  border: 1px solid #333;
}
.article-footer {
  display: flex;
  gap: 10px;
  margin-top: 40px;
  justify-content: flex-end;
}

.section-title {
  font-size: 18px;
  font-weight: 900;
  font-style: italic;
  margin-bottom: 20px;
  color: var(--f1-red);
}
.count {
  color: #555;
  font-style: normal;
}

.comment-item {
  border-bottom: 1px solid #222;
  padding: 15px 0;
}
.comment-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  margin-bottom: 5px;
}
.radio-status {
  width: 8px;
  height: 8px;
  background: #0f0;
  border-radius: 50%;
  box-shadow: 0 0 5px #0f0;
}
.comment-author {
  font-weight: 800;
  color: #eee;
}
.comment-date {
  color: #555;
}
.comment-body {
  margin: 0;
  color: #aaa;
  font-size: 14px;
}

.f1-textarea {
  width: 100%;
  background: #000;
  border: 1px solid #333;
  color: white;
  padding: 15px;
  border-radius: 0;
  font-family: inherit;
  margin-bottom: 10px;
}
.f1-textarea:focus {
  border-color: var(--f1-red);
  outline: none;
}
.btn-f1-red {
  background: var(--f1-red);
  color: white;
  border: none;
  padding: 12px;
  width: 100%;
  font-weight: 900;
  font-style: italic;
  cursor: pointer;
}
.btn-f1-red:disabled {
  background: #222;
  color: #444;
}

.btn-f1-sub {
  background: none;
  border: 1px solid #444;
  color: #888;
  padding: 6px 15px;
  font-weight: 800;
  font-size: 12px;
  cursor: pointer;
}
.btn-f1-danger {
  background: none;
  border: 1px solid #a00;
  color: #a00;
  padding: 6px 15px;
  font-weight: 800;
  font-size: 12px;
  cursor: pointer;
}

.comment-actions {
  margin-top: 5px;
  display: flex;
  gap: 10px;
}
.comment-actions button {
  background: none;
  border: none;
  font-size: 11px;
  font-weight: 800;
  color: #444;
  cursor: pointer;
}
</style>
