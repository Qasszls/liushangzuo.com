# useConfig + 移动端 Studio 优化

## 概述

创建统一的 `useConfig` composable 封装所有环境数据，并优化移动端 Nuxt Studio 编辑体验。

## 1. `useConfig` Composable

### 数据源

- **静态数据**：从 `app.config.ts` 读取（site 信息）
- **动态数据**：UA 检测，`useState` 实现 SSR hydration

### 接口

```typescript
const { site, device } = useConfig()

// 站点信息（来自 app.config.ts）
site.name         // '柳尚佐'
site.email        // '1561790480@qq.com'
site.socialLinks  // [...]

// 设备检测（UA，SSR 兼容）
device.isMobile   // boolean
```

### 文件

- `app/composables/useConfig.ts` — composable 实现
- `app/app.config.ts` — 增加 email 字段（从 socialLinks 提取到顶层方便访问）

### SSR 兼容

- 服务端：`useRequestHeaders(['user-agent'])` 取 UA
- 客户端：hydration 复用服务端结果，无需重复检测
- `useState('config-device')` 保证 SSR/CSR 状态一致

## 2. 移动端 Studio CSS 覆盖

### 问题

nuxt-studio 编辑器侧边栏默认 440px，展开时 `margin-left: 440px` 推页面内容。移动端屏幕不够宽，体验很差。

### 方案

在 `main.css` 添加 `@media (max-width: 768px)` 覆盖：

- `body[data-studio-active][data-expand-sidebar]` 的 `margin-left` 改为 `0`
- `nuxt-studio` 元素全屏覆盖（`width: 100vw`）
- 收起侧边栏 = 看预览，展开 = 编辑（利用 Studio 自带的切换）

### 文件

- `app/assets/css/main.css` — 添加移动端媒体查询
