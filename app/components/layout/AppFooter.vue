<template>
  <footer class="border-t border-stone-200 dark:border-stone-800 py-12 mt-20">
    <div class="max-w-7xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p class="text-sm text-stone-500 dark:text-stone-400">
        &copy; {{ new Date().getFullYear() }} 柳尚佐. All rights reserved.
      </p>
      <div class="flex items-center gap-4">
        <a
          v-for="link in socialLinks"
          :key="link.href"
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          class="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
          :aria-label="link.label"
        >
          <Icon :name="link.icon" class="w-5 h-5" />
        </a>
        <span
          class="text-stone-400 cursor-default"
          title="微信：Zlsqass006"
          aria-label="微信：Zlsqass006"
        >
          <Icon name="ph:wechat-logo" class="w-5 h-5" />
        </span>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const socialLinks = [
  { href: 'https://github.com/Qasszls', icon: 'ph:github-logo', label: 'GitHub' },
  { href: 'mailto:1561790480@qq.com', icon: 'ph:envelope', label: 'Email' },
]
</script>
