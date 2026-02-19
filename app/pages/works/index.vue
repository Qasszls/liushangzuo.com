<template>
  <div class="max-w-7xl mx-auto px-6 md:px-12 py-12">
    <!-- Header -->
    <div class="mb-12">
      <h1 class="text-3xl md:text-4xl font-bold mb-4" style="font-family: var(--font-title)">
        摄影作品
      </h1>
      <p class="text-stone-600 dark:text-stone-400 max-w-2xl">
        用镜头捕捉光影与瞬间。
      </p>
    </div>

    <!-- Category Filter -->
    <div class="flex flex-wrap gap-2 mb-10">
      <button
        v-for="cat in categories"
        :key="cat"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium transition',
          selectedCategory === cat
            ? 'bg-accent-500 text-white'
            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700',
        ]"
        @click="selectedCategory = selectedCategory === cat ? '全部' : cat"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Masonry Grid -->
    <div class="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
      <div
        v-for="(photo, idx) in filteredPhotos"
        :key="photo._path"
        class="break-inside-avoid group relative overflow-hidden rounded-xl cursor-pointer"
        @click="openLightbox(idx)"
      >
        <NuxtImg
          :src="photo.image"
          :alt="photo.title"
          class="w-full transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          sizes="sm:100vw md:50vw lg:33vw"
        />

        <!-- Hover Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
          <h3 class="text-white font-bold text-lg">{{ photo.title }}</h3>
          <p v-if="photo.location" class="text-white/80 text-sm">{{ photo.location }}</p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!filteredPhotos.length" class="text-center py-20 text-stone-400">
      暂无作品
    </div>

    <!-- Lightbox -->
    <ClientOnly>
      <PhotoLightbox
        v-if="lightboxData.length"
        :images="lightboxData"
        :index="lightboxIndex"
        :open="lightboxOpen"
        @close="lightboxOpen = false"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const selectedCategory = ref('全部')
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

const categories = ['全部', '风光', '人文', '街头', '建筑']

const { data: photos } = await useAsyncData('works', () =>
  queryCollection('works')
    .order('date', 'DESC')
    .all()
)

const filteredPhotos = computed(() => {
  if (selectedCategory.value === '全部') return photos.value || []
  return (photos.value || []).filter((p: any) => p.category === selectedCategory.value)
})

const lightboxData = computed(() =>
  filteredPhotos.value.map((p: any) => ({
    src: p.image,
    title: p.title,
    caption: [p.camera, p.lens, p.location].filter(Boolean).join(' · '),
  }))
)

function openLightbox(idx: number) {
  lightboxIndex.value = idx
  lightboxOpen.value = true
}

useHead({ title: '摄影作品' })
</script>
