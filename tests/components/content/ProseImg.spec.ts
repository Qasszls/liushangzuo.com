import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProseImg from '~/components/content/ProseImg.vue'
import BlurImage from '~/components/ui/BlurImage.vue'

describe('ProseImg', () => {
  it('renders BlurImage with src and alt from props', () => {
    const wrapper = mount(ProseImg, {
      props: {
        src: '/images/blog/hlj-winter-songhua-1.jpg',
        alt: '冰封的江面',
      },
      global: {
        components: { BlurImage },
      },
    })
    const blurImage = wrapper.findComponent(BlurImage)
    expect(blurImage.exists()).toBe(true)
    expect(blurImage.props('src')).toBe('/images/blog/hlj-winter-songhua-1.jpg')
    expect(blurImage.props('alt')).toBe('冰封的江面')
  })

  it('wraps BlurImage in a figure with rounded corners', () => {
    const wrapper = mount(ProseImg, {
      props: { src: '/images/test.jpg', alt: 'test' },
      global: { components: { BlurImage } },
    })
    const figure = wrapper.find('figure')
    expect(figure.exists()).toBe(true)
    expect(figure.classes()).toContain('rounded-xl')
    expect(figure.classes()).toContain('overflow-hidden')
  })

  it('renders alt text as figcaption when provided', () => {
    const wrapper = mount(ProseImg, {
      props: { src: '/images/test.jpg', alt: '图片说明' },
      global: { components: { BlurImage } },
    })
    const caption = wrapper.find('figcaption')
    expect(caption.exists()).toBe(true)
    expect(caption.text()).toBe('图片说明')
  })
})
