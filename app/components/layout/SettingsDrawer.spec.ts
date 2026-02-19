import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import SettingsDrawer from './SettingsDrawer.vue'

const stubs = { Icon: { template: '<span />', props: ['name'] } }

const mockSetAccentColor = vi.fn()
const mockSetTitleFont = vi.fn()

vi.mock('~/composables/useTheme', () => ({
  useTheme: () => ({
    accentColor: { value: 'mist-blue' },
    titleFont: { value: 'noto-serif' },
    setAccentColor: mockSetAccentColor,
    setTitleFont: mockSetTitleFont,
    accentColors: [
      { id: 'mist-blue', label: '雾霾蓝', color: '#7C9CB5' },
      { id: 'bean-green', label: '豆沙绿', color: '#8FA395' },
      { id: 'lotus-pink', label: '藕荷粉', color: '#B8A9A1' },
      { id: 'desert-camel', label: '淡漠驼', color: '#A89F91' },
    ],
    titleFonts: [
      { id: 'noto-serif', label: 'Noto Serif SC', family: '' },
      { id: 'lxgw-wenkai', label: '霞鹜文楷', family: '' },
      { id: 'system', label: '系统字体', family: '' },
    ],
  }),
  ACCENT_COLORS: [],
  TITLE_FONTS: [],
}))

describe('SettingsDrawer', () => {
  it('is hidden when modelValue is false', () => {
    const wrapper = mount(SettingsDrawer, {
      props: { modelValue: false },
      global: { stubs },
    })
    expect(wrapper.find('[data-test="drawer-panel"]').exists()).toBe(false)
  })

  it('is visible when modelValue is true', () => {
    const wrapper = mount(SettingsDrawer, {
      props: { modelValue: true },
      global: { stubs },
    })
    expect(wrapper.find('[data-test="drawer-panel"]').exists()).toBe(true)
  })

  it('renders four accent color buttons', () => {
    const wrapper = mount(SettingsDrawer, {
      props: { modelValue: true },
      global: { stubs },
    })
    const colorButtons = wrapper.findAll('[data-test="accent-color-button"]')
    expect(colorButtons).toHaveLength(4)
  })

  it('calls setAccentColor when accent button clicked', async () => {
    const wrapper = mount(SettingsDrawer, {
      props: { modelValue: true },
      global: { stubs },
    })
    const buttons = wrapper.findAll('[data-test="accent-color-button"]')
    await buttons[1].trigger('click')
    expect(mockSetAccentColor).toHaveBeenCalledWith('bean-green')
  })

  it('renders three font buttons', () => {
    const wrapper = mount(SettingsDrawer, {
      props: { modelValue: true },
      global: { stubs },
    })
    const fontButtons = wrapper.findAll('[data-test="font-button"]')
    expect(fontButtons).toHaveLength(3)
  })

  it('calls setTitleFont when font button clicked', async () => {
    const wrapper = mount(SettingsDrawer, {
      props: { modelValue: true },
      global: { stubs },
    })
    const buttons = wrapper.findAll('[data-test="font-button"]')
    await buttons[1].trigger('click')
    expect(mockSetTitleFont).toHaveBeenCalledWith('lxgw-wenkai')
  })

  it('emits close when overlay clicked', async () => {
    const wrapper = mount(SettingsDrawer, {
      props: { modelValue: true },
      global: { stubs },
    })
    await wrapper.find('[data-test="drawer-overlay"]').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })
})
