<!-- frontend/src/components/SearchBar.vue -->
<template>
  <div class="search-bar">
    <input
      v-model="keyword"
      type="text"
      placeholder="搜索小区名、地址..."
      @keyup.enter="onSearch"
    />
    <button class="btn btn-primary" @click="onSearch">搜索</button>
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
  gap: 8px;
  padding: 12px;
  background: var(--color-card);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}
.search-bar input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 15px;
  outline: none;
}
.search-bar input:focus {
  border-color: var(--color-primary);
}
</style>
