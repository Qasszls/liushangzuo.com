<template>
  <div class="sidebar-root">
    <!-- Author Card -->
    <section class="pb-8">
      <div class="flex flex-col items-center">
        <div class="relative mb-5">
          <div class="w-[88px] h-[88px] rounded-full overflow-hidden ring-1 ring-stone-200/80 dark:ring-stone-700/60 shadow-sm">
            <img
              :src="config.site.author.avatar"
              :alt="config.site.name"
              class="w-full h-full object-cover"
            />
          </div>
        </div>
        <h3
          class="text-lg font-semibold text-stone-800 dark:text-stone-200 mb-1.5"
          style="font-family: var(--font-title)"
        >
          {{ config.site.name }}
        </h3>
        <p class="text-[13px] text-stone-400 dark:text-stone-500 tracking-wide">
          {{ config.site.author.bio }}
        </p>
      </div>
    </section>

    <!-- Divider -->
    <div class="h-px bg-stone-200/60 dark:bg-stone-800/80 mx-4" />

    <!-- Tags -->
    <section v-if="tags.length" class="py-8">
      <h4
        class="text-xs font-medium uppercase tracking-[0.15em] text-stone-400 dark:text-stone-500 mb-5"
      >
        标签
      </h4>
      <div class="flex flex-wrap gap-2.5">
        <NuxtLink
          v-for="item in tags"
          :key="item.name"
          :to="`/blog?tag=${item.name}`"
          class="inline-flex items-center gap-1 px-3 py-1.5 text-[13px] rounded-full border border-stone-200 dark:border-stone-700/80 text-stone-500 dark:text-stone-400 hover:border-accent-400 hover:text-accent-600 dark:hover:border-accent-500 dark:hover:text-accent-400 transition-colors duration-200"
        >
          <span>{{ item.name }}</span>
          <span class="text-[11px] text-stone-300 dark:text-stone-600">{{ item.count }}</span>
        </NuxtLink>
      </div>
    </section>

    <!-- Divider -->
    <div v-if="tags.length && archives.length" class="h-px bg-stone-200/60 dark:bg-stone-800/80 mx-4" />

    <!-- Archive -->
    <section v-if="archives.length" class="pt-8">
      <h4
        class="text-xs font-medium uppercase tracking-[0.15em] text-stone-400 dark:text-stone-500 mb-5"
      >
        归档
      </h4>
      <ul class="space-y-3">
        <li v-for="item in archives" :key="item.key">
          <NuxtLink
            :to="`/blog?month=${item.key}`"
            class="group flex items-center justify-between text-[13px]"
          >
            <span class="text-stone-500 dark:text-stone-400 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors duration-200">
              {{ item.label }}
            </span>
            <span class="text-stone-300 dark:text-stone-600 text-[12px] tabular-nums">
              {{ item.count }}
            </span>
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

// Use useState so SSG payload transfers the build-time timestamp to the client,
// ensuring identical heat-score sort order during hydration.
const sidebarTimestamp = useState('sidebar-timestamp', () => Date.now())

const tags = computed(() => {
  const map = new Map<string, { count: number; dates: string[] }>()
  props.posts.forEach((post) => {
    post.tags?.forEach((tag: string) => {
      const entry = map.get(tag) || { count: 0, dates: [] }
      entry.count++
      if (post.date) entry.dates.push(String(post.date))
      map.set(tag, entry)
    })
  })

  const now = sidebarTimestamp.value
  const DECAY_DAYS = 180
  const RECENCY_WEIGHT = 0.7

  return Array.from(map.entries())
    .map(([name, { count, dates }]) => {
      const recency = dates.reduce((sum, d) => {
        const days = (now - new Date(d).getTime()) / 86_400_000
        return sum + Math.max(0, 1 - days / DECAY_DAYS)
      }, 0)
      return { name, count, score: count + recency * RECENCY_WEIGHT }
    })
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
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
