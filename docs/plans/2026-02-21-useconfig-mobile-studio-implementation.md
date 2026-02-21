# useConfig + 移动端 Studio 优化 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 创建统一的 `useConfig` composable 封装站点信息和 UA 设备检测，并用 CSS 覆盖优化移动端 Nuxt Studio 编辑体验。

**Architecture:** `app.config.ts` 作为静态数据源（站点信息），`useConfig` composable 内部用 `useState` 做 SSR 兼容的 UA 设备检测，合并后统一对外暴露。移动端 Studio 通过 `main.css` 媒体查询覆盖侧边栏布局为全屏叠加。

**Tech Stack:** Nuxt 3, TypeScript, Tailwind CSS v4, `useState` (SSR hydration), `useRequestHeaders`, `useAppConfig`

---

### Task 1: 更新 app.config.ts 增加 email 顶层字段

**Files:**
- Modify: `app/app.config.ts`

**Step 1: 修改 app.config.ts**

在 `site` 对象中增加 `email` 字段，方便直接访问：

```typescript
export default defineAppConfig({
  site: {
    name: '柳尚佐',
    email: '1561790480@qq.com',
    title: '柳尚佐 — 记录生活，分享思考',
    description: '柳尚佐的个人空间，记录技术、旅行与摄影的思考与见闻',
    socialLinks: [
      { href: 'https://github.com/Qasszls', icon: 'ph:github-logo', label: 'GitHub' },
      { href: 'mailto:1561790480@qq.com', icon: 'ph:envelope', label: 'Email' },
      { icon: 'ph:wechat-logo', label: '微信：Zlsqass006', wechat: 'Zlsqass006' },
    ],
  },
  icon: {
    aliases: {
      'dark-mode': 'ph:moon',
      'light-mode': 'ph:sun',
    },
  },
})
```

**Step 2: 同步更新 tests/setup.ts 的 mock**

在 `useAppConfig` mock 的 `site` 对象中增加 `email` 字段：

```typescript
vi.stubGlobal('useAppConfig', vi.fn(() => ({
  site: {
    name: '柳尚佐',
    email: '1561790480@qq.com',
    title: '柳尚佐 — 记录生活，分享思考',
    description: '柳尚佐的个人空间',
    socialLinks: [
      { href: 'https://github.com/Qasszls', icon: 'ph:github-logo', label: 'GitHub' },
      { href: 'mailto:1561790480@qq.com', icon: 'ph:envelope', label: 'Email' },
      { icon: 'ph:wechat-logo', label: '微信：Zlsqass006', wechat: 'Zlsqass006' },
    ],
  },
})))
```

**Step 3: Commit**

```bash
git add app/app.config.ts tests/setup.ts
git commit -m "feat: add email field to site config"
```

---

### Task 2: 创建 useConfig composable

**Files:**
- Create: `app/composables/useConfig.ts`

**Step 1: 写测试**

创建 `app/composables/useConfig.spec.ts`：

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Nuxt auto-imports before importing useConfig
const mockUseAppConfig = vi.fn(() => ({
  site: {
    name: '柳尚佐',
    email: '1561790480@qq.com',
    title: '柳尚佐 — 记录生活，分享思考',
    description: '描述',
    socialLinks: [],
  },
}))

const mockUseState = vi.fn((key: string, init?: () => any) => {
  const val = init ? init() : null
  return { value: val }
})

const mockUseRequestHeaders = vi.fn(() => ({
  'user-agent': 'Mozilla/5.0 (Linux; Android 13) Mobile Safari/537.36',
}))

vi.stubGlobal('useAppConfig', mockUseAppConfig)
vi.stubGlobal('useState', mockUseState)
vi.stubGlobal('useRequestHeaders', mockUseRequestHeaders)

// import.meta.server is false in test environment by default

import { useConfig } from '~/composables/useConfig'

describe('useConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAppConfig.mockReturnValue({
      site: {
        name: '柳尚佐',
        email: '1561790480@qq.com',
        title: '柳尚佐 — 记录生活，分享思考',
        description: '描述',
        socialLinks: [],
      },
    })
  })

  it('returns site config from appConfig', () => {
    const { site } = useConfig()
    expect(site.name).toBe('柳尚佐')
    expect(site.email).toBe('1561790480@qq.com')
  })

  it('returns device info with isMobile', () => {
    const { device } = useConfig()
    expect(typeof device.isMobile).toBe('boolean')
  })

  it('detects mobile UA', () => {
    mockUseState.mockImplementation((_key: string, init?: () => any) => ({
      value: init ? init() : null,
    }))
    // navigator.userAgent is used in client mode (import.meta.server = false)
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148',
      configurable: true,
    })
    const { device } = useConfig()
    expect(device.isMobile).toBe(true)
  })

  it('detects desktop UA', () => {
    mockUseState.mockImplementation((_key: string, init?: () => any) => ({
      value: init ? init() : null,
    }))
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
      configurable: true,
    })
    const { device } = useConfig()
    expect(device.isMobile).toBe(false)
  })
})
```

**Step 2: 运行测试确认失败**

```bash
npx vitest run app/composables/useConfig.spec.ts
```

Expected: FAIL — `useConfig` 模块不存在

**Step 3: 实现 useConfig**

创建 `app/composables/useConfig.ts`：

```typescript
export function useConfig() {
  const appConfig = useAppConfig()

  const device = useState('config-device', () => {
    let ua = ''
    if (import.meta.server) {
      const headers = useRequestHeaders(['user-agent'])
      ua = headers['user-agent'] || ''
    } else {
      ua = navigator.userAgent
    }
    return {
      isMobile: /Mobile|Android|iPhone|iPod/i.test(ua),
    }
  })

  return {
    site: appConfig.site,
    device: device.value,
  }
}
```

> **注意：** `useAppConfig`、`useState`、`useRequestHeaders` 都是 Nuxt 自动导入，无需手动 import。

**Step 4: 运行测试确认通过**

```bash
npx vitest run app/composables/useConfig.spec.ts
```

Expected: PASS

**Step 5: Commit**

```bash
git add app/composables/useConfig.ts app/composables/useConfig.spec.ts
git commit -m "feat: add useConfig composable with site info and UA device detection"
```

---

### Task 3: 移动端 Studio CSS 覆盖

**Files:**
- Modify: `app/assets/css/main.css`

**Step 1: 在 main.css 末尾添加移动端 Studio 覆盖**

在文件末尾（`.dark .prose` 块之后）追加：

```css
/* === Mobile Studio editor overrides === */
@media (max-width: 768px) {
  /* 编辑器展开时不推页面内容，改为全屏覆盖 */
  body[data-studio-active][data-expand-sidebar] {
    margin-left: 0 !important;
  }

  /* Studio 组件全屏覆盖 */
  nuxt-studio {
    position: fixed !important;
    inset: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    z-index: 9999 !important;
  }
}
```

**Step 2: 本地构建验证无错误**

```bash
npx nuxt build 2>&1 | tail -5
```

Expected: 构建成功，无 CSS 相关错误

**Step 3: Commit**

```bash
git add app/assets/css/main.css
git commit -m "feat: add mobile CSS overrides for Nuxt Studio editor"
```

---

### Task 4: 运行全量测试 + 推送

**Step 1: 运行全量测试**

```bash
npx vitest run
```

Expected: 全部 PASS

**Step 2: 推送并创建 PR**

```bash
git push origin main
```

> 如果使用 feature 分支，改为 `git push origin <branch> -u` 然后 `gh pr create`。
