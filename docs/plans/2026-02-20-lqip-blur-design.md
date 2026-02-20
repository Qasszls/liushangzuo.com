# LQIP 图片模糊占位优化设计

**日期**: 2026-02-20
**目标**: 为所有图片添加 LQIP（Low Quality Image Placeholder）模糊加载过渡效果

## 概述

创建一个本地脚本工具，扫描 `public/images/` 下所有图片并生成极小的模糊缩略图（~500 bytes）。配合 Vue 组件，页面加载时先显示模糊版本，高清图加载完成后淡入替换。

## 技术方案

### 脚本：`scripts/generate-blur.ts`

- **依赖**：`sharp`（Node.js 图片处理库）
- **逻辑**：
  1. 递归扫描 `public/images/**/*.{jpg,jpeg,png,webp}`
  2. 跳过已有 `-blur` 后缀的文件
  3. 对每张图检查同目录下是否存在 `xxx-blur.jpg`
  4. 不存在则用 sharp 生成：resize 宽度 20px → JPEG quality 50 → 保存为 `xxx-blur.jpg`
  5. 输出日志：生成了几张，跳过了几张
- **运行方式**：`pnpm run generate:blur`
- **环境**：不区分 dev/production，生成一次统一使用

### 组件：`app/components/ui/BlurImage.vue`

- **Props**: `src`, `alt`, `class`, `width?`, `height?`
- **自动推导** blur 路径：`/images/blog/foo.jpg` → `/images/blog/foo-blur.jpg`
- **渲染逻辑**：
  - 外层 div：`position: relative` + overflow hidden
  - blur 层：`<img :src="blurSrc">` + CSS `filter: blur(20px)` + `scale(1.1)`
  - 原图层：`<img :src="src" @load="loaded = true" loading="lazy">`
  - 过渡：原图 `transition-opacity duration-500`，加载前 `opacity-0`，加载后 `opacity-100`
  - blur 层在原图加载后淡出隐藏

### MDC 覆盖：`app/components/content/ProseImg.vue`

- Nuxt Content 自动将 Markdown `![alt](src)` 映射到此组件
- 内部使用 `BlurImage` 组件
- 所有博客文章内联图片自动获得 blur 加载效果

## 改动清单

| 文件 | 类型 | 说明 |
|------|------|------|
| `scripts/generate-blur.ts` | 新建 | blur 缩略图生成脚本 |
| `package.json` | 修改 | 加 sharp devDependency + generate:blur script |
| `app/components/ui/BlurImage.vue` | 新建 | 通用模糊过渡图片组件 |
| `app/components/content/ProseImg.vue` | 新建 | 覆盖 Markdown 内联图片渲染 |
| `app/pages/index.vue` | 修改 | NuxtImg → BlurImage |
| `app/components/ui/ArticleCard.vue` | 修改 | NuxtImg → BlurImage |
| `app/pages/works/index.vue` | 修改 | NuxtImg → BlurImage |

## 使用流程

```bash
# 1. 添加新图片到 public/images/
# 2. 生成 blur 版本
pnpm run generate:blur

# 3. 开发或构建
pnpm dev          # blur 效果在开发中也可见
pnpm generate     # 生产构建
```
