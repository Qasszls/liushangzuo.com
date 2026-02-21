<template>
  <Transition name="studio-home">
    <button
      v-if="isStudioActive"
      class="
        fixed bottom-6 right-6 z-[10000]
        w-11 h-11 rounded-full
        flex items-center justify-center
        bg-white/80 dark:bg-stone-900/80
        backdrop-blur-sm
        border border-stone-200/60 dark:border-stone-700/40
        shadow-sm shadow-stone-300/30 dark:shadow-stone-900/50
        text-stone-500 dark:text-stone-400
        hover:text-accent-600 dark:hover:text-accent-400
        hover:border-accent-300/60 dark:hover:border-accent-600/40
        hover:shadow-md hover:shadow-accent-200/20 dark:hover:shadow-accent-900/20
        hover:-translate-y-0.5
        active:translate-y-0 active:shadow-sm
        transition-all duration-300 ease-out
        cursor-pointer
      "
      title="返回首页"
      @click="navigateTo('/')"
    >
      <Icon name="ph:house" class="w-[18px] h-[18px]" />
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isStudioActive = ref(false)

let observer: MutationObserver | null = null

onMounted(() => {
  isStudioActive.value = document.body.hasAttribute('data-studio-active')

  observer = new MutationObserver(() => {
    isStudioActive.value = document.body.hasAttribute('data-studio-active')
  })
  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['data-studio-active'],
  })
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<style scoped>
.studio-home-enter-active {
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.studio-home-leave-active {
  transition: opacity 0.2s ease-in,
              transform 0.2s ease-in;
}
.studio-home-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(8px);
}
.studio-home-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
