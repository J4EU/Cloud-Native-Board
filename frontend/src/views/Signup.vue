<template>
  <div class="f1-auth-container">
    <div class="f1-card auth-card">
      <header class="auth-header">
        <h1 class="f1-title">JOIN THE GRID</h1>
        <p class="f1-subtitle">REGISTER YOUR OFFICIAL FAN ID</p>
      </header>

      <form @submit.prevent="handleSignup" class="f1-form">
        <div class="form-group">
          <label>CHOOSE USERNAME</label>
          <input v-model="form.username" type="text" class="f1-input" placeholder="USERNAME" required>
        </div>
        <div class="form-group">
          <label>EMAIL ADDRESS</label>
          <input v-model="form.email" type="email" class="f1-input" placeholder="EMAIL@EXAMPLE.COM" required>
        </div>
        <div class="form-group">
          <label>PASSWORD</label>
          <input v-model="form.password" type="password" class="f1-input" placeholder="SECURE PASSWORD" required>
        </div>
        <div class="form-group">
          <label>CONFIRM PASSWORD</label>
          <input v-model="passwordConfirm" type="password" class="f1-input" placeholder="REPEAT PASSWORD" required>
        </div>
        
        <button type="submit" class="btn-f1-red">CREATE ACCOUNT</button>
      </form>

      <p class="auth-footer">
        ALREADY REGISTERED? <router-link to="/login">BACK TO PIT WALL</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';

const router = useRouter();
const passwordConfirm = ref('');
const form = ref({
  username: '',
  email: '',
  password: ''
});

const handleSignup = async () => {
  if (form.value.password !== passwordConfirm.value) {
    alert('비밀번호가 서로 일치하지 않습니다.');
    return;
  }

  try {
    await api.post('/auth/signup', form.value);
    alert('회원가입이 완료되었습니다. 패독에 오신 것을 환영합니다!');
    router.push('/login');
  } catch (error) {
    alert(error.response?.data?.message || '회원가입 중 에러가 발생했습니다.');
  }
};
</script>

<style scoped>
/* 로그인 페이지와 스타일 공유 */
.f1-auth-container {
  max-width: 450px;
  margin: 60px auto;
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
