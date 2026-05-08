<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="sidebar-brand">
        <div class="brand-mark">
          <svg viewBox="0 0 40 40" fill="none">
            <path d="M20 4L3 18h5v16h24V18h5L20 4z" fill="currentColor" opacity="0.9"/>
            <rect x="15" y="22" width="10" height="12" rx="1" fill="rgba(255,255,255,0.25)"/>
          </svg>
        </div>
        <div class="brand-text">
          <span class="brand-name">嘉原地产</span>
          <span class="brand-sub">管理系统</span>
        </div>
      </div>
      <nav>
        <router-link to="/admin">
          <svg viewBox="0 0 20 20" fill="currentColor"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zm10 0a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"/></svg>
          <span>仪表盘</span>
        </router-link>
        <router-link to="/admin/properties">
          <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm3 1h6v4H7V5zm6 6H7v2h6v-2z" clip-rule="evenodd"/></svg>
          <span>房源管理</span>
        </router-link>
        <router-link to="/admin/password">
          <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/></svg>
          <span>修改密码</span>
        </router-link>
        <div class="nav-divider"></div>
        <router-link to="/" class="nav-external">
          <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H9.414l1.293-1.293z" clip-rule="evenodd"/></svg>
          <span>返回前台</span>
        </router-link>
      </nav>
      <button class="logout" @click="logout">
        <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"/></svg>
        <span>退出登录</span>
      </button>
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
  width: 220px;
  background: linear-gradient(180deg, #2D2118 0%, #3A2E22 40%, #2D2118 100%);
  color: #fff;
  padding: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.sidebar::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 100% 50% at 0% 0%, rgba(196, 168, 130, 0.06) 0%, transparent 60%),
    radial-gradient(ellipse 80% 40% at 100% 100%, rgba(139, 111, 71, 0.04) 0%, transparent 60%);
  pointer-events: none;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 20px 20px;
  position: relative;
}

.sidebar-brand::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20px;
  right: 20px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(196, 168, 130, 0.2), transparent);
}

.brand-mark {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #C4A882, #8B6F47);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
.brand-mark svg {
  width: 22px;
  height: 22px;
}

.brand-text {
  display: flex;
  flex-direction: column;
}
.brand-name {
  font-family: var(--font-serif);
  font-size: 16px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  letter-spacing: 2px;
}
.brand-sub {
  font-size: 11px;
  color: rgba(196, 168, 130, 0.6);
  letter-spacing: 3px;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  padding: 16px 12px;
}

nav a {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.55);
  font-size: 14px;
  text-decoration: none;
  transition: all 0.25s;
  position: relative;
}

nav a svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  opacity: 0.7;
  transition: opacity 0.25s;
}

nav a:hover {
  color: rgba(255, 255, 255, 0.85);
  background: rgba(196, 168, 130, 0.08);
}
nav a:hover svg {
  opacity: 1;
}

nav a.router-link-exact-active {
  color: #fff;
  background: rgba(196, 168, 130, 0.12);
}
nav a.router-link-exact-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 3px;
  background: linear-gradient(180deg, #C4A882, #D4764E);
  border-radius: 0 3px 3px 0;
}
nav a.router-link-exact-active svg {
  opacity: 1;
  color: #C4A882;
}

.nav-divider {
  height: 1px;
  background: rgba(196, 168, 130, 0.1);
  margin: 8px 14px;
}

.nav-external {
  opacity: 0.7;
}

.logout {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 12px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.45);
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.25s;
}
.logout svg {
  width: 16px;
  height: 16px;
}
.logout:hover {
  background: rgba(220, 38, 38, 0.1);
  border-color: rgba(220, 38, 38, 0.2);
  color: rgba(255, 255, 255, 0.8);
}

.main {
  flex: 1;
  padding: 28px 32px;
  background: var(--bg-main);
  overflow-y: auto;
  min-width: 0;
}

@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    flex-direction: row;
    align-items: center;
    padding: 0;
    overflow: visible;
  }
  .sidebar::before {
    display: none;
  }
  .sidebar-brand {
    padding: 12px 16px;
    margin: 0;
  }
  .sidebar-brand::after {
    display: none;
  }
  .brand-mark {
    width: 30px;
    height: 30px;
    border-radius: 8px;
  }
  .brand-mark svg {
    width: 18px;
    height: 18px;
  }
  .brand-sub {
    display: none;
  }
  .brand-name {
    font-size: 14px;
  }
  nav {
    flex-direction: row;
    flex: 1;
    padding: 8px 4px;
    gap: 0;
    overflow-x: auto;
  }
  nav a {
    padding: 8px 12px;
    white-space: nowrap;
    font-size: 13px;
  }
  nav a svg {
    width: 15px;
    height: 15px;
  }
  nav a.router-link-exact-active::before {
    left: 8px;
    right: 8px;
    top: auto;
    bottom: 0;
    width: auto;
    height: 2px;
    border-radius: 2px 2px 0 0;
  }
  .nav-divider {
    display: none;
  }
  .logout {
    margin: 8px;
    padding: 8px 10px;
  }
  .logout span {
    display: none;
  }
  .main {
    padding: 20px 16px;
  }
}
</style>
