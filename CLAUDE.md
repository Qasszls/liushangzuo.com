# 个人网站项目

## 项目概述

Nuxt 3 个人网站，风格定位**简约文艺**。四大模块：随笔（blog）、旅行（travel）、摄影（works）、技术（tech）。

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Nuxt 3，部署策略以 SSG（`nuxt generate`）为主 |
| 样式 | Tailwind CSS v4，`darkMode: 'class'` |
| 内容 | @nuxt/content（Markdown + MDC 语法） |
| 图标 | @nuxt/icon，优先使用 Phosphor Icons（`ph:` 前缀） |
| 色彩模式 | @nuxtjs/color-mode |
| 状态管理 | Pinia |
| 语言 | TypeScript strict 模式 |
| 图片 | @nuxt/image |
| 测试 | Vitest + @vue/test-utils |

## 目录约定

```
pages/          # 文件系统路由（Nuxt 自动生成）
  index.vue
  blog/
    index.vue
    [slug].vue
  travel/
  works/
  tech/
components/     # 全局自动导入组件
composables/    # 全局自动导入组合式函数
content/        # Markdown 内容文件
  blog/
  travel/
  works/
  tech/
layouts/        # 布局组件（default、blog、fullscreen）
assets/         # 静态资源（字体、全局 CSS）
public/         # 公共文件（图片等）
```

## 测试策略

**组件测试是首选测试类型**，单元测试仅用于独立的 composable 和工具函数。

实现任何 Vue 组件或前端功能时，使用 **`vue-component-tdd`** skill（而非通用的 `test-driven-development`）。

测试命令：
```bash
npx vitest run                          # 全量
npx vitest run src/components/Foo.spec.ts  # 单文件
```

## 设计原则

- **留白**：正文最大宽度 720-800px，媒体页面 1200-1400px，页面边距桌面端 64-96px
- **字体**：标题用 Noto Serif SC（衬线），正文用系统字体栈
- **色彩**：以 Stone/Slate 灰阶为主，强调色取莫兰迪低饱和度色（1-2 种）
- **背景**：不用纯白，用 `#FAFAF9` 或 `bg-stone-50`
- **暗黑模式**：每个颜色类都配 `dark:` 变体

## 开发完成收尾规范

**所有功能实现完成后，必须自动执行以下步骤，无需等待用户提醒：**

1. 确认所有测试通过
2. 将 feature 分支推送到 GitHub
3. 自动创建 Pull Request（使用 `gh pr create`）
4. 把 PR 链接发给用户，等待 review 和合并
5. 清理 worktree（如有）

> 禁止直接 merge 到 main。所有改动必须经过 PR，由用户审核后自行合并。

## 交互规范

- **有选项供用户选择时，必须使用 `AskUserQuestion` 工具**，不能只在文字里列出选项
- **选项中尽量标注一个推荐项**，在 label 末尾加 `（推荐）`

## Skill 检查规范

**每次回复前，必须先检查以下 skill 是否适用并调用，简单任务不是跳过的理由：**

1. `using-superpowers` — 任何任务前必须检查，确认是否有更具体的适配 skill
2. `frontend-design` — 涉及前端界面、组件、页面设计时（**包括需求澄清和方案设计阶段**，不只是写代码时）
3. Vue 技巧系列（任意 `.vue` 文件修改或 Vue 相关任务时）：
   - `vue-best-practices`
   - `vue`
   - `vue-component-tdd`
   - `vue-router-best-practices`
   - `vue-testing-best-practices`
   - `vueuse-functions`

## 内容 Front Matter 规范

所有内容文件统一字段：

```yaml
title: ""
description: ""       # SEO 描述与列表摘要
date: "YYYY-MM-DD"
updated: "YYYY-MM-DD" # 可选
tags: []
cover: ""             # 相对于 public/ 的路径
draft: false
featured: false
```
