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
      w: img.width || 0,
      h: img.height || 0,
      alt: img.title || '',
    })),
    pswpModule: () => import('photoswipe'),
    showHideAnimationType: 'fade',
    bgOpacity: 0.95,
  })

  // Detect actual image dimensions when width/height are not provided,
  // so portrait images display at their natural aspect ratio
  lightbox.on('contentLoad', (e) => {
    const { content } = e
    if (!content.data.w || !content.data.h) {
      e.preventDefault()

      const img = document.createElement('img')
      img.className = 'pswp__img'
      content.element = img
      content.state = 'loading'

      img.onload = () => {
        content.data.w = img.naturalWidth
        content.data.h = img.naturalHeight
        content.width = img.naturalWidth
        content.height = img.naturalHeight

        if (content.slide) {
          content.slide.width = img.naturalWidth
          content.slide.height = img.naturalHeight
          content.slide.calculateSize()
          content.slide.zoomAndPanToInitial()
          content.slide.updateContentSize(true)
          content.slide.applyCurrentZoomPan()
        }

        content.onLoaded()
      }

      img.onerror = () => {
        content.onError()
      }

      img.src = content.data.src as string
    }
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
