<template>
  <div class="home">
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
          <router-link to="/" class="active">首页</router-link>
          <router-link to="/list?type=二手房">二手房</router-link>
          <router-link to="/list?type=新房">新房</router-link>
          <router-link to="/list?type=租房">租房</router-link>
          <router-link to="/about">关于我们</router-link>
        </nav>
      </div>
    </header>

    <!-- Hero 搜索区 -->
    <section class="hero">
      <div class="container hero-content">
        <h1>深圳龙岗房产信息</h1>
        <p class="hero-sub">专注龙岗区 · 新房 · 二手房 · 租房</p>
        <SearchBar :showTags="true" @search="goSearch" class="hero-search" />
      </div>
    </section>

    <!-- 推荐房源 -->
    <section class="section container">
      <div class="section-header">
        <h2 class="section-title">精选推荐</h2>
        <router-link to="/list" class="section-more">查看更多 &gt;</router-link>
      </div>
      <div v-if="hotList.length" class="hot-grid">
        <PropertyCard v-for="p in hotList" :key="p.id" :property="p" />
      </div>
      <div v-else class="empty-hint">暂无推荐房源，请先在后台添加</div>
    </section>

    <!-- 按区域找房 -->
    <section class="area-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">龙岗区按区域找房</h2>
        </div>
        <div class="area-grid">
          <router-link v-for="a in longgangAreas" :key="a" :to="`/list?area=${a}`" class="area-card">
            <span class="area-name">{{ a }}</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- 房产类型入口 -->
    <section class="section container">
      <div class="section-header">
        <h2 class="section-title">找房通道</h2>
      </div>
      <div class="type-cards">
        <router-link to="/list?type=二手房" class="type-card">
          <div class="type-icon" style="background: linear-gradient(135deg, #8B6F47, #C4A882);">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4"/></svg>
          </div>
          <h3>二手房</h3>
          <p>海量真实二手房源</p>
        </router-link>
        <router-link to="/list?type=新房" class="type-card">
          <div class="type-icon" style="background: linear-gradient(135deg, #5A8C6A, #7AB68A);">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
          </div>
          <h3>新房</h3>
          <p>龙岗新盘抢先看</p>
        </router-link>
        <router-link to="/list?type=租房" class="type-card">
          <div class="type-icon" style="background: linear-gradient(135deg, #5A7FA8, #7A9FC8);">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <h3>租房</h3>
          <p>品质租房任你选</p>
        </router-link>
      </div>
    </section>

    <!-- 为什么选择嘉原 -->
    <section class="features-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">为什么选择嘉原地产</h2>
        </div>
        <div class="features-grid">
          <div class="feature-item">
            <div class="feat-icon">实</div>
            <h3>真房源</h3>
            <p>每套房源均经实地核查</p>
          </div>
          <div class="feature-item">
            <div class="feat-icon">专</div>
            <h3>一对一服务</h3>
            <p>专属顾问全程陪同</p>
          </div>
          <div class="feature-item">
            <div class="feat-icon">明</div>
            <h3>透明收费</h3>
            <p>所有费用公开透明</p>
          </div>
          <div class="feature-item">
            <div class="feat-icon">熟</div>
            <h3>深耕龙岗</h3>
            <p>熟悉龙岗每个小区</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container footer-inner">
        <div class="footer-brand">
          <strong>嘉原地产</strong>
          <p>专注深圳龙岗区房产服务</p>
          <p>电话：13603080608</p>
        </div>
        <div class="footer-links">
          <router-link to="/list?type=二手房">二手房</router-link>
          <router-link to="/list?type=新房">新房</router-link>
          <router-link to="/list?type=租房">租房</router-link>
          <router-link to="/about">关于我们</router-link>
        </div>
        <span class="footer-copy">© 2026 嘉原地产 版权所有</span>
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
const longgangAreas = [
  '龙岗中心城', '布吉', '坂田', '横岗', '龙城',
  '坪地', '南湾', '吉华', '园山', '宝龙',
];

onMounted(async () => {
  try {
    const res = await api.get('/properties/hot');
    hotList.value = res.data.data;
  } catch {}
});

function goSearch(keyword: string, type: string) {
  const query: any = {};
  if (keyword) query.keyword = keyword;
  if (type) query.type = type;
  router.push({ path: '/list', query });
}
</script>

<style scoped>
/* Top bar */
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
  transition: color 0.2s;
}
.top-links a:hover {
  color: #fff;
}

/* Header */
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
.main-nav a.active,
.main-nav a.router-link-exact-active {
  color: #fff;
  background: var(--color-accent);
}

/* Hero */
.hero {
  background: linear-gradient(135deg, #3A2E22 0%, #2D2118 50%, #3A2E22 100%);
  padding: 56px 0 64px;
  position: relative;
  overflow: hidden;
}
.hero::before {
  content: '';
  position: absolute;
  top: -30%;
  right: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(196,168,130,0.08) 0%, transparent 70%);
  border-radius: 50%;
}
.hero-content {
  position: relative;
  text-align: center;
}
.hero h1 {
  color: #fff;
  font-family: var(--font-serif);
  font-size: clamp(28px, 4vw, 40px);
  margin-bottom: 8px;
}
.hero-sub {
  color: rgba(196,168,130,0.7);
  font-size: 16px;
  margin-bottom: 32px;
}
.hero-search {
  max-width: 680px;
  margin: 0 auto;
}

/* Sections */
.section {
  padding: 48px 24px;
}
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.section-title {
  font-family: var(--font-serif);
  font-size: 24px;
  color: var(--color-text);
  position: relative;
  padding-left: 14px;
}
.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 4px;
  bottom: 4px;
  width: 4px;
  background: linear-gradient(180deg, var(--color-accent), var(--color-orange));
  border-radius: 2px;
}
.section-more {
  color: var(--color-accent);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
}
.section-more:hover {
  color: var(--color-accent-dark);
}

.hot-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.empty-hint {
  padding: 40px;
  text-align: center;
  color: var(--color-text-light);
  background: var(--bg-card);
  border-radius: 14px;
  border: 1px dashed var(--color-border);
}

/* Area section */
.area-section {
  padding: 48px 0;
  background: var(--bg-cream);
}
.area-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}
.area-card {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 16px;
  background: var(--bg-card);
  border: 1px solid var(--color-border-light);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.25s;
}
.area-card:hover {
  border-color: var(--color-accent);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}
.area-name {
  color: var(--color-text);
  font-size: 15px;
  font-weight: 600;
}

/* Type cards */
.type-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.type-card {
  padding: 32px 24px;
  background: var(--bg-card);
  border: 1px solid var(--color-border-light);
  border-radius: 16px;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s;
}
.type-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}
.type-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 16px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.type-icon svg {
  width: 28px;
  height: 28px;
}
.type-card h3 {
  color: var(--color-text);
  font-size: 18px;
  margin-bottom: 6px;
}
.type-card p {
  color: var(--color-text-light);
  font-size: 14px;
}

/* Features */
.features-section {
  padding: 48px 0;
  background: var(--bg-cream);
}
.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.feature-item {
  text-align: center;
  padding: 28px 20px;
  background: var(--bg-card);
  border-radius: 14px;
  border: 1px solid var(--color-border-light);
}
.feat-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(139,111,71,0.1), rgba(196,168,130,0.15));
  border-radius: 14px;
  font-family: var(--font-serif);
  font-size: 22px;
  font-weight: 700;
  color: var(--color-accent);
}
.feature-item h3 {
  font-size: 16px;
  margin-bottom: 6px;
}
.feature-item p {
  font-size: 13px;
  color: var(--color-text-light);
}

/* Footer */
.footer {
  padding: 40px 0 28px;
  background: #2D2118;
  color: rgba(255,255,255,0.5);
}
.footer-inner {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}
.footer-brand strong {
  display: block;
  color: var(--color-primary);
  font-family: var(--font-serif);
  font-size: 18px;
  margin-bottom: 8px;
}
.footer-brand p {
  font-size: 13px;
  margin-bottom: 4px;
}
.footer-links {
  display: flex;
  gap: 24px;
}
.footer-links a {
  color: rgba(255,255,255,0.5);
  font-size: 14px;
  text-decoration: none;
}
.footer-links a:hover {
  color: #fff;
}
.footer-copy {
  font-size: 12px;
  color: rgba(255,255,255,0.3);
}

@media (max-width: 768px) {
  .header-inner {
    padding: 0 16px;
  }
  .main-nav {
    gap: 0;
  }
  .main-nav a {
    padding: 8px 10px;
    font-size: 14px;
  }
  .hero {
    padding: 40px 0 48px;
  }
  .area-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .type-cards {
    grid-template-columns: 1fr;
  }
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .footer-inner {
    flex-direction: column;
  }
}
@media (max-width: 480px) {
  .top-bar span:first-child {
    display: none;
  }
  .logo-text {
    font-size: 17px;
  }
  .area-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
