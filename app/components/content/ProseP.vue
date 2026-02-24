<script lang="ts">
import { defineComponent, h, type VNode } from 'vue'

const BLOCK_ELEMENTS = new Set([
  'div', 'figure', 'figcaption', 'blockquote', 'pre', 'table',
  'ul', 'ol', 'dl', 'hr', 'section', 'article', 'aside',
  'header', 'footer', 'nav', 'main', 'details', 'form',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
])

const INLINE_PROSE_COMPONENTS = new Set([
  'ProseA', 'ProseCode', 'ProseCodeInline', 'ProseEm', 'ProseStrong',
])

function containsBlockContent(children: VNode[]): boolean {
  for (const child of children) {
    if (child.type && typeof child.type === 'object') {
      const name = (child.type as any).__name || (child.type as any).name || ''
      if (!INLINE_PROSE_COMPONENTS.has(name)) {
        return true
      }
    }
    if (typeof child.type === 'string' && BLOCK_ELEMENTS.has(child.type)) {
      return true
    }
  }
  return false
}

export default defineComponent({
  name: 'ProseP',
  setup(_, { slots }) {
    return () => {
      const children = slots.default?.() || []
      const tag = containsBlockContent(children) ? 'div' : 'p'
      return h(tag, null, children)
    }
  },
})
</script>
