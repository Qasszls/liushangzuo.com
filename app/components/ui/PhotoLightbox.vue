<template>
  <div ref="galleryRef" />
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'

const props = defineProps<{
  images: Array<{
    src: string
    width?: number
    height?: number
    title?: string
    caption?: string
  }>
  index: number
  open: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const galleryRef = ref<HTMLElement>()
let lightbox: PhotoSwipeLightbox | null = null

onMounted(() => {
  lightbox = new PhotoSwipeLightbox({
    dataSource: props.images.map(img => ({
      src: img.src,
      w: img.width || 1200,
      h: img.height || 800,
      alt: img.title || '',
    })),
    pswpModule: () => import('photoswipe'),
    showHideAnimationType: 'fade',
    bgOpacity: 0.95,
  })

  lightbox.on('close', () => {
    emit('close')
  })

  lightbox.init()
})

watch(() => props.open, (val) => {
  if (val && lightbox) {
    lightbox.loadAndOpen(props.index)
  }
})

onUnmounted(() => {
  lightbox?.destroy()
  lightbox = null
})
</script>
