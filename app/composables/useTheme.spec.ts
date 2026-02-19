import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value },
    clear: () => { store = {} },
  }
})()
Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock })

// Mock document.documentElement
const htmlElement = {
  dataset: {} as Record<string, string>,
  style: { setProperty: vi.fn() },
}
Object.defineProperty(globalThis, 'document', {
  value: { documentElement: htmlElement },
  writable: true,
})

import { useTheme, ACCENT_COLORS, TITLE_FONTS } from './useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    localStorageMock.clear()
    htmlElement.dataset = {}
  })

  it('exports accent color options', () => {
    expect(ACCENT_COLORS).toHaveLength(4)
    expect(ACCENT_COLORS[0].id).toBe('mist-blue')
    expect(ACCENT_COLORS[1].id).toBe('bean-green')
    expect(ACCENT_COLORS[2].id).toBe('lotus-pink')
    expect(ACCENT_COLORS[3].id).toBe('desert-camel')
  })

  it('exports title font options', () => {
    expect(TITLE_FONTS).toHaveLength(3)
    expect(TITLE_FONTS[0].id).toBe('noto-serif')
    expect(TITLE_FONTS[1].id).toBe('lxgw-wenkai')
    expect(TITLE_FONTS[2].id).toBe('system')
  })

  it('defaults to mist-blue accent and noto-serif font', () => {
    const { accentColor, titleFont } = useTheme()
    expect(accentColor.value).toBe('mist-blue')
    expect(titleFont.value).toBe('noto-serif')
  })

  it('setAccentColor updates data attribute and localStorage', () => {
    const { setAccentColor, accentColor } = useTheme()
    setAccentColor('bean-green')
    expect(accentColor.value).toBe('bean-green')
    expect(localStorageMock.getItem('accent-color')).toBe('bean-green')
    expect(htmlElement.dataset.accent).toBe('bean-green')
  })

  it('setTitleFont updates data attribute and localStorage', () => {
    const { setTitleFont, titleFont } = useTheme()
    setTitleFont('lxgw-wenkai')
    expect(titleFont.value).toBe('lxgw-wenkai')
    expect(localStorageMock.getItem('title-font')).toBe('lxgw-wenkai')
    expect(htmlElement.dataset.font).toBe('lxgw-wenkai')
  })

  it('restores saved preferences from localStorage', () => {
    localStorageMock.setItem('accent-color', 'lotus-pink')
    localStorageMock.setItem('title-font', 'system')
    const { accentColor, titleFont } = useTheme()
    expect(accentColor.value).toBe('lotus-pink')
    expect(titleFont.value).toBe('system')
  })

  it('ignores invalid localStorage values', () => {
    localStorageMock.setItem('accent-color', 'neon-pink')
    const { accentColor } = useTheme()
    expect(accentColor.value).toBe('mist-blue')
  })
})
