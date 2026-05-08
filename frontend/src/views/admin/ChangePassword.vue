<template>
  <AdminLayout>
    <h1>修改密码</h1>
    <div class="card form-card">
      <div v-if="success" class="success">{{ success }}</div>
      <div v-if="error" class="error">{{ error }}</div>
      <div class="field">
        <label>旧密码</label>
        <input v-model="form.oldPassword" type="password" placeholder="请输入旧密码" />
      </div>
      <div class="field">
        <label>新密码</label>
        <input v-model="form.newPassword" type="password" placeholder="请输入新密码（至少6位）" />
      </div>
      <div class="field">
        <label>确认新密码</label>
        <input v-model="form.confirmPassword" type="password" placeholder="请再次输入新密码" />
      </div>
      <button class="btn" @click="submit" :disabled="loading">
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
h1 { margin-bottom: 20px; }
.form-card { max-width: 480px; padding: 28px; }
.field { margin-bottom: 16px; }
label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
  color: var(--color-text-secondary);
}
input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-size: 14px;
  background: var(--bg-card);
  transition: var(--transition);
}
input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px rgba(139, 111, 71, 0.1);
}
.btn {
  width: 100%;
  padding: 12px;
  background: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}
.btn:hover { background: var(--color-accent-dark); }
.btn:disabled { opacity: 0.6; cursor: not-allowed; }
.error {
  background: #fef2f2;
  color: #dc2626;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  margin-bottom: 16px;
  font-size: 14px;
}
.success {
  background: #f0fdf4;
  color: #16a34a;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  margin-bottom: 16px;
  font-size: 14px;
}
</style>
