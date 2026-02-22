import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { useTocActiveHeading } from '~/composables/useTocActiveHeading'

describe('useTocActiveHeading', () => {
  let observerCallback: IntersectionObserverCallback
  const mockObserver = { observe: vi.fn(), disconnect: vi.fn() }

  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', class {
      constructor(cb: IntersectionObserverCallback) {
        observerCallback = cb
      }
      observe = mockObserver.observe
      disconnect = mockObserver.disconnect
    })
    vi.spyOn(document, 'getElementById').mockReturnValue(document.createElement('h2'))
    mockObserver.observe.mockClear()
    mockObserver.disconnect.mockClear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  function mountComposable(ids: string[]) {
    return mount(defineComponent({
      setup() {
        const idsRef = ref(ids)
        const activeId = useTocActiveHeading(idsRef)
        return { activeId }
      },
      template: '<div />',
    }))
  }

  it('初始 activeId 为空字符串', () => {
    const wrapper = mountComposable(['heading-1'])
    expect(wrapper.vm.activeId).toBe('')
  })

  it('标题进入视口时更新 activeId', () => {
    const wrapper = mountComposable(['heading-1', 'heading-2'])
    observerCallback(
      [{ isIntersecting: true, target: { id: 'heading-1' } } as IntersectionObserverEntry],
      mockObserver as unknown as IntersectionObserver,
    )
    expect(wrapper.vm.activeId).toBe('heading-1')
  })

  it('标题离开视口时不重置 activeId', () => {
    const wrapper = mountComposable(['heading-1'])
    observerCallback(
      [{ isIntersecting: true, target: { id: 'heading-1' } } as IntersectionObserverEntry],
      mockObserver as unknown as IntersectionObserver,
    )
    observerCallback(
      [{ isIntersecting: false, target: { id: 'heading-1' } } as IntersectionObserverEntry],
      mockObserver as unknown as IntersectionObserver,
    )
    expect(wrapper.vm.activeId).toBe('heading-1')
  })

  it('挂载时为每个 id 调用 observer.observe', () => {
    mountComposable(['h1', 'h2', 'h3'])
    expect(mockObserver.observe).toHaveBeenCalledTimes(3)
  })

  it('ids 为空时不创建 observer', () => {
    mountComposable([])
    expect(mockObserver.observe).not.toHaveBeenCalled()
  })
})
