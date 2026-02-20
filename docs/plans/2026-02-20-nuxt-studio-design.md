# Nuxt Studio 在线编辑 + 字体本地化设计方案

**日期**: 2026-02-20
**目标**: 接入 Nuxt Studio 实现网页端文章创建与编辑，同时本地化 Google Fonts 加快构建速度

## 概述

通过 Nuxt Studio 开源模块为个人网站添加在线 CMS 编辑功能。编辑界面访问路径为 `/_studio`，使用 GitHub OAuth 验证身份（仅站主本人可进入）。每次发布直接通过 GitHub API commit 到 main 分支，触发 Vercel 自动重新部署。

同步将 Google Fonts 字体文件本地化，消除每次构建的网络下载耗时（约 19 秒）。

## 编辑流程

```
打开 /_studio → GitHub 登录验证 → 编辑/创建文章（草稿即时保存到浏览器）
→ 实时预览 → 点击「发布」→ GitHub API commit → Vercel 自动重部署（2-4 分钟）
```

## 技术方案

### Part 1：字体本地化

- 从当前构建缓存中提取已下载的 WOFF2 文件（Noto Serif SC、LXGW WenKai）
- 复制到 `public/fonts/` 并提交到 git
- 在 `assets/css/main.css` 中添加 `@font-face` 声明（含 `unicode-range` subset 规则）
- 从 `nuxt.config.ts` 移除 `@nuxtjs/google-fonts` 模块及相关配置
- 从 `package.json` 卸载 `@nuxtjs/google-fonts`

### Part 2：Nuxt Studio 接入

**依赖安装**
```bash
pnpm add nuxt-studio
```

**`nuxt.config.ts` 改动**
- `modules` 数组加入 `'nuxt-studio'`
- 添加 `nitro.prerender.crawlLinks: true`（替代 `nuxi generate` 的全量预渲染）
- 保留现有所有模块和配置

**Vercel 构建命令**
- 从 `nuxt generate` 改为 `nuxt build`
- Studio 需要 `/_studio` serverless 路由，纯静态产物不支持

**GitHub OAuth App（站主一次性手动操作）**
- 在 GitHub → Settings → Developer Settings → OAuth Apps 创建应用
- Homepage URL：Vercel 部署地址
- Authorization callback URL：`https://<your-domain>/_studio/auth/github`
- 将 `GITHUB_CLIENT_ID` 和 `GITHUB_CLIENT_SECRET` 填入 Vercel 环境变量

## 安全说明

- `client_id` 公开无害，仅为应用标识
- `client_secret` 仅存于 Vercel 服务端环境变量，不暴露给浏览器
- 只有绑定 repo 的 GitHub 账号可通过 OAuth 授权，其他人无法进入编辑界面
- 草稿仅存于编辑者本地浏览器（IndexedDB），不影响线上内容

## 执行顺序

1. 字体本地化（提取 WOFF2 → 写 CSS → 移除模块）→ commit → PR → 合并
2. 安装 nuxt-studio、修改 nuxt.config.ts → commit → PR → 合并
3. 合并后在 Vercel 将构建命令改为 `nuxt build`
4. 站主在 GitHub 创建 OAuth App，将密钥填入 Vercel 环境变量

## 验收标准

- `pnpm run build`（即 `nuxi build`）零错误完成
- 所有页面（首页、博客列表、博客详情、作品页、关于页）正常预渲染
- 访问 `/_studio` 出现登录界面，GitHub 授权后可进入编辑
- 可创建新文章、编辑现有文章、发布后触发 Vercel 重部署
- build 日志中不再出现 Google Fonts 下载耗时
