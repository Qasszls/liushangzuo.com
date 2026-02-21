<template>
  <div class="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-300">
    <AppHeader :scrolled="isScrolled" @open-settings="isSettingsOpen = true" />
    <main class="pt-16">
      <slot />
    </main>
    <AppFooter />
    <SettingsDrawer v-model="isSettingsOpen" />
    <StudioHomeButton />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const isSettingsOpen = ref(false)

onMounted(() => {
  const onScroll = () => {
    isScrolled.value = window.scrollY > 50
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', onScroll))
})
</script>
