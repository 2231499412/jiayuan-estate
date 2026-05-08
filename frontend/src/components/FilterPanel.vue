<!-- frontend/src/components/FilterPanel.vue -->
<template>
  <div class="filter-panel">
    <div class="filter-group">
      <label>房源类型</label>
      <div class="options">
        <button v-for="t in types" :key="t" :class="{ active: filters.type === t }" @click="toggle('type', t)">{{ t }}</button>
      </div>
    </div>
    <div class="filter-group">
      <label>所在区域</label>
      <div class="options">
        <button v-for="a in areaOptions" :key="a" :class="{ active: filters.area === a }" @click="toggle('area', a)">{{ a }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue';

const props = defineProps<{ areas: string[] }>();
const emit = defineEmits<{ change: [filters: { type: string; area: string }] }>();

const types = ['不限', '新房', '二手房', '租房'];
const filters = reactive({ type: '不限', area: '不限' });
const areaOptions = computed(() => ['不限', ...props.areas]);

function toggle(field: 'type' | 'area', value: string) {
  filters[field] = value;
  emit('change', { ...filters });
}
</script>

<style scoped>
.filter-panel {
  padding: 18px;
  background: var(--bg-card);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius);
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
  font-weight: 800;
}
.options {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.options button {
  min-height: 36px;
  padding: 7px 14px;
  border: 1px solid var(--color-border);
  border-radius: 100px;
  background: var(--bg-main);
  color: var(--color-text-secondary);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
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
