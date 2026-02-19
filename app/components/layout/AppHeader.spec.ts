import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AppHeader from './AppHeader.vue'

const stubs = {
  NuxtLink: { template: '<a :href="to"><slot /></a>', props: ['to'] },
  Icon: { template: '<span />', props: ['name'] },
}

describe('AppHeader', () => {
  it('renders site name', () => {
    const wrapper = mount(AppHeader, { global: { stubs } })
    expect(wrapper.text()).toContain('Your Name')
  })

  it('renders navigation links', () => {
    const wrapper = mount(AppHeader, { global: { stubs } })
    const links = wrapper.findAll('a')
    const hrefs = links.map(l => l.attributes('href'))
    expect(hrefs).toContain('/')
    expect(hrefs).toContain('/blog')
    expect(hrefs).toContain('/works')
    expect(hrefs).toContain('/about')
  })

  it('toggles mobile menu on button click', async () => {
    const wrapper = mount(AppHeader, { global: { stubs } })
    const menuButton = wrapper.find('[data-test="mobile-menu-button"]')
    expect(wrapper.find('[data-test="mobile-menu"]').exists()).toBe(false)
    await menuButton.trigger('click')
    expect(wrapper.find('[data-test="mobile-menu"]').exists()).toBe(true)
  })

  it('applies frosted glass class when scrolled prop is true', () => {
    const wrapper = mount(AppHeader, {
      props: { scrolled: true },
      global: { stubs },
    })
    expect(wrapper.find('header').classes()).toContain('backdrop-blur-md')
  })

  it('emits open-settings when settings button clicked', async () => {
    const wrapper = mount(AppHeader, { global: { stubs } })
    const settingsBtn = wrapper.find('[data-test="settings-button"]')
    await settingsBtn.trigger('click')
    expect(wrapper.emitted('open-settings')).toHaveLength(1)
  })
})
