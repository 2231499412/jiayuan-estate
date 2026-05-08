<!-- frontend/src/views/Home.vue -->
<template>
  <div class="home">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="container header-inner">
        <h1 class="logo">嘉原地产</h1>
        <nav>
          <router-link to="/">首页</router-link>
          <router-link to="/list">房源</router-link>
          <router-link to="/about">关于我们</router-link>
        </nav>
      </div>
    </header>

    <!-- Banner -->
    <section class="banner">
      <div class="container">
        <h2>找到理想的家</h2>
        <p>嘉原地产，为您精选优质房源</p>
        <SearchBar @search="goSearch" />
      </div>
    </section>

    <!-- 推荐房源 -->
    <section class="section container">
      <h2 class="section-title">推荐房源</h2>
      <div class="grid">
        <PropertyCard v-for="p in hotList" :key="p.id" :property="p" />
      </div>
    </section>

    <!-- 区域入口 -->
    <section class="section container">
      <h2 class="section-title">按区域找房</h2>
      <div class="area-grid">
        <router-link v-for="a in areas" :key="a" :to="`/list?area=${a}`" class="area-item card">
          {{ a }}
        </router-link>
      </div>
    </section>

    <!-- 底部 -->
    <footer class="footer">
      <div class="container">
        <p>&copy; 2026 嘉原地产 版权所有</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';
import type { Property } from '../types';
import SearchBar from '../components/SearchBar.vue';
import PropertyCard from '../components/PropertyCard.vue';

const router = useRouter();
const hotList = ref<Property[]>([]);
const areas = ref<string[]>([]);

onMounted(async () => {
  const [hotRes, areasRes] = await Promise.all([
    api.get('/properties/hot'),
    api.get('/areas'),
  ]);
  hotList.value = hotRes.data.data;
  areas.value = areasRes.data.data;
});

function goSearch(keyword: string) {
  router.push({ path: '/list', query: keyword ? { keyword } : {} });
}
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
  font-weight: 600;
}
.banner {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  padding: 48px 0;
  text-align: center;
  color: #fff;
}
.banner h2 {
  font-size: 28px;
  margin-bottom: 8px;
}
.banner p {
  font-size: 16px;
  margin-bottom: 20px;
  opacity: 0.9;
}
.section {
  padding: 32px 16px;
}
.section-title {
  font-size: 20px;
  margin-bottom: 16px;
  padding-left: 12px;
  border-left: 3px solid var(--color-accent);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}
.area-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}
.area-item {
  padding: 16px;
  text-align: center;
  font-size: 15px;
  color: var(--color-accent);
  font-weight: 500;
}
.footer {
  background: var(--color-text);
  color: var(--color-text-secondary);
  text-align: center;
  padding: 20px 0;
  margin-top: 32px;
}
</style>
