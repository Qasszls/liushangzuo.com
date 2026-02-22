// tests/setup.ts
import { vi } from 'vitest'
import type { SafeAny } from '~/types/safe-any'

// Mock Nuxt auto-imports
vi.mock('#imports', () => ({
  ref: (val: SafeAny) => ({ value: val }),
  computed: (fn: SafeAny) => ({ value: fn() }),
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

// Stub useAppConfig globally for components that use it via Nuxt auto-import
vi.stubGlobal('useAppConfig', vi.fn(() => ({
  site: {
    name: '柳尚佐',
    email: '1561790480@qq.com',
    title: '柳尚佐 — 记录生活，分享思考',
    description: '柳尚佐的个人空间',
    socialLinks: [
      { href: 'https://github.com/Qasszls', icon: 'ph:github-logo', label: 'GitHub' },
      { href: 'mailto:1561790480@qq.com', icon: 'ph:envelope', label: 'Email' },
      { icon: 'ph:wechat-logo', label: '微信：Zlsqass006', wechat: 'Zlsqass006' },
    ],
  },
})))
