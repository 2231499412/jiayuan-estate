<!-- frontend/src/components/ImageCarousel.vue -->
<template>
  <div class="carousel" v-if="images.length">
    <div class="carousel-track" :style="{ transform: `translateX(-${current * 100}%)` }">
      <div v-for="(img, i) in images" :key="i" class="slide">
        <img :src="img" :alt="`图片 ${i + 1}`" />
      </div>
    </div>
    <div class="dots" v-if="images.length > 1">
      <span v-for="(_, i) in images" :key="i" :class="{ active: i === current }" @click="current = i"></span>
    </div>
  </div>
  <div v-else class="no-images">暂无图片</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{ images: string[] }>();
const current = ref(0);
</script>

<style scoped>
.carousel {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius);
}
.carousel-track {
  display: flex;
  transition: transform 0.3s ease;
}
.slide {
  min-width: 100%;
}
.slide img {
  width: 100%;
  height: 280px;
  object-fit: cover;
}
.dots {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
}
.dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
  cursor: pointer;
}
.dots span.active {
  background: #fff;
}
.no-images {
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-border);
  border-radius: var(--radius);
  color: var(--color-text-secondary);
}
</style>
