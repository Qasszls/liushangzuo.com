# Lint 待修复：`no-explicit-any` 业务类型

> 生成日期：2026-02-22
> 剩余 10 个 `@typescript-eslint/no-explicit-any` error，均需补具体业务类型。

## 分类

### 1. TOC 相关（6 处）— 需定义 `TocLink` 类型

| 文件 | 行 | 代码 | 建议类型 |
|------|-----|------|----------|
| `app/layouts/blog.vue` | 27 | `useState<any[]>('blogTocLinks')` | `TocLink[]` |
| `app/pages/blog/[...slug].vue` | 127 | `as any[]` | `TocLink[]` |
| `app/pages/blog/[...slug].vue` | 130 | `(link: any)` | `TocLink` |
| `app/pages/blog/[...slug].vue` | 132 | `(child: any)` | `TocLink` |
| `app/pages/blog/[...slug].vue` | 139 | `useState<any[]>('blogTocLinks')` | `TocLink[]` |

**建议**：在 `app/types/` 下创建 `TocLink` 接口，统一引用。

```ts
interface TocLink {
  id: string
  text: string
  depth: 2 | 3
  children?: TocLink[]
}
```

### 2. 博客文章类型（3 处）— 需使用 Nuxt Content 生成的集合类型

| 文件 | 行 | 代码 | 建议类型 |
|------|-----|------|----------|
| `app/pages/blog/[...slug].vue` | 113 | `(p: any) => p.path` | `BlogCollectionItem` |
| `app/pages/blog/index.vue` | 72 | `(post: any) => post.tags` | `BlogCollectionItem` |
| `app/pages/blog/index.vue` | 79 | `(post: any) => post.tags` | `BlogCollectionItem` |

**建议**：使用 `@nuxt/content` 生成的类型（`.nuxt/content/types.d.ts`），或在 `app/types/` 下定义 `BlogPost` 接口。

### 3. 摄影作品类型（2 处）— 需定义 `Photo` / `WorkItem` 类型

| 文件 | 行 | 代码 | 建议类型 |
|------|-----|------|----------|
| `app/pages/works/index.vue` | 87 | `(p: any) => p.category` | `WorkItem` |
| `app/pages/works/index.vue` | 91 | `(p: any) => ({ src: ... })` | `WorkItem` |

**建议**：在 `app/types/` 下定义 `WorkItem` 接口。
