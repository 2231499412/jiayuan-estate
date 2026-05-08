<template>
  <div class="filter-panel">
    <div class="filter-group">
      <label>区域</label>
      <div class="options">
        <button v-for="a in areaOptions" :key="a" :class="{ active: filters.area === a }" @click="toggle('area', a)">{{ a }}</button>
      </div>
    </div>
    <div class="filter-group">
      <label>价格</label>
      <div class="options">
        <button v-for="p in priceRanges" :key="p" :class="{ active: filters.priceRange === p }" @click="toggle('priceRange', p)">{{ p }}</button>
      </div>
    </div>
    <div class="filter-group">
      <label>户型</label>
      <div class="options">
        <button v-for="r in roomOptions" :key="r" :class="{ active: filters.rooms === r }" @click="toggle('rooms', r)">{{ r }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const props = defineProps<{ areas: string[] }>();
const emit = defineEmits<{ change: [filters: { area: string; priceRange: string; rooms: string }] }>();

const defaultAreas = [
  '龙岗中心城', '布吉', '坂田', '横岗', '龙城', '坪地', '南湾', '吉华', '园山', '宝龙',
];

const priceRanges = ['不限', '50万以下', '50-100万', '100-200万', '200-300万', '300万以上'];
const roomOptions = ['不限', '一居', '两居', '三居', '四居及以上'];

const areaOptions = ['不限', ...(props.areas.length ? props.areas : defaultAreas)];

const filters = reactive({ area: '不限', priceRange: '不限', rooms: '不限' });

function toggle(field: 'area' | 'priceRange' | 'rooms', value: string) {
  filters[field] = value;
  emit('change', { ...filters });
}
</script>

<style scoped>
.filter-panel {
  padding: 20px;
  background: var(--bg-card);
  border: 1px solid var(--color-border-light);
  border-radius: 14px;
  box-shadow: var(--shadow-sm);
}
.filter-group + .filter-group {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid var(--color-border-light);
}
.filter-group label {
  display: block;
  margin-bottom: 10px;
  color: var(--color-text);
  font-size: 14px;
  font-weight: 700;
}
.options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.options button {
  min-height: 34px;
  padding: 6px 14px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--bg-main);
  color: var(--color-text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.25s;
}
.options button:hover {
  border-color: var(--color-primary);
  color: var(--color-accent);
}
.options button.active {
  background: var(--color-accent);
  color: #fff;
  border-color: var(--color-accent);
}
</style>
