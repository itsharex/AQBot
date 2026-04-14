<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useData } from 'vitepress';
import { ArrowRight } from 'lucide-vue-next';

declare const __APP_VERSION__: string;
const VERSION = __APP_VERSION__;

const { lang } = useData();
const isZh = computed(() => lang.value === 'zh-CN');

const detectedOS = ref<'macos' | 'windows' | 'linux'>('macos');

onMounted(() => {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('win')) {
    detectedOS.value = 'windows';
  } else if (ua.includes('linux')) {
    detectedOS.value = 'linux';
  } else {
    detectedOS.value = 'macos';
  }
});

const osLabel = computed(() => {
  const labels: Record<string, { en: string; zh: string }> = {
    macos: { en: 'for macOS', zh: 'macOS 版' },
    windows: { en: 'for Windows', zh: 'Windows 版' },
    linux: { en: 'for Linux', zh: 'Linux 版' },
  };
  const l = labels[detectedOS.value];
  return isZh.value ? l.zh : l.en;
});
</script>

<template>
  <div class="download-bar">
    <a href="/download" class="dl-btn dl-primary">
      <!-- OS icon -->
      <svg v-if="detectedOS === 'macos'" class="os-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
      </svg>
      <svg v-else-if="detectedOS === 'windows'" class="os-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 12V6.5l8-1.1V12H3zm10 0V5.2l8-1.2V12h-8zM3 13h8v6.6l-8-1.1V13zm10 0h8v6l-8 1.2V13z"/>
      </svg>
      <svg v-else class="os-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.504 0c-.155 0-.311.003-.465.01a10.012 10.012 0 00-3.044.66c-.904.348-1.71.87-2.244 1.658C6.2 3.2 5.88 4.22 5.88 5.5c0 .78.116 1.49.346 2.13a6.7 6.7 0 00.96 1.73c.386.48.8.9 1.25 1.25.45.35.9.62 1.35.82.45.2.84.33 1.17.39.33.06.55.09.67.09h.02c.12 0 .34-.03.67-.09.33-.06.72-.19 1.17-.39.45-.2.9-.47 1.35-.82.45-.35.864-.77 1.25-1.25.386-.48.71-1.05.96-1.73.23-.64.346-1.35.346-2.13 0-1.28-.32-2.3-.872-3.172-.534-.788-1.34-1.31-2.244-1.658A10.012 10.012 0 0012.969.01C12.813.003 12.66 0 12.504 0zm-4.39 13.12c-.71 0-1.4.13-2.03.4-.62.27-1.16.65-1.61 1.14-.45.49-.8 1.08-1.04 1.76-.24.68-.37 1.43-.37 2.24 0 .6.06 1.15.17 1.63.12.48.29.9.52 1.25.23.35.52.63.87.84.35.21.76.31 1.23.31.35 0 .68-.06 1-.17.32-.12.65-.29 1-.52.35-.23.73-.52 1.14-.87.42-.35.89-.77 1.43-1.25.53.48 1.01.9 1.43 1.25.41.35.79.64 1.14.87.35.23.68.4 1 .52.32.11.65.17 1 .17.47 0 .88-.1 1.23-.31.35-.21.64-.49.87-.84.23-.35.4-.77.52-1.25.11-.48.17-1.03.17-1.63 0-.81-.13-1.56-.37-2.24-.24-.68-.59-1.27-1.04-1.76-.45-.49-.99-.87-1.61-1.14-.63-.27-1.32-.4-2.03-.4H12.5h-.01-4.385z"/>
      </svg>
      <span>{{ isZh ? '下载' : 'Download' }} v{{ VERSION }}</span>
    </a>
    <a href="/features" class="dl-btn dl-docs">
      <span>{{ isZh ? '文档' : 'Docs' }}</span>
      <ArrowRight :size="18" />
    </a>
  </div>
</template>

<style scoped>
.download-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 32px 0 8px;
  flex-wrap: wrap;
}

.dl-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 0 36px;
  height: 56px;
  border-radius: 28px;
  font-size: 17px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.25s ease;
  white-space: nowrap;
}

.dl-primary {
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border: 2px solid var(--vp-c-divider);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
.dl-primary:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
}

.dark .dl-primary {
  background: var(--vp-c-bg-soft);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.dl-docs {
  color: var(--vp-c-text-1);
  border: 2px solid var(--vp-c-text-3);
  background: transparent;
}
.dl-docs:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  transform: translateY(-1px);
}

.os-icon {
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .dl-btn {
    padding: 0 28px;
    height: 50px;
    font-size: 15px;
    border-radius: 25px;
    gap: 8px;
  }
  .download-bar {
    gap: 14px;
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .dl-btn {
    padding: 0 24px;
    height: 48px;
    font-size: 15px;
    border-radius: 24px;
    gap: 8px;
    width: 100%;
  }
  .download-bar {
    gap: 12px;
    flex-direction: column;
    align-items: stretch;
    padding: 24px 16px 8px;
  }
}
</style>
