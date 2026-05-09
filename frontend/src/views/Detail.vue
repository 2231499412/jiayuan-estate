<!-- frontend/src/views/Detail.vue -->
<template>
  <div class="detail-page">
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

    <div class="container content" v-if="property">
      <router-link to="/list" class="back-link">← 返回房源列表</router-link>
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
          <p>联系我们了解看房时间、房源细节和交易流程。</p>
        </div>
        <router-link to="/about" class="contact-btn">立即咨询</router-link>
      </div>
    </div>

    <div v-else class="container loading">加载中...</div>
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
.content {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-top: 24px;
  padding-bottom: 64px;
}
.back-link {
  width: fit-content;
  color: var(--color-accent);
  font-size: 14px;
  font-weight: 700;
}
.info-card {
  padding: 28px;
}
.price-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.price {
  color: var(--color-orange);
  font-size: 32px;
  font-weight: 900;
  line-height: 1;
}
.status-tag {
  padding: 4px 12px;
  border-radius: 100px;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
}
.status-tag.在售 { background: var(--color-green); }
.status-tag.已售 { background: var(--color-text-light); }
.status-tag.已租 { background: var(--color-blue); }
.title {
  margin-bottom: 22px;
  font-family: var(--font-serif);
  font-size: clamp(24px, 4vw, 34px);
  line-height: 1.35;
}
.meta-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 18px;
}
.meta-item {
  padding: 18px;
  background: var(--bg-cream);
  border-radius: var(--radius);
}
.meta-item .label,
.address .label {
  display: block;
  margin-bottom: 6px;
  color: var(--color-text-light);
  font-size: 13px;
}
.meta-item .value {
  color: var(--color-text);
  font-size: 17px;
  font-weight: 800;
}
.address {
  padding-top: 18px;
  border-top: 1px solid var(--color-border-light);
  color: var(--color-text-secondary);
  font-size: 15px;
}
.desc-card {
  padding: 28px;
}
.desc-card h3 {
  margin-bottom: 14px;
  font-family: var(--font-serif);
  font-size: 22px;
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
  padding: 34px;
  overflow: hidden;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-dark));
  border-radius: var(--radius-xl);
  color: #fff;
}
.contact-card h3 {
  margin-bottom: 8px;
  font-family: var(--font-serif);
  font-size: 24px;
}
.contact-card p {
  opacity: 0.82;
}
.contact-btn {
  display: inline-flex;
  min-height: 46px;
  flex-shrink: 0;
  align-items: center;
  padding: 0 28px;
  background: #fff;
  border-radius: var(--radius);
  color: var(--color-accent-dark);
  font-weight: 800;
  transition: var(--transition);
}
.contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}
.loading {
  padding: 80px 24px;
  color: var(--color-text-secondary);
  text-align: center;
}
@media (max-width: 768px) {
  .content {
    padding-top: 18px;
    padding-bottom: 40px;
  }
  .info-card,
  .desc-card {
    padding: 22px;
  }
  .meta-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .contact-card {
    flex-direction: column;
    align-items: flex-start;
    padding: 28px 22px;
  }
}
</style>
