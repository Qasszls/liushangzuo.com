<template>
  <article class="group">
    <NuxtLink :to="post.path" class="block">
      <div
        v-if="post.cover"
        class="aspect-[16/10] overflow-hidden rounded-xl mb-5 bg-stone-100 dark:bg-stone-800"
      >
        <BlurImage
          :src="post.cover"
          :alt="post.title"
          class="w-full h-full"
        />
      </div>

      <div class="space-y-3">
        <div class="flex items-center gap-3 text-sm text-stone-500 dark:text-stone-400">
          <time>{{ formatDate(post.date) }}</time>
          <span v-if="post.tags?.length" class="flex gap-2">
            <span
              v-for="tag in post.tags.slice(0, 2)"
              :key="tag"
              class="text-accent-600 dark:text-accent-400"
            >
              #{{ tag }}
            </span>
          </span>
        </div>

        <h3 class="text-xl font-bold group-hover:text-accent-500 transition-colors leading-tight">
          {{ post.title }}
        </h3>

        <p
          v-if="post.description"
          class="text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed"
        >
          {{ post.description }}
        </p>
      </div>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  post: {
    path: string
    title: string
    description?: string
    date: string
    tags?: string[]
    cover?: string
  }
}>()

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>
