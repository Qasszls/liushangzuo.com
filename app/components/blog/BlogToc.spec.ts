import { mount } from '@vue/test-utils'
import BlogToc from './BlogToc.vue'

const links = [
  {
    id: 'intro',
    text: '介绍',
    depth: 2,
    children: [
      { id: 'background', text: '背景', depth: 3 },
    ],
  },
  { id: 'conclusion', text: '总结', depth: 2, children: [] },
]

describe('BlogToc', () => {
  it('渲染 h2 条目', () => {
    const wrapper = mount(BlogToc, { props: { links, activeId: '' } })
    expect(wrapper.text()).toContain('介绍')
    expect(wrapper.text()).toContain('总结')
  })

  it('渲染 h3 子条目，缩进显示', () => {
    const wrapper = mount(BlogToc, { props: { links, activeId: '' } })
    expect(wrapper.text()).toContain('背景')
    const nestedUl = wrapper.find('ul ul')
    expect(nestedUl.exists()).toBe(true)
    expect(nestedUl.text()).toContain('背景')
  })

  it('links 为空时不渲染列表项', () => {
    const wrapper = mount(BlogToc, { props: { links: [], activeId: '' } })
    expect(wrapper.find('li').exists()).toBe(false)
  })

  it('激活项有加粗样式', () => {
    const wrapper = mount(BlogToc, { props: { links, activeId: 'intro' } })
    const activeLink = wrapper.find('a[href="#intro"]')
    expect(activeLink.classes()).toContain('font-semibold')
  })

  it('非激活项无加粗样式', () => {
    const wrapper = mount(BlogToc, { props: { links, activeId: 'intro' } })
    const inactiveLink = wrapper.find('a[href="#conclusion"]')
    expect(inactiveLink.classes()).not.toContain('font-semibold')
  })

  it('h3 激活项有加粗样式', () => {
    const wrapper = mount(BlogToc, { props: { links, activeId: 'background' } })
    const activeChild = wrapper.find('a[href="#background"]')
    expect(activeChild.classes()).toContain('font-semibold')
  })

  it('链接 href 正确', () => {
    const wrapper = mount(BlogToc, { props: { links, activeId: '' } })
    expect(wrapper.find('a[href="#intro"]').exists()).toBe(true)
    expect(wrapper.find('a[href="#background"]').exists()).toBe(true)
  })
})
