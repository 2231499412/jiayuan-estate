<!-- frontend/src/components/PropertyCard.vue -->
<template>
  <router-link :to="`/detail/${property.id}`" class="property-card">
    <div class="card-image">
      <img v-if="imageUrl" :src="imageUrl" :alt="property.title" />
      <div v-else class="placeholder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
        <span>暂无图片</span>
      </div>
      <span class="badge" :class="badgeClass">{{ property.type }}</span>
      <span v-if="property.hot" class="hot-mark">热</span>
    </div>
    <div class="card-body">
      <h3 class="title">{{ property.title }}</h3>
      <p class="info">
        <span v-if="property.rooms">{{ property.rooms }}</span>
        <span v-if="property.area_sqm">{{ property.area_sqm }}</span>
        <span v-if="property.floor">{{ property.floor }}</span>
      </p>
      <p class="location">{{ property.area }} {{ property.address }}</p>
      <div class="card-bottom">
        <p class="price">{{ property.price }}</p>
        <span class="action">查看详情</span>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Property } from '../types';

const props = defineProps<{ property: Property }>();

const imageUrl = computed(() => {
  const keys = props.property.image_keys?.split(',').filter(Boolean);
  return keys?.length ? `/api/images/${keys[0]}` : null;
});

const badgeClass = computed(() => ({
  new: props.property.type === '新房',
  sale: props.property.type === '二手房',
  rent: props.property.type === '租房',
}));
</script>

<style scoped>
.property-card {
  display: block;
  overflow: hidden;
  background: var(--bg-card);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}
.property-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-hover);
  border-color: var(--color-primary-light);
}
.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: var(--bg-cream);
}
.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.property-card:hover .card-image img {
  transform: scale(1.04);
}
.placeholder {
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--color-text-light);
}
.placeholder svg {
  width: 42px;
  height: 42px;
  opacity: 0.45;
}
.placeholder span {
  font-size: 13px;
}
.badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 12px;
  border-radius: 100px;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  backdrop-filter: blur(8px);
}
.badge.new { background: rgba(90, 140, 106, 0.92); }
.badge.sale { background: rgba(139, 111, 71, 0.92); }
.badge.rent { background: rgba(90, 127, 168, 0.92); }
.hot-mark {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 118, 78, 0.92);
  border-radius: 50%;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}
.card-body {
  padding: 16px 18px 20px;
}
.title {
  display: -webkit-box;
  min-height: 45px;
  margin-bottom: 8px;
  overflow: hidden;
  color: var(--color-text);
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.info {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 8px;
  color: var(--color-text-secondary);
  font-size: 13px;
}
.info span + span::before {
  content: '·';
  margin-right: 10px;
  color: var(--color-text-light);
}
.location {
  margin-bottom: 12px;
  color: var(--color-text-light);
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.location::before {
  content: '⌖';
  margin-right: 4px;
}
.card-bottom {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border-light);
}
.price {
  color: var(--color-orange);
  font-size: 22px;
  font-weight: 800;
  line-height: 1;
}
.action {
  flex-shrink: 0;
  padding: 6px 14px;
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-sm);
  color: var(--color-accent);
  font-size: 13px;
  font-weight: 600;
  transition: var(--transition);
}
.property-card:hover .action {
  background: var(--color-accent);
  color: #fff;
  border-color: var(--color-accent);
}
@media (max-width: 768px) {
  .card-image {
    height: 170px;
  }
}
</style>
