<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useData } from 'vitepress';

declare const __APP_VERSION__: string;

const VERSION = __APP_VERSION__;
const BASE = `https://github.com/AQBot-Desktop/AQBot/releases/download/v${VERSION}`;

interface DownloadItem {
  labelZh: string;
  labelEn: string;
  file: string;
  arch: string;
  os: 'macos' | 'windows' | 'linux';
}

const downloads: DownloadItem[] = [
  { os: 'macos', arch: 'Apple Silicon', labelEn: 'macOS (Apple Silicon)', labelZh: 'macOS（M 系列芯片）', file: `AQBot_${VERSION}_aarch64.dmg` },
  { os: 'macos', arch: 'Intel', labelEn: 'macOS (Intel)', labelZh: 'macOS（英特尔芯片）', file: `AQBot_${VERSION}_x64.dmg` },
  { os: 'windows', arch: 'x64', labelEn: 'Windows (x64)', labelZh: 'Windows（x64）', file: `AQBot_${VERSION}_x64-setup.exe` },
  { os: 'windows', arch: 'x64 Portable', labelEn: 'Windows (x64 Portable)', labelZh: 'Windows（x64 绿色版）', file: `AQBot_v${VERSION}_windows-x64-portable.zip` },
  { os: 'windows', arch: 'ARM64', labelEn: 'Windows (ARM64)', labelZh: 'Windows（ARM64）', file: `AQBot_${VERSION}_arm64-setup.exe` },
  { os: 'windows', arch: 'ARM64 Portable', labelEn: 'Windows (ARM64 Portable)', labelZh: 'Windows（ARM64 绿色版）', file: `AQBot_v${VERSION}_windows-arm64-portable.zip` },
  { os: 'linux', arch: 'x64 deb', labelEn: 'Linux (x64 .deb)', labelZh: 'Linux（x64 .deb）', file: `AQBot_${VERSION}_amd64.deb` },
  { os: 'linux', arch: 'x64 AppImage', labelEn: 'Linux (x64 AppImage)', labelZh: 'Linux（x64 AppImage）', file: `AQBot_${VERSION}_amd64.AppImage` },
  { os: 'linux', arch: 'ARM64 deb', labelEn: 'Linux (ARM64 .deb)', labelZh: 'Linux（ARM64 .deb）', file: `AQBot_${VERSION}_arm64.deb` },
  { os: 'linux', arch: 'x64 rpm', labelEn: 'Linux (x64 .rpm)', labelZh: 'Linux（x64 .rpm）', file: `AQBot-${VERSION}-1.x86_64.rpm` },
  { os: 'linux', arch: 'ARM64 rpm', labelEn: 'Linux (ARM64 .rpm)', labelZh: 'Linux（ARM64 .rpm）', file: `AQBot-${VERSION}-1.aarch64.rpm` },
];

const { lang } = useData();
const isZh = computed(() => lang.value === 'zh-CN');

function itemLabel(item: DownloadItem) {
  return isZh.value ? item.labelZh : item.labelEn;
}

const detectedOS = ref<'macos' | 'windows' | 'linux'>('macos');
const archKnown = ref(false);
const detectedArch = ref<'arm' | 'x64'>('x64');
const showAll = ref(false);

onMounted(() => {
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('mac')) {
    detectedOS.value = 'macos';
  } else if (ua.includes('win')) {
    detectedOS.value = 'windows';
  } else if (ua.includes('linux')) {
    detectedOS.value = 'linux';
  }

  // Try to detect architecture
  // @ts-ignore - userAgentData is experimental
  const uaArch = navigator.userAgentData?.architecture;
  if (uaArch) {
    archKnown.value = true;
    detectedArch.value = /arm/i.test(uaArch) ? 'arm' : 'x64';
  } else if (/arm|aarch64/i.test(navigator.userAgent)) {
    archKnown.value = true;
    detectedArch.value = 'arm';
  }
  // On macOS, userAgent says "MacIntel" even on Apple Silicon, so we can't reliably detect
});

// When architecture is unknown on macOS, show both options as primary
const recommendedItems = computed<DownloadItem[]>(() => {
  const os = detectedOS.value;
  if (os === 'macos') {
    if (!archKnown.value) {
      // Show both Apple Silicon and Intel
      return downloads.filter(d => d.os === 'macos');
    }
    const match = downloads.find(d => d.os === 'macos' && (detectedArch.value === 'arm' ? d.arch === 'Apple Silicon' : d.arch === 'Intel'));
    return match ? [match] : downloads.filter(d => d.os === 'macos');
  }
  if (os === 'windows') {
    if (!archKnown.value) {
      const def = downloads.find(d => d.os === 'windows' && d.arch === 'x64');
      return def ? [def] : [];
    }
    const match = downloads.find(d => d.os === 'windows' && (detectedArch.value === 'arm' ? d.arch === 'ARM64' : d.arch === 'x64'));
    return match ? [match] : [];
  }
  const def = downloads.find(d => d.os === 'linux' && d.arch === 'x64 deb');
  return def ? [def] : [];
});

const otherDownloads = computed(() => {
  const recSet = new Set(recommendedItems.value);
  return downloads.filter(d => !recSet.has(d));
});

function downloadUrl(item: DownloadItem) {
  return `${BASE}/${item.file}`;
}
</script>

<template>
  <div class="download-hero">
    <div class="primary-download">
      <a
        v-for="item in recommendedItems"
        :key="item.file"
        :href="downloadUrl(item)"
        class="download-btn primary"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        {{ isZh ? '下载' : 'Download' }} {{ itemLabel(item) }}
      </a>
      <span class="version-tag">v{{ VERSION }}</span>
    </div>

    <button class="toggle-btn" @click="showAll = !showAll">
      {{ showAll
        ? (isZh ? '收起' : 'Collapse')
        : (isZh ? '查看其他版本' : 'View All Platforms')
      }}
      <svg :class="{ rotated: showAll }" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
    </button>

    <Transition name="slide">
      <div v-if="showAll" class="all-downloads">
        <template v-for="group in ['macos', 'windows', 'linux']" :key="group">
          <div v-if="otherDownloads.filter(d => d.os === group).length > 0" class="os-group">
            <h4 class="os-title">
              {{ group === 'macos' ? 'macOS' : group === 'windows' ? 'Windows' : 'Linux' }}
            </h4>
            <div class="download-grid">
              <a
                v-for="item in otherDownloads.filter(d => d.os === group)"
                :key="item.file"
                :href="downloadUrl(item)"
                class="download-btn secondary"
              >
                {{ itemLabel(item) }}
              </a>
            </div>
          </div>
        </template>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.download-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin: 32px 0;
}

.primary-download {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 12px;
}

.download-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 20px;
  font-weight: 500;
  text-decoration: none;
  transition: border-color 0.25s, color 0.25s, background-color 0.25s;
  cursor: pointer;
  white-space: nowrap;
}

.download-btn.primary {
  padding: 0 24px;
  height: 48px;
  font-size: 16px;
  line-height: 48px;
  color: #fff;
  background-color: var(--vp-c-brand-1);
  border: 2px solid transparent;
}
.download-btn.primary:hover {
  background-color: var(--vp-c-brand-2);
}

.download-btn.secondary {
  padding: 0 20px;
  height: 40px;
  font-size: 14px;
  line-height: 40px;
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-soft);
}
.download-btn.secondary:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.version-tag {
  font-size: 13px;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg-soft);
  padding: 4px 10px;
  border-radius: 20px;
  line-height: 1;
}

.toggle-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: var(--vp-c-brand-1);
  cursor: pointer;
  font-size: 14px;
  padding: 4px 8px;
}
.toggle-btn:hover {
  text-decoration: underline;
}
.toggle-btn svg {
  transition: transform 0.2s;
}
.toggle-btn svg.rotated {
  transform: rotate(180deg);
}

.all-downloads {
  width: 100%;
  max-width: 600px;
}

.os-group {
  margin-bottom: 16px;
}

.os-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--vp-c-text-2);
}

.download-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
