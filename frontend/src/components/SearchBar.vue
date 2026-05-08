<!-- frontend/src/components/SearchBar.vue -->
<template>
  <div class="search-bar">
    <input
      v-model="keyword"
      type="text"
      placeholder="搜索小区名、地址、关键词..."
      @keyup.enter="onSearch"
    />
    <button class="btn btn-primary" @click="onSearch">搜索房源</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{ search: [keyword: string] }>();
const keyword = ref('');

function onSearch() {
  emit('search', keyword.value.trim());
}
</script>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  gap: 6px;
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
    flex-direction: column;
    align-items: stretch;
    padding: 8px;
  }
  .search-bar input {
    padding: 12px 14px;
  }
  .search-bar .btn {
    width: 100%;
  }
}
</style>
