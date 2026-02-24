<template>
  <div class="max-w-7xl mx-auto px-6 md:px-12 py-12">
    <!-- Header -->
    <div class="mb-12">
      <h1 class="text-3xl md:text-4xl font-bold mb-4" style="font-family: var(--font-title)">
        生活随笔
      </h1>
      <p class="text-stone-600 dark:text-stone-400 max-w-2xl">
        记录日常思考、阅读笔记与生活观察。
      </p>
    </div>

    <!-- Active Filters -->
    <div v-if="selectedMonth" class="flex items-center gap-2 mb-6">
      <span class="text-sm text-stone-500 dark:text-stone-400">筛选：{{ monthLabel }}</span>
      <button
        class="text-sm text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition"
        @click="clearMonth"
      >
        <Icon name="ph:x" class="w-4 h-4" />
      </button>
    </div>

    <!-- Tag Filter -->
    <div v-if="allTags.length" class="flex flex-wrap gap-2 mb-10">
      <button
        v-for="tag in allTags"
        :key="tag"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium transition',
          selectedTag === tag
            ? 'bg-accent-500 text-white'
            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700',
        ]"
        @click="selectedTag = selectedTag === tag ? null : tag"
      >
        {{ tag }}
      </button>
    </div>

    <!-- Post Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <ArticleCard
        v-for="post in visiblePosts"
        :key="post.path"
        :post="post"
      />
    </div>

    <!-- Empty State -->
    <div v-if="!visiblePosts.length" class="text-center py-20 text-stone-400">
      暂无文章
    </div>

    <!-- Load More -->
    <div v-if="hasMore" class="mt-16 text-center">
      <button
        class="px-8 py-3 border border-stone-300 dark:border-stone-700 rounded-full font-medium hover:bg-stone-100 dark:hover:bg-stone-800 transition"
        @click="page++"
      >
        加载更多
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { BlogCollectionItem } from '@nuxt/content'

const route = useRoute()
const router = useRouter()

const selectedTag = ref<string | null>((route.query.tag as string) || null)
const selectedMonth = ref<string | null>((route.query.month as string) || null)
const page = ref(1)
const pageSize = 9

const { data: allPosts } = await useAsyncData('blog-posts', () =>
  queryCollection('blog')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .all()
)

const allTags = computed(() => {
  const tags = new Set<string>()
  allPosts.value?.forEach((post: BlogCollectionItem) => post.tags?.forEach((tag: string) => tags.add(tag)))
  return Array.from(tags).sort()
})

const monthLabel = computed(() => {
  if (!selectedMonth.value) return ''
  const [year, month] = selectedMonth.value.split('-')
  return `${year}年${Number(month)}月`
})

const filteredPosts = computed(() => {
  let posts = allPosts.value || []
  if (selectedTag.value) {
    posts = posts.filter((post: BlogCollectionItem) => post.tags?.includes(selectedTag.value!))
  }
  if (selectedMonth.value) {
    posts = posts.filter((post: BlogCollectionItem) => {
      if (!post.date) return false
      const d = new Date(post.date)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      return key === selectedMonth.value
    })
  }
  return posts
})

const visiblePosts = computed(() =>
  filteredPosts.value.slice(0, page.value * pageSize)
)

const hasMore = computed(() =>
  visiblePosts.value.length < filteredPosts.value.length
)

function clearMonth() {
  selectedMonth.value = null
  router.replace({ query: { ...route.query, month: undefined } })
}

watch(selectedTag, () => { page.value = 1 })
watch(selectedMonth, () => { page.value = 1 })

// Sync URL query params when navigating from sidebar
watch(() => route.query, (query) => {
  if (query.tag !== undefined) selectedTag.value = (query.tag as string) || null
  if (query.month !== undefined) selectedMonth.value = (query.month as string) || null
}, { immediate: false })

useHead({ title: '生活随笔' })
</script>
