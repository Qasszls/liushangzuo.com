<template>
  <div class="max-w-2xl mx-auto px-6 md:px-16 py-20">

    <!-- 页头 -->
    <div class="mb-20">
      <p class="text-xs tracking-[0.3em] text-stone-400 dark:text-stone-500 uppercase mb-4">Archive</p>
      <h1 class="text-4xl text-stone-900 dark:text-stone-100" style="font-family: var(--font-title)">
        归档
      </h1>
      <p class="mt-3 text-sm text-stone-400 dark:text-stone-500">
        共 {{ total }} 篇
      </p>
    </div>

    <!-- 按年分组 -->
    <div v-for="group in grouped" :key="group.year" class="mb-16">

      <!-- 年份标题 -->
      <div class="flex items-baseline gap-6 mb-8">
        <span
          class="text-6xl font-bold italic text-stone-100 dark:text-stone-800 select-none"
          style="font-family: var(--font-title); line-height: 1"
        >{{ group.year }}</span>
        <span class="text-xs text-stone-400 dark:text-stone-600 tracking-widest">
          {{ group.items.length }} 篇
        </span>
      </div>

      <!-- 条目列表 -->
      <div class="relative">
        <!-- 竖线 -->
        <div class="absolute left-[3.5rem] top-0 bottom-0 w-px bg-stone-200 dark:bg-stone-800" />

        <div
          v-for="item in group.items"
          :key="item.path"
          class="relative flex items-baseline gap-0 group"
        >
          <!-- 月份 -->
          <span class="w-14 shrink-0 text-xs text-stone-400 dark:text-stone-600 py-3 pr-3 text-right tabular-nums">
            {{ formatMonth(item.date) }}
          </span>

          <!-- 圆点 -->
          <div class="relative z-10 w-1.5 h-1.5 rounded-full bg-stone-300 dark:bg-stone-700 shrink-0 mt-[1.1rem] mx-3 group-hover:bg-accent-400 transition-colors duration-200" />

          <!-- 内容 -->
          <NuxtLink
            :to="item.path"
            class="flex-1 flex items-baseline justify-between gap-4 py-3 pr-1 min-w-0"
          >
            <span
              class="text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-stone-100 transition-colors duration-200 truncate text-sm leading-relaxed"
              style="font-family: var(--font-title)"
            >{{ item.title }}</span>
            <span class="shrink-0 text-[10px] tracking-widest text-stone-400 dark:text-stone-600 uppercase">
              {{ item.typeLabel }}
            </span>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!total" class="text-center py-20 text-stone-400 text-sm">
      暂无内容
    </div>

  </div>
</template>

<script setup lang="ts">
interface ArchiveItem {
  path: string
  title: string
  date: string
  typeLabel: string
}

interface YearGroup {
  year: number
  items: ArchiveItem[]
}

const TYPE_LABELS: Record<string, string> = {
  blog: '随笔',
  works: '摄影',
  travel: '旅行',
  tech: '技术',
}

const [{ data: blogPosts }, { data: worksPosts }] = await Promise.all([
  useAsyncData('archive-blog', () =>
    queryCollection('blog')
      .where('draft', '=', false)
      .select('title', 'date', 'path')
      .order('date', 'DESC')
      .all()
  ),
  useAsyncData('archive-works', () =>
    queryCollection('works')
      .select('title', 'date', 'path')
      .order('date', 'DESC')
      .all()
  ),
])

const allItems = computed<ArchiveItem[]>(() => {
  const blog = (blogPosts.value ?? []).map(p => ({
    path: p.path,
    title: p.title,
    date: p.date,
    typeLabel: TYPE_LABELS.blog,
  }))
  const works = (worksPosts.value ?? []).map(p => ({
    path: p.path,
    title: p.title,
    date: p.date,
    typeLabel: TYPE_LABELS.works,
  }))
  return [...blog, ...works].sort((a, b) => b.date.localeCompare(a.date))
})

const total = computed(() => allItems.value.length)

const grouped = computed<YearGroup[]>(() => {
  const map = new Map<number, ArchiveItem[]>()
  for (const item of allItems.value) {
    const year = new Date(item.date).getFullYear()
    if (!map.has(year)) map.set(year, [])
    map.get(year)!.push(item)
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => b - a)
    .map(([year, items]) => ({ year, items }))
})

function formatMonth(date: string) {
  const d = new Date(date)
  return `${String(d.getMonth() + 1).padStart(2, '0')}月`
}

useHead({ title: '归档' })
definePageMeta({ layout: 'default' })
</script>
