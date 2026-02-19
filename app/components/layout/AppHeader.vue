<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled
        ? 'bg-white/90 dark:bg-stone-950/90 backdrop-blur-md shadow-sm'
        : 'bg-transparent',
    ]"
  >
    <nav class="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
      <NuxtLink to="/" class="text-xl font-bold tracking-tight" style="font-family: var(--font-title)">
        Your Name
      </NuxtLink>

      <!-- Desktop nav -->
      <div class="hidden md:flex items-center gap-8">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors relative group"
        >
          {{ link.label }}
          <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-500 transition-all group-hover:w-full" />
        </NuxtLink>
        <button
          data-test="settings-button"
          class="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          @click="$emit('open-settings')"
        >
          <Icon name="ph:gear" class="w-5 h-5" />
        </button>
      </div>

      <!-- Mobile menu button -->
      <button
        class="md:hidden p-2"
        data-test="mobile-menu-button"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
      >
        <Icon :name="isMobileMenuOpen ? 'ph:x' : 'ph:list'" class="w-6 h-6" />
      </button>
    </nav>

    <!-- Mobile dropdown -->
    <div
      v-if="isMobileMenuOpen"
      data-test="mobile-menu"
      class="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 shadow-lg"
    >
      <div class="px-6 py-4 space-y-1">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="block py-3 text-lg font-medium"
          @click="isMobileMenuOpen = false"
        >
          {{ link.label }}
        </NuxtLink>
        <button
          class="w-full text-left py-3 text-lg font-medium"
          data-test="settings-button"
          @click="$emit('open-settings'); isMobileMenuOpen = false"
        >
          设置
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ scrolled?: boolean }>()
defineEmits<{ 'open-settings': [] }>()

const isMobileMenuOpen = ref(false)

const navLinks = [
  { to: '/', label: '首页' },
  { to: '/blog', label: '随笔' },
  { to: '/works', label: '作品' },
  { to: '/about', label: '关于' },
]
</script>
