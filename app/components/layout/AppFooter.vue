<template>
  <footer class="border-t border-stone-200 dark:border-stone-800 py-12 mt-20">
    <div class="max-w-7xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p class="text-sm text-stone-500 dark:text-stone-400">
        &copy; {{ new Date().getFullYear() }} Your Name. All rights reserved.
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
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const socialLinks = [
  { href: 'https://github.com/yourname', icon: 'ph:github-logo', label: 'GitHub' },
  { href: 'https://twitter.com/yourname', icon: 'ph:twitter-logo', label: 'Twitter' },
  { href: 'mailto:hello@example.com', icon: 'ph:envelope', label: 'Email' },
]
</script>
