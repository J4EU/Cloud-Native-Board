<template>
  <div class="f1-write-container">
    <header class="page-header">
      <h1 class="f1-title">{{ isEdit ? 'MODIFY STRATEGY' : 'NEW PADDOCK TAKE' }}</h1>
      <p class="f1-subtitle">TRANSMIT YOUR THOUGHTS AND INTEL</p>
    </header>

    <div class="f1-card write-card">
      <form @submit.prevent="submitForm" class="f1-form">
        <div class="form-group">
          <label>REPORT SUBJECT</label>
          <input v-model="form.title" type="text" class="f1-input" placeholder="TITLE" required>
        </div>

        <!-- 💡 이미지 업로드 섹션 -->
        <div class="form-group">
          <label>ATTACH INTEL IMAGE (MAX 1)</label>
          <div class="file-upload-wrapper">
            <input type="file" @change="handleFileChange" accept="image/*" class="f1-file-input">
            <div v-if="imagePreview || form.image_url" class="image-preview">
              <img :src="imagePreview || (form.image_url.startsWith('http') ? form.image_url : `${baseURL}${form.image_url}`)" alt="Preview">
              <button type="button" @click="removeImage" class="btn-remove-img">REMOVE</button>
            </div>
          </div>
        </div>

        <div class="form-group">
          <label>DETAILED INTEL (CONTENT)</label>
          <textarea v-model="form.content" class="f1-textarea" rows="10" placeholder="MESSAGE" required></textarea>
        </div>

        <div class="form-actions">
          <button type="button" @click="$router.back()" class="btn-f1-sub">ABORT</button>
          <button type="submit" class="btn-f1-red">{{ isEdit ? 'UPDATE' : 'POST' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api, { baseURL } from '../api';
import { store } from '../store';

const route = useRoute();
const router = useRouter();
const selectedFile = ref(null);
const imagePreview = ref('');
const form = ref({ title: '', content: '', image_url: '' });
const isEdit = ref(!!route.params.id);

onMounted(async () => {
  if (!store.user) { router.push('/login'); return; }
  if (isEdit.value) {
    const res = await api.get(`/posts/${route.params.id}`);
    form.value = res.data;
  }
});

// 파일 선택 시 실행
const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    selectedFile.value = file;
    imagePreview.value = URL.createObjectURL(file); // 미리보기 생성
  }
};

// 이미지 제거
const removeImage = () => {
  selectedFile.value = null;
  imagePreview.value = '';
  form.value.image_url = '';
};

const submitForm = async () => {
  try {
    // 💡 파일을 보낼 때는 FormData를 사용해야 합니다.
    const formData = new FormData();
    formData.append('title', form.value.title);
    formData.append('content', form.value.content);
    if (selectedFile.value) {
      formData.append('image', selectedFile.value); // 'image'라는 이름으로 파일 추가
    }

    if (isEdit.value) {
      await api.put(`/posts/${route.params.id}`, formData);
      alert('수정되었습니다.');
    } else {
      await api.post('/posts', formData);
      alert('등록되었습니다.');
    }
    router.push('/');
  } catch (error) {
    alert('전송 실패');
  }
};
</script>

<style scoped>
/* 기존 스타일 유지 + 이미지 관련 추가 */
.file-upload-wrapper { margin-top: 5px; }
.f1-file-input { background: #000; border: 1px solid #333; padding: 10px; width: 100%; color: #888; cursor: pointer; }

.image-preview { margin-top: 15px; position: relative; width: 200px; }
.image-preview img { width: 100%; border: 2px solid var(--f1-red); }
.btn-remove-img { position: absolute; top: -10px; right: -10px; background: var(--f1-red); color: white; border: none; padding: 2px 8px; font-size: 10px; font-weight: 900; cursor: pointer; }

.f1-write-container { max-width: 800px; margin: 0 auto; }
.page-header { border-bottom: 4px solid var(--f1-red); padding-bottom: 20px; margin-bottom: 40px; }
.f1-title { font-size: 40px; font-weight: 900; font-style: italic; margin: 0; }
.f1-subtitle { font-size: 14px; font-weight: 700; color: #888; }
.write-card { border-left: 10px solid var(--f1-red); background-color: var(--f1-dark-grey); }
.f1-form { display: flex; flex-direction: column; gap: 20px; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.form-group label { font-size: 12px; font-weight: 900; color: #888; }
.f1-input, .f1-textarea { background-color: #000; border: 1px solid #333; color: white; padding: 15px; font-family: inherit; }
.form-actions { display: flex; justify-content: flex-end; gap: 15px; margin-top: 20px; border-top: 1px solid #333; padding-top: 20px; }
.btn-f1-red { background-color: var(--f1-red); color: white; border: none; padding: 12px 30px; font-weight: 900; font-style: italic; cursor: pointer; }
.btn-f1-sub { background: none; border: 1px solid #444; color: #888; padding: 12px 30px; font-weight: 800; cursor: pointer; }
</style>
