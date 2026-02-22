<template>
  <div class="min-h-screen bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-300">
    <AppHeader :scrolled="isScrolled" @open-settings="isSettingsOpen = true" />
    <div class="max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-12 grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-12">
      <main class="max-w-2xl mx-auto">
        <slot />
      </main>
      <aside class="hidden lg:block">
        <nav v-if="tocLinks.length" class="sticky top-24">
          <h4 class="text-sm font-medium text-stone-500 dark:text-stone-400 mb-4">目录</h4>
          <BlogToc :links="tocLinks" :active-id="tocActiveId" />
        </nav>
      </aside>
    </div>
    <AppFooter />
    <SettingsDrawer v-model="isSettingsOpen" />
    <HomeButton />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const isSettingsOpen = ref(false)

const tocLinks = useState<any[]>('blogTocLinks', () => [])
const tocActiveId = useState<string>('blogTocActiveId', () => '')

onMounted(() => {
  const onScroll = () => { isScrolled.value = window.scrollY > 50 }
  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', onScroll))
})
</script>
