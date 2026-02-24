<template>
  <div class="space-y-10">
    <!-- Author Card -->
    <section class="text-center">
      <img
        :src="config.site.author.avatar"
        :alt="config.site.name"
        class="w-20 h-20 rounded-full mx-auto mb-3 object-cover ring-2 ring-stone-200 dark:ring-stone-700"
      />
      <h3 class="text-base font-semibold text-stone-800 dark:text-stone-200" style="font-family: var(--font-title)">
        {{ config.site.name }}
      </h3>
      <p class="text-sm text-stone-500 dark:text-stone-400 mt-1">
        {{ config.site.author.bio }}
      </p>
    </section>

    <!-- Tags -->
    <section v-if="tags.length">
      <h4 class="text-sm font-medium text-stone-500 dark:text-stone-400 mb-3">标签</h4>
      <div class="flex flex-wrap gap-2">
        <NuxtLink
          v-for="item in tags"
          :key="item.name"
          :to="`/blog?tag=${item.name}`"
          class="px-2.5 py-1 text-xs rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700 transition"
        >
          {{ item.name }}
          <span class="text-stone-400 dark:text-stone-500 ml-0.5">({{ item.count }})</span>
        </NuxtLink>
      </div>
    </section>

    <!-- Archive -->
    <section v-if="archives.length">
      <h4 class="text-sm font-medium text-stone-500 dark:text-stone-400 mb-3">归档</h4>
      <ul class="space-y-1.5">
        <li v-for="item in archives" :key="item.key">
          <NuxtLink
            :to="`/blog?month=${item.key}`"
            class="text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 transition"
          >
            {{ item.label }}
            <span class="text-stone-400 dark:text-stone-500">({{ item.count }})</span>
          </NuxtLink>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BlogCollectionItem } from '@nuxt/content'

const config = useAppConfig()

const props = defineProps<{
  posts: BlogCollectionItem[]
}>()

const tags = computed(() => {
  const map = new Map<string, number>()
  props.posts.forEach((post) => {
    post.tags?.forEach((tag: string) => {
      map.set(tag, (map.get(tag) || 0) + 1)
    })
  })
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
})

const archives = computed(() => {
  const map = new Map<string, number>()
  props.posts.forEach((post) => {
    if (!post.date) return
    const d = new Date(post.date)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    map.set(key, (map.get(key) || 0) + 1)
  })
  return Array.from(map.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([key, count]) => {
      const [year, month] = key.split('-')
      return { key, label: `${year}年${Number(month)}月`, count }
    })
})
</script>
