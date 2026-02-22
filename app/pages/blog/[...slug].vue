<template>
  <div>
    <article v-if="article">
      <!-- Header -->
      <header class="mb-10">
        <div class="flex items-center gap-3 text-sm text-stone-500 dark:text-stone-400 mb-4">
          <time>{{ formatDate(article.date) }}</time>
          <span v-if="article.readingTime">&middot; {{ article.readingTime }} 分钟阅读</span>
        </div>

        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight" style="font-family: var(--font-title)">
          {{ article.title }}
        </h1>

        <p v-if="article.description" class="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">
          {{ article.description }}
        </p>

        <div v-if="article.tags?.length" class="flex flex-wrap gap-2 mt-6">
          <NuxtLink
            v-for="tag in article.tags"
            :key="tag"
            :to="`/blog?tag=${tag}`"
            class="px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 rounded-full text-sm hover:bg-stone-200 dark:hover:bg-stone-700 transition"
          >
            {{ tag }}
          </NuxtLink>
        </div>
      </header>

      <!-- Cover Image -->
      <div v-if="article.cover" class="mb-10 -mx-6 md:mx-0">
        <BlurImage
          :src="article.cover"
          :alt="article.title"
          class="w-full aspect-[16/9] rounded-xl"
        />
      </div>

      <!-- Mobile TOC -->
      <div v-if="tocLinks.length" class="lg:hidden mb-8 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden">
        <button
          class="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-900"
          @click="mobileOpen = !mobileOpen"
        >
          <span>目录</span>
          <Icon :name="mobileOpen ? 'ph:caret-up' : 'ph:caret-down'" class="w-4 h-4" />
        </button>
        <Transition name="toc-mobile">
          <div v-show="mobileOpen" class="overflow-hidden" @click="mobileOpen = false">
            <div class="px-4 py-3">
              <BlogToc :links="tocLinks" :active-id="activeId" />
            </div>
          </div>
        </Transition>
      </div>

      <!-- Content -->
      <div class="prose prose-lg dark:prose-invert max-w-none prose-stone">
        <ContentRenderer :value="article" />
      </div>

      <!-- Footer -->
      <footer class="mt-16 pt-10 border-t border-stone-200 dark:border-stone-800">
        <div v-if="relatedPosts?.length" class="mb-10">
          <h3 class="text-lg font-bold mb-4">相关文章</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ArticleCard
              v-for="post in relatedPosts"
              :key="post.path"
              :post="post"
            />
          </div>
        </div>

        <NuxtLink
          to="/blog"
          class="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition flex items-center gap-2"
        >
          <Icon name="ph:arrow-left" class="w-4 h-4" />
          返回列表
        </NuxtLink>
      </footer>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onUnmounted } from 'vue'
import type { TocLink, BlogCollectionItem } from '@nuxt/content'
import { useTocActiveHeading } from '~/composables/useTocActiveHeading'

definePageMeta({ layout: 'blog' })

const route = useRoute()
const slug = (route.params.slug as string[]).join('/')

const { data: article } = await useAsyncData(`blog-${slug}`, () =>
  queryCollection('blog').path(`/blog/${slug}`).first()
)

if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: '文章未找到' })
}

const firstTag = article.value.tags?.[0]
const { data: relatedPosts } = await useAsyncData(`related-${slug}`, async () => {
  if (!firstTag) return []
  const posts = await queryCollection('blog')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .all()
  return posts
    .filter((p: BlogCollectionItem) => p.path !== article.value!.path && p.tags?.includes(firstTag))
    .slice(0, 2)
})

useHead({
  title: article.value.title,
  meta: [
    { name: 'description', content: article.value.description },
    { property: 'og:title', content: article.value.title },
    { property: 'og:description', content: article.value.description },
  ],
})

// TOC — share with layout via useState
const tocLinks = computed(() => (article.value?.body?.toc?.links ?? []) as TocLink[])
const allHeadingIds = computed<string[]>(() => {
  const ids: string[] = []
  tocLinks.value.forEach((link: TocLink) => {
    ids.push(link.id)
    link.children?.forEach((child: TocLink) => ids.push(child.id))
  })
  return ids
})
const activeId = useTocActiveHeading(allHeadingIds)

// Push TOC data to layout via shared state
const layoutTocLinks = useState<TocLink[]>('blogTocLinks', () => [])
const layoutTocActiveId = useState<string>('blogTocActiveId', () => '')

watchEffect(() => {
  layoutTocLinks.value = tocLinks.value
  layoutTocActiveId.value = activeId.value
})

onUnmounted(() => {
  layoutTocLinks.value = []
  layoutTocActiveId.value = ''
})

const mobileOpen = ref(false)

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<style scoped>
.toc-mobile-enter-active,
.toc-mobile-leave-active {
  display: grid;
  transition: grid-template-rows 0.3s ease;
}
.toc-mobile-enter-from,
.toc-mobile-leave-to {
  grid-template-rows: 0fr;
}
.toc-mobile-enter-to,
.toc-mobile-leave-from {
  grid-template-rows: 1fr;
}
</style>
