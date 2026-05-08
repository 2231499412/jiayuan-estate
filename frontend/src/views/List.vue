<template>
  <div class="list-page">
    <!-- 顶部信息条 -->
    <div class="top-bar">
      <div class="container top-bar-inner">
        <span>深圳龙岗房产信息网</span>
        <div class="top-links">
          <a href="tel:13603080608">📞 13603080608</a>
          <router-link to="/admin/login">管理登录</router-link>
        </div>
      </div>
    </div>

    <!-- 主导航 -->
    <header class="header">
      <div class="container header-inner">
        <router-link to="/" class="logo">
          <span class="logo-icon">嘉</span>
          <span class="logo-text">嘉原地产</span>
        </router-link>
        <nav class="main-nav">
          <router-link to="/">首页</router-link>
          <router-link to="/list?type=二手房">二手房</router-link>
          <router-link to="/list?type=新房">新房</router-link>
          <router-link to="/list?type=租房">租房</router-link>
          <router-link to="/about">关于我们</router-link>
        </nav>
      </div>
    </header>

    <!-- 搜索条 -->
    <div class="search-section">
      <div class="container">
        <SearchBar :showTags="false" @search="onSearch" />
      </div>
    </div>

    <!-- 筛选 + 结果 -->
    <div class="container content">
      <aside class="sidebar">
        <FilterPanel :areas="areas" @change="onFilter" />
      </aside>
      <main class="main">
        <div class="result-bar">
          <div class="result-count">
            共找到 <strong>{{ total }}</strong> 套房源
          </div>
          <div class="result-info">
            <span v-if="filters.type">{{ filters.type }}</span>
            <span v-if="filters.area && filters.area !== '不限'">{{ filters.area }}</span>
          </div>
        </div>

        <div v-if="list.length" class="result-list">
          <PropertyCard v-for="p in list" :key="p.id" :property="p" />
        </div>
        <div v-else class="empty">
          <strong>暂无符合条件的房源</strong>
          <p>可以换个关键词，或者清空筛选条件再试试</p>
        </div>

        <div class="pagination" v-if="total > pageSize">
          <button :disabled="page <= 1" @click="changePage(page - 1)">上一页</button>
          <span>{{ page }} / {{ Math.ceil(total / pageSize) }}</span>
          <button :disabled="page >= Math.ceil(total / pageSize)" @click="changePage(page + 1)">下一页</button>
        </div>
      </main>
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
const filters = ref({ type: '', area: '', keyword: '', priceRange: '', rooms: '' });

async function fetchList() {
  const params: any = { page: page.value, pageSize };
  if (filters.value.type) params.type = filters.value.type;
  if (filters.value.area && filters.value.area !== '不限') params.area = filters.value.area;
  if (filters.value.keyword) params.keyword = filters.value.keyword;
  if (filters.value.priceRange && filters.value.priceRange !== '不限') params.priceRange = filters.value.priceRange;
  if (filters.value.rooms && filters.value.rooms !== '不限') params.rooms = filters.value.rooms;
  const res = await api.get('/properties', { params });
  list.value = res.data.data;
  total.value = res.data.total;
}

async function fetchAreas() {
  const res = await api.get('/areas');
  areas.value = res.data.data;
}

function onSearch(keyword: string, type: string) {
  filters.value.keyword = keyword;
  if (type) filters.value.type = type;
  page.value = 1;
  fetchList();
}

function onFilter(f: { area: string; priceRange: string; rooms: string }) {
  filters.value.area = f.area;
  filters.value.priceRange = f.priceRange;
  filters.value.rooms = f.rooms;
  page.value = 1;
  fetchList();
}

function changePage(p: number) {
  page.value = p;
  fetchList();
  window.scrollTo(0, 0);
}

onMounted(() => {
  if (route.query.type) filters.value.type = route.query.type as string;
  if (route.query.area) filters.value.area = route.query.area as string;
  if (route.query.keyword) filters.value.keyword = route.query.keyword as string;
  fetchAreas();
  fetchList();
});
</script>

<style scoped>
.top-bar {
  background: #2D2118;
  color: rgba(255,255,255,0.6);
  font-size: 13px;
  padding: 6px 0;
}
.top-bar-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.top-links {
  display: flex;
  gap: 20px;
}
.top-links a {
  color: rgba(255,255,255,0.6);
  text-decoration: none;
}
.top-links a:hover { color: #fff; }

.header {
  background: #fff;
  border-bottom: 2px solid var(--color-accent);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(45,33,24,0.06);
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 64px;
}
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}
.logo-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #8B6F47, #C4A882);
  color: #fff;
  border-radius: 10px;
  font-family: var(--font-serif);
  font-size: 18px;
  font-weight: 700;
}
.logo-text {
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: 2px;
}
.main-nav {
  display: flex;
  gap: 4px;
}
.main-nav a {
  padding: 8px 18px;
  border-radius: 8px;
  color: var(--color-text-secondary);
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.25s;
}
.main-nav a:hover {
  color: var(--color-accent);
  background: rgba(139,111,71,0.06);
}

.search-section {
  padding: 20px 0;
  background: var(--bg-cream);
  border-bottom: 1px solid var(--color-border-light);
}

.content {
  display: flex;
  gap: 24px;
  padding: 24px;
  padding-bottom: 64px;
}
.sidebar {
  width: 280px;
  flex-shrink: 0;
  position: sticky;
  top: 100px;
  height: fit-content;
}
.main {
  flex: 1;
  min-width: 0;
}

.result-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 14px 18px;
  background: var(--bg-card);
  border: 1px solid var(--color-border-light);
  border-radius: 12px;
}
.result-count {
  font-size: 14px;
  color: var(--color-text-secondary);
}
.result-count strong {
  color: var(--color-accent);
  font-family: var(--font-serif);
  font-size: 22px;
  margin: 0 4px;
}
.result-info {
  display: flex;
  gap: 8px;
}
.result-info span {
  padding: 3px 10px;
  background: rgba(139,111,71,0.08);
  border-radius: 6px;
  font-size: 13px;
  color: var(--color-accent);
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty {
  padding: 56px 24px;
  background: var(--bg-card);
  border: 1px dashed var(--color-border);
  border-radius: 14px;
  text-align: center;
}
.empty strong {
  display: block;
  margin-bottom: 8px;
  font-size: 18px;
}
.empty p {
  color: var(--color-text-light);
  font-size: 14px;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 28px;
}
.pagination button {
  padding: 8px 20px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--bg-card);
  cursor: pointer;
  transition: all 0.2s;
}
.pagination button:hover:not(:disabled) {
  border-color: var(--color-accent);
  color: var(--color-accent);
}
.pagination button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.pagination span {
  font-weight: 600;
  color: var(--color-text-secondary);
}

@media (max-width: 900px) {
  .content {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    position: static;
  }
}
@media (max-width: 640px) {
  .result-list {
    gap: 12px;
  }
}
</style>
