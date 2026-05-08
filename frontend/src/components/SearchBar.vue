<!-- frontend/src/components/SearchBar.vue -->
<template>
  <div class="search-bar">
    <select v-model="activeType" class="search-type">
      <option v-for="t in types" :key="t.value" :value="t.value">{{ t.label }}</option>
    </select>
    <input
      v-model="keyword"
      type="text"
      :placeholder="placeholder"
      @keyup.enter="onSearch"
    />
    <button class="btn btn-primary" @click="onSearch">搜索房源</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const emit = defineEmits<{ search: [keyword: string, type: string] }>();

const types = [
  { label: '全部', value: '' },
  { label: '二手房', value: '二手房' },
  { label: '新房', value: '新房' },
  { label: '租房', value: '租房' },
];

const activeType = ref('');
const keyword = ref('');

const placeholder = computed(() => {
  const t = activeType.value;
  if (t === '租房') return '搜索小区名、地址查找租房...';
  if (t === '新房') return '搜索楼盘名查找新房...';
  if (t === '二手房') return '搜索小区名、地址查找二手房...';
  return '搜索小区名、地址、关键词...';
});

function onSearch() {
  emit('search', keyword.value.trim(), activeType.value);
}
</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 6px;
  background: var(--bg-card);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  transition: var(--transition);
}
.search-bar:focus-within {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-hover);
}
.search-type {
  flex-shrink: 0;
  padding: 12px 14px;
  border: none;
  outline: none;
  background: transparent;
  color: var(--color-accent);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  border-right: 1px solid var(--color-border-light);
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%238B6F47' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
  padding-right: 28px;
}
.search-type option {
  color: var(--color-text);
  font-weight: 500;
}
.search-bar input {
  flex: 1;
  min-width: 0;
  padding: 14px 18px;
  border: none;
  outline: none;
  background: transparent;
  color: var(--color-text);
  font-size: 15px;
}
.search-bar input::placeholder {
  color: var(--color-text-light);
}
.search-bar .btn {
  flex-shrink: 0;
  padding: 12px 28px;
}
@media (max-width: 640px) {
  .search-bar {
    flex-wrap: wrap;
    padding: 8px;
  }
  .search-type {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--color-border-light);
    padding: 10px 14px;
  }
  .search-bar input {
    width: 100%;
    padding: 12px 14px;
  }
  .search-bar .btn {
    width: 100%;
  }
}
</style>
