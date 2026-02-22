# TOC 目录导航设计文档

**日期**：2026-02-22
**功能**：博客文章详情页侧边栏目录（TOC）

---

## 需求概述

为博客文章详情页添加目录导航，桌面端展示为右侧 sticky 侧边栏，移动端展示为文章顶部可折叠面板。滚动时自动高亮当前小节对应的目录项。

---

## 决策清单

| 项目 | 决策 |
|------|------|
| 标题层级 | h2 + h3（嵌套） |
| 数据来源 | `article.body.toc.links`（Nuxt Content 内置） |
| 激活检测 | VueUse `useIntersectionObserver` |
| 激活样式 | 文字加粗 + 颜色加深（强调色） |
| 移动端 | 正文顶部可折叠面板，默认收起 |

---

## 架构设计

### 组件

```
components/blog/
  BlogToc.vue              # TOC 组件，支持 sidebar 和 inline 两种模式
composables/
  useTocActiveHeading.ts   # 激活标题检测逻辑（基于 useIntersectionObserver）
```

### 数据结构

Nuxt Content 的 `article.body.toc.links` 结构：

```ts
interface TocLink {
  id: string
  text: string
  depth: 2 | 3
  children?: TocLink[]
}
```

h3 嵌套在对应 h2 的 `children` 数组里，组件递归渲染即可。

---

## 组件设计

### `BlogToc.vue`

**Props**：
- `links: TocLink[]` — 目录数据
- `activeId: string` — 当前激活的标题 id（由父组件传入）

**桌面 sidebar 模式**（在 blog layout 的 `aside` slot 中使用）：
- `sticky top-24` 定位
- 标题"目录"（`text-sm font-medium text-stone-500`）
- h2 列表 + h3 缩进子列表
- 激活项：`font-semibold text-stone-900 dark:text-stone-100`（加粗 + 颜色加深）
- 非激活项：`text-stone-500 dark:text-stone-400 hover:text-stone-700`
- 点击平滑滚动到对应标题

**移动端 inline 模式**（在封面图下方、正文上方）：
- 默认收起，显示"目录 ▸"触发按钮
- 点击展开，`<Transition>` 动画（`max-height` 过渡）
- 展开后显示完整目录列表
- 点击任意条目后自动收起面板
- 仅在 `< lg` 断点显示（`lg:hidden`）

### `useTocActiveHeading.ts`

```ts
// 监听文章内所有 h2/h3，返回当前视口中最靠近顶部的标题 id
export function useTocActiveHeading(ids: Ref<string[]>): Ref<string>
```

内部使用 VueUse `useIntersectionObserver`，配置 `rootMargin: '-20% 0px -70% 0px'`，使标题进入视口上方 20%-30% 区域时触发激活。

---

## 布局调整

`app/layouts/blog.vue` 的 `<main>` 加 `mx-auto`：

```html
<!-- 改前 -->
<main class="max-w-2xl">
<!-- 改后 -->
<main class="max-w-2xl mx-auto">
```

使文章内容在 `1fr` 列中居中对齐，与右侧 260px TOC 列形成对称布局。

---

## 渲染条件

- TOC 数据为空（文章无标题）时，侧边栏和移动端折叠块均不渲染
- 通过 `v-if="links?.length"` 控制

---

## 样式规范

- 颜色：沿用 `stone` 灰阶 + `--color-accent` 强调色变量
- 字体：系统字体栈（不用 Noto Serif SC）
- 暗黑模式：所有颜色类配 `dark:` 变体
- 动画：移动端展开用 CSS `max-height` transition，`duration-300 ease-in-out`

---

## 测试要点

- `BlogToc` 渲染 h2 + h3 两级列表
- h3 在 h2 下方缩进显示
- 无 links 时不渲染
- 激活 id 对应的条目有正确 class
- 移动端：默认收起，点击展开，点击条目后收起
- `useTocActiveHeading`：单元测试 IntersectionObserver mock
