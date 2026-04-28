<template>
  <div class="f1-auth-container">
    <div class="f1-card auth-card">
      <header class="auth-header">
        <h1 class="f1-title">SIGN IN</h1>
        <p class="f1-subtitle">ENTER THE PADDOCK CONTROL</p>
      </header>

      <form @submit.prevent="handleLogin" class="f1-form">
        <div class="form-group">
          <label>ID / USERNAME</label>
          <input v-model="form.username" type="text" class="f1-input" placeholder="USERNAME" required>
        </div>
        <div class="form-group">
          <label>SECURITY PASSWORD</label>
          <input v-model="form.password" type="password" class="f1-input" placeholder="PASSWORD" required>
        </div>
        
        <button type="submit" class="btn-f1-red">AUTHENTICATE</button>
      </form>

      <p class="auth-footer">
        NEW TO THE TRACK? <router-link to="/signup">JOIN THE PADDOCK</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';
import { store } from '../store';

const router = useRouter();
const form = ref({
  username: '',
  password: ''
});

const handleLogin = async () => {
  try {
    const response = await api.post('/auth/login', form.value);
    localStorage.setItem('token', response.data.token);
    store.setUser(response.data.user);
    router.push('/');
  } catch (error) {
    alert(error.response?.data?.message || '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
  }
};
</script>

<style scoped>
.f1-auth-container {
  max-width: 450px;
  margin: 100px auto;
  padding: 0 20px;
}

.auth-card {
  border-left: 10px solid var(--f1-red);
  padding: 40px;
}

.auth-header {
  margin-bottom: 30px;
  text-align: center;
}

.f1-title {
  font-size: 32px;
  font-weight: 900;
  font-style: italic;
  margin: 0;
  color: white;
}

.f1-subtitle {
  font-size: 12px;
  font-weight: 700;
  color: #888;
  letter-spacing: 2px;
  margin-top: 5px;
}

.f1-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 11px;
  font-weight: 900;
  color: #666;
  letter-spacing: 1px;
}

.f1-input {
  background-color: #000;
  border: 1px solid #333;
  color: white;
  padding: 15px;
  font-family: inherit;
  font-size: 15px;
  border-radius: 0;
}

.f1-input:focus {
  border-color: var(--f1-red);
  outline: none;
}

.btn-f1-red {
  background-color: var(--f1-red);
  color: white;
  border: none;
  padding: 15px;
  font-weight: 900;
  font-style: italic;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
}

.auth-footer {
  margin-top: 30px;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  color: #555;
}

.auth-footer a {
  color: var(--f1-red);
  text-decoration: none;
  margin-left: 5px;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>
