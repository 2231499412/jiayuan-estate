<template>
  <AdminLayout>
    <div class="page-header">
      <h1>修改密码</h1>
    </div>
    <div class="form-card">
      <Transition name="fade">
        <div v-if="success" class="alert success">
          <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
          {{ success }}
        </div>
      </Transition>
      <Transition name="fade">
        <div v-if="error" class="alert error">
          <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
          {{ error }}
        </div>
      </Transition>

      <div class="field">
        <label>旧密码</label>
        <div class="input-wrap">
          <svg class="field-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/></svg>
          <input v-model="form.oldPassword" type="password" placeholder="请输入当前密码" />
        </div>
      </div>
      <div class="field">
        <label>新密码</label>
        <div class="input-wrap">
          <svg class="field-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/></svg>
          <input v-model="form.newPassword" type="password" placeholder="至少6位" />
        </div>
      </div>
      <div class="field">
        <label>确认新密码</label>
        <div class="input-wrap">
          <svg class="field-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
          <input v-model="form.confirmPassword" type="password" placeholder="再次输入新密码" />
        </div>
      </div>

      <button class="btn-submit" @click="submit" :disabled="loading">
        {{ loading ? '提交中...' : '确认修改' }}
      </button>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../api';
import AdminLayout from '../../components/AdminLayout.vue';

const router = useRouter();
const loading = ref(false);
const error = ref('');
const success = ref('');
const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});

async function submit() {
  error.value = '';
  success.value = '';
  if (!form.oldPassword || !form.newPassword) {
    error.value = '请填写完整';
    return;
  }
  if (form.newPassword.length < 6) {
    error.value = '新密码至少6位';
    return;
  }
  if (form.newPassword !== form.confirmPassword) {
    error.value = '两次输入的新密码不一致';
    return;
  }
  loading.value = true;
  try {
    await api.put('/admin/password', {
      oldPassword: form.oldPassword,
      newPassword: form.newPassword,
    });
    success.value = '密码修改成功，请重新登录';
    form.oldPassword = '';
    form.newPassword = '';
    form.confirmPassword = '';
    setTimeout(() => {
      localStorage.removeItem('token');
      router.push('/admin/login');
    }, 1500);
  } catch (e: any) {
    error.value = e.response?.data?.error || '修改失败';
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.page-header {
  margin-bottom: 24px;
}
.page-header h1 {
  font-family: var(--font-serif);
  font-size: 28px;
  color: var(--color-text);
}

.form-card {
  max-width: 480px;
  background: var(--bg-card);
  border-radius: 16px;
  padding: 32px;
  border: 1px solid var(--color-border-light);
  box-shadow: var(--shadow-sm);
}

.alert {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  margin-bottom: 20px;
}
.alert svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}
.alert.error {
  background: #FEF2F2;
  color: #DC2626;
  border: 1px solid #FEE2E2;
}
.alert.success {
  background: #F0FDF4;
  color: #16A34A;
  border: 1px solid #DCFCE7;
}

.field {
  margin-bottom: 20px;
}
.field label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.input-wrap {
  position: relative;
}
.field-icon {
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
.input-wrap input {
  width: 100%;
  padding: 12px 14px 12px 44px;
  border: 1.5px solid var(--color-border);
  border-radius: 12px;
  font-size: 14px;
  background: var(--bg-main);
  outline: none;
  transition: all 0.3s;
}
.input-wrap input:focus {
  border-color: var(--color-accent);
  background: #fff;
  box-shadow: 0 0 0 3px rgba(139, 111, 71, 0.08);
}
.input-wrap:focus-within .field-icon {
  color: var(--color-accent);
}

.btn-submit {
  width: 100%;
  padding: 13px;
  background: linear-gradient(135deg, #8B6F47, #A68B64);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 16px rgba(139, 111, 71, 0.25);
  margin-top: 8px;
}
.btn-submit:hover:not(:disabled) {
  background: linear-gradient(135deg, #6B5535, #8B6F47);
  box-shadow: 0 6px 24px rgba(139, 111, 71, 0.35);
  transform: translateY(-1px);
}
.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.fade-enter-active { transition: all 0.3s; }
.fade-leave-active { transition: all 0.2s; }
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
