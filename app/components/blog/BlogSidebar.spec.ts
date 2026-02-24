import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import BlogSidebar from './BlogSidebar.vue'

const stubs = {
  NuxtLink: { template: '<a :href="to"><slot /></a>', props: ['to'] },
}

function createPost(overrides: Record<string, unknown> = {}) {
  return {
    path: '/blog/test',
    title: 'Test Post',
    description: 'desc',
    date: '2025-10-15',
    tags: ['随笔'],
    draft: false,
    featured: false,
    ...overrides,
  }
}

describe('BlogSidebar', () => {
  it('renders author avatar, name and bio', () => {
    const wrapper = mount(BlogSidebar, {
      props: { posts: [] },
      global: { stubs },
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toContain('unsplash')
    expect(wrapper.text()).toContain('柳尚佐')
    expect(wrapper.text()).toContain('记录生活，分享思考。')
  })

  it('extracts tags with correct counts', () => {
    const posts = [
      createPost({ path: '/blog/a', tags: ['随笔', '旅行'] }),
      createPost({ path: '/blog/b', tags: ['随笔', '技术'] }),
      createPost({ path: '/blog/c', tags: ['技术'] }),
    ]

    const wrapper = mount(BlogSidebar, {
      props: { posts },
      global: { stubs },
    })

    const tagLinks = wrapper.findAll('section:nth-of-type(2) a')
    expect(tagLinks.length).toBe(3)

    // Sorted by count desc, then name asc via localeCompare
    const texts = tagLinks.map((l) => l.text())
    // Both 随笔 and 技术 have count 2; 旅行 has count 1
    const countTwoTags = texts.slice(0, 2)
    expect(countTwoTags).toContainEqual(expect.stringContaining('随笔'))
    expect(countTwoTags).toContainEqual(expect.stringContaining('技术'))
    expect(countTwoTags[0]).toContain('2')
    expect(countTwoTags[1]).toContain('2')
    expect(texts[2]).toContain('旅行')
    expect(texts[2]).toContain('1')
  })

  it('sorts tags by count + recency heat score', () => {
    // Fix "now" so decay calculations are deterministic
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-01'))

    const posts = [
      // "老话题" — 3 posts all older than 180 days → recency bonus = 0
      createPost({ path: '/blog/a1', date: '2025-01-01', tags: ['老话题'] }),
      createPost({ path: '/blog/a2', date: '2025-01-15', tags: ['老话题'] }),
      createPost({ path: '/blog/a3', date: '2025-02-01', tags: ['老话题'] }),
      // "近期热" — 2 very recent posts → recency bonus ≈ 2 × 0.5 = 1.0
      createPost({ path: '/blog/b1', date: '2026-02-20', tags: ['近期热'] }),
      createPost({ path: '/blog/b2', date: '2026-02-25', tags: ['近期热'] }),
      // "新芽" — 1 recent post → recency bonus ≈ 0.5, not enough to beat count=3
      createPost({ path: '/blog/c1', date: '2026-02-28', tags: ['新芽'] }),
    ]

    const wrapper = mount(BlogSidebar, {
      props: { posts },
      global: { stubs },
    })

    const tagLinks = wrapper.findAll('section:nth-of-type(2) a')
    const texts = tagLinks.map((l) => l.text())

    // 老话题: score = 3 + 0 = 3.0
    // 近期热: score = 2 + ~1.35 = ~3.35 (recency boosts above 老话题)
    // 新芽:   score = 1 + ~0.7 = ~1.7 (single post can't beat count=3)
    expect(texts[0]).toContain('近期热')
    expect(texts[1]).toContain('老话题')
    expect(texts[2]).toContain('新芽')

    vi.useRealTimers()
  })

  it('generates correct tag link hrefs', () => {
    const posts = [createPost({ tags: ['随笔'] })]

    const wrapper = mount(BlogSidebar, {
      props: { posts },
      global: { stubs },
    })

    const tagLink = wrapper.find('section:nth-of-type(2) a')
    expect(tagLink.attributes('href')).toBe('/blog?tag=随笔')
  })

  it('groups posts into archives by year-month', () => {
    const posts = [
      createPost({ path: '/blog/a', date: '2026-01-05' }),
      createPost({ path: '/blog/b', date: '2026-01-18' }),
      createPost({ path: '/blog/c', date: '2025-12-20' }),
      createPost({ path: '/blog/d', date: '2025-10-15' }),
    ]

    const wrapper = mount(BlogSidebar, {
      props: { posts },
      global: { stubs },
    })

    const archiveLinks = wrapper.findAll('section:nth-of-type(3) a')
    expect(archiveLinks.length).toBe(3)

    // Sorted newest first
    expect(archiveLinks[0].text()).toContain('2026年1月')
    expect(archiveLinks[0].text()).toContain('2')
    expect(archiveLinks[1].text()).toContain('2025年12月')
    expect(archiveLinks[1].text()).toContain('1')
    expect(archiveLinks[2].text()).toContain('2025年10月')
    expect(archiveLinks[2].text()).toContain('1')
  })

  it('generates correct archive link hrefs', () => {
    const posts = [createPost({ date: '2025-12-20' })]

    const wrapper = mount(BlogSidebar, {
      props: { posts },
      global: { stubs },
    })

    const archiveLink = wrapper.find('section:nth-of-type(3) a')
    expect(archiveLink.attributes('href')).toBe('/blog?month=2025-12')
  })

  it('hides tags section when no posts have tags', () => {
    const posts = [createPost({ tags: [] })]

    const wrapper = mount(BlogSidebar, {
      props: { posts },
      global: { stubs },
    })

    // Only author card and archive should be visible (2 sections)
    const sections = wrapper.findAll('section')
    expect(sections.length).toBe(2)
  })

  it('hides archive section when no posts provided', () => {
    const wrapper = mount(BlogSidebar, {
      props: { posts: [] },
      global: { stubs },
    })

    // Only author card should be visible
    const sections = wrapper.findAll('section')
    expect(sections.length).toBe(1)
  })
})
