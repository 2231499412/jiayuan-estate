<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <h2 class="logo">嘉原管理</h2>
      <nav>
        <router-link to="/admin">仪表盘</router-link>
        <router-link to="/admin/properties">房源管理</router-link>
        <router-link to="/">返回前台</router-link>
      </nav>
      <button class="logout" @click="logout">退出登录</button>
    </aside>
    <main class="main">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
function logout() {
  localStorage.removeItem('token');
  router.push('/admin/login');
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}
.sidebar {
  width: 200px;
  background: var(--color-text);
  color: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
}
.logo {
  font-size: 18px;
  margin-bottom: 24px;
  color: var(--color-primary);
}
nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}
nav a {
  padding: 10px 12px;
  border-radius: 6px;
  color: rgba(255,255,255,0.7);
  font-size: 14px;
}
nav a.router-link-exact-active {
  background: var(--color-accent);
  color: #fff;
}
.logout {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.3);
  color: rgba(255,255,255,0.7);
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
}
.main {
  flex: 1;
  padding: 24px;
  background: var(--bg-main);
  overflow-y: auto;
}

@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    flex-direction: row;
    align-items: center;
    padding: 12px;
    gap: 12px;
  }
  .logo {
    margin-bottom: 0;
    font-size: 16px;
  }
  nav {
    flex-direction: row;
    flex: 1;
  }
  .logout {
    margin-left: auto;
  }
}
</style>
