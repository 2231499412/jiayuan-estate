<template>
  <div class="login-page">
    <div class="login-bg"></div>
    <div class="login-card">
      <div class="brand">
        <div class="brand-icon">
          <svg viewBox="0 0 40 40" fill="none">
            <path d="M20 4L3 18h5v16h24V18h5L20 4z" fill="currentColor" opacity="0.9"/>
            <rect x="15" y="22" width="10" height="12" rx="1" fill="rgba(255,255,255,0.3)"/>
            <rect x="10" y="14" width="5" height="5" rx="1" fill="rgba(255,255,255,0.2)"/>
            <rect x="25" y="14" width="5" height="5" rx="1" fill="rgba(255,255,255,0.2)"/>
          </svg>
        </div>
        <h1>嘉原地产</h1>
        <p class="subtitle">管理后台</p>
      </div>
      <form @submit.prevent="onLogin">
        <div class="field">
          <div class="input-wrap">
            <span class="input-icon">
              <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0H3z"/></svg>
            </span>
            <input v-model="username" type="text" placeholder="用户名" required />
          </div>
        </div>
        <div class="field">
          <div class="input-wrap">
            <span class="input-icon">
              <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/></svg>
            </span>
            <input v-model="password" type="password" placeholder="密码" required />
          </div>
        </div>
        <p v-if="error" class="error">{{ error }}</p>
        <button type="submit" :disabled="loading">
          {{ loading ? '登录中...' : '登 录' }}
        </button>
      </form>
      <div class="footer-text">Jiayuan Estate Admin</div>
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
const loading = ref(false);

async function onLogin() {
  error.value = '';
  loading.value = true;
  try {
    const res = await api.post('/admin/login', {
      username: username.value,
      password: password.value,
    });
    localStorage.setItem('token', res.data.token);
    router.push('/admin');
  } catch (e: any) {
    error.value = e.response?.data?.error || '登录失败';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: #2D2118;
}

.login-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 20% 80%, rgba(196, 168, 130, 0.15) 0%, transparent 60%),
    radial-gradient(ellipse 60% 80% at 80% 20%, rgba(139, 111, 71, 0.12) 0%, transparent 60%),
    radial-gradient(circle at 50% 50%, rgba(212, 118, 78, 0.05) 0%, transparent 70%);
}
.login-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(196, 168, 130, 0.03) 40px, rgba(196, 168, 130, 0.03) 41px),
    repeating-linear-gradient(-45deg, transparent, transparent 40px, rgba(196, 168, 130, 0.03) 40px, rgba(196, 168, 130, 0.03) 41px);
}

.login-card {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 20px;
  padding: 48px 40px 40px;
  background: rgba(255, 255, 255, 0.97);
  border-radius: 24px;
  box-shadow:
    0 4px 6px rgba(0, 0, 0, 0.05),
    0 20px 60px rgba(45, 33, 24, 0.2),
    0 0 0 1px rgba(196, 168, 130, 0.1);
  animation: cardIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes cardIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.97);
  }
}

.brand {
  text-align: center;
  margin-bottom: 36px;
}

.brand-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, #8B6F47, #C4A882);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 8px 24px rgba(139, 111, 71, 0.3);
}
.brand-icon svg {
  width: 32px;
  height: 32px;
}

.brand h1 {
  font-family: var(--font-serif);
  font-size: 26px;
  color: var(--color-text);
  letter-spacing: 4px;
  margin-bottom: 4px;
}

.subtitle {
  font-size: 13px;
  color: var(--color-text-light);
  letter-spacing: 6px;
  text-transform: uppercase;
}

.field {
  margin-bottom: 18px;
}

.input-wrap {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--color-text-light);
  pointer-events: none;
  transition: color 0.3s;
}
.input-icon svg {
  width: 100%;
  height: 100%;
}

.input-wrap input {
  width: 100%;
  padding: 13px 14px 13px 44px;
  border: 1.5px solid var(--color-border);
  border-radius: 12px;
  font-size: 15px;
  background: var(--bg-main);
  color: var(--color-text);
  outline: none;
  transition: all 0.3s;
}

.input-wrap input:focus {
  border-color: var(--color-accent);
  background: #fff;
  box-shadow: 0 0 0 4px rgba(139, 111, 71, 0.08);
}

.input-wrap input:focus + .input-icon,
.input-wrap:focus-within .input-icon {
  color: var(--color-accent);
}

.error {
  background: #FEF2F2;
  color: #DC2626;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
  margin-bottom: 16px;
  border: 1px solid #FEE2E2;
}

button[type="submit"] {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #8B6F47, #A68B64);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 8px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 16px rgba(139, 111, 71, 0.3);
  margin-top: 4px;
}

button[type="submit"]:hover:not(:disabled) {
  background: linear-gradient(135deg, #6B5535, #8B6F47);
  box-shadow: 0 6px 24px rgba(139, 111, 71, 0.4);
  transform: translateY(-1px);
}

button[type="submit"]:active:not(:disabled) {
  transform: translateY(0);
}

button[type="submit"]:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.footer-text {
  text-align: center;
  margin-top: 32px;
  font-size: 11px;
  color: var(--color-text-light);
  letter-spacing: 3px;
  text-transform: uppercase;
}

@media (max-width: 480px) {
  .login-card {
    padding: 36px 24px 32px;
    border-radius: 20px;
  }
  .brand h1 {
    font-size: 22px;
  }
}
</style>
