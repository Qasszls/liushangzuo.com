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

const selectedTag = ref<string | null>(null)
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
  allPosts.value?.forEach((post: any) => post.tags?.forEach((tag: string) => tags.add(tag)))
  return Array.from(tags).sort()
})

const filteredPosts = computed(() => {
  let posts = allPosts.value || []
  if (selectedTag.value) {
    posts = posts.filter((post: any) => post.tags?.includes(selectedTag.value!))
  }
  return posts
})

const visiblePosts = computed(() =>
  filteredPosts.value.slice(0, page.value * pageSize)
)

const hasMore = computed(() =>
  visiblePosts.value.length < filteredPosts.value.length
)

watch(selectedTag, () => { page.value = 1 })

useHead({ title: '生活随笔' })
</script>
