<template>
  <div class="home">
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
      <div class="hero-grain"></div>
      <div class="hero-glow"></div>
      <div class="container hero-content">
        <div class="hero-badge">深耕龙岗 · 专业值得信赖</div>
        <h1 class="hero-title">深圳龙岗<br><span class="hero-accent">房产信息</span></h1>
        <p class="hero-sub">专注龙岗区 · 新房 · 二手房 · 租房</p>
        <SearchBar :showTags="true" @search="goSearch" class="hero-search" />
      </div>
      <div class="hero-deco-line"></div>
    </section>

    <!-- 推荐房源 -->
    <section class="section container">
      <div class="section-header">
        <h2 class="section-title">精选推荐</h2>
        <router-link to="/list" class="section-more">查看更多 &rarr;</router-link>
      </div>
      <div v-if="hotList.length" class="hot-grid">
        <PropertyCard v-for="(p, i) in hotList" :key="p.id" :property="p" :style="{ animationDelay: `${i * 0.08}s` }" class="reveal" />
      </div>
      <div v-else class="empty-hint">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="32" height="32"><path d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>
        <p>暂无推荐房源，请先在后台添加</p>
      </div>
    </section>

    <!-- 按区域找房 -->
    <section class="area-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">龙岗区按区域找房</h2>
        </div>
        <div class="area-grid">
          <router-link v-for="(a, i) in longgangAreas" :key="a" :to="`/list?area=${a}`" class="area-card" :style="{ animationDelay: `${i * 0.04}s` }">
            <span class="area-name">{{ a }}</span>
            <span class="area-arrow">&rarr;</span>
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
          <div class="type-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4"/></svg>
          </div>
          <h3>二手房</h3>
          <p>海量真实二手房源</p>
          <span class="type-link">查看房源 &rarr;</span>
        </router-link>
        <router-link to="/list?type=新房" class="type-card">
          <div class="type-icon type-icon-green">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
          </div>
          <h3>新房</h3>
          <p>龙岗新盘抢先看</p>
          <span class="type-link">查看房源 &rarr;</span>
        </router-link>
        <router-link to="/list?type=租房" class="type-card">
          <div class="type-icon type-icon-blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.8"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <h3>租房</h3>
          <p>品质租房任你选</p>
          <span class="type-link">查看房源 &rarr;</span>
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
      <div class="gold-line"></div>
      <div class="container footer-inner">
        <div class="footer-brand">
          <strong>嘉原地产</strong>
          <p>专注深圳龙岗区房产服务</p>
          <p>联系人：吴女士</p>
          <p>电话：<a href="tel:13603080608">13603080608</a></p>
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
/* ── Top Bar ── */
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

/* ── Header ── */
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
  border-radius: var(--radius-sm);
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
.main-nav a.active,
.main-nav a.router-link-exact-active {
  color: var(--color-accent-dark);
  font-weight: 700;
  background: rgba(122, 92, 58, 0.06);
}

/* ── Hero ── */
.hero {
  position: relative;
  padding: 64px 0 72px;
  background: linear-gradient(165deg, #2A1F15 0%, #1E1610 40%, #2A1F15 100%);
  overflow: hidden;
}
.hero-grain {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='300' height='300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
  pointer-events: none;
}
.hero-glow {
  position: absolute;
  top: -40%;
  right: -15%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(184, 148, 62, 0.08) 0%, transparent 65%);
  border-radius: 50%;
  pointer-events: none;
}
.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
}
.hero-badge {
  display: inline-block;
  margin-bottom: 20px;
  padding: 6px 18px;
  background: rgba(184, 148, 62, 0.12);
  border: 1px solid rgba(184, 148, 62, 0.2);
  border-radius: 100px;
  color: var(--color-gold);
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.12em;
  animation: fadeIn 0.8s var(--ease-out) both;
}
.hero-title {
  color: #fff;
  font-family: var(--font-display);
  font-size: clamp(32px, 5vw, 48px);
  font-weight: 700;
  margin-bottom: 10px;
  line-height: 1.25;
  letter-spacing: 0.06em;
  animation: fadeInUp 0.8s var(--ease-out) 0.1s both;
}
.hero-accent {
  background: linear-gradient(135deg, var(--color-gold), #D4A854);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.hero-sub {
  color: rgba(196, 168, 130, 0.6);
  font-size: 16px;
  margin-bottom: 36px;
  letter-spacing: 0.08em;
  animation: fadeInUp 0.8s var(--ease-out) 0.2s both;
}
.hero-search {
  max-width: 680px;
  margin: 0 auto;
  animation: fadeInUp 0.8s var(--ease-out) 0.3s both;
}
.hero-deco-line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-gold), transparent);
  opacity: 0.2;
}

/* ── Sections ── */
.section {
  padding: 52px 24px;
}
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
}
.section-more {
  color: var(--color-accent);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: var(--transition);
  letter-spacing: 0.02em;
}
.section-more:hover {
  color: var(--color-gold);
  transform: translateX(3px);
}

.hot-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.empty-hint {
  padding: 52px 40px;
  text-align: center;
  color: var(--color-text-light);
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  border: 1px dashed var(--color-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.empty-hint svg {
  opacity: 0.3;
}
.empty-hint p {
  font-size: 15px;
}

/* ── Area Section ── */
.area-section {
  padding: 52px 0;
  background: var(--bg-cream);
  position: relative;
}
.area-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-border), transparent);
}
.area-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}
.area-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 18px;
  background: var(--bg-card);
  border: 1px solid var(--color-border-light);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s var(--ease-out);
}
.area-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-3px);
  box-shadow: var(--shadow);
}
.area-card:hover .area-arrow {
  opacity: 1;
  transform: translateX(0);
  color: var(--color-gold);
}
.area-name {
  color: var(--color-text);
  font-size: 15px;
  font-weight: 600;
  font-family: var(--font-display);
  letter-spacing: 0.04em;
}
.area-arrow {
  color: var(--color-text-light);
  font-size: 14px;
  opacity: 0;
  transform: translateX(-6px);
  transition: all 0.3s var(--ease-out);
}

/* ── Type Cards ── */
.type-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.type-card {
  padding: 36px 28px;
  background: var(--bg-card);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-lg);
  text-align: left;
  text-decoration: none;
  transition: all 0.35s var(--ease-out);
  position: relative;
  overflow: hidden;
}
.type-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-accent), var(--color-gold));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s var(--ease-out);
}
.type-card:hover::before {
  transform: scaleX(1);
}
.type-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}
.type-icon {
  width: 56px;
  height: 56px;
  margin-bottom: 20px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, var(--color-accent), #8B6F47);
  box-shadow: 0 4px 12px rgba(122, 92, 58, 0.2);
}
.type-icon-green {
  background: linear-gradient(145deg, var(--color-green), #5A8C6A);
  box-shadow: 0 4px 12px rgba(74, 122, 90, 0.2);
}
.type-icon-blue {
  background: linear-gradient(145deg, var(--color-blue), #5A7FA8);
  box-shadow: 0 4px 12px rgba(74, 111, 140, 0.2);
}
.type-icon svg {
  width: 28px;
  height: 28px;
}
.type-card h3 {
  color: var(--color-text);
  font-size: 20px;
  margin-bottom: 6px;
  font-family: var(--font-display);
  letter-spacing: 0.04em;
}
.type-card p {
  color: var(--color-text-light);
  font-size: 14px;
  margin-bottom: 16px;
}
.type-link {
  color: var(--color-accent);
  font-size: 14px;
  font-weight: 600;
  transition: var(--transition);
}
.type-card:hover .type-link {
  color: var(--color-gold);
}

/* ── Features ── */
.features-section {
  padding: 52px 0;
  background: var(--bg-cream);
  position: relative;
}
.features-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-border), transparent);
}
.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.feature-item {
  text-align: center;
  padding: 32px 20px;
  background: var(--bg-card);
  border-radius: var(--radius);
  border: 1px solid var(--color-border-light);
  transition: var(--transition);
}
.feature-item:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow);
}
.feat-icon {
  width: 52px;
  height: 52px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, rgba(122, 92, 58, 0.08), rgba(184, 148, 62, 0.12));
  border: 1px solid rgba(184, 148, 62, 0.15);
  border-radius: 14px;
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 700;
  color: var(--color-accent);
}
.feature-item h3 {
  font-size: 16px;
  margin-bottom: 6px;
  font-family: var(--font-display);
  letter-spacing: 0.04em;
}
.feature-item p {
  font-size: 13px;
  color: var(--color-text-light);
}

/* ── Footer ── */
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
  transition: color 0.2s;
}
.footer-brand a:hover {
  color: var(--color-gold);
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
.footer-links a:hover {
  color: var(--color-primary);
}
.footer-copy {
  font-size: 12px;
  color: rgba(255,255,255,0.25);
}

/* ── Responsive ── */
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
    padding: 44px 0 52px;
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
  .top-brand {
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
