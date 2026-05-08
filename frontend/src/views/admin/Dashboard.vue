<template>
  <AdminLayout>
    <h1>仪表盘</h1>
    <div class="stats">
      <div class="stat-card card">
        <span class="stat-value">{{ stats.total }}</span>
        <span class="stat-label">房源总数</span>
      </div>
      <div class="stat-card card">
        <span class="stat-value">{{ stats.selling }}</span>
        <span class="stat-label">在售</span>
      </div>
      <div class="stat-card card">
        <span class="stat-value">{{ stats.sold }}</span>
        <span class="stat-label">已售</span>
      </div>
      <div class="stat-card card">
        <span class="stat-value">{{ stats.rented }}</span>
        <span class="stat-label">已租</span>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../api';
import AdminLayout from '../../components/AdminLayout.vue';

const stats = ref({ total: 0, selling: 0, sold: 0, rented: 0 });

onMounted(async () => {
  const res = await api.get('/admin/stats');
  const d = res.data.data;
  stats.value = {
    total: d.total || 0,
    selling: d.selling || 0,
    sold: d.sold || 0,
    rented: d.rented || 0,
  };
});
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
}
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}
.stat-card {
  padding: 20px;
  text-align: center;
}
.stat-value {
  display: block;
  font-size: 32px;
  font-weight: 700;
  color: var(--color-accent);
}
.stat-label {
  font-size: 14px;
  color: var(--color-text-secondary);
}
</style>
