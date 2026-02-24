<template>
  <div class="relative overflow-hidden" :class="$attrs.class">
    <img
      data-blur
      :src="blurSrc"
      :alt="alt"
      class="absolute inset-0 w-full h-full object-cover blur-[20px] scale-110 transition-opacity duration-500"
      :class="loaded ? 'opacity-0' : 'opacity-100'"
      aria-hidden="true"
    >
    <img
      ref="mainImg"
      data-main
      :src="src"
      :alt="alt"
      class="w-full h-full object-cover transition-opacity duration-500"
      :class="loaded ? 'opacity-100' : 'opacity-0'"
      loading="lazy"
      @load="loaded = true"
    >
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, useTemplateRef } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  src: string
  alt: string
}>()

const loaded = ref(false)
const mainImg = useTemplateRef<HTMLImageElement>('mainImg')

onMounted(() => {
  if (mainImg.value?.complete && mainImg.value.naturalWidth > 0) {
    loaded.value = true
  }
})

const blurSrc = computed(() => {
  const dotIndex = props.src.lastIndexOf('.')
  if (dotIndex === -1) return `${props.src}-blur.jpg`
  const pathWithoutExt = props.src.substring(0, dotIndex)
  return `${pathWithoutExt}-blur.jpg`
})
</script>
