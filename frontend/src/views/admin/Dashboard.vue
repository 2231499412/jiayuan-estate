<template>
  <AdminLayout>
    <div class="dashboard-header">
      <div>
        <h1>仪表盘</h1>
        <p class="date">{{ today }}</p>
      </div>
    </div>

    <div class="stats">
      <div class="stat-card" v-for="s in statItems" :key="s.key">
        <div class="stat-icon" :style="{ background: s.gradient }">
          <span v-html="s.icon"></span>
        </div>
        <div class="stat-info">
          <span class="stat-value">{{ stats[s.key] }}</span>
          <span class="stat-label">{{ s.label }}</span>
        </div>
        <div class="stat-decoration" :style="{ background: s.gradient }"></div>
      </div>
    </div>

    <div class="quick-actions">
      <h2>快捷操作</h2>
      <div class="actions-grid">
        <router-link to="/admin/properties" class="action-card">
          <div class="action-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
          </div>
          <span>新增房源</span>
        </router-link>
        <router-link to="/admin/properties" class="action-card">
          <div class="action-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
          </div>
          <span>管理房源</span>
        </router-link>
        <router-link to="/" class="action-card">
          <div class="action-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4"/></svg>
          </div>
          <span>查看前台</span>
        </router-link>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import api from '../../api';
import AdminLayout from '../../components/AdminLayout.vue';

const stats = reactive({ total: 0, selling: 0, sold: 0, rented: 0 });

const today = new Date().toLocaleDateString('zh-CN', {
  year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
});

const statItems = [
  {
    key: 'total' as const,
    label: '房源总数',
    gradient: 'linear-gradient(135deg, #8B6F47, #C4A882)',
    icon: '<svg viewBox="0 0 20 20" fill="currentColor" width="22" height="22"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>',
  },
  {
    key: 'selling' as const,
    label: '在售',
    gradient: 'linear-gradient(135deg, #5A8C6A, #7AB68A)',
    icon: '<svg viewBox="0 0 20 20" fill="currentColor" width="22" height="22"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>',
  },
  {
    key: 'sold' as const,
    label: '已售',
    gradient: 'linear-gradient(135deg, #D4764E, #E8956E)',
    icon: '<svg viewBox="0 0 20 20" fill="currentColor" width="22" height="22"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>',
  },
  {
    key: 'rented' as const,
    label: '已租',
    gradient: 'linear-gradient(135deg, #5A7FA8, #7A9FC8)',
    icon: '<svg viewBox="0 0 20 20" fill="currentColor" width="22" height="22"><path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd"/></svg>',
  },
];

onMounted(async () => {
  const res = await api.get('/admin/stats');
  const d = res.data.data;
  stats.total = d.total || 0;
  stats.selling = d.selling || 0;
  stats.sold = d.sold || 0;
  stats.rented = d.rented || 0;
});
</script>

<style scoped>
.dashboard-header {
  margin-bottom: 28px;
}
.dashboard-header h1 {
  font-family: var(--font-serif);
  font-size: 28px;
  color: var(--color-text);
  margin-bottom: 4px;
}
.date {
  font-size: 14px;
  color: var(--color-text-light);
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 36px;
}

.stat-card {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 22px;
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border-light);
  transition: all 0.3s;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-info {
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
}
.stat-value {
  font-family: var(--font-serif);
  font-size: 30px;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.1;
}
.stat-label {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-top: 2px;
}

.stat-decoration {
  position: absolute;
  right: -20px;
  bottom: -20px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  opacity: 0.06;
}

.quick-actions h2 {
  font-family: var(--font-serif);
  font-size: 20px;
  color: var(--color-text);
  margin-bottom: 16px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  background: var(--bg-card);
  border: 1px solid var(--color-border-light);
  border-radius: 14px;
  text-decoration: none;
  color: var(--color-text);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.25s;
}
.action-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
}

.action-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--bg-cream);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-accent);
}
.action-icon svg {
  width: 18px;
  height: 18px;
}

@media (max-width: 640px) {
  .stats {
    grid-template-columns: repeat(2, 1fr);
  }
  .stat-card {
    padding: 16px;
  }
  .stat-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
  }
  .stat-value {
    font-size: 24px;
  }
}
</style>
