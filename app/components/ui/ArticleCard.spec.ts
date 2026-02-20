import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ArticleCard from './ArticleCard.vue'

const stubs = {
  NuxtLink: { template: '<a :href="to"><slot /></a>', props: ['to'] },
  BlurImage: { template: '<img :src="src" :alt="alt" />', props: ['src', 'alt'] },
}

const post = {
  _path: '/blog/hello-world',
  title: '你好，世界',
  description: '第一篇随笔',
  date: '2026-02-19',
  tags: ['随笔', '建站'],
  cover: '/images/placeholder.svg',
}

describe('ArticleCard', () => {
  it('renders title', () => {
    const wrapper = mount(ArticleCard, { props: { post }, global: { stubs } })
    expect(wrapper.text()).toContain('你好，世界')
  })

  it('renders description', () => {
    const wrapper = mount(ArticleCard, { props: { post }, global: { stubs } })
    expect(wrapper.text()).toContain('第一篇随笔')
  })

  it('renders formatted date in zh-CN', () => {
    const wrapper = mount(ArticleCard, { props: { post }, global: { stubs } })
    expect(wrapper.text()).toContain('2026')
  })

  it('renders tags', () => {
    const wrapper = mount(ArticleCard, { props: { post }, global: { stubs } })
    expect(wrapper.text()).toContain('随笔')
    expect(wrapper.text()).toContain('建站')
  })

  it('links to post path', () => {
    const wrapper = mount(ArticleCard, { props: { post }, global: { stubs } })
    const link = wrapper.find('a')
    expect(link.attributes('href')).toBe('/blog/hello-world')
  })

  it('renders cover image when provided', () => {
    const wrapper = mount(ArticleCard, { props: { post }, global: { stubs } })
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/images/placeholder.svg')
  })

  it('hides cover image when not provided', () => {
    const noCoverPost = { ...post, cover: undefined }
    const wrapper = mount(ArticleCard, { props: { post: noCoverPost }, global: { stubs } })
    expect(wrapper.find('img').exists()).toBe(false)
  })
})
