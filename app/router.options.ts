import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, _from, savedPosition) {
    // Back/forward navigation → restore saved scroll position
    if (savedPosition) {
      return savedPosition
    }

    // Hash link → scroll to anchor
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }

    // New navigation → scroll to top
    return { top: 0 }
  },
}
