<!-- frontend/src/views/Home.vue -->
<template>
  <div class="home">
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

    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge">深耕本地 · 值得信赖</div>
          <h1>找到理想的<em>家</em></h1>
          <p class="hero-desc">嘉原地产，为您精选优质二手房、新房和租房房源。专业团队一对一服务，让每一次选择都安心。</p>
          <SearchBar class="hero-search" @search="goSearch" />
          <div class="stats-bar">
            <div class="stat-item">
              <div class="stat-number">{{ hotList.length || 0 }}<span>套</span></div>
              <div class="stat-label">推荐房源</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">{{ areas.length || 0 }}<span>个</span></div>
              <div class="stat-label">覆盖区域</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">8</div>
              <div class="stat-label">年行业经验</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section container">
      <div class="section-header">
        <h2 class="section-title">推荐房源</h2>
        <router-link to="/list" class="section-more">查看全部 →</router-link>
      </div>
      <div v-if="hotList.length" class="grid">
        <PropertyCard v-for="p in hotList" :key="p.id" :property="p" />
      </div>
      <div v-else class="empty-card">暂无推荐房源，请先在后台添加房源</div>
    </section>

    <section class="area-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">按区域找房</h2>
        </div>
        <div v-if="areas.length" class="area-grid">
          <router-link v-for="a in areas" :key="a" :to="`/list?area=${a}`" class="area-item">
            <span class="area-name">{{ a }}</span>
            <span class="area-count">查看房源</span>
          </router-link>
        </div>
        <div v-else class="empty-card">暂无区域数据</div>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">为什么选择嘉原</h2>
        </div>
        <div class="feature-grid">
          <div class="feature-card">
            <div class="feature-icon">实</div>
            <h3>真房源</h3>
            <p>每套房源均经过实地核查，确保信息真实可靠，杜绝虚假房源。</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">专</div>
            <h3>一对一服务</h3>
            <p>专属顾问全程陪同，从看房到签约，每一步都有人为您把关。</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">明</div>
            <h3>透明收费</h3>
            <p>所有费用公开透明，无隐藏收费，让您安心完成每一次交易。</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">熟</div>
            <h3>本地深耕</h3>
            <p>熟悉本地每个小区的优劣，帮您做出更合适的选择。</p>
          </div>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <div class="cta-card">
          <h2>找到心仪的房源了吗？</h2>
          <p>联系我们，专业顾问为您一对一服务</p>
          <router-link to="/about" class="cta-btn">立即咨询</router-link>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="container footer-inner">
        <div>
          <strong>嘉原地产</strong>
          <p>专业、诚信、温暖，为您找到理想的家。</p>
        </div>
        <span>© 2026 嘉原地产 版权所有</span>
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
.hero {
  position: relative;
  padding: 80px 0 100px;
  overflow: hidden;
}
.hero::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(196, 168, 130, 0.15) 0%, transparent 70%);
  border-radius: 50%;
}
.hero::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(139, 111, 71, 0.08) 0%, transparent 70%);
  border-radius: 50%;
}
.hero-content {
  position: relative;
  z-index: 1;
  max-width: 680px;
}
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  margin-bottom: 24px;
  background: rgba(139, 111, 71, 0.08);
  border: 1px solid rgba(139, 111, 71, 0.12);
  border-radius: 100px;
  font-size: 13px;
  font-weight: 500;
  color: var(--color-accent);
}
.hero-badge::before {
  content: '';
  width: 6px;
  height: 6px;
  background: var(--color-accent);
  border-radius: 50%;
}
.hero h1 {
  margin-bottom: 16px;
  font-family: var(--font-serif);
  font-size: clamp(34px, 5vw, 52px);
  font-weight: 700;
  line-height: 1.25;
}
.hero h1 em {
  position: relative;
  z-index: 1;
  color: var(--color-accent);
  font-style: normal;
}
.hero h1 em::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 8px;
  background: rgba(196, 168, 130, 0.3);
  border-radius: 4px;
}
.hero-desc {
  max-width: 520px;
  margin-bottom: 32px;
  color: var(--color-text-secondary);
  font-size: 17px;
  line-height: 1.8;
}
.hero-search {
  max-width: 560px;
}
.stats-bar {
  display: flex;
  gap: 40px;
  margin-top: 48px;
  padding-top: 32px;
  border-top: 1px solid var(--color-border-light);
}
.stat-number {
  font-family: var(--font-serif);
  font-size: 28px;
  font-weight: 700;
  color: var(--color-accent);
  line-height: 1.2;
}
.stat-number span {
  margin-left: 2px;
  color: var(--color-text-secondary);
  font-size: 16px;
  font-weight: 400;
}
.stat-label {
  margin-top: 4px;
  color: var(--color-text-light);
  font-size: 13px;
}
.section {
  padding: 64px 24px;
}
.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 32px;
}
.section-more {
  color: var(--color-accent);
  font-size: 14px;
  font-weight: 600;
  transition: var(--transition);
}
.section-more:hover {
  transform: translateX(4px);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
.area-section,
.features {
  padding: 64px 0;
  background: var(--bg-cream);
}
.area-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 14px;
}
.area-item {
  position: relative;
  padding: 24px 20px;
  background: var(--bg-card);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius);
  text-align: center;
  transition: var(--transition);
  overflow: hidden;
}
.area-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  opacity: 0;
  transition: var(--transition);
}
.area-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow);
  border-color: var(--color-primary);
}
.area-item:hover::before {
  opacity: 1;
}
.area-name,
.area-count {
  display: block;
}
.area-name {
  margin-bottom: 4px;
  color: var(--color-text);
  font-size: 16px;
  font-weight: 700;
}
.area-count {
  color: var(--color-text-light);
  font-size: 13px;
}
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}
.feature-card {
  padding: 32px 24px;
  background: var(--bg-card);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius);
  transition: var(--transition);
}
.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}
.feature-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
  background: linear-gradient(135deg, rgba(139, 111, 71, 0.1) 0%, rgba(196, 168, 130, 0.15) 100%);
  border-radius: 14px;
  color: var(--color-accent);
  font-family: var(--font-serif);
  font-size: 24px;
  font-weight: 700;
}
.feature-card h3 {
  margin-bottom: 8px;
  font-size: 17px;
}
.feature-card p {
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.7;
}
.cta-section {
  padding: 80px 0;
}
.cta-card {
  position: relative;
  padding: 56px 40px;
  overflow: hidden;
  border-radius: var(--radius-xl);
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%);
  color: #fff;
  text-align: center;
}
.cta-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
}
.cta-card h2,
.cta-card p,
.cta-btn {
  position: relative;
}
.cta-card h2 {
  margin-bottom: 12px;
  font-family: var(--font-serif);
  font-size: 28px;
}
.cta-card p {
  margin-bottom: 28px;
  opacity: 0.85;
}
.cta-btn {
  display: inline-flex;
  min-height: 48px;
  align-items: center;
  padding: 0 36px;
  background: #fff;
  border-radius: var(--radius);
  color: var(--color-accent-dark);
  font-weight: 700;
  transition: var(--transition);
}
.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}
.empty-card {
  padding: 40px 24px;
  background: var(--bg-card);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius);
  color: var(--color-text-light);
  text-align: center;
}
.footer {
  padding: 42px 0 32px;
  background: var(--color-text);
  color: rgba(255, 255, 255, 0.6);
}
.footer-inner {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}
.footer strong {
  display: block;
  margin-bottom: 8px;
  color: var(--color-primary);
  font-family: var(--font-serif);
  font-size: 20px;
}
.footer p,
.footer span {
  font-size: 13px;
}
@media (max-width: 768px) {
  .hero {
    padding: 48px 0 64px;
  }
  .hero-desc {
    font-size: 15px;
  }
  .stats-bar {
    flex-wrap: wrap;
    gap: 24px;
  }
  .section,
  .area-section,
  .features {
    padding: 40px 16px;
  }
  .grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 14px;
  }
  .area-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
  }
  .area-item {
    padding: 18px 14px;
  }
  .cta-card {
    padding: 40px 24px;
  }
  .cta-card h2 {
    font-size: 22px;
  }
  .footer-inner {
    flex-direction: column;
    align-items: flex-start;
  }
}
@media (max-width: 480px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .stat-item {
    min-width: 80px;
    flex: 1;
  }
}
</style>
