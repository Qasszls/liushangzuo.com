import { ref, watch, onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'

export function useTocActiveHeading(ids: Ref<string[]>) {
  const activeId = ref('')
  let observer: IntersectionObserver | null = null

  function observe(idList: string[]) {
    observer?.disconnect()
    if (!idList.length) return

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            activeId.value = entry.target.id
          }
        }
      },
      { rootMargin: '-10% 0px -80% 0px', threshold: 0 },
    )

    idList.forEach((id) => {
      const el = document.getElementById(id)
      if (el) observer!.observe(el)
    })
  }

  onMounted(() => {
    observe(ids.value)
    watch(ids, observe)
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return activeId
}
