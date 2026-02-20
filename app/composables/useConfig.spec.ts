import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockUseAppConfig = vi.fn(() => ({
  site: {
    name: '柳尚佐',
    email: '1561790480@qq.com',
    title: '柳尚佐 — 记录生活，分享思考',
    description: '描述',
    socialLinks: [],
  },
}))

const mockUseState = vi.fn((_key: string, init?: () => any) => {
  const val = init ? init() : null
  return { value: val }
})

const mockUseRequestHeaders = vi.fn(() => ({
  'user-agent': 'Mozilla/5.0 (Linux; Android 13) Mobile Safari/537.36',
}))

vi.stubGlobal('useAppConfig', mockUseAppConfig)
vi.stubGlobal('useState', mockUseState)
vi.stubGlobal('useRequestHeaders', mockUseRequestHeaders)

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
    mockUseState.mockImplementation((_key: string, init?: () => any) => ({
      value: init ? init() : null,
    }))
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
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148',
      configurable: true,
    })
    const { device } = useConfig()
    expect(device.isMobile).toBe(true)
  })

  it('detects desktop UA', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36',
      configurable: true,
    })
    const { device } = useConfig()
    expect(device.isMobile).toBe(false)
  })
})
