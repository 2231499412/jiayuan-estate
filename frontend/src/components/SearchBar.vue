<template>
  <div class="search-bar">
    <div class="search-tabs">
      <button
        v-for="t in tabs"
        :key="t.value"
        :class="{ active: activeType === t.value }"
        @click="activeType = t.value"
      >{{ t.label }}</button>
    </div>
    <div class="search-input-wrap">
      <input
        v-model="keyword"
        type="text"
        :placeholder="placeholder"
        @keyup.enter="onSearch"
      />
      <button class="search-btn" @click="onSearch">
        <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/></svg>
        搜索
      </button>
    </div>
    <div class="search-tags" v-if="showTags">
      <span class="tag-label">热门搜索：</span>
      <button v-for="tag in hotTags" :key="tag" class="hot-tag" @click="quickSearch(tag)">{{ tag }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const emit = defineEmits<{ search: [keyword: string, type: string] }>();

const props = withDefaults(defineProps<{ showTags?: boolean }>(), { showTags: false });

const tabs = [
  { label: '二手房', value: '二手房' },
  { label: '新房', value: '新房' },
  { label: '租房', value: '租房' },
];

const hotTags = ['龙岗中心城', '布吉', '坂田', '横岗', '龙城', '坪地'];

const activeType = ref('二手房');
const keyword = ref('');

const placeholder = computed(() => {
  const type = activeType.value;
  if (type === '租房') return '请输入小区名或地址查找租房';
  if (type === '新房') return '请输入楼盘名查找新房';
  return '请输入小区名、商圈或地址';
});

function onSearch() {
  emit('search', keyword.value.trim(), activeType.value);
}

function quickSearch(tag: string) {
  keyword.value = tag;
  onSearch();
}
</script>

<style scoped>
.search-bar {
  background: var(--bg-card);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(45, 33, 24, 0.12);
  overflow: hidden;
}

.search-tabs {
  display: flex;
  padding: 0 8px;
  background: linear-gradient(135deg, #3A2E22, #2D2118);
}
.search-tabs button {
  padding: 12px 24px;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  transition: all 0.25s;
}
.search-tabs button:hover {
  color: rgba(255, 255, 255, 0.85);
}
.search-tabs button.active {
  color: #fff;
}
.search-tabs button.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 3px;
  background: var(--color-orange);
  border-radius: 3px 3px 0 0;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 12px;
}
.search-input-wrap input {
  flex: 1;
  min-width: 0;
  padding: 14px 18px;
  border: 2px solid var(--color-border);
  border-radius: 12px;
  font-size: 16px;
  color: var(--color-text);
  background: var(--bg-main);
  outline: none;
  transition: all 0.3s;
}
.search-input-wrap input:focus {
  border-color: var(--color-accent);
  background: #fff;
  box-shadow: 0 0 0 4px rgba(139, 111, 71, 0.08);
}
.search-input-wrap input::placeholder {
  color: var(--color-text-light);
}

.search-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  background: linear-gradient(135deg, #D4764E, #E8956E);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 16px rgba(212, 118, 78, 0.3);
  white-space: nowrap;
}
.search-btn:hover {
  background: linear-gradient(135deg, #C06840, #D4764E);
  box-shadow: 0 6px 24px rgba(212, 118, 78, 0.4);
  transform: translateY(-1px);
}
.search-btn svg {
  width: 18px;
  height: 18px;
}

.search-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 20px 16px;
  flex-wrap: wrap;
}
.tag-label {
  font-size: 13px;
  color: var(--color-text-light);
}
.hot-tag {
  padding: 4px 12px;
  background: var(--bg-cream);
  border: 1px solid var(--color-border-light);
  border-radius: 20px;
  font-size: 13px;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.25s;
}
.hot-tag:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: rgba(139, 111, 71, 0.05);
}

@media (max-width: 640px) {
  .search-tabs button {
    padding: 10px 16px;
    font-size: 14px;
  }
  .search-input-wrap {
    flex-direction: column;
    padding: 12px;
  }
  .search-input-wrap input {
    padding: 12px 14px;
    font-size: 15px;
  }
  .search-btn {
    width: 100%;
    justify-content: center;
    padding: 12px;
  }
}
</style>
