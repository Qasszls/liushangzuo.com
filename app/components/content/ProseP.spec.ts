import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import ProseP from './ProseP.vue'

describe('ProseP', () => {
  it('renders <p> for plain text content', () => {
    const wrapper = mount(ProseP, {
      slots: { default: 'Hello world' },
    })
    expect(wrapper.element.tagName).toBe('P')
    expect(wrapper.text()).toBe('Hello world')
  })

  it('renders <p> for inline HTML elements', () => {
    const wrapper = mount(ProseP, {
      slots: { default: () => [h('span', 'inline'), h('a', { href: '#' }, 'link')] },
    })
    expect(wrapper.element.tagName).toBe('P')
  })

  it('renders <div> when slot contains a block-level HTML element', () => {
    const wrapper = mount(ProseP, {
      slots: { default: () => h('figure', h('img', { src: 'test.jpg' })) },
    })
    expect(wrapper.element.tagName).toBe('DIV')
  })

  it('renders <div> when slot contains a div element', () => {
    const wrapper = mount(ProseP, {
      slots: { default: () => h('div', 'block content') },
    })
    expect(wrapper.element.tagName).toBe('DIV')
  })

  it('renders <div> when slot contains an unknown component (treated as block)', () => {
    const BlockComponent = defineComponent({
      name: 'ProseImg',
      setup() {
        return () => h('figure', h('img', { src: 'test.jpg', alt: 'test' }))
      },
    })
    const wrapper = mount(ProseP, {
      slots: { default: () => h(BlockComponent) },
    })
    expect(wrapper.element.tagName).toBe('DIV')
  })

  it('renders <p> when slot contains a known inline prose component', () => {
    const InlineComponent = defineComponent({
      name: 'ProseCode',
      setup() {
        return () => h('code', 'inline code')
      },
    })
    const wrapper = mount(ProseP, {
      slots: { default: () => [h(InlineComponent), ' some text'] },
    })
    expect(wrapper.element.tagName).toBe('P')
  })

  it('renders <div> when slot mixes text with block elements', () => {
    const wrapper = mount(ProseP, {
      slots: { default: () => ['Some text ', h('figure', h('img', { src: 'test.jpg' }))] },
    })
    expect(wrapper.element.tagName).toBe('DIV')
  })

  it('renders <p> for empty slot', () => {
    const wrapper = mount(ProseP)
    expect(wrapper.element.tagName).toBe('P')
  })
})
