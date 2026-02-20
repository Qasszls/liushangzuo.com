# Nuxt Studio + Font Localization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 接入 Nuxt Studio 实现在线 Markdown 编辑，同时本地化 Noto Serif SC 字体消除每次构建的 19 秒网络下载。

**Architecture:** 分两阶段：Phase 1 字体本地化（把 15 个 WOFF2 文件提交到 repo，手写 `@font-face`，移除 `@nuxtjs/google-fonts`）；Phase 2 接入 Nuxt Studio（安装 `nuxt-studio` 模块，`nuxt.config.ts` 加预渲染配置，Vercel 构建命令改为 `nuxt build`）。LXGW WenKai 字体不在缓存中，改为通过 `useHead` 在用户切换时动态注入 Google Fonts `<link>`。

**Tech Stack:** Nuxt 3, @nuxt/content v3, nuxt-studio, Tailwind CSS v4, Vercel

---

### Task 1: 复制 Noto Serif SC 字体文件到 public/fonts/

**Files:**
- Create: `public/fonts/noto-serif-sc/`（目录）

字体文件已存在于构建缓存中，直接复制：

**Step 1: 创建目标目录并复制文件**

```bash
mkdir -p public/fonts/noto-serif-sc
cp node_modules/.cache/nuxt-google-fonts/fonts/Noto_Serif_SC-*.woff2 public/fonts/noto-serif-sc/
```

**Step 2: 确认文件数量正确**

```bash
ls public/fonts/noto-serif-sc/ | wc -l
```

预期输出：`15`（5 个 subset × 3 个 weight）

**Step 3: 确认文件列表**

```bash
ls public/fonts/noto-serif-sc/
```

预期看到：
```
Noto_Serif_SC-normal-400-cyrillic.woff2
Noto_Serif_SC-normal-400-latin-ext.woff2
Noto_Serif_SC-normal-400-latin.woff2
Noto_Serif_SC-normal-400-text.woff2
Noto_Serif_SC-normal-400-vietnamese.woff2
Noto_Serif_SC-normal-600-cyrillic.woff2
... (共 15 个)
```

---

### Task 2: 生成本地化字体 CSS

**Files:**
- Create: `app/assets/css/fonts.css`
- Modify: `app/assets/css/main.css`

缓存目录中已有完整的 `@font-face` CSS（含正确的 `unicode-range`），直接复制并更新路径。

**Step 1: 复制缓存 CSS 并更新字体路径**

```bash
sed 's|url(\x27\.\./fonts/\(.*\)\x27)|url(\x27/fonts/noto-serif-sc/\1\x27)|g' \
  node_modules/.cache/nuxt-google-fonts/css/nuxt-google-fonts.css \
  > app/assets/css/fonts.css
```

**Step 2: 确认 CSS 文件路径已更新**

```bash
grep "url(" app/assets/css/fonts.css | head -3
```

预期输出应包含 `/fonts/noto-serif-sc/`，而非 `../fonts/`：
```
  src: url('/fonts/noto-serif-sc/Noto_Serif_SC-normal-400-text.woff2') format('woff2');
```

如果路径仍是 `../fonts/`，说明 sed 的引号格式不匹配，改用：
```bash
cp node_modules/.cache/nuxt-google-fonts/css/nuxt-google-fonts.css app/assets/css/fonts.css
# 然后手动在编辑器中将 ../fonts/ 全部替换为 /fonts/noto-serif-sc/
```

**Step 3: 在 main.css 顶部添加 import**

在 `app/assets/css/main.css` 第 1 行（`@import "tailwindcss";` 之前）加入：

```css
@import "./fonts.css";
```

结果 `main.css` 开头应为：
```css
/* app/assets/css/main.css */
@import "./fonts.css";
@import "tailwindcss";
```

---

### Task 3: LXGW WenKai 改为动态加载

**Files:**
- Modify: `app/composables/useTheme.ts`

LXGW WenKai 不在本地缓存中，改为用户切换到该字体时才动态注入 Google Fonts `<link>`，避免每次页面加载都请求。

**Step 1: 修改 useTheme.ts，在 setTitleFont 中注入/移除 link 标签**

替换 `applyFont` 函数和 `setTitleFont` 函数：

```typescript
const LXGW_FONTS_LINK_ID = 'lxgw-wenkai-fonts'

function ensureLxgwFontsLoaded() {
  if (typeof document === 'undefined') return
  if (document.getElementById(LXGW_FONTS_LINK_ID)) return
  const link = document.createElement('link')
  link.id = LXGW_FONTS_LINK_ID
  link.rel = 'stylesheet'
  link.href = 'https://fonts.googleapis.com/css2?family=LXGW+WenKai:wght@400;700&display=swap'
  document.head.appendChild(link)
}

function applyFont(id: string) {
  if (typeof document !== 'undefined') {
    if (id === 'lxgw-wenkai') {
      ensureLxgwFontsLoaded()
    }
    if (id === 'noto-serif') {
      delete document.documentElement.dataset.font
    } else {
      document.documentElement.dataset.font = id
    }
  }
}
```

（`setTitleFont` 函数本身不需要改动，它已经调用 `applyFont`）

**Step 2: 确认文件保存正确，原有逻辑未被破坏**

检查 `applyFont` 中仍然有 `delete document.documentElement.dataset.font` 的 noto-serif 分支，以及 `document.documentElement.dataset.font = id` 的其他字体分支。

---

### Task 4: 移除 @nuxtjs/google-fonts

**Files:**
- Modify: `nuxt.config.ts`
- Modify: `package.json`（通过 pnpm 命令）

**Step 1: 从 nuxt.config.ts 移除模块和配置**

从 `modules` 数组中删除 `'@nuxtjs/google-fonts'`，删除整个 `googleFonts: { ... }` 配置块。

`nuxt.config.ts` 的 `modules` 应变为：
```typescript
modules: [
  '@nuxt/content',
  '@nuxt/image',
  '@nuxt/icon',
  '@nuxtjs/color-mode',
  '@pinia/nuxt',
],
```

**Step 2: 卸载依赖**

```bash
pnpm remove @nuxtjs/google-fonts
```

预期输出：`Removed 1 package`

**Step 3: 确认 package.json 中已不含该包**

```bash
grep google-fonts package.json
```

预期：无输出

---

### Task 5: 构建验证（字体阶段）

**Step 1: 运行 nuxt prepare**

```bash
pnpm exec nuxi prepare 2>&1
```

预期：`✔ Types generated in .nuxt`，且 **不再出现** `[nuxt:google-fonts]` 相关日志

**Step 2: 运行完整构建**

```bash
pnpm run build 2>&1
```

预期：
- exit 0
- 构建日志中 **不出现** `Slow module @nuxtjs/google-fonts`
- 输出的 `_nuxt/` 目录中包含 Noto Serif SC WOFF2 文件（或 `public/fonts/` 中的文件被正确引用）

如果构建失败，检查 `fonts.css` 中的路径格式是否正确。

**Step 3: 运行测试**

```bash
pnpm exec vitest run
```

预期：8 files, 39 tests, all pass

**Step 4: Commit**

```bash
git add public/fonts/ app/assets/css/fonts.css app/assets/css/main.css app/composables/useTheme.ts nuxt.config.ts package.json pnpm-lock.yaml
git commit -m "feat: localize Noto Serif SC fonts, load LXGW WenKai on demand"
```

---

### Task 6: 安装 nuxt-studio 并配置

**Files:**
- Modify: `nuxt.config.ts`

**Step 1: 安装依赖**

```bash
pnpm add nuxt-studio
```

**Step 2: 更新 nuxt.config.ts**

在 `modules` 数组末尾加入 `'nuxt-studio'`，并添加 `nitro.prerender` 配置：

```typescript
modules: [
  '@nuxt/content',
  '@nuxt/image',
  '@nuxt/icon',
  '@nuxtjs/color-mode',
  '@pinia/nuxt',
  'nuxt-studio',
],

nitro: {
  prerender: {
    crawlLinks: true,
  },
},
```

**Step 3: 确认 nuxt.config.ts 无语法错误**

```bash
pnpm exec nuxi prepare 2>&1 | tail -5
```

预期最后一行：`✔ Types generated in .nuxt`

---

### Task 7: 最终构建验证

**Step 1: 运行完整构建**

```bash
pnpm run build 2>&1
```

预期：
- exit 0
- 日志中出现 `[nuxt-studio]` 相关初始化信息
- 预渲染所有内容页面（首页、博客列表、6 篇博客、作品页、关于页）

**Step 2: 运行测试**

```bash
pnpm exec vitest run
```

预期：39/39 pass

**Step 3: Commit**

```bash
git add nuxt.config.ts package.json pnpm-lock.yaml
git commit -m "feat: add nuxt-studio for online content editing"
```

---

### Task 8: 创建 PR 并完成手动配置

**Step 1: 推送并创建 PR**

```bash
git push origin HEAD
gh pr create \
  --title "feat: Nuxt Studio online editing + font localization" \
  --body "## Summary
- 本地化 Noto Serif SC 字体（15 个 WOFF2 提交到 repo），消除构建时 19 秒网络下载
- LXGW WenKai 改为用户切换时动态注入 Google Fonts link
- 接入 nuxt-studio 模块实现网页端文章创建与编辑
- 构建策略从 nuxi generate 切换为 nuxi build + crawlLinks 预渲染

## 验证
- [x] 39/39 测试通过
- [x] nuxi build exit 0，所有页面预渲染成功
- [x] 构建日志无 google-fonts 下载耗时

## 合并后手动操作（站主）
1. Vercel 项目设置 → 构建命令改为 \`nuxt build\`
2. Vercel 项目设置 → 开启「Automatically expose System Environment Variables」
3. GitHub → Settings → Developer Settings → OAuth Apps → New OAuth App
   - Homepage URL: 你的 Vercel 部署地址
   - Authorization callback URL: \`https://<your-domain>/api/_studio/github/callback\`
   - 将生成的 Client ID 和 Client Secret 填入 Vercel 环境变量：
     \`NUXT_STUDIO_GITHUB_CLIENT_ID\` 和 \`NUXT_STUDIO_GITHUB_CLIENT_SECRET\`
4. 重新触发 Vercel 部署
5. 访问 \`https://<your-domain>/_studio\` 验证登录和编辑功能

🤖 Generated with [Claude Code](https://claude.com/claude-code)"
```

**Step 2: 通知用户 PR 链接，等待 review 合并**

PR 合并后，用户按照 PR 描述中的「合并后手动操作」步骤完成 Vercel 和 GitHub OAuth 配置。
