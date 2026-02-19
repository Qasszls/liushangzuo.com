<template>
  <Transition name="drawer">
    <div v-if="modelValue" class="fixed inset-0 z-[100]">
      <!-- Overlay -->
      <div
        data-test="drawer-overlay"
        class="absolute inset-0 bg-black/30 backdrop-blur-sm"
        @click="$emit('update:modelValue', false)"
      />
      <!-- Panel -->
      <div
        data-test="drawer-panel"
        class="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-stone-900 shadow-2xl p-6 overflow-y-auto"
      >
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-lg font-bold">设置</h2>
          <button
            class="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            @click="$emit('update:modelValue', false)"
          >
            <Icon name="ph:x" class="w-5 h-5" />
          </button>
        </div>

        <!-- Color Mode -->
        <section class="mb-8">
          <h3 class="text-sm font-medium text-stone-500 dark:text-stone-400 mb-3">色彩模式</h3>
          <div class="flex gap-3">
            <button
              :class="[
                'flex-1 py-2 rounded-lg text-sm font-medium transition',
                colorMode.value === 'light'
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                  : 'bg-stone-100 dark:bg-stone-800'
              ]"
              @click="colorMode.preference = 'light'"
            >
              <Icon name="ph:sun" class="w-4 h-4 inline-block mr-1" /> 浅色
            </button>
            <button
              :class="[
                'flex-1 py-2 rounded-lg text-sm font-medium transition',
                colorMode.value === 'dark'
                  ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                  : 'bg-stone-100 dark:bg-stone-800'
              ]"
              @click="colorMode.preference = 'dark'"
            >
              <Icon name="ph:moon" class="w-4 h-4 inline-block mr-1" /> 深色
            </button>
          </div>
        </section>

        <hr class="border-stone-200 dark:border-stone-700 mb-8" />

        <!-- Accent Color -->
        <section class="mb-8">
          <h3 class="text-sm font-medium text-stone-500 dark:text-stone-400 mb-3">强调色</h3>
          <div class="flex gap-3">
            <button
              v-for="ac in theme.accentColors"
              :key="ac.id"
              data-test="accent-color-button"
              :class="[
                'w-10 h-10 rounded-full transition-all',
                theme.accentColor.value === ac.id
                  ? 'ring-2 ring-offset-2 ring-stone-900 dark:ring-stone-100 dark:ring-offset-stone-900'
                  : 'hover:scale-110'
              ]"
              :style="{ backgroundColor: ac.color }"
              :title="ac.label"
              @click="theme.setAccentColor(ac.id)"
            />
          </div>
        </section>

        <hr class="border-stone-200 dark:border-stone-700 mb-8" />

        <!-- Title Font -->
        <section>
          <h3 class="text-sm font-medium text-stone-500 dark:text-stone-400 mb-3">标题字体</h3>
          <div class="space-y-2">
            <button
              v-for="font in theme.titleFonts"
              :key="font.id"
              data-test="font-button"
              :class="[
                'w-full text-left px-4 py-3 rounded-lg text-sm transition',
                theme.titleFont.value === font.id
                  ? 'bg-accent-500 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700'
              ]"
              :style="{ fontFamily: font.family }"
              @click="theme.setTitleFont(font.id)"
            >
              {{ font.label }}
            </button>
          </div>
        </section>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useTheme } from '~/composables/useTheme'

defineProps<{ modelValue: boolean }>()
defineEmits<{ 'update:modelValue': [value: boolean] }>()

const colorMode = useColorMode()
const theme = useTheme()
</script>
