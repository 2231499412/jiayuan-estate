<template>
  <div class="list-page">
    <!-- 顶部信息条 -->
    <div class="top-bar">
      <div class="container top-bar-inner">
        <span class="top-brand">深圳龙岗房产信息网</span>
        <div class="top-links">
          <a href="tel:13603080608">
            <svg viewBox="0 0 16 16" fill="currentColor" width="13" height="13"><path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58z"/></svg>
            吴女士 13603080608
          </a>
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
          <PropertyCard v-for="(p, i) in list" :key="p.id" :property="p" :style="{ animationDelay: `${i * 0.06}s` }" class="reveal" />
        </div>
        <div v-else class="empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="36" height="36"><path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
          <strong>暂无符合条件的房源</strong>
          <p>可以换个关键词，或者清空筛选条件再试试</p>
        </div>

        <div class="pagination" v-if="total > pageSize">
          <button :disabled="page <= 1" @click="changePage(page - 1)">&larr; 上一页</button>
          <span>{{ page }} / {{ Math.ceil(total / pageSize) }}</span>
          <button :disabled="page >= Math.ceil(total / pageSize)" @click="changePage(page + 1)">下一页 &rarr;</button>
        </div>
      </main>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <div class="gold-line"></div>
      <div class="container footer-inner">
        <div class="footer-brand">
          <strong>嘉原地产</strong>
          <p>专注深圳龙岗区房产服务</p>
          <p>联系人：吴女士 · <a href="tel:13603080608">13603080608</a></p>
        </div>
        <div class="footer-links">
          <router-link to="/list?type=二手房">二手房</router-link>
          <router-link to="/list?type=新房">新房</router-link>
          <router-link to="/list?type=租房">租房</router-link>
          <router-link to="/about">关于我们</router-link>
        </div>
        <span class="footer-copy">&copy; 2026 嘉原地产 版权所有</span>
      </div>
    </footer>
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
  background: var(--color-text);
  color: rgba(255,255,255,0.5);
  font-size: 13px;
  padding: 7px 0;
  letter-spacing: 0.02em;
}
.top-bar-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.top-brand {
  font-family: var(--font-display);
  letter-spacing: 0.08em;
}
.top-links {
  display: flex;
  gap: 20px;
  align-items: center;
}
.top-links a {
  color: rgba(255,255,255,0.5);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: color 0.25s;
}
.top-links a:hover { color: var(--color-primary); }

.header {
  background: rgba(248, 244, 238, 0.92);
  backdrop-filter: blur(24px) saturate(1.2);
  -webkit-backdrop-filter: blur(24px) saturate(1.2);
  border-bottom: 1px solid var(--color-border-light);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 3px rgba(30, 22, 16, 0.04);
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 66px;
}
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}
.logo-icon {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, var(--color-accent), var(--color-gold));
  color: #fff;
  border-radius: 10px;
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  box-shadow: 0 2px 10px rgba(122, 92, 58, 0.25);
}
.logo-text {
  font-family: var(--font-display);
  font-size: 21px;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: 3px;
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
  transition: all 0.25s var(--ease-out);
}
.main-nav a:hover {
  color: var(--color-accent);
  background: var(--color-accent-glow);
}

.search-section {
  padding: 22px 0;
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
  margin-bottom: 18px;
  padding: 16px 20px;
  background: var(--bg-card);
  border: 1px solid var(--color-border-light);
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
}
.result-count {
  font-size: 14px;
  color: var(--color-text-secondary);
}
.result-count strong {
  color: var(--color-accent);
  font-family: var(--font-display);
  font-size: 24px;
  margin: 0 4px;
}
.result-info {
  display: flex;
  gap: 8px;
}
.result-info span {
  padding: 4px 12px;
  background: var(--color-accent-glow);
  border: 1px solid rgba(122, 92, 58, 0.1);
  border-radius: 8px;
  font-size: 13px;
  color: var(--color-accent);
  font-family: var(--font-display);
}

.result-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.empty {
  padding: 64px 24px;
  background: var(--bg-card);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-lg);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: var(--color-text-light);
}
.empty svg { opacity: 0.3; }
.empty strong {
  display: block;
  font-size: 18px;
  color: var(--color-text-secondary);
  font-family: var(--font-display);
}
.empty p {
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
  padding: 10px 22px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  background: var(--bg-card);
  font-size: 14px;
  font-weight: 600;
  transition: all 0.25s var(--ease-out);
}
.pagination button:hover:not(:disabled) {
  border-color: var(--color-accent);
  color: var(--color-accent);
  box-shadow: var(--shadow-sm);
}
.pagination button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.pagination span {
  font-weight: 600;
  color: var(--color-text-secondary);
  font-family: var(--font-display);
}

/* Footer */
.footer {
  padding: 0;
  background: var(--color-text);
  color: rgba(255,255,255,0.45);
}
.footer .gold-line {
  height: 2px;
  background: linear-gradient(90deg, transparent 5%, var(--color-gold), transparent 95%);
  opacity: 0.25;
}
.footer-inner {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding: 40px 0 28px;
}
.footer-brand strong {
  display: block;
  color: var(--color-primary);
  font-family: var(--font-display);
  font-size: 20px;
  margin-bottom: 10px;
  letter-spacing: 0.08em;
}
.footer-brand p {
  font-size: 13px;
  margin-bottom: 5px;
}
.footer-brand a {
  color: var(--color-primary-light);
}
.footer-links {
  display: flex;
  gap: 24px;
}
.footer-links a {
  color: rgba(255,255,255,0.45);
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s;
}
.footer-links a:hover { color: var(--color-primary); }
.footer-copy {
  font-size: 12px;
  color: rgba(255,255,255,0.25);
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
  .footer-inner {
    flex-direction: column;
  }
}
</style>
