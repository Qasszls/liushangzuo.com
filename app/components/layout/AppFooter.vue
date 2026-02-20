<template>
  <footer class="border-t border-stone-200 dark:border-stone-800 py-12 mt-20">
    <div class="max-w-7xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p class="text-sm text-stone-500 dark:text-stone-400">
        &copy; {{ new Date().getFullYear() }} {{ site.name }}. All rights reserved.
      </p>
      <div class="flex items-center gap-4">
        <template v-for="link in site.socialLinks" :key="link.label">
          <a
            v-if="link.href"
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
            class="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
            :aria-label="link.label"
          >
            <Icon :name="link.icon" class="w-5 h-5" />
          </a>
          <span
            v-else
            class="text-stone-400 cursor-default"
            :title="link.label"
            :aria-label="link.label"
          >
            <Icon :name="link.icon" class="w-5 h-5" />
          </span>
        </template>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const { site } = useAppConfig()
</script>
