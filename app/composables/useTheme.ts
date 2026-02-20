import { ref } from 'vue'

export interface AccentColor {
  id: string
  label: string
  color: string
}

export interface TitleFont {
  id: string
  label: string
  family: string
}

export const ACCENT_COLORS: AccentColor[] = [
  { id: 'mist-blue', label: '雾霾蓝', color: '#7C9CB5' },
  { id: 'bean-green', label: '豆沙绿', color: '#8FA395' },
  { id: 'lotus-pink', label: '藕荷粉', color: '#B8A9A1' },
  { id: 'desert-camel', label: '淡漠驼', color: '#A89F91' },
]

export const TITLE_FONTS: TitleFont[] = [
  { id: 'noto-serif', label: 'Noto Serif SC', family: "'Noto Serif SC', serif" },
  { id: 'lxgw-wenkai', label: '霞鹜文楷', family: "'LXGW WenKai', cursive" },
  { id: 'system', label: '系统字体', family: "system-ui, -apple-system, sans-serif" },
]

const ACCENT_IDS = ACCENT_COLORS.map(c => c.id)
const FONT_IDS = TITLE_FONTS.map(f => f.id)

function loadSaved(key: string, validValues: string[], fallback: string): string {
  if (typeof localStorage === 'undefined') return fallback
  const saved = localStorage.getItem(key)
  return saved && validValues.includes(saved) ? saved : fallback
}

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

export function useTheme() {
  const accentColor = ref(loadSaved('accent-color', ACCENT_IDS, 'mist-blue'))
  const titleFont = ref(loadSaved('title-font', FONT_IDS, 'noto-serif'))

  function applyAccent(id: string) {
    if (typeof document !== 'undefined') {
      if (id === 'mist-blue') {
        delete document.documentElement.dataset.accent
      } else {
        document.documentElement.dataset.accent = id
      }
    }
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

  function setAccentColor(id: string) {
    if (!ACCENT_IDS.includes(id)) return
    accentColor.value = id
    localStorage.setItem('accent-color', id)
    applyAccent(id)
  }

  function setTitleFont(id: string) {
    if (!FONT_IDS.includes(id)) return
    titleFont.value = id
    localStorage.setItem('title-font', id)
    applyFont(id)
  }

  applyAccent(accentColor.value)
  applyFont(titleFont.value)

  return {
    accentColor,
    titleFont,
    setAccentColor,
    setTitleFont,
    accentColors: ACCENT_COLORS,
    titleFonts: TITLE_FONTS,
  }
}
