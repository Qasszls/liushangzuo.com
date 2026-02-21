# 首页点击与导航测试用例

> 测试环境：Playwright Chromium headless，viewport 1280x720
> 测试方式：`page.mouse.click(x, y)` 模拟真实鼠标坐标点击，非 `element.click()` DOM API 调用

## 背景

PR #7（feat/studio-home-button）引入 `<StudioHomeButton />` 组件后，因 `nuxt.config.ts` 中 `pathPrefix: false` 导致组件注册名为 `HomeButton` 而非 `StudioHomeButton`，触发 Vue hydration mismatch，破坏全局事件绑定，首页所有点击失效。

## 测试用例

### 1. Hero 区域按钮

| 编号 | 元素 | 操作 | 预期结果 |
|------|------|------|----------|
| 1.1 | "阅读随笔" 按钮 (`a[href="/blog"]`) | 鼠标点击元素中心坐标 | 导航到 `/blog` |
| 1.2 | "浏览作品" 按钮 (`a[href="/works"]`) | 鼠标点击元素中心坐标 | 导航到 `/works` |

### 2. Header 导航链接

| 编号 | 元素 | 操作 | 预期结果 |
|------|------|------|----------|
| 2.1 | 导航 "随笔" (`header a[href="/blog"]`) | 鼠标点击 | 导航到 `/blog` |
| 2.2 | 导航 "作品" (`header a[href="/works"]`) | 鼠标点击 | 导航到 `/works` |
| 2.3 | 导航 "关于" (`header a[href="/about"]`) | 鼠标点击 | 导航到 `/about` |

### 3. 设置按钮与抽屉

| 编号 | 元素 | 操作 | 预期结果 |
|------|------|------|----------|
| 3.1 | 齿轮按钮 (`header button`) | 鼠标点击 | SettingsDrawer 抽屉打开，`[data-test="drawer-panel"]` 可见 |

### 4. "查看全部" 链接

| 编号 | 元素 | 操作 | 预期结果 |
|------|------|------|----------|
| 4.1 | 最新文章 "查看全部" → `/blog` | 鼠标点击 | 导航到 `/blog` |
| 4.2 | 摄影精选 "查看全部" → `/works` | 滚动至可见后鼠标点击 | 导航到 `/works` |

### 5. 文章卡片

| 编号 | 元素 | 操作 | 预期结果 |
|------|------|------|----------|
| 5.1 | 第1篇文章卡片 (`a[href*="/blog/"]`) | 滚动至可见 → 鼠标点击 | 导航到对应文章详情页 |
| 5.2 | 第2篇文章卡片 | 同上 | 同上 |
| 5.3 | 第3篇文章卡片 | 同上 | 同上 |

### 6. "了解更多" 链接

| 编号 | 元素 | 操作 | 预期结果 |
|------|------|------|----------|
| 6.1 | "了解更多 →" (`a[href="/about"]`) | 滚动至可见 → 鼠标点击 | 导航到 `/about` |

### 7. 覆盖层检测

| 编号 | 检查项 | 预期结果 |
|------|--------|----------|
| 7.1 | 全页面扫描 `position:fixed/absolute` 且 `z-index>=1` 且尺寸>200x200 的元素 | 无阻挡性覆盖层 |
| 7.2 | 所有可交互元素 (`a, button`) 的 `pointer-events` | 无 `pointer-events: none` |

### 8. 控制台错误检测

| 编号 | 检查项 | 预期结果 |
|------|--------|----------|
| 8.1 | Vue 组件解析警告 | 无 `Failed to resolve component` |
| 8.2 | Hydration mismatch 错误 | 无 `Hydration node mismatch` |
| 8.3 | 未解析的自定义元素 | 无空的自定义元素标签 |

## 已知注意事项

- **BlurImage 组件**：`elementFromPoint` 返回的是 `opacity-0` 的模糊占位图 `<img>`，但点击事件能正确冒泡到父级 `<a>` 标签，不影响导航功能。
- **nuxt-studio 移动端 CSS**：`main.css` 中 `@media (max-width: 768px)` 下的 `nuxt-studio` 样式会覆盖全视口，仅在 Nuxt Studio 编辑模式下生效。
