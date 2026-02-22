<template>
  <div>
    <!-- Hero -->
    <section class="relative h-[65vh] min-h-[480px] overflow-hidden">
      <!-- Background image (conditional) -->
      <template v-if="heroImage">
        <!-- Blur placeholder -->
        <div
          class="absolute inset-0 bg-cover bg-center scale-110 blur-[20px]"
          :style="{ backgroundImage: `url('${heroImageBlur}')` }"
          aria-hidden="true"
        />
        <!-- Full image — fades in on top of blur -->
        <img
          :src="heroImage"
          alt=""
          class="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          :class="heroLoaded ? 'opacity-100' : 'opacity-0'"
          @load="heroLoaded = true"
        >
      </template>

      <!-- Gradient overlay (always present — provides dark base when no image) -->
      <div
        class="absolute inset-0"
        :class="heroImage
          ? 'bg-gradient-to-t from-stone-950/80 via-stone-950/25 to-transparent'
          : 'bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950 dark:from-stone-900 dark:via-stone-950 dark:to-black'"
      />

      <!-- Content -->
      <div class="relative z-10 h-full flex flex-col justify-end pb-14 md:pb-20">
        <div class="max-w-7xl mx-auto w-full px-6 md:px-12">
          <p class="text-white/50 text-sm tracking-[0.3em] uppercase mb-4 font-light">
            文字 · 镜头 · 旅途
          </p>
          <h1
            class="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-[1.15]"
            style="font-family: var(--font-title)"
          >
            记录生活，<br>分享思考
          </h1>
          <p class="text-white/60 text-base md:text-lg max-w-md leading-relaxed mb-8">
            用文字沉淀思想，用镜头捕捉瞬间。
          </p>
          <div class="flex gap-3">
            <NuxtLink
              to="/blog"
              class="px-6 py-2.5 bg-white/90 text-stone-900 text-sm font-medium rounded-full hover:bg-white transition-colors"
            >
              阅读随笔
            </NuxtLink>
            <NuxtLink
              to="/works"
              class="px-6 py-2.5 text-white/80 text-sm font-medium rounded-full border border-white/25 hover:bg-white/10 hover:border-white/40 transition-all"
            >
              浏览作品
            </NuxtLink>
          </div>
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
            :key="post.path"
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
            :key="photo.path"
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
import { ref } from 'vue'

// Hero background image — set to '' or null to hide the image (layout stays the same)
const heroImage = '/images/blog/beijing-autumn-gugong-cover.jpg'
const heroImageBlur = '/images/blog/beijing-autumn-gugong-cover-blur.jpg'
const heroLoaded = ref(false)

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

const { site } = useAppConfig()

useHead({
  title: site.title,
  meta: [
    { name: 'description', content: site.description },
  ],
})
</script>
