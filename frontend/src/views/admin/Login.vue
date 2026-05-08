<template>
  <div class="login-page">
    <div class="login-card card">
      <h2>嘉原地产管理后台</h2>
      <form @submit.prevent="onLogin">
        <div class="field">
          <label>用户名</label>
          <input v-model="username" type="text" placeholder="请输入用户名" required />
        </div>
        <div class="field">
          <label>密码</label>
          <input v-model="password" type="password" placeholder="请输入密码" required />
        </div>
        <p v-if="error" class="error">{{ error }}</p>
        <button class="btn btn-primary full" type="submit">登录</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../api';

const router = useRouter();
const username = ref('');
const password = ref('');
const error = ref('');

async function onLogin() {
  error.value = '';
  try {
    const res = await api.post('/admin/login', {
      username: username.value,
      password: password.value,
    });
    localStorage.setItem('token', res.data.token);
    router.push('/admin');
  } catch (e: any) {
    error.value = e.response?.data?.error || '登录失败';
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--bg-main);
}
.login-card {
  width: 100%;
  max-width: 380px;
  padding: 32px;
}
.login-card h2 {
  text-align: center;
  margin-bottom: 24px;
  color: var(--color-accent);
}
.field {
  margin-bottom: 16px;
}
.field label {
  display: block;
  font-size: 14px;
  margin-bottom: 6px;
}
.field input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 15px;
  outline: none;
}
.field input:focus {
  border-color: var(--color-primary);
}
.error {
  color: #E64A19;
  font-size: 13px;
  margin-bottom: 12px;
}
.full {
  width: 100%;
}
</style>
