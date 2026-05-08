<!-- frontend/src/components/FilterPanel.vue -->
<template>
  <div class="filter-panel">
    <div class="filter-group">
      <label>类型</label>
      <div class="options">
        <button v-for="t in types" :key="t" :class="{ active: filters.type === t }" @click="toggle('type', t)">{{ t }}</button>
      </div>
    </div>
    <div class="filter-group">
      <label>区域</label>
      <div class="options">
        <button v-for="a in areas" :key="a" :class="{ active: filters.area === a }" @click="toggle('area', a)">{{ a }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

defineProps<{ areas: string[] }>();
const emit = defineEmits<{ change: [filters: { type: string; area: string }] }>();

const types = ['不限', '新房', '二手房', '租房'];
const filters = reactive({ type: '不限', area: '不限' });

function toggle(field: 'type' | 'area', value: string) {
  filters[field] = value;
  emit('change', { ...filters });
}
</script>

<style scoped>
.filter-panel {
  padding: 12px;
  background: var(--color-card);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}
.filter-group {
  margin-bottom: 12px;
}
.filter-group:last-child {
  margin-bottom: 0;
}
.filter-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}
.options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.options button {
  padding: 6px 14px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: transparent;
  font-size: 13px;
  cursor: pointer;
}
.options button.active {
  background: var(--color-accent);
  color: #fff;
  border-color: var(--color-accent);
}
</style>
