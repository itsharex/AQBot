<script setup lang="ts">
import DefaultTheme from 'vitepress/theme';
import { useData } from 'vitepress';
import DownloadBar from './DownloadBar.vue';
import ImageCarousel from './ImageCarousel.vue';

const { Layout } = DefaultTheme;
const { frontmatter } = useData();
</script>

<template>
  <Layout>
    <template #home-hero-info-after>
      <div v-if="frontmatter?.layout === 'home'" class="hero-actions-custom">
        <DownloadBar />
      </div>
    </template>
    <template #home-features-before>
      <div v-if="frontmatter?.layout === 'home'">
        <ImageCarousel />
      </div>
    </template>
  </Layout>
</template>

<style scoped>
.hero-actions-custom {
  width: 100%;
}
</style>
