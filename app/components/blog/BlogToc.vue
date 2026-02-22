<script setup lang="ts">
interface TocLink {
  id: string
  text: string
  depth: 2 | 3
  children?: TocLink[]
}

defineProps<{
  links: TocLink[]
  activeId: string
}>()

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function activeClass(id: string, active: string) {
  return id === active
    ? 'font-semibold text-stone-900 dark:text-stone-100'
    : 'text-stone-500 dark:text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
}
</script>

<template>
  <ul class="space-y-2 text-sm">
    <li v-for="link in links" :key="link.id">
      <a
        :href="`#${link.id}`"
        :class="['block transition-colors duration-150', activeClass(link.id, activeId)]"
        @click.prevent="scrollTo(link.id)"
      >
        {{ link.text }}
      </a>
      <ul v-if="link.children?.length" class="ml-4 mt-1 space-y-1">
        <li v-for="child in link.children" :key="child.id">
          <a
            :href="`#${child.id}`"
            :class="['block transition-colors duration-150 text-xs', activeClass(child.id, activeId)]"
            @click.prevent="scrollTo(child.id)"
          >
            {{ child.text }}
          </a>
        </li>
      </ul>
    </li>
  </ul>
</template>
