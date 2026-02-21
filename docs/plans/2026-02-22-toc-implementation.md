# TOC 目录导航实现计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 为博客文章详情页添加目录导航——桌面端 sticky 右侧侧边栏，移动端文章顶部可折叠面板，滚动时自动高亮当前小节。

**Architecture:** `useTocActiveHeading` composable 用原生 IntersectionObserver 检测当前激活标题（从 'vue' 直接导入生命周期钩子），`BlogToc.vue` 纯展示组件渲染两级列表，`[...slug].vue` 组合两者并各自处理桌面/移动端布局。

**Tech Stack:** Vue 3 Composition API, IntersectionObserver, Tailwind CSS v4, @vue/test-utils, Vitest (happy-dom)

---

## 测试约定

- 测试文件与源文件同目录，命名 `Foo.spec.ts`
- 运行单文件：`npx vitest run app/composables/useTocActiveHeading.spec.ts`
- 全量：`npx vitest run`
- `describe`/`it`/`expect`/`vi` 无需 import（`globals: true`）
- 路径别名 `~` = `/app`
- 每个 task 完成后必须 commit

---

## Task 1：修复 blog.vue 布局，content 列居中

**Files:**
- Modify: `app/layouts/blog.vue:5`

### Step 1：修改

将 `<main class="max-w-2xl">` 改为：

```html
<main class="max-w-2xl mx-auto">
```

### Step 2：Commit

```bash
git add app/layouts/blog.vue
git commit -m "fix: center article content within blog layout grid"
```

---

## Task 2：创建 `useTocActiveHeading` composable

**Files:**
- Create: `app/composables/useTocActiveHeading.ts`
- Create: `app/composables/useTocActiveHeading.spec.ts`

### Step 1：写失败测试

```ts
// app/composables/useTocActiveHeading.spec.ts
import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { useTocActiveHeading } from '~/composables/useTocActiveHeading'

describe('useTocActiveHeading', () => {
  let observerCallback: IntersectionObserverCallback
  const mockObserver = { observe: vi.fn(), disconnect: vi.fn() }

  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', vi.fn((cb: IntersectionObserverCallback) => {
      observerCallback = cb
      return mockObserver
    }))
    vi.spyOn(document, 'getElementById').mockReturnValue(document.createElement('h2'))
    mockObserver.observe.mockClear()
    mockObserver.disconnect.mockClear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  function mountComposable(ids: string[]) {
    return mount(defineComponent({
      setup() {
        const idsRef = ref(ids)
        const activeId = useTocActiveHeading(idsRef)
        return { activeId }
      },
      template: '<div />',
    }))
  }

  it('初始 activeId 为空字符串', () => {
    const wrapper = mountComposable(['heading-1'])
    expect(wrapper.vm.activeId).toBe('')
  })

  it('标题进入视口时更新 activeId', () => {
    const wrapper = mountComposable(['heading-1', 'heading-2'])
    observerCallback(
      [{ isIntersecting: true, target: { id: 'heading-1' } } as IntersectionObserverEntry],
      mockObserver as unknown as IntersectionObserver,
    )
    expect(wrapper.vm.activeId).toBe('heading-1')
  })

  it('标题离开视口时不重置 activeId', () => {
    const wrapper = mountComposable(['heading-1'])
    observerCallback(
      [{ isIntersecting: true, target: { id: 'heading-1' } } as IntersectionObserverEntry],
      mockObserver as unknown as IntersectionObserver,
    )
    observerCallback(
      [{ isIntersecting: false, target: { id: 'heading-1' } } as IntersectionObserverEntry],
      mockObserver as unknown as IntersectionObserver,
    )
    expect(wrapper.vm.activeId).toBe('heading-1')
  })

  it('挂载时为每个 id 调用 observer.observe', () => {
    mountComposable(['h1', 'h2', 'h3'])
    expect(mockObserver.observe).toHaveBeenCalledTimes(3)
  })

  it('ids 为空时不创建 observer', () => {
    mountComposable([])
    expect(mockObserver.observe).not.toHaveBeenCalled()
  })
})
```

### Step 2：运行测试，确认失败

```bash
npx vitest run app/composables/useTocActiveHeading.spec.ts
```

预期：FAIL，模块找不到

### Step 3：实现 composable

```ts
// app/composables/useTocActiveHeading.ts
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
```

### Step 4：运行测试，确认通过

```bash
npx vitest run app/composables/useTocActiveHeading.spec.ts
```

预期：全部 PASS

### Step 5：Commit

```bash
git add app/composables/useTocActiveHeading.ts app/composables/useTocActiveHeading.spec.ts
git commit -m "feat: add useTocActiveHeading composable with IntersectionObserver"
```

---

## Task 3：创建 `BlogToc.vue` 组件

**Files:**
- Create: `app/components/blog/BlogToc.vue`
- Create: `app/components/blog/BlogToc.spec.ts`

### Step 1：写失败测试

```ts
// app/components/blog/BlogToc.spec.ts
import { mount } from '@vue/test-utils'
import BlogToc from './BlogToc.vue'

const links = [
  {
    id: 'intro',
    text: '介绍',
    depth: 2,
    children: [
      { id: 'background', text: '背景', depth: 3 },
    ],
  },
  { id: 'conclusion', text: '总结', depth: 2, children: [] },
]

describe('BlogToc', () => {
  it('渲染 h2 条目', () => {
    const wrapper = mount(BlogToc, { props: { links, activeId: '' } })
    expect(wrapper.text()).toContain('介绍')
    expect(wrapper.text()).toContain('总结')
  })

  it('渲染 h3 子条目，缩进显示', () => {
    const wrapper = mount(BlogToc, { props: { links, activeId: '' } })
    expect(wrapper.text()).toContain('背景')
    // h3 应在嵌套 ul 内
    const nestedUl = wrapper.find('ul ul')
    expect(nestedUl.exists()).toBe(true)
    expect(nestedUl.text()).toContain('背景')
  })

  it('links 为空时不渲染列表项', () => {
    const wrapper = mount(BlogToc, { props: { links: [], activeId: '' } })
    expect(wrapper.find('li').exists()).toBe(false)
  })

  it('激活项有加粗样式', () => {
    const wrapper = mount(BlogToc, { props: { links, activeId: 'intro' } })
    const activeLink = wrapper.find('a[href="#intro"]')
    expect(activeLink.classes()).toContain('font-semibold')
  })

  it('非激活项无加粗样式', () => {
    const wrapper = mount(BlogToc, { props: { links, activeId: 'intro' } })
    const inactiveLink = wrapper.find('a[href="#conclusion"]')
    expect(inactiveLink.classes()).not.toContain('font-semibold')
  })

  it('h3 激活项有加粗样式', () => {
    const wrapper = mount(BlogToc, { props: { links, activeId: 'background' } })
    const activeChild = wrapper.find('a[href="#background"]')
    expect(activeChild.classes()).toContain('font-semibold')
  })

  it('链接 href 正确', () => {
    const wrapper = mount(BlogToc, { props: { links, activeId: '' } })
    expect(wrapper.find('a[href="#intro"]').exists()).toBe(true)
    expect(wrapper.find('a[href="#background"]').exists()).toBe(true)
  })
})
```

### Step 2：运行测试，确认失败

```bash
npx vitest run app/components/blog/BlogToc.spec.ts
```

预期：FAIL，组件不存在

### Step 3：实现组件

```vue
<!-- app/components/blog/BlogToc.vue -->
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
```

### Step 4：运行测试，确认通过

```bash
npx vitest run app/components/blog/BlogToc.spec.ts
```

预期：全部 PASS

### Step 5：Commit

```bash
git add app/components/blog/BlogToc.vue app/components/blog/BlogToc.spec.ts
git commit -m "feat: add BlogToc component with h2/h3 support and active highlighting"
```

---

## Task 4：更新 `[...slug].vue`，接入 TOC

**Files:**
- Modify: `app/pages/blog/[...slug].vue`

### Step 1：在 script setup 末尾添加 TOC 逻辑

在 `formatDate` 函数之前加入：

```ts
import { computed, ref } from 'vue'
import { useTocActiveHeading } from '~/composables/useTocActiveHeading'

// TOC
const tocLinks = computed(() => article.value?.body?.toc?.links ?? [])
const allHeadingIds = computed(() => {
  const ids: string[] = []
  tocLinks.value.forEach((link: any) => {
    ids.push(link.id)
    link.children?.forEach((child: any) => ids.push(child.id))
  })
  return ids
})
const activeId = useTocActiveHeading(allHeadingIds)
const mobileOpen = ref(false)
```

注意：文件顶部已有 `import { computed } from 'vue'`，检查是否需要合并 import，避免重复。

### Step 2：在封面图下方、正文上方添加移动端 TOC

在 `<!-- Content -->` 注释行之前插入：

```html
<!-- Mobile TOC -->
<div v-if="tocLinks.length" class="lg:hidden mb-8 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden">
  <button
    class="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-900"
    @click="mobileOpen = !mobileOpen"
  >
    <span>目录</span>
    <Icon :name="mobileOpen ? 'ph:caret-up' : 'ph:caret-down'" class="w-4 h-4" />
  </button>
  <Transition name="toc-mobile">
    <div v-show="mobileOpen" class="overflow-hidden" @click="mobileOpen = false">
      <div class="px-4 py-3">
        <BlogToc :links="tocLinks" :active-id="activeId" />
      </div>
    </div>
  </Transition>
</div>
```

### Step 3：在 template 末尾添加桌面端 sidebar slot

在 `</div>` 最后（article 结束后）添加：

```html
<!-- Desktop sidebar TOC -->
<template #sidebar>
  <nav v-if="tocLinks.length" class="sticky top-24">
    <h4 class="text-sm font-medium text-stone-500 dark:text-stone-400 mb-4">目录</h4>
    <BlogToc :links="tocLinks" :active-id="activeId" />
  </nav>
</template>
```

### Step 4：添加 Transition CSS

在文件最后添加：

```vue
<style scoped>
.toc-mobile-enter-active,
.toc-mobile-leave-active {
  display: grid;
  transition: grid-template-rows 0.3s ease;
}
.toc-mobile-enter-from,
.toc-mobile-leave-to {
  grid-template-rows: 0fr;
}
.toc-mobile-enter-to,
.toc-mobile-leave-from {
  grid-template-rows: 1fr;
}
</style>
```

### Step 5：验证文件结构完整

检查 `[...slug].vue` 最终 template 结构：

```
<div>
  <article v-if="article">
    <header>...</header>
    <div v-if="article.cover">封面图</div>
    <div class="lg:hidden ...">移动端 TOC</div>   ← 新增
    <div class="prose ..."><ContentRenderer /></div>
    <footer>...</footer>
  </article>
  <template #sidebar>桌面端 TOC</template>         ← 新增
</div>
```

### Step 6：Commit

```bash
git add app/pages/blog/[...slug].vue
git commit -m "feat: integrate TOC into blog detail page (sidebar + mobile collapsible)"
```

---

## Task 5：全量测试 + 手动验证

### Step 1：运行全量测试

```bash
npx vitest run
```

预期：全部 PASS，无新增失败

### Step 2：本地运行验证

```bash
npx nuxi dev
```

访问任意有标题的文章（确认 content/blog/ 下有含 h2/h3 的 md 文件）：

**桌面端（> 1024px）验证：**
- [ ] 右侧出现"目录"标题 + 两级列表
- [ ] 侧边栏随页面滚动保持固定（sticky）
- [ ] 滚动到对应小节时，对应目录项变粗变深
- [ ] 点击目录项平滑滚动到对应标题
- [ ] 文章内容列在 1fr 列中居中对齐

**移动端（< 1024px）验证：**
- [ ] 封面图下方出现"目录"折叠条，默认收起
- [ ] 点击展开，显示目录列表
- [ ] 点击目录项，平滑滚动 + 面板自动收起
- [ ] 右侧侧边栏不显示

**无标题文章验证：**
- [ ] 桌面端：sidebar slot 为空，不出现目录区域
- [ ] 移动端：折叠条不出现

### Step 3：完成收尾（参考 CLAUDE.md 开发完成收尾规范）

按 CLAUDE.md 规范：推送分支、创建 PR、等待用户 review。
