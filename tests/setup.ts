// tests/setup.ts
import { vi } from 'vitest'

// Mock Nuxt auto-imports
vi.mock('#imports', () => ({
  ref: (val: any) => ({ value: val }),
  computed: (fn: any) => ({ value: fn() }),
  watch: vi.fn(),
  onMounted: vi.fn(),
  onUnmounted: vi.fn(),
  useHead: vi.fn(),
  useRoute: vi.fn(() => ({ params: {}, path: '/' })),
  useRouter: vi.fn(() => ({ push: vi.fn() })),
  definePageMeta: vi.fn(),
  useColorMode: vi.fn(() => ({ preference: 'light', value: 'light' })),
  navigateTo: vi.fn(),
}))

// Mock NuxtLink as a simple <a> tag
vi.stubGlobal('NuxtLink', {
  template: '<a :href="to"><slot /></a>',
  props: ['to'],
})

// Stub useColorMode globally for components that use it via Nuxt auto-import
vi.stubGlobal('useColorMode', vi.fn(() => ({ preference: 'light', value: 'light' })))
