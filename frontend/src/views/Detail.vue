<template>
  <div class="detail-page">
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

    <div class="container content" v-if="property">
      <router-link to="/list" class="back-link">&larr; 返回房源列表</router-link>
      <ImageCarousel :images="imageUrls" />

      <div class="info-card card">
        <div class="price-row">
          <span class="price">{{ property.price }}</span>
          <span class="status-tag" :class="property.status">{{ property.status }}</span>
        </div>
        <h1 class="title">{{ property.title }}</h1>

        <div class="meta-grid">
          <div class="meta-item">
            <span class="label">户型</span>
            <span class="value">{{ property.rooms || '-' }}</span>
          </div>
          <div class="meta-item">
            <span class="label">面积</span>
            <span class="value">{{ property.area_sqm || '-' }}</span>
          </div>
          <div class="meta-item">
            <span class="label">楼层</span>
            <span class="value">{{ property.floor || '-' }}</span>
          </div>
          <div class="meta-item">
            <span class="label">类型</span>
            <span class="value">{{ property.type }}</span>
          </div>
        </div>

        <div class="address">
          <span class="label">地址</span>
          <span>{{ property.area }} {{ property.address }}</span>
        </div>
      </div>

      <div class="desc-card card" v-if="property.desc">
        <h3>房源描述</h3>
        <p>{{ property.desc }}</p>
      </div>

      <div class="contact-card">
        <div>
          <h3>对这套房源感兴趣？</h3>
          <p>联系吴女士 13603080608，了解看房时间、房源细节和交易流程</p>
        </div>
        <a href="tel:13603080608" class="contact-btn">立即咨询</a>
      </div>
    </div>

    <div v-else class="container loading">加载中...</div>

    <!-- Footer -->
    <footer class="footer">
      <div class="gold-line"></div>
      <div class="container footer-inner">
        <div class="footer-brand">
          <strong>嘉原地产</strong>
          <p>联系人：吴女士 · <a href="tel:13603080608">13603080608</a></p>
        </div>
        <span class="footer-copy">&copy; 2026 嘉原地产 版权所有</span>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '../api';
import type { Property } from '../types';
import ImageCarousel from '../components/ImageCarousel.vue';

const route = useRoute();
const property = ref<Property | null>(null);

const imageUrls = computed(() => {
  if (!property.value?.image_keys) return [];
  return property.value.image_keys.split(',').filter(Boolean).map(k => `/api/images/${k}`);
});

onMounted(async () => {
  const res = await api.get(`/properties/${route.params.id}`);
  property.value = res.data.data;
});
</script>

<style scoped>
.top-bar {
  background: var(--color-text);
  color: rgba(255,255,255,0.5);
  font-size: 13px;
  padding: 7px 0;
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

.content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 24px;
  padding-bottom: 64px;
  animation: fadeInUp 0.6s var(--ease-out) both;
}
.back-link {
  width: fit-content;
  color: var(--color-accent);
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  font-family: var(--font-display);
  letter-spacing: 0.04em;
  transition: var(--transition);
}
.back-link:hover {
  color: var(--color-gold);
  transform: translateX(-3px);
}

.info-card {
  padding: 32px;
}
.price-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
}
.price {
  color: var(--color-orange);
  font-size: 34px;
  font-weight: 900;
  line-height: 1;
  font-family: var(--font-display);
}
.status-tag {
  padding: 4px 14px;
  border-radius: 8px;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
}
.status-tag.在售 { background: var(--color-green); }
.status-tag.已售 { background: var(--color-text-light); }
.status-tag.已租 { background: var(--color-blue); }
.title {
  margin-bottom: 24px;
  font-family: var(--font-display);
  font-size: clamp(24px, 4vw, 34px);
  line-height: 1.35;
  letter-spacing: 0.03em;
}
.meta-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}
.meta-item {
  padding: 20px;
  background: var(--bg-cream);
  border-radius: var(--radius);
  border: 1px solid var(--color-border-light);
}
.meta-item .label,
.address .label {
  display: block;
  margin-bottom: 8px;
  color: var(--color-text-light);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.meta-item .value {
  color: var(--color-text);
  font-size: 17px;
  font-weight: 800;
  font-family: var(--font-display);
}
.address {
  padding-top: 20px;
  border-top: 1px solid var(--color-border-light);
  color: var(--color-text-secondary);
  font-size: 15px;
}
.desc-card {
  padding: 32px;
}
.desc-card h3 {
  margin-bottom: 16px;
  font-family: var(--font-display);
  font-size: 22px;
  letter-spacing: 0.04em;
}
.desc-card p {
  color: var(--color-text-secondary);
  font-size: 15px;
  line-height: 1.9;
}
.contact-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 36px;
  background: linear-gradient(145deg, var(--color-accent), var(--color-accent-dark));
  border-radius: var(--radius-xl);
  color: #fff;
  position: relative;
  overflow: hidden;
}
.contact-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(184, 148, 62, 0.15), transparent 60%);
  border-radius: 50%;
}
.contact-card h3 {
  margin-bottom: 8px;
  font-family: var(--font-display);
  font-size: 24px;
  letter-spacing: 0.04em;
  position: relative;
}
.contact-card p {
  opacity: 0.82;
  position: relative;
}
.contact-btn {
  display: inline-flex;
  min-height: 48px;
  flex-shrink: 0;
  align-items: center;
  padding: 0 32px;
  background: #fff;
  border-radius: var(--radius);
  color: var(--color-accent-dark);
  font-weight: 800;
  font-family: var(--font-display);
  text-decoration: none;
  transition: var(--transition);
  position: relative;
}
.contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}
.loading {
  padding: 80px 24px;
  color: var(--color-text-secondary);
  text-align: center;
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
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 28px 0;
}
.footer-brand strong {
  color: var(--color-primary);
  font-family: var(--font-display);
  font-size: 16px;
  letter-spacing: 0.06em;
}
.footer-brand p {
  font-size: 13px;
  margin-top: 4px;
}
.footer-brand a {
  color: var(--color-primary-light);
}
.footer-copy {
  font-size: 12px;
  color: rgba(255,255,255,0.25);
}

@media (max-width: 768px) {
  .content {
    padding-top: 18px;
    padding-bottom: 40px;
  }
  .info-card, .desc-card {
    padding: 24px;
  }
  .meta-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .contact-card {
    flex-direction: column;
    align-items: flex-start;
    padding: 28px 24px;
  }
  .footer-inner {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
