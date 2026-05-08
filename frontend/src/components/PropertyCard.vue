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
      </div>
      <span class="badge" :class="badgeClass">{{ property.type }}</span>
      <span v-if="property.hot" class="hot-mark">荐</span>
    </div>
    <div class="card-body">
      <h3 class="title">{{ property.title }}</h3>
      <div class="meta">
        <span v-if="property.rooms">{{ property.rooms }}</span>
        <span v-if="property.area_sqm">{{ property.area_sqm }}</span>
        <span v-if="property.floor">{{ property.floor }}</span>
      </div>
      <div class="location">
        <svg viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a5 5 0 00-5 5c0 3.5 5 9 5 9s5-5.5 5-9a5 5 0 00-5-5zm0 7a2 2 0 110-4 2 2 0 010 4z"/></svg>
        <span>{{ property.area }} · {{ property.address }}</span>
      </div>
      <div class="card-bottom">
        <p class="price">{{ property.price }}</p>
        <span class="status-tag" :class="statusClass">{{ property.status }}</span>
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

const statusClass = computed(() => ({
  selling: props.property.status === '在售',
  sold: props.property.status === '已售',
  rented: props.property.status === '已租',
}));
</script>

<style scoped>
.property-card {
  display: flex;
  overflow: hidden;
  background: var(--bg-card);
  border: 1px solid var(--color-border-light);
  border-radius: 14px;
  box-shadow: var(--shadow-sm);
  transition: all 0.3s;
}
.property-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-hover);
  border-color: var(--color-primary-light);
}

.card-image {
  position: relative;
  width: 240px;
  height: 180px;
  flex-shrink: 0;
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
  transform: scale(1.05);
}
.placeholder {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  color: var(--color-text-light);
}
.placeholder svg {
  width: 40px;
  height: 40px;
  opacity: 0.35;
}

.badge {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 3px 10px;
  border-radius: 6px;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(8px);
}
.badge.new { background: rgba(90, 140, 106, 0.9); }
.badge.sale { background: rgba(139, 111, 71, 0.9); }
.badge.rent { background: rgba(90, 127, 168, 0.9); }

.hot-mark {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 118, 78, 0.92);
  border-radius: 6px;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}

.card-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: 16px 20px;
}

.title {
  display: -webkit-box;
  margin-bottom: 8px;
  overflow: hidden;
  color: var(--color-text);
  font-size: 17px;
  font-weight: 700;
  line-height: 1.4;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}
.meta span {
  padding: 3px 10px;
  background: var(--bg-cream);
  border-radius: 6px;
  color: var(--color-text-secondary);
  font-size: 13px;
}

.location {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: auto;
  color: var(--color-text-light);
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.location svg {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
  opacity: 0.6;
}

.card-bottom {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border-light);
  margin-top: 12px;
}
.price {
  color: var(--color-orange);
  font-size: 22px;
  font-weight: 800;
  line-height: 1;
}
.price::before {
  content: '';
}

.status-tag {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}
.status-tag.selling {
  background: rgba(90, 140, 106, 0.1);
  color: #5A8C6A;
}
.status-tag.sold {
  background: rgba(220, 38, 38, 0.08);
  color: #DC2626;
}
.status-tag.rented {
  background: rgba(90, 127, 168, 0.1);
  color: #5A7FA8;
}

@media (max-width: 768px) {
  .property-card {
    flex-direction: column;
  }
  .card-image {
    width: 100%;
    height: 200px;
  }
  .card-body {
    padding: 14px 16px;
  }
}

@media (max-width: 480px) {
  .card-image {
    height: 170px;
  }
}
</style>
