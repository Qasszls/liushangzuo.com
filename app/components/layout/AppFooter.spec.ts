import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppFooter from './AppFooter.vue'

describe('AppFooter', () => {
  it('renders copyright with current year', () => {
    const wrapper = mount(AppFooter)
    const year = new Date().getFullYear()
    expect(wrapper.text()).toContain(`${year}`)
  })

  it('renders social links', () => {
    const wrapper = mount(AppFooter, {
      global: { stubs: { Icon: true } },
    })
    const links = wrapper.findAll('a[target="_blank"]')
    expect(links.length).toBeGreaterThan(0)
  })
})
