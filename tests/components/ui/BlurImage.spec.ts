import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BlurImage from '~/components/ui/BlurImage.vue'

describe('BlurImage', () => {
  const defaultProps = {
    src: '/images/blog/beijing-autumn-gugong-cover.jpg',
    alt: 'Test image',
  }

  it('renders blur image with derived blur path', () => {
    const wrapper = mount(BlurImage, { props: defaultProps })
    const blurImg = wrapper.find('[data-blur]')
    expect(blurImg.exists()).toBe(true)
    expect(blurImg.attributes('src')).toBe('/images/blog/beijing-autumn-gugong-cover-blur.jpg')
  })

  it('renders main image with original src and lazy loading', () => {
    const wrapper = mount(BlurImage, { props: defaultProps })
    const mainImg = wrapper.find('[data-main]')
    expect(mainImg.exists()).toBe(true)
    expect(mainImg.attributes('src')).toBe('/images/blog/beijing-autumn-gugong-cover.jpg')
    expect(mainImg.attributes('loading')).toBe('lazy')
  })

  it('passes alt to both images', () => {
    const wrapper = mount(BlurImage, { props: defaultProps })
    expect(wrapper.find('[data-blur]').attributes('alt')).toBe('Test image')
    expect(wrapper.find('[data-main]').attributes('alt')).toBe('Test image')
  })

  it('main image starts with opacity-0', () => {
    const wrapper = mount(BlurImage, { props: defaultProps })
    const mainImg = wrapper.find('[data-main]')
    expect(mainImg.classes()).toContain('opacity-0')
  })

  it('transitions to opacity-100 after main image loads', async () => {
    const wrapper = mount(BlurImage, { props: defaultProps })
    const mainImg = wrapper.find('[data-main]')
    await mainImg.trigger('load')
    expect(mainImg.classes()).toContain('opacity-100')
  })

  it('derives blur path for various extensions', () => {
    const wrapper = mount(BlurImage, {
      props: { src: '/images/works/photo.png', alt: 'PNG test' },
    })
    expect(wrapper.find('[data-blur]').attributes('src')).toBe('/images/works/photo-blur.jpg')
  })

  it('applies custom class to wrapper', () => {
    const wrapper = mount(BlurImage, {
      props: { ...defaultProps, class: 'aspect-[4/3]' },
    })
    expect(wrapper.classes()).toContain('aspect-[4/3]')
  })
})
