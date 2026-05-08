<!-- frontend/src/components/PropertyCard.vue -->
<template>
  <router-link :to="`/detail/${property.id}`" class="property-card card">
    <div class="card-image">
      <img v-if="imageUrl" :src="imageUrl" :alt="property.title" />
      <div v-else class="placeholder">暂无图片</div>
      <span class="badge" :class="property.type">{{ property.type }}</span>
    </div>
    <div class="card-body">
      <h3 class="title">{{ property.title }}</h3>
      <p class="info">
        <span v-if="property.rooms">{{ property.rooms }}</span>
        <span v-if="property.area_sqm"> | {{ property.area_sqm }}</span>
        <span v-if="property.floor"> | {{ property.floor }}</span>
      </p>
      <p class="location">{{ property.area }} {{ property.address }}</p>
      <p class="price">{{ property.price }}</p>
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
</script>

<style scoped>
.property-card {
  display: block;
  transition: transform 0.2s;
}
.property-card:hover {
  transform: translateY(-4px);
}
.card-image {
  position: relative;
  height: 180px;
  background: var(--color-border);
}
.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--color-text-secondary);
}
.badge {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
}
.badge.新房 { background: #4CAF50; }
.badge.二手房 { background: var(--color-accent); }
.badge.租房 { background: #2196F3; }
.card-body {
  padding: 12px;
}
.title {
  font-size: 16px;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.info {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
}
.location {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}
.price {
  font-size: 18px;
  font-weight: 600;
  color: #E64A19;
}
</style>
