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
      </div>
    </header>

    <div class="container content" v-if="property">
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

      <div class="contact-card card">
        <h3>咨询房源</h3>
        <p>对这套房源感兴趣？联系我们了解更多详情。</p>
        <p class="phone">电话：400-XXX-XXXX</p>
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
.content {
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.info-card {
  padding: 20px;
}
.price-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}
.price {
  font-size: 24px;
  font-weight: 700;
  color: #E64A19;
}
.status-tag {
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 13px;
  color: #fff;
}
.status-tag.在售 { background: #4CAF50; }
.status-tag.已售 { background: #9E9E9E; }
.status-tag.已租 { background: #2196F3; }
.title {
  font-size: 20px;
  margin-bottom: 16px;
}
.meta-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 12px;
}
.meta-item {
  display: flex;
  flex-direction: column;
}
.meta-item .label {
  font-size: 13px;
  color: var(--color-text-secondary);
}
.meta-item .value {
  font-size: 15px;
  font-weight: 500;
}
.address {
  font-size: 14px;
}
.address .label {
  color: var(--color-text-secondary);
  margin-right: 8px;
}
.desc-card, .contact-card {
  padding: 20px;
}
.desc-card h3, .contact-card h3 {
  font-size: 16px;
  margin-bottom: 12px;
  padding-left: 10px;
  border-left: 3px solid var(--color-accent);
}
.desc-card p {
  font-size: 14px;
  line-height: 1.8;
  color: var(--color-text-secondary);
}
.contact-card p {
  font-size: 14px;
  color: var(--color-text-secondary);
}
.phone {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-accent);
  margin-top: 8px;
}
.loading {
  text-align: center;
  padding: 48px;
  color: var(--color-text-secondary);
}
</style>
