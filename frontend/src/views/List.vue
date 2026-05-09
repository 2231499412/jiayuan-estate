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
        <a href="tel:13603080608" class="header-phone">吴女士 13603080608</a>
      </div>
    </header>

    <section class="list-hero">
      <div class="container">
        <span class="eyebrow">房源中心</span>
        <h1>把合适的房子筛出来</h1>
        <p>按类型、区域和关键词快速查找，少花时间翻列表，多花时间看好房。</p>
      </div>
    </section>

    <div class="container content">
      <aside class="sidebar">
        <SearchBar @search="onSearch" />
        <FilterPanel :areas="areas" @change="onFilter" />
      </aside>
      <main class="main">
        <div class="result-info">
          <div>
            <span>共找到</span>
            <strong>{{ total }}</strong>
            <span>套房源</span>
          </div>
          <span class="hint">为你按最新发布排序</span>
        </div>
        <div v-if="list.length" class="grid">
          <PropertyCard v-for="p in list" :key="p.id" :property="p" />
        </div>
        <div v-else class="empty">
          <strong>暂无符合条件的房源</strong>
          <p>可以换个关键词，或者清空筛选条件再试试。</p>
        </div>
        <div class="pagination" v-if="total > pageSize">
          <button class="btn btn-outline" :disabled="page <= 1" @click="changePage(page - 1)">上一页</button>
          <span>{{ page }} / {{ Math.ceil(total / pageSize) }}</span>
          <button class="btn btn-outline" :disabled="page >= Math.ceil(total / pageSize)" @click="changePage(page + 1)">下一页</button>
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

function onSearch(keyword: string, type: string) {
  filters.value.keyword = keyword;
  if (type) filters.value.type = type;
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
.list-hero {
  position: relative;
  padding: 56px 0 48px;
  overflow: hidden;
  background: var(--bg-cream);
  border-bottom: 1px solid var(--color-border-light);
}
.list-hero::after {
  content: '';
  position: absolute;
  top: -160px;
  right: -100px;
  width: 420px;
  height: 420px;
  background: radial-gradient(circle, rgba(196, 168, 130, 0.18) 0%, transparent 70%);
  border-radius: 50%;
}
.list-hero .container {
  position: relative;
  z-index: 1;
}
.eyebrow {
  display: inline-block;
  margin-bottom: 12px;
  padding: 5px 12px;
  background: rgba(139, 111, 71, 0.08);
  border-radius: 100px;
  color: var(--color-accent);
  font-size: 13px;
  font-weight: 700;
}
.list-hero h1 {
  margin-bottom: 10px;
  font-family: var(--font-serif);
  font-size: clamp(28px, 4vw, 42px);
}
.list-hero p {
  max-width: 520px;
  color: var(--color-text-secondary);
  font-size: 16px;
}
.content {
  display: flex;
  gap: 24px;
  padding-top: 28px;
  padding-bottom: 64px;
}
.sidebar {
  position: sticky;
  top: 84px;
  width: 300px;
  height: fit-content;
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
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
  padding: 16px 18px;
  background: var(--bg-card);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius);
  color: var(--color-text-secondary);
  font-size: 14px;
}
.result-info strong {
  margin: 0 6px;
  color: var(--color-accent);
  font-family: var(--font-serif);
  font-size: 26px;
  line-height: 1;
}
.hint {
  color: var(--color-text-light);
  font-size: 13px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}
.empty {
  padding: 56px 24px;
  background: var(--bg-card);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius);
  text-align: center;
}
.empty strong {
  display: block;
  margin-bottom: 8px;
  color: var(--color-text);
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
.pagination span {
  color: var(--color-text-secondary);
  font-weight: 700;
}
@media (max-width: 900px) {
  .content {
    flex-direction: column;
  }
  .sidebar {
    position: static;
    width: 100%;
  }
}
@media (max-width: 640px) {
  .content {
    padding-top: 20px;
    padding-bottom: 40px;
  }
  .result-info {
    align-items: flex-start;
    flex-direction: column;
  }
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
