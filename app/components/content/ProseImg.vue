<template>
  <figure class="rounded-xl overflow-hidden my-8">
    <BlurImage
      :src="src"
      :alt="alt || ''"
      class="aspect-[3/2]"
    />
    <figcaption
      v-if="alt"
      class="text-center text-sm text-stone-500 dark:text-stone-400 mt-3"
    >
      {{ alt }}
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
defineProps<{
  src: string
  alt?: string
}>()
</script>
