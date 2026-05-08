<!-- frontend/src/views/List.vue -->
<template>
  <div class="list-page">
    <header class="header">
      <div class="container header-inner">
        <router-link to="/" class="logo">嘉原地产</router-link>
        <nav>
          <router-link to="/">首页</router-link>
          <router-link to="/list">房源</router-link>
          <router-link to="/about">关于我们</router-link>
        </nav>
      </div>
    </header>

    <div class="container content">
      <div class="sidebar">
        <SearchBar @search="onSearch" />
        <FilterPanel :areas="areas" @change="onFilter" />
      </div>
      <div class="main">
        <div class="result-info">
          共 <strong>{{ total }}</strong> 套房源
        </div>
        <div class="grid">
          <PropertyCard v-for="p in list" :key="p.id" :property="p" />
        </div>
        <div v-if="!list.length" class="empty">暂无符合条件的房源</div>
        <div class="pagination" v-if="total > pageSize">
          <button class="btn btn-outline" :disabled="page <= 1" @click="changePage(page - 1)">上一页</button>
          <span>{{ page }} / {{ Math.ceil(total / pageSize) }}</span>
          <button class="btn btn-outline" :disabled="page >= Math.ceil(total / pageSize)" @click="changePage(page + 1)">下一页</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../api';
import type { Property } from '../types';
import SearchBar from '../components/SearchBar.vue';
import FilterPanel from '../components/FilterPanel.vue';
import PropertyCard from '../components/PropertyCard.vue';

const route = useRoute();
const list = ref<Property[]>([]);
const areas = ref<string[]>([]);
const total = ref(0);
const page = ref(1);
const pageSize = 12;
const filters = ref({ type: '', area: '', keyword: '' });

async function fetchList() {
  const params: any = { page: page.value, pageSize };
  if (filters.value.type && filters.value.type !== '不限') params.type = filters.value.type;
  if (filters.value.area && filters.value.area !== '不限') params.area = filters.value.area;
  if (filters.value.keyword) params.keyword = filters.value.keyword;
  const res = await api.get('/properties', { params });
  list.value = res.data.data;
  total.value = res.data.total;
}

async function fetchAreas() {
  const res = await api.get('/areas');
  areas.value = res.data.data;
}

function onSearch(keyword: string) {
  filters.value.keyword = keyword;
  page.value = 1;
  fetchList();
}

function onFilter(f: { type: string; area: string }) {
  filters.value.type = f.type;
  filters.value.area = f.area;
  page.value = 1;
  fetchList();
}

function changePage(p: number) {
  page.value = p;
  fetchList();
  window.scrollTo(0, 0);
}

onMounted(() => {
  if (route.query.area) filters.value.area = route.query.area as string;
  if (route.query.keyword) filters.value.keyword = route.query.keyword as string;
  fetchAreas();
  fetchList();
});
</script>

<style scoped>
.header {
  background: var(--color-card);
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: 100;
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
}
.logo {
  font-size: 20px;
  color: var(--color-accent);
  font-weight: 700;
}
nav {
  display: flex;
  gap: 20px;
}
nav a {
  font-size: 15px;
  color: var(--color-text);
}
nav a.router-link-exact-active {
  color: var(--color-accent);
}
.content {
  display: flex;
  gap: 20px;
  padding: 20px 16px;
}
.sidebar {
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.main {
  flex: 1;
  min-width: 0;
}
.result-info {
  margin-bottom: 12px;
  font-size: 14px;
  color: var(--color-text-secondary);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}
.empty {
  text-align: center;
  padding: 48px;
  color: var(--color-text-secondary);
}
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .content {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
  }
}
</style>
