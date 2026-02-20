<template>
  <div>
    <!-- Hero -->
    <section class="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-stone-100 via-stone-50 to-accent-50/30 dark:from-stone-950 dark:via-stone-900 dark:to-accent-950/20" />
      <div class="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <h1
          class="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight"
          style="font-family: var(--font-title)"
        >
          记录生活，<br />
          <span class="text-stone-500 dark:text-stone-400">分享思考</span>
        </h1>
        <p class="text-lg md:text-xl text-stone-600 dark:text-stone-400 mb-10 max-w-xl mx-auto leading-relaxed">
          一个关于技术、旅行与摄影的个人空间。用文字沉淀思想，用镜头捕捉瞬间。
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/blog"
            class="px-8 py-4 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-full font-medium hover:scale-105 transition-transform"
          >
            阅读随笔
          </NuxtLink>
          <NuxtLink
            to="/works"
            class="px-8 py-4 border border-stone-300 dark:border-stone-700 rounded-full font-medium hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            浏览作品
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Latest Posts -->
    <section class="py-20 md:py-32">
      <div class="max-w-7xl mx-auto px-6 md:px-12">
        <div class="flex items-center justify-between mb-12">
          <h2 class="text-2xl md:text-3xl font-bold" style="font-family: var(--font-title)">
            最新文章
          </h2>
          <NuxtLink
            to="/blog"
            class="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition flex items-center gap-1"
          >
            查看全部 <Icon name="ph:arrow-right" class="w-4 h-4" />
          </NuxtLink>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ArticleCard
            v-for="post in latestPosts"
            :key="post._path"
            :post="post"
          />
        </div>
      </div>
    </section>

    <!-- Featured Photos -->
    <section v-if="featuredPhotos?.length" class="py-20 md:py-32 bg-stone-100 dark:bg-stone-900">
      <div class="max-w-7xl mx-auto px-6 md:px-12">
        <div class="flex items-center justify-between mb-12">
          <h2 class="text-2xl md:text-3xl font-bold" style="font-family: var(--font-title)">
            摄影精选
          </h2>
          <NuxtLink
            to="/works"
            class="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition flex items-center gap-1"
          >
            查看全部 <Icon name="ph:arrow-right" class="w-4 h-4" />
          </NuxtLink>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="photo in featuredPhotos"
            :key="photo._path"
            to="/works"
            class="group relative aspect-[4/3] overflow-hidden rounded-xl bg-stone-200 dark:bg-stone-800"
          >
            <BlurImage
              :src="photo.image"
              :alt="photo.title"
              class="w-full h-full"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <span class="text-white font-medium">{{ photo.title }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- About Preview -->
    <section class="py-20 md:py-32">
      <div class="max-w-4xl mx-auto px-6 md:px-12 text-center">
        <div class="w-28 h-28 rounded-full mx-auto mb-8 bg-stone-200 dark:bg-stone-700 flex items-center justify-center">
          <Icon name="ph:user" class="w-12 h-12 text-stone-400" />
        </div>
        <h2 class="text-2xl md:text-3xl font-bold mb-4" style="font-family: var(--font-title)">
          关于我
        </h2>
        <p class="text-stone-600 dark:text-stone-400 mb-8 max-w-2xl mx-auto leading-relaxed text-lg">
          热爱探索技术与设计的交叉点。相信好的代码应当像好的文字一样——清晰、优雅、有表达力。
        </p>
        <NuxtLink
          to="/about"
          class="text-accent-500 hover:text-accent-600 transition font-medium"
        >
          了解更多 &rarr;
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { data: latestPosts } = await useAsyncData('home-posts', () =>
  queryCollection('blog')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .limit(3)
    .all()
)

const { data: featuredPhotos } = await useAsyncData('home-photos', () =>
  queryCollection('works')
    .where('featured', '=', true)
    .order('date', 'DESC')
    .limit(3)
    .all()
)

useHead({
  title: 'Your Name — 记录生活，分享思考',
  meta: [
    { name: 'description', content: '一个关于技术、旅行与摄影的个人空间' },
  ],
})
</script>
