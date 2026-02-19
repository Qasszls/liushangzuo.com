# Personal Website MVP Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the MVP personal website with homepage, blog, photography gallery, about page, and a switchable theme system.

**Architecture:** Nuxt 3 + @nuxt/content v3 (collections) + Tailwind CSS v4 (CSS-first @theme) + TypeScript. Content stored as Markdown, queried via `queryCollection`. Theme switching (accent colors, title fonts, dark mode) managed by `useTheme` composable with CSS custom properties persisted to localStorage.

**Tech Stack:** Nuxt 3, @nuxt/content v3, Tailwind CSS v4 (@tailwindcss/vite), @nuxt/icon, @nuxtjs/color-mode, @nuxtjs/google-fonts, PhotoSwipe 5, Vitest, @vue/test-utils

---

### Task 1: Project Initialization

**Files:**
- Create: entire project scaffold
- Modify: `nuxt.config.ts`, `package.json`

**Step 1: Initialize from Content Wind template**

```bash
cd /root/work
# Back up existing files
cp liushangzuo.com/CLAUDE.md /tmp/CLAUDE.md
cp liushangzuo.com/design.md /tmp/design.md
cp -r liushangzuo.com/docs /tmp/docs
cp -r liushangzuo.com/.claude /tmp/.claude

# Init fresh project in temp dir
npx nuxi@latest init liushangzuo-temp -t github:atinux/content-wind
```

**Step 2: Merge into existing repo**

```bash
# Copy template files into existing repo (preserve git history)
cp -r liushangzuo-temp/* liushangzuo.com/
cp liushangzuo-temp/.* liushangzuo.com/ 2>/dev/null || true

# Restore our files
cp /tmp/CLAUDE.md liushangzuo.com/CLAUDE.md
cp /tmp/design.md liushangzuo.com/design.md
cp -r /tmp/docs liushangzuo.com/
cp -r /tmp/.claude liushangzuo.com/

# Clean up
rm -rf liushangzuo-temp
cd liushangzuo.com
```

**Step 3: Strip Content Wind default UI**

Remove Content Wind's default pages and components — we'll write our own. Keep only base config files (`nuxt.config.ts`, `package.json`, `tsconfig.json`, `app.config.ts`). Delete default content, components, layouts, and pages that came with the template.

**Step 4: Install additional dependencies**

```bash
pnpm add @nuxt/image @nuxtjs/google-fonts photoswipe
pnpm add -D @tailwindcss/vite tailwindcss vitest @vue/test-utils @nuxt/test-utils happy-dom
```

If Content Wind ships @nuxt/content v2, upgrade:
```bash
pnpm add @nuxt/content@latest
```

**Step 5: Configure nuxt.config.ts**

```typescript
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-02-19',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@nuxtjs/google-fonts',
  ],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  colorMode: {
    classSuffix: '',
  },

  googleFonts: {
    families: {
      'Noto Serif SC': [400, 600, 700],
      'LXGW WenKai': [400, 700],
    },
    display: 'swap',
    download: true,
  },

  content: {
    // v3 uses content.config.ts for collections
  },

  image: {
    quality: 80,
    format: ['webp', 'jpg', 'png'],
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'zh-CN' },
    },
  },

  typescript: {
    strict: true,
  },
})
```

**Step 6: Verify dev server starts**

```bash
pnpm dev
```

Expected: Dev server runs at `http://localhost:3000` without errors.

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: initialize project from Content Wind template

Strip default UI, add @nuxt/content v3, Tailwind v4, @nuxt/image,
@nuxtjs/google-fonts, PhotoSwipe, and testing dependencies."
```

---

### Task 2: Tailwind CSS v4 + Design Tokens

**Files:**
- Create: `assets/css/main.css`
- Remove: `tailwind.config.ts` (if exists, v4 uses CSS-first)

**Step 1: Create main.css with Tailwind v4 and design tokens**

```css
/* assets/css/main.css */
@import "tailwindcss";

/* === Design Tokens via @theme === */
@theme {
  /* Font families */
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, 'Noto Sans', sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
  --font-serif: 'Noto Serif SC', 'Source Han Serif CN', 'STSong', 'SimSun', serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', Monaco, Consolas, monospace;

  /* Accent color palette — references CSS variables set by useTheme */
  --color-accent-50: var(--accent-50);
  --color-accent-100: var(--accent-100);
  --color-accent-200: var(--accent-200);
  --color-accent-300: var(--accent-300);
  --color-accent-400: var(--accent-400);
  --color-accent-500: var(--accent-500);
  --color-accent-600: var(--accent-600);
  --color-accent-700: var(--accent-700);
  --color-accent-800: var(--accent-800);
  --color-accent-900: var(--accent-900);
  --color-accent-950: var(--accent-950);
}

/* === Accent color presets (default: Mist Blue) === */
:root {
  --accent-50: #f0f5f8;
  --accent-100: #dce7ef;
  --accent-200: #bdd2e1;
  --accent-300: #92b6cd;
  --accent-400: #7c9cb5;
  --accent-500: #5a7a93;
  --accent-600: #4a657c;
  --accent-700: #3e5366;
  --accent-800: #374856;
  --accent-900: #313d49;
  --accent-950: #202830;

  --font-title: 'Noto Serif SC', serif;
}

/* Bean Green preset */
:root[data-accent="bean-green"] {
  --accent-50: #f2f5f3;
  --accent-100: #e0e8e2;
  --accent-200: #c3d3c7;
  --accent-300: #9bb6a2;
  --accent-400: #8fa395;
  --accent-500: #6b826f;
  --accent-600: #556958;
  --accent-700: #455548;
  --accent-800: #3a463c;
  --accent-900: #313b33;
  --accent-950: #1a201b;
}

/* Lotus Pink preset */
:root[data-accent="lotus-pink"] {
  --accent-50: #f7f4f3;
  --accent-100: #ede7e4;
  --accent-200: #ddd2cc;
  --accent-300: #c8b8af;
  --accent-400: #b8a9a1;
  --accent-500: #9a8b83;
  --accent-600: #82736b;
  --accent-700: #6b5e58;
  --accent-800: #5a504b;
  --accent-900: #4e4541;
  --accent-950: #292422;
}

/* Desert Camel preset */
:root[data-accent="desert-camel"] {
  --accent-50: #f6f4f2;
  --accent-100: #ebe7e2;
  --accent-200: #d8d1c7;
  --accent-300: #c0b5a6;
  --accent-400: #a89f91;
  --accent-500: #8a8173;
  --accent-600: #746b5f;
  --accent-700: #5f584e;
  --accent-800: #514b43;
  --accent-900: #46413b;
  --accent-950: #25221f;
}

/* === Font title presets === */
:root[data-font="lxgw-wenkai"] {
  --font-title: 'LXGW WenKai', cursive;
}
:root[data-font="system"] {
  --font-title: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
/* default (noto-serif) uses the :root default */

/* === Global styles === */
html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-sans);
}

/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
}

/* Prose overrides for article content */
.prose {
  --tw-prose-body: theme(--color-stone-700);
  --tw-prose-headings: theme(--color-stone-900);
  line-height: 1.8;
}
.dark .prose {
  --tw-prose-body: theme(--color-stone-300);
  --tw-prose-headings: theme(--color-stone-100);
}
```

**Step 2: Remove tailwind.config.ts if it exists**

```bash
rm -f tailwind.config.ts tailwind.config.js
```

**Step 3: Verify Tailwind works**

Create a minimal `app.vue` (temporary):

```vue
<template>
  <div class="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
    <h1 class="text-4xl text-accent-500 p-12" style="font-family: var(--font-title)">
      Theme Test
    </h1>
    <NuxtPage />
  </div>
</template>
```

Run `pnpm dev`, check that accent color and font render correctly.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: set up Tailwind v4 with accent color and font CSS variables

Four accent color presets (mist-blue, bean-green, lotus-pink,
desert-camel) and three font presets via data attributes on :root."
```

---

### Task 3: Vitest + Testing Infrastructure

**Files:**
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`
- Modify: `package.json` (add test script)

**Step 1: Create vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./tests/setup.ts'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    globals: true,
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, '.'),
      '#imports': resolve(__dirname, '.nuxt/imports.d.ts'),
    },
  },
})
```

**Step 2: Create test setup file**

```typescript
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
```

**Step 3: Add test script to package.json**

Add to `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

**Step 4: Verify test infrastructure with a trivial test**

Create `tests/smoke.spec.ts`:

```typescript
import { describe, it, expect } from 'vitest'

describe('smoke test', () => {
  it('works', () => {
    expect(1 + 1).toBe(2)
  })
})
```

Run: `pnpm test`
Expected: 1 test passes.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: set up Vitest with happy-dom and Nuxt mocks"
```

---

### Task 4: useTheme Composable (TDD)

**Files:**
- Test: `composables/useTheme.spec.ts`
- Create: `composables/useTheme.ts`

**Step 1: Write the failing tests**

```typescript
// composables/useTheme.spec.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    clear: () => { store = {} },
  }
})()
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock })

// Mock document.documentElement
const htmlElement = {
  dataset: {} as Record<string, string>,
  style: { setProperty: vi.fn() },
}
Object.defineProperty(globalThis, 'document', {
  value: { documentElement: htmlElement },
  writable: true,
})

import { useTheme, ACCENT_COLORS, TITLE_FONTS } from './useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    localStorageMock.clear()
    htmlElement.dataset = {}
  })

  it('exports accent color options', () => {
    expect(ACCENT_COLORS).toHaveLength(4)
    expect(ACCENT_COLORS[0].id).toBe('mist-blue')
    expect(ACCENT_COLORS[1].id).toBe('bean-green')
    expect(ACCENT_COLORS[2].id).toBe('lotus-pink')
    expect(ACCENT_COLORS[3].id).toBe('desert-camel')
  })

  it('exports title font options', () => {
    expect(TITLE_FONTS).toHaveLength(3)
    expect(TITLE_FONTS[0].id).toBe('noto-serif')
    expect(TITLE_FONTS[1].id).toBe('lxgw-wenkai')
    expect(TITLE_FONTS[2].id).toBe('system')
  })

  it('defaults to mist-blue accent and noto-serif font', () => {
    const { accentColor, titleFont } = useTheme()
    expect(accentColor.value).toBe('mist-blue')
    expect(titleFont.value).toBe('noto-serif')
  })

  it('setAccentColor updates data attribute and localStorage', () => {
    const { setAccentColor, accentColor } = useTheme()
    setAccentColor('bean-green')
    expect(accentColor.value).toBe('bean-green')
    expect(localStorageMock.getItem('accent-color')).toBe('bean-green')
    expect(htmlElement.dataset.accent).toBe('bean-green')
  })

  it('setTitleFont updates data attribute and localStorage', () => {
    const { setTitleFont, titleFont } = useTheme()
    setTitleFont('lxgw-wenkai')
    expect(titleFont.value).toBe('lxgw-wenkai')
    expect(localStorageMock.getItem('title-font')).toBe('lxgw-wenkai')
    expect(htmlElement.dataset.font).toBe('lxgw-wenkai')
  })

  it('restores saved preferences from localStorage', () => {
    localStorageMock.setItem('accent-color', 'lotus-pink')
    localStorageMock.setItem('title-font', 'system')
    const { accentColor, titleFont } = useTheme()
    expect(accentColor.value).toBe('lotus-pink')
    expect(titleFont.value).toBe('system')
  })

  it('ignores invalid localStorage values', () => {
    localStorageMock.setItem('accent-color', 'neon-pink')
    const { accentColor } = useTheme()
    expect(accentColor.value).toBe('mist-blue')
  })
})
```

**Step 2: Run test to verify it fails**

```bash
pnpm test composables/useTheme.spec.ts
```

Expected: FAIL — module `./useTheme` not found.

**Step 3: Write the implementation**

```typescript
// composables/useTheme.ts
import { ref } from 'vue'

export interface AccentColor {
  id: string
  label: string
  color: string
}

export interface TitleFont {
  id: string
  label: string
  family: string
}

export const ACCENT_COLORS: AccentColor[] = [
  { id: 'mist-blue', label: '雾霾蓝', color: '#7C9CB5' },
  { id: 'bean-green', label: '豆沙绿', color: '#8FA395' },
  { id: 'lotus-pink', label: '藕荷粉', color: '#B8A9A1' },
  { id: 'desert-camel', label: '淡漠驼', color: '#A89F91' },
]

export const TITLE_FONTS: TitleFont[] = [
  { id: 'noto-serif', label: 'Noto Serif SC', family: "'Noto Serif SC', serif" },
  { id: 'lxgw-wenkai', label: '霞鹜文楷', family: "'LXGW WenKai', cursive" },
  { id: 'system', label: '系统字体', family: "system-ui, -apple-system, sans-serif" },
]

const ACCENT_IDS = ACCENT_COLORS.map(c => c.id)
const FONT_IDS = TITLE_FONTS.map(f => f.id)

function loadSaved(key: string, validValues: string[], fallback: string): string {
  if (typeof localStorage === 'undefined') return fallback
  const saved = localStorage.getItem(key)
  return saved && validValues.includes(saved) ? saved : fallback
}

export function useTheme() {
  const accentColor = ref(loadSaved('accent-color', ACCENT_IDS, 'mist-blue'))
  const titleFont = ref(loadSaved('title-font', FONT_IDS, 'noto-serif'))

  function applyAccent(id: string) {
    if (typeof document !== 'undefined') {
      if (id === 'mist-blue') {
        delete document.documentElement.dataset.accent
      } else {
        document.documentElement.dataset.accent = id
      }
    }
  }

  function applyFont(id: string) {
    if (typeof document !== 'undefined') {
      if (id === 'noto-serif') {
        delete document.documentElement.dataset.font
      } else {
        document.documentElement.dataset.font = id
      }
    }
  }

  function setAccentColor(id: string) {
    if (!ACCENT_IDS.includes(id)) return
    accentColor.value = id
    localStorage.setItem('accent-color', id)
    applyAccent(id)
  }

  function setTitleFont(id: string) {
    if (!FONT_IDS.includes(id)) return
    titleFont.value = id
    localStorage.setItem('title-font', id)
    applyFont(id)
  }

  // Apply on init
  applyAccent(accentColor.value)
  applyFont(titleFont.value)

  return {
    accentColor,
    titleFont,
    setAccentColor,
    setTitleFont,
    accentColors: ACCENT_COLORS,
    titleFonts: TITLE_FONTS,
  }
}
```

**Step 4: Run tests to verify they pass**

```bash
pnpm test composables/useTheme.spec.ts
```

Expected: All 7 tests pass.

**Step 5: Commit**

```bash
git add composables/useTheme.ts composables/useTheme.spec.ts
git commit -m "feat: add useTheme composable with accent color and font switching

TDD: 4 accent colors, 3 title fonts, localStorage persistence,
data-attribute driven CSS variables."
```

---

### Task 5: Content v3 Configuration + Sample Content

**Files:**
- Create: `content.config.ts`
- Create: `content/blog/2026-02-19-hello-world.md`
- Create: `content/blog/2026-02-10-second-post.md`
- Create: `content/blog/2026-01-20-third-post.md`
- Create: `content/works/mountain-sunrise.md`
- Create: `content/works/tokyo-night.md`
- Create: `content/works/old-street.md`
- Create: `public/images/placeholder.svg`

**Step 1: Create content.config.ts**

```typescript
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string(),
        updated: z.string().optional(),
        tags: z.array(z.string()).default([]),
        cover: z.string().optional(),
        draft: z.boolean().default(false),
        featured: z.boolean().default(false),
        readingTime: z.number().optional(),
      }),
    }),
    works: defineCollection({
      type: 'page',
      source: 'works/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string(),
        category: z.enum(['风光', '人文', '街头', '建筑']),
        series: z.string().optional(),
        image: z.string(),
        camera: z.string().optional(),
        lens: z.string().optional(),
        settings: z.object({
          aperture: z.string(),
          shutter: z.string(),
          iso: z.number(),
        }).optional(),
        location: z.string().optional(),
        featured: z.boolean().default(false),
      }),
    }),
  },
})
```

**Step 2: Create sample blog posts**

`content/blog/2026-02-19-hello-world.md`:
```markdown
---
title: "你好，世界"
description: "这是第一篇随笔，记录建站的心路历程。"
date: "2026-02-19"
tags: ["随笔", "建站"]
featured: true
readingTime: 3
---

这是第一篇随笔的正文内容。用于测试博客列表和详情页的渲染效果。

## 为什么要建一个个人网站

在社交媒体泛滥的时代，拥有一片自己的数字空间变得尤为珍贵。

## 技术选型

选择了 Nuxt 3 作为框架，Tailwind CSS 负责样式，@nuxt/content 管理内容。
```

`content/blog/2026-02-10-reading-notes.md`:
```markdown
---
title: "二月读书笔记"
description: "这个月读完的几本书，简单记录一些想法。"
date: "2026-02-10"
tags: ["阅读", "随笔"]
readingTime: 5
---

二月的阅读笔记正文内容。
```

`content/blog/2026-01-20-winter-thoughts.md`:
```markdown
---
title: "冬日碎语"
description: "寒冬里的一些零散思绪。"
date: "2026-01-20"
tags: ["随笔", "生活"]
readingTime: 4
---

冬日碎语的正文内容。
```

**Step 3: Create sample works entries**

`content/works/mountain-sunrise.md`:
```markdown
---
title: "山巅日出"
description: "在海拔3000米的营地等待的第一缕阳光"
date: "2026-01-15"
category: "风光"
image: "/images/placeholder.svg"
camera: "Sony A7R IV"
lens: "FE 16-35mm f/2.8 GM"
settings:
  aperture: "f/8"
  shutter: "1/125s"
  iso: 100
location: "四川·贡嘎山"
featured: true
---
```

`content/works/tokyo-night.md`:
```markdown
---
title: "东京夜色"
description: "霓虹灯下的城市脉搏"
date: "2026-01-10"
category: "街头"
image: "/images/placeholder.svg"
location: "东京·新宿"
featured: true
---
```

`content/works/old-street.md`:
```markdown
---
title: "老街日常"
description: "巷弄间的生活气息"
date: "2025-12-20"
category: "人文"
image: "/images/placeholder.svg"
location: "成都·宽窄巷子"
---
```

**Step 4: Create placeholder image**

```svg
<!-- public/images/placeholder.svg -->
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <rect fill="#e7e5e4" width="1200" height="800"/>
  <text fill="#a8a29e" font-family="sans-serif" font-size="24" text-anchor="middle" x="600" y="408">Placeholder Image</text>
</svg>
```

**Step 5: Verify content loads**

```bash
pnpm dev
```

Check that dev server starts without content schema errors.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Content v3 collections config and sample content

Blog and works collections with Zod schemas. Three sample blog posts,
three sample works entries, placeholder image."
```

---

### Task 6: AppFooter Component (TDD)

**Files:**
- Test: `components/layout/AppFooter.spec.ts`
- Create: `components/layout/AppFooter.vue`

**Step 1: Write the failing test**

```typescript
// components/layout/AppFooter.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppFooter from './AppFooter.vue'

describe('AppFooter', () => {
  it('renders copyright with current year', () => {
    const wrapper = mount(AppFooter)
    const year = new Date().getFullYear()
    expect(wrapper.text()).toContain(`${year}`)
  })

  it('renders social links', () => {
    const wrapper = mount(AppFooter)
    const links = wrapper.findAll('a[target="_blank"]')
    expect(links.length).toBeGreaterThan(0)
  })
})
```

**Step 2: Run test to verify it fails**

```bash
pnpm test components/layout/AppFooter.spec.ts
```

Expected: FAIL — module not found.

**Step 3: Implement AppFooter**

```vue
<!-- components/layout/AppFooter.vue -->
<template>
  <footer class="border-t border-stone-200 dark:border-stone-800 py-12 mt-20">
    <div class="max-w-7xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p class="text-sm text-stone-500 dark:text-stone-400">
        &copy; {{ new Date().getFullYear() }} Your Name. All rights reserved.
      </p>
      <div class="flex items-center gap-4">
        <a
          v-for="link in socialLinks"
          :key="link.href"
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          class="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
          :aria-label="link.label"
        >
          <Icon :name="link.icon" class="w-5 h-5" />
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const socialLinks = [
  { href: 'https://github.com/yourname', icon: 'ph:github-logo', label: 'GitHub' },
  { href: 'https://twitter.com/yourname', icon: 'ph:twitter-logo', label: 'Twitter' },
  { href: 'mailto:hello@example.com', icon: 'ph:envelope', label: 'Email' },
]
</script>
```

**Step 4: Run tests to verify they pass**

```bash
pnpm test components/layout/AppFooter.spec.ts
```

Expected: 2 tests pass.

Note: If the `Icon` component causes issues in tests, stub it:
```typescript
mount(AppFooter, {
  global: {
    stubs: { Icon: true },
  },
})
```

**Step 5: Commit**

```bash
git add components/layout/AppFooter.vue components/layout/AppFooter.spec.ts
git commit -m "feat: add AppFooter component with social links

TDD: copyright year, social link rendering."
```

---

### Task 7: AppHeader Component (TDD)

**Files:**
- Test: `components/layout/AppHeader.spec.ts`
- Create: `components/layout/AppHeader.vue`

**Step 1: Write the failing tests**

```typescript
// components/layout/AppHeader.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AppHeader from './AppHeader.vue'

const stubs = {
  NuxtLink: { template: '<a :href="to"><slot /></a>', props: ['to'] },
  Icon: { template: '<span />', props: ['name'] },
}

describe('AppHeader', () => {
  it('renders site name', () => {
    const wrapper = mount(AppHeader, { global: { stubs } })
    expect(wrapper.text()).toContain('Your Name')
  })

  it('renders navigation links', () => {
    const wrapper = mount(AppHeader, { global: { stubs } })
    const links = wrapper.findAll('a')
    const hrefs = links.map(l => l.attributes('href'))
    expect(hrefs).toContain('/')
    expect(hrefs).toContain('/blog')
    expect(hrefs).toContain('/works')
    expect(hrefs).toContain('/about')
  })

  it('toggles mobile menu on button click', async () => {
    const wrapper = mount(AppHeader, { global: { stubs } })
    const menuButton = wrapper.find('[data-test="mobile-menu-button"]')
    expect(wrapper.find('[data-test="mobile-menu"]').exists()).toBe(false)
    await menuButton.trigger('click')
    expect(wrapper.find('[data-test="mobile-menu"]').exists()).toBe(true)
  })

  it('applies frosted glass class when scrolled prop is true', () => {
    const wrapper = mount(AppHeader, {
      props: { scrolled: true },
      global: { stubs },
    })
    expect(wrapper.find('header').classes()).toContain('backdrop-blur-md')
  })

  it('emits open-settings when settings button clicked', async () => {
    const wrapper = mount(AppHeader, { global: { stubs } })
    const settingsBtn = wrapper.find('[data-test="settings-button"]')
    await settingsBtn.trigger('click')
    expect(wrapper.emitted('open-settings')).toHaveLength(1)
  })
})
```

**Step 2: Run test to verify it fails**

```bash
pnpm test components/layout/AppHeader.spec.ts
```

**Step 3: Implement AppHeader**

```vue
<!-- components/layout/AppHeader.vue -->
<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled
        ? 'bg-white/90 dark:bg-stone-950/90 backdrop-blur-md shadow-sm'
        : 'bg-transparent',
    ]"
  >
    <nav class="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
      <NuxtLink to="/" class="text-xl font-bold tracking-tight" style="font-family: var(--font-title)">
        Your Name
      </NuxtLink>

      <!-- Desktop nav -->
      <div class="hidden md:flex items-center gap-8">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors relative group"
        >
          {{ link.label }}
          <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent-500 transition-all group-hover:w-full" />
        </NuxtLink>
        <button
          data-test="settings-button"
          class="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          @click="$emit('open-settings')"
        >
          <Icon name="ph:gear" class="w-5 h-5" />
        </button>
      </div>

      <!-- Mobile menu button -->
      <button
        class="md:hidden p-2"
        data-test="mobile-menu-button"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
      >
        <Icon :name="isMobileMenuOpen ? 'ph:x' : 'ph:list'" class="w-6 h-6" />
      </button>
    </nav>

    <!-- Mobile dropdown -->
    <div
      v-if="isMobileMenuOpen"
      data-test="mobile-menu"
      class="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 shadow-lg"
    >
      <div class="px-6 py-4 space-y-1">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="block py-3 text-lg font-medium"
          @click="isMobileMenuOpen = false"
        >
          {{ link.label }}
        </NuxtLink>
        <button
          class="w-full text-left py-3 text-lg font-medium"
          data-test="settings-button"
          @click="$emit('open-settings'); isMobileMenuOpen = false"
        >
          设置
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{ scrolled?: boolean }>()
defineEmits<{ 'open-settings': [] }>()

const isMobileMenuOpen = ref(false)

const navLinks = [
  { to: '/', label: '首页' },
  { to: '/blog', label: '随笔' },
  { to: '/works', label: '作品' },
  { to: '/about', label: '关于' },
]
</script>
```

**Step 4: Run tests**

```bash
pnpm test components/layout/AppHeader.spec.ts
```

Expected: All 5 tests pass.

**Step 5: Commit**

```bash
git add components/layout/AppHeader.vue components/layout/AppHeader.spec.ts
git commit -m "feat: add AppHeader with desktop nav, mobile menu, settings trigger

TDD: nav links, mobile toggle, scroll frost, settings emit."
```

---

### Task 8: SettingsDrawer Component (TDD)

**Files:**
- Test: `components/layout/SettingsDrawer.spec.ts`
- Create: `components/layout/SettingsDrawer.vue`

**Step 1: Write the failing tests**

```typescript
// components/layout/SettingsDrawer.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SettingsDrawer from './SettingsDrawer.vue'

const stubs = { Icon: { template: '<span />', props: ['name'] } }

const mockSetAccentColor = vi.fn()
const mockSetTitleFont = vi.fn()

vi.mock('~/composables/useTheme', () => ({
  useTheme: () => ({
    accentColor: { value: 'mist-blue' },
    titleFont: { value: 'noto-serif' },
    setAccentColor: mockSetAccentColor,
    setTitleFont: mockSetTitleFont,
    accentColors: [
      { id: 'mist-blue', label: '雾霾蓝', color: '#7C9CB5' },
      { id: 'bean-green', label: '豆沙绿', color: '#8FA395' },
      { id: 'lotus-pink', label: '藕荷粉', color: '#B8A9A1' },
      { id: 'desert-camel', label: '淡漠驼', color: '#A89F91' },
    ],
    titleFonts: [
      { id: 'noto-serif', label: 'Noto Serif SC', family: '' },
      { id: 'lxgw-wenkai', label: '霞鹜文楷', family: '' },
      { id: 'system', label: '系统字体', family: '' },
    ],
  }),
  ACCENT_COLORS: [],
  TITLE_FONTS: [],
}))

describe('SettingsDrawer', () => {
  it('is hidden when modelValue is false', () => {
    const wrapper = mount(SettingsDrawer, {
      props: { modelValue: false },
      global: { stubs },
    })
    expect(wrapper.find('[data-test="drawer-panel"]').exists()).toBe(false)
  })

  it('is visible when modelValue is true', () => {
    const wrapper = mount(SettingsDrawer, {
      props: { modelValue: true },
      global: { stubs },
    })
    expect(wrapper.find('[data-test="drawer-panel"]').exists()).toBe(true)
  })

  it('renders four accent color buttons', () => {
    const wrapper = mount(SettingsDrawer, {
      props: { modelValue: true },
      global: { stubs },
    })
    const colorButtons = wrapper.findAll('[data-test="accent-color-button"]')
    expect(colorButtons).toHaveLength(4)
  })

  it('calls setAccentColor when accent button clicked', async () => {
    const wrapper = mount(SettingsDrawer, {
      props: { modelValue: true },
      global: { stubs },
    })
    const buttons = wrapper.findAll('[data-test="accent-color-button"]')
    await buttons[1].trigger('click')
    expect(mockSetAccentColor).toHaveBeenCalledWith('bean-green')
  })

  it('renders three font buttons', () => {
    const wrapper = mount(SettingsDrawer, {
      props: { modelValue: true },
      global: { stubs },
    })
    const fontButtons = wrapper.findAll('[data-test="font-button"]')
    expect(fontButtons).toHaveLength(3)
  })

  it('calls setTitleFont when font button clicked', async () => {
    const wrapper = mount(SettingsDrawer, {
      props: { modelValue: true },
      global: { stubs },
    })
    const buttons = wrapper.findAll('[data-test="font-button"]')
    await buttons[1].trigger('click')
    expect(mockSetTitleFont).toHaveBeenCalledWith('lxgw-wenkai')
  })

  it('emits close when overlay clicked', async () => {
    const wrapper = mount(SettingsDrawer, {
      props: { modelValue: true },
      global: { stubs },
    })
    await wrapper.find('[data-test="drawer-overlay"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })
})
```

**Step 2: Run test to verify it fails**

```bash
pnpm test components/layout/SettingsDrawer.spec.ts
```

**Step 3: Implement SettingsDrawer**

```vue
<!-- components/layout/SettingsDrawer.vue -->
<template>
  <Teleport to="body">
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
  </Teleport>
</template>

<script setup lang="ts">
import { useTheme } from '~/composables/useTheme'

defineProps<{ modelValue: boolean }>()
defineEmits<{ 'update:modelValue': [value: boolean] }>()

const colorMode = useColorMode()
const theme = useTheme()
</script>
```

**Step 4: Run tests**

```bash
pnpm test components/layout/SettingsDrawer.spec.ts
```

Expected: All 7 tests pass.

**Step 5: Commit**

```bash
git add components/layout/SettingsDrawer.vue components/layout/SettingsDrawer.spec.ts
git commit -m "feat: add SettingsDrawer with color mode, accent, and font switching

TDD: drawer visibility, accent/font selection, overlay close."
```

---

### Task 9: Default Layout

**Files:**
- Create: `layouts/default.vue`
- Remove: `app.vue` (temporary test file from Task 2)

**Step 1: Create default layout**

```vue
<!-- layouts/default.vue -->
<template>
  <div class="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-300">
    <AppHeader :scrolled="isScrolled" @open-settings="isSettingsOpen = true" />
    <main class="pt-16">
      <slot />
    </main>
    <AppFooter />
    <SettingsDrawer v-model="isSettingsOpen" />
  </div>
</template>

<script setup lang="ts">
const isScrolled = ref(false)
const isSettingsOpen = ref(false)

onMounted(() => {
  const onScroll = () => {
    isScrolled.value = window.scrollY > 50
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', onScroll))
})
</script>
```

**Step 2: Update app.vue to use layout**

```vue
<!-- app.vue -->
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

**Step 3: Create a minimal index page to test**

```vue
<!-- pages/index.vue -->
<template>
  <div class="max-w-7xl mx-auto px-6 md:px-12 py-20">
    <h1 class="text-4xl font-bold" style="font-family: var(--font-title)">首页占位</h1>
    <p class="mt-4 text-stone-600 dark:text-stone-400">布局系统正常工作。</p>
  </div>
</template>
```

**Step 4: Verify in browser**

```bash
pnpm dev
```

Check: header renders, scrolling adds frost, settings drawer opens, accent color and font switching works.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add default layout with header, footer, settings drawer

Scroll-aware header, settings drawer integration, theme switching."
```

---

### Task 10: ArticleCard Component (TDD)

**Files:**
- Test: `components/ui/ArticleCard.spec.ts`
- Create: `components/ui/ArticleCard.vue`

**Step 1: Write the failing tests**

```typescript
// components/ui/ArticleCard.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ArticleCard from './ArticleCard.vue'

const stubs = {
  NuxtLink: { template: '<a :href="to"><slot /></a>', props: ['to'] },
  NuxtImg: { template: '<img :src="src" :alt="alt" />', props: ['src', 'alt'] },
}

const post = {
  _path: '/blog/hello-world',
  title: '你好，世界',
  description: '第一篇随笔',
  date: '2026-02-19',
  tags: ['随笔', '建站'],
  cover: '/images/placeholder.svg',
}

describe('ArticleCard', () => {
  it('renders title', () => {
    const wrapper = mount(ArticleCard, {
      props: { post },
      global: { stubs },
    })
    expect(wrapper.text()).toContain('你好，世界')
  })

  it('renders description', () => {
    const wrapper = mount(ArticleCard, {
      props: { post },
      global: { stubs },
    })
    expect(wrapper.text()).toContain('第一篇随笔')
  })

  it('renders formatted date in zh-CN', () => {
    const wrapper = mount(ArticleCard, {
      props: { post },
      global: { stubs },
    })
    // Should contain "2026" at minimum
    expect(wrapper.text()).toContain('2026')
  })

  it('renders tags', () => {
    const wrapper = mount(ArticleCard, {
      props: { post },
      global: { stubs },
    })
    expect(wrapper.text()).toContain('随笔')
    expect(wrapper.text()).toContain('建站')
  })

  it('links to post path', () => {
    const wrapper = mount(ArticleCard, {
      props: { post },
      global: { stubs },
    })
    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('/blog/hello-world')
  })

  it('renders cover image when provided', () => {
    const wrapper = mount(ArticleCard, {
      props: { post },
      global: { stubs },
    })
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/images/placeholder.svg')
  })

  it('hides cover image when not provided', () => {
    const noCoverPost = { ...post, cover: undefined }
    const wrapper = mount(ArticleCard, {
      props: { post: noCoverPost },
      global: { stubs },
    })
    expect(wrapper.find('img').exists()).toBe(false)
  })
})
```

**Step 2: Run test to verify it fails**

```bash
pnpm test components/ui/ArticleCard.spec.ts
```

**Step 3: Implement ArticleCard**

```vue
<!-- components/ui/ArticleCard.vue -->
<template>
  <article class="group">
    <NuxtLink :to="post._path" class="block">
      <div
        v-if="post.cover"
        class="aspect-[16/10] overflow-hidden rounded-xl mb-5 bg-stone-100 dark:bg-stone-800"
      >
        <NuxtImg
          :src="post.cover"
          :alt="post.title"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div class="space-y-3">
        <div class="flex items-center gap-3 text-sm text-stone-500 dark:text-stone-400">
          <time>{{ formatDate(post.date) }}</time>
          <span v-if="post.tags?.length" class="flex gap-2">
            <span
              v-for="tag in post.tags.slice(0, 2)"
              :key="tag"
              class="text-accent-600 dark:text-accent-400"
            >
              #{{ tag }}
            </span>
          </span>
        </div>

        <h3 class="text-xl font-bold group-hover:text-accent-500 transition-colors leading-tight">
          {{ post.title }}
        </h3>

        <p
          v-if="post.description"
          class="text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed"
        >
          {{ post.description }}
        </p>
      </div>
    </NuxtLink>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  post: {
    _path: string
    title: string
    description?: string
    date: string
    tags?: string[]
    cover?: string
  }
}>()

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>
```

**Step 4: Run tests**

```bash
pnpm test components/ui/ArticleCard.spec.ts
```

Expected: All 7 tests pass.

**Step 5: Commit**

```bash
git add components/ui/ArticleCard.vue components/ui/ArticleCard.spec.ts
git commit -m "feat: add ArticleCard component

TDD: title, description, date, tags, cover image, link."
```

---

### Task 11: Blog List Page

**Files:**
- Create: `pages/blog/index.vue`

**Step 1: Implement blog list page**

```vue
<!-- pages/blog/index.vue -->
<template>
  <div class="max-w-7xl mx-auto px-6 md:px-12 py-12">
    <!-- Header -->
    <div class="mb-12">
      <h1 class="text-3xl md:text-4xl font-bold mb-4" style="font-family: var(--font-title)">
        生活随笔
      </h1>
      <p class="text-stone-600 dark:text-stone-400 max-w-2xl">
        记录日常思考、阅读笔记与生活观察。
      </p>
    </div>

    <!-- Tag Filter -->
    <div v-if="allTags.length" class="flex flex-wrap gap-2 mb-10">
      <button
        v-for="tag in allTags"
        :key="tag"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium transition',
          selectedTag === tag
            ? 'bg-accent-500 text-white'
            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700',
        ]"
        @click="selectedTag = selectedTag === tag ? null : tag"
      >
        {{ tag }}
      </button>
    </div>

    <!-- Post Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <ArticleCard
        v-for="post in visiblePosts"
        :key="post._path"
        :post="post"
      />
    </div>

    <!-- Empty State -->
    <div v-if="!visiblePosts.length" class="text-center py-20 text-stone-400">
      暂无文章
    </div>

    <!-- Load More -->
    <div v-if="hasMore" class="mt-16 text-center">
      <button
        class="px-8 py-3 border border-stone-300 dark:border-stone-700 rounded-full font-medium hover:bg-stone-100 dark:hover:bg-stone-800 transition"
        @click="page++"
      >
        加载更多
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const selectedTag = ref<string | null>(null)
const page = ref(1)
const pageSize = 9

const { data: allPosts } = await useAsyncData('blog-posts', () =>
  queryCollection('blog')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .all()
)

const allTags = computed(() => {
  const tags = new Set<string>()
  allPosts.value?.forEach(post => post.tags?.forEach((tag: string) => tags.add(tag)))
  return Array.from(tags).sort()
})

const filteredPosts = computed(() => {
  let posts = allPosts.value || []
  if (selectedTag.value) {
    posts = posts.filter(post => post.tags?.includes(selectedTag.value!))
  }
  return posts
})

const visiblePosts = computed(() =>
  filteredPosts.value.slice(0, page.value * pageSize)
)

const hasMore = computed(() =>
  visiblePosts.value.length < filteredPosts.value.length
)

// Reset page when filter changes
watch(selectedTag, () => { page.value = 1 })

useHead({ title: '生活随笔' })
</script>
```

**Step 2: Verify in browser**

```bash
pnpm dev
```

Navigate to `/blog`. Check: sample posts render in cards, tags show, filtering works.

**Step 3: Commit**

```bash
git add pages/blog/index.vue
git commit -m "feat: add blog list page with tag filter and load more"
```

---

### Task 12: Blog Layout + Detail Page

**Files:**
- Create: `layouts/blog.vue`
- Create: `pages/blog/[...slug].vue`

**Step 1: Create blog layout**

```vue
<!-- layouts/blog.vue -->
<template>
  <div class="min-h-screen bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-300">
    <AppHeader :scrolled="isScrolled" @open-settings="isSettingsOpen = true" />
    <div class="max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-12 grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-12">
      <main class="max-w-2xl">
        <slot />
      </main>
      <aside class="hidden lg:block">
        <slot name="sidebar" />
      </aside>
    </div>
    <AppFooter />
    <SettingsDrawer v-model="isSettingsOpen" />
  </div>
</template>

<script setup lang="ts">
const isScrolled = ref(false)
const isSettingsOpen = ref(false)

onMounted(() => {
  const onScroll = () => { isScrolled.value = window.scrollY > 50 }
  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', onScroll))
})
</script>
```

**Step 2: Create blog detail page**

```vue
<!-- pages/blog/[...slug].vue -->
<template>
  <div>
    <article v-if="article">
      <!-- Header -->
      <header class="mb-10">
        <div class="flex items-center gap-3 text-sm text-stone-500 dark:text-stone-400 mb-4">
          <time>{{ formatDate(article.date) }}</time>
          <span v-if="article.readingTime">&middot; {{ article.readingTime }} 分钟阅读</span>
        </div>

        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight" style="font-family: var(--font-title)">
          {{ article.title }}
        </h1>

        <p v-if="article.description" class="text-lg text-stone-600 dark:text-stone-400 leading-relaxed">
          {{ article.description }}
        </p>

        <div v-if="article.tags?.length" class="flex flex-wrap gap-2 mt-6">
          <NuxtLink
            v-for="tag in article.tags"
            :key="tag"
            :to="`/blog?tag=${tag}`"
            class="px-3 py-1 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 rounded-full text-sm hover:bg-stone-200 dark:hover:bg-stone-700 transition"
          >
            {{ tag }}
          </NuxtLink>
        </div>
      </header>

      <!-- Cover Image -->
      <div v-if="article.cover" class="mb-10 -mx-6 md:mx-0">
        <NuxtImg
          :src="article.cover"
          :alt="article.title"
          class="w-full aspect-[16/9] object-cover rounded-xl"
        />
      </div>

      <!-- Content -->
      <div class="prose prose-lg dark:prose-invert max-w-none prose-stone">
        <ContentRenderer :value="article" />
      </div>

      <!-- Footer -->
      <footer class="mt-16 pt-10 border-t border-stone-200 dark:border-stone-800">
        <div v-if="relatedPosts?.length" class="mb-10">
          <h3 class="text-lg font-bold mb-4">相关文章</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ArticleCard
              v-for="post in relatedPosts"
              :key="post._path"
              :post="post"
            />
          </div>
        </div>

        <NuxtLink
          to="/blog"
          class="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition flex items-center gap-2"
        >
          <Icon name="ph:arrow-left" class="w-4 h-4" />
          返回列表
        </NuxtLink>
      </footer>
    </article>

    <!-- TOC in sidebar slot -->
    <template #sidebar>
      <nav v-if="article?.body?.toc?.links?.length" class="sticky top-24">
        <h4 class="text-sm font-medium text-stone-500 dark:text-stone-400 mb-4">目录</h4>
        <ul class="space-y-2 text-sm">
          <li v-for="link in article.body.toc.links" :key="link.id">
            <a
              :href="`#${link.id}`"
              class="text-stone-500 hover:text-accent-500 transition-colors"
            >
              {{ link.text }}
            </a>
          </li>
        </ul>
      </nav>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'blog' })

const route = useRoute()
const slug = (route.params.slug as string[]).join('/')

const { data: article } = await useAsyncData(`blog-${slug}`, () =>
  queryCollection('blog').path(`/blog/${slug}`).first()
)

if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: '文章未找到' })
}

// Related posts: same first tag, exclude current
const firstTag = article.value.tags?.[0]
const { data: relatedPosts } = await useAsyncData(`related-${slug}`, async () => {
  if (!firstTag) return []
  const posts = await queryCollection('blog')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .all()
  return posts
    .filter(p => p._path !== article.value!._path && p.tags?.includes(firstTag))
    .slice(0, 2)
})

useHead({
  title: article.value.title,
  meta: [
    { name: 'description', content: article.value.description },
    { property: 'og:title', content: article.value.title },
    { property: 'og:description', content: article.value.description },
  ],
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>
```

**Step 3: Verify in browser**

Navigate to `/blog`, click a post. Check: article renders, TOC sidebar shows, related posts appear.

**Step 4: Commit**

```bash
git add layouts/blog.vue pages/blog/\\[...slug\\].vue
git commit -m "feat: add blog layout and detail page

Sidebar TOC, related posts, cover image, SEO meta tags."
```

---

### Task 13: Photography Gallery + PhotoSwipe

**Files:**
- Create: `components/ui/PhotoLightbox.vue`
- Create: `pages/works/index.vue`

**Step 1: Create PhotoSwipe lightbox wrapper**

```vue
<!-- components/ui/PhotoLightbox.vue -->
<template>
  <div ref="galleryRef" />
</template>

<script setup lang="ts">
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
```

**Step 2: Create photography gallery page**

```vue
<!-- pages/works/index.vue -->
<template>
  <div class="max-w-7xl mx-auto px-6 md:px-12 py-12">
    <!-- Header -->
    <div class="mb-12">
      <h1 class="text-3xl md:text-4xl font-bold mb-4" style="font-family: var(--font-title)">
        摄影作品
      </h1>
      <p class="text-stone-600 dark:text-stone-400 max-w-2xl">
        用镜头捕捉光影与瞬间。
      </p>
    </div>

    <!-- Category Filter -->
    <div class="flex flex-wrap gap-2 mb-10">
      <button
        v-for="cat in categories"
        :key="cat"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium transition',
          selectedCategory === cat
            ? 'bg-accent-500 text-white'
            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700',
        ]"
        @click="selectedCategory = selectedCategory === cat ? '全部' : cat"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Masonry Grid -->
    <div class="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
      <div
        v-for="(photo, idx) in filteredPhotos"
        :key="photo._path"
        class="break-inside-avoid group relative overflow-hidden rounded-xl cursor-pointer"
        @click="openLightbox(idx)"
      >
        <NuxtImg
          :src="photo.image"
          :alt="photo.title"
          class="w-full transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          sizes="sm:100vw md:50vw lg:33vw"
        />

        <!-- Hover Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
          <h3 class="text-white font-bold text-lg">{{ photo.title }}</h3>
          <p v-if="photo.location" class="text-white/80 text-sm">{{ photo.location }}</p>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!filteredPhotos.length" class="text-center py-20 text-stone-400">
      暂无作品
    </div>

    <!-- Lightbox -->
    <ClientOnly>
      <PhotoLightbox
        v-if="lightboxData.length"
        :images="lightboxData"
        :index="lightboxIndex"
        :open="lightboxOpen"
        @close="lightboxOpen = false"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
const selectedCategory = ref('全部')
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)

const categories = ['全部', '风光', '人文', '街头', '建筑']

const { data: photos } = await useAsyncData('works', () =>
  queryCollection('works')
    .order('date', 'DESC')
    .all()
)

const filteredPhotos = computed(() => {
  if (selectedCategory.value === '全部') return photos.value || []
  return (photos.value || []).filter(p => p.category === selectedCategory.value)
})

const lightboxData = computed(() =>
  filteredPhotos.value.map(p => ({
    src: p.image,
    title: p.title,
    caption: [p.camera, p.lens, p.location].filter(Boolean).join(' · '),
  }))
)

function openLightbox(idx: number) {
  lightboxIndex.value = idx
  lightboxOpen.value = true
}

useHead({ title: '摄影作品' })
</script>
```

**Step 3: Verify in browser**

Navigate to `/works`. Check: masonry layout, category filter, click opens PhotoSwipe lightbox.

**Step 4: Commit**

```bash
git add components/ui/PhotoLightbox.vue pages/works/index.vue
git commit -m "feat: add photography gallery with masonry layout and PhotoSwipe lightbox

Category filter, hover overlay, EXIF caption in lightbox."
```

---

### Task 14: Homepage

**Files:**
- Modify: `pages/index.vue`

**Step 1: Implement full homepage**

```vue
<!-- pages/index.vue -->
<template>
  <div>
    <!-- Hero -->
    <section class="min-h-[80vh] flex items-center justify-center relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-stone-100 via-stone-50 to-accent-50/30 dark:from-stone-950 dark:via-stone-900 dark:to-accent-950/20" />
      <div class="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <h1
          class="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight"
          style="font-family: var(--font-title)"
        >
          记录生活，<br />
          <span class="text-stone-500 dark:text-stone-400">分享思考</span>
        </h1>
        <p class="text-lg md:text-xl text-stone-600 dark:text-stone-400 mb-10 max-w-xl mx-auto leading-relaxed">
          一个关于技术、旅行与摄影的个人空间。用文字沉淀思想，用镜头捕捉瞬间。
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/blog"
            class="px-8 py-4 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-full font-medium hover:scale-105 transition-transform"
          >
            阅读随笔
          </NuxtLink>
          <NuxtLink
            to="/works"
            class="px-8 py-4 border border-stone-300 dark:border-stone-700 rounded-full font-medium hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            浏览作品
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Latest Posts -->
    <section class="py-20 md:py-32">
      <div class="max-w-7xl mx-auto px-6 md:px-12">
        <div class="flex items-center justify-between mb-12">
          <h2 class="text-2xl md:text-3xl font-bold" style="font-family: var(--font-title)">
            最新文章
          </h2>
          <NuxtLink
            to="/blog"
            class="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition flex items-center gap-1"
          >
            查看全部 <Icon name="ph:arrow-right" class="w-4 h-4" />
          </NuxtLink>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ArticleCard
            v-for="post in latestPosts"
            :key="post._path"
            :post="post"
          />
        </div>
      </div>
    </section>

    <!-- Featured Photos -->
    <section v-if="featuredPhotos?.length" class="py-20 md:py-32 bg-stone-100 dark:bg-stone-900">
      <div class="max-w-7xl mx-auto px-6 md:px-12">
        <div class="flex items-center justify-between mb-12">
          <h2 class="text-2xl md:text-3xl font-bold" style="font-family: var(--font-title)">
            摄影精选
          </h2>
          <NuxtLink
            to="/works"
            class="text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition flex items-center gap-1"
          >
            查看全部 <Icon name="ph:arrow-right" class="w-4 h-4" />
          </NuxtLink>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="photo in featuredPhotos"
            :key="photo._path"
            to="/works"
            class="group relative aspect-[4/3] overflow-hidden rounded-xl bg-stone-200 dark:bg-stone-800"
          >
            <NuxtImg
              :src="photo.image"
              :alt="photo.title"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <span class="text-white font-medium">{{ photo.title }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- About Preview -->
    <section class="py-20 md:py-32">
      <div class="max-w-4xl mx-auto px-6 md:px-12 text-center">
        <div class="w-28 h-28 rounded-full mx-auto mb-8 bg-stone-200 dark:bg-stone-700 flex items-center justify-center">
          <Icon name="ph:user" class="w-12 h-12 text-stone-400" />
        </div>
        <h2 class="text-2xl md:text-3xl font-bold mb-4" style="font-family: var(--font-title)">
          关于我
        </h2>
        <p class="text-stone-600 dark:text-stone-400 mb-8 max-w-2xl mx-auto leading-relaxed text-lg">
          热爱探索技术与设计的交叉点。相信好的代码应当像好的文字一样——清晰、优雅、有表达力。
        </p>
        <NuxtLink
          to="/about"
          class="text-accent-500 hover:text-accent-600 transition font-medium"
        >
          了解更多 &rarr;
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { data: latestPosts } = await useAsyncData('home-posts', () =>
  queryCollection('blog')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .limit(3)
    .all()
)

const { data: featuredPhotos } = await useAsyncData('home-photos', () =>
  queryCollection('works')
    .where('featured', '=', true)
    .order('date', 'DESC')
    .limit(3)
    .all()
)

useHead({
  title: 'Your Name — 记录生活，分享思考',
  meta: [
    { name: 'description', content: '一个关于技术、旅行与摄影的个人空间' },
  ],
})
</script>
```

**Step 2: Verify in browser**

Check: hero, latest posts, featured photos, about preview all render. Responsive layout works.

**Step 3: Commit**

```bash
git add pages/index.vue
git commit -m "feat: add homepage with hero, latest posts, featured photos, about preview"
```

---

### Task 15: About Page

**Files:**
- Create: `pages/about.vue`

**Step 1: Implement about page**

```vue
<!-- pages/about.vue -->
<template>
  <div class="max-w-3xl mx-auto px-6 md:px-12 py-20">
    <div class="text-center mb-16">
      <div class="w-32 h-32 rounded-full mx-auto mb-8 bg-stone-200 dark:bg-stone-700 flex items-center justify-center">
        <Icon name="ph:user" class="w-16 h-16 text-stone-400" />
      </div>
      <h1 class="text-3xl md:text-4xl font-bold mb-4" style="font-family: var(--font-title)">
        Your Name
      </h1>
      <p class="text-lg text-stone-600 dark:text-stone-400 leading-relaxed max-w-xl mx-auto">
        开发者 / 摄影爱好者 / 旅行者
      </p>
    </div>

    <div class="prose prose-lg dark:prose-invert prose-stone max-w-none mb-16">
      <p>
        你好，欢迎来到我的个人空间。这里记录着日常的思考、旅途的见闻、镜头捕捉的瞬间，以及技术探索的心得。
      </p>
      <p>
        我相信，记录是一种与时间对话的方式。文字赋予思想形状，照片定格光影片刻，而代码则构建连接人与世界的桥梁。
      </p>
    </div>

    <!-- Social Links -->
    <div class="flex justify-center gap-4">
      <a
        v-for="link in socialLinks"
        :key="link.href"
        :href="link.href"
        target="_blank"
        rel="noopener noreferrer"
        class="p-4 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 transition"
        :aria-label="link.label"
      >
        <Icon :name="link.icon" class="w-5 h-5" />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
const socialLinks = [
  { href: 'https://github.com/yourname', icon: 'ph:github-logo', label: 'GitHub' },
  { href: 'https://twitter.com/yourname', icon: 'ph:twitter-logo', label: 'Twitter' },
  { href: 'mailto:hello@example.com', icon: 'ph:envelope', label: 'Email' },
]

useHead({
  title: '关于',
  meta: [{ name: 'description', content: '关于我的个人介绍' }],
})
</script>
```

**Step 2: Verify in browser**

**Step 3: Commit**

```bash
git add pages/about.vue
git commit -m "feat: add about page with placeholder content and social links"
```

---

### Task 16: Polish + Build Verification

**Files:**
- Possibly adjust various files based on build issues

**Step 1: Run all tests**

```bash
pnpm test
```

Expected: All tests pass.

**Step 2: Test dev server**

```bash
pnpm dev
```

Navigate through all pages: `/`, `/blog`, `/blog/hello-world`, `/works`, `/about`. Verify settings drawer works (accent colors, fonts, dark mode).

**Step 3: Test static generation**

```bash
pnpm generate
```

Expected: Build succeeds, output in `.output/public`.

**Step 4: Preview generated site**

```bash
npx serve .output/public
```

Navigate through all pages, verify static files work correctly.

**Step 5: Fix any build issues**

Address any errors from generate step. Common issues:
- Content queries failing at build time
- Missing `<ClientOnly>` around PhotoSwipe
- Image paths not resolving

**Step 6: Final commit**

```bash
git add -A
git commit -m "fix: resolve build issues and verify static generation"
```

---

## Task Summary

| # | Task | Type |
|---|------|------|
| 1 | Project Initialization | Setup |
| 2 | Tailwind CSS v4 + Design Tokens | Setup |
| 3 | Vitest + Testing Infrastructure | Setup |
| 4 | useTheme Composable | TDD |
| 5 | Content v3 Config + Sample Content | Setup |
| 6 | AppFooter Component | TDD |
| 7 | AppHeader Component | TDD |
| 8 | SettingsDrawer Component | TDD |
| 9 | Default Layout | Integration |
| 10 | ArticleCard Component | TDD |
| 11 | Blog List Page | Page |
| 12 | Blog Layout + Detail Page | Page |
| 13 | Photography Gallery + PhotoSwipe | Page |
| 14 | Homepage | Page |
| 15 | About Page | Page |
| 16 | Polish + Build Verification | Verification |
