import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

/**
 * Regression test for mobile click-blocking bug.
 *
 * The `nuxt-studio` element must only be positioned as a fixed overlay
 * when Studio is active (`body[data-studio-active]`). Without that guard
 * the element covers the entire mobile viewport at z-index 9999 and
 * swallows all touch events.
 *
 * See: https://github.com/Qasszls/liushangzuo.com/pull/10
 */
describe('nuxt-studio mobile overlay CSS', () => {
  const css = readFileSync(
    resolve(__dirname, '../../app/assets/css/main.css'),
    'utf-8',
  )

  it('scopes the fixed-overlay rule to body[data-studio-active]', () => {
    // Match any rule that targets `nuxt-studio` with `position: fixed`
    // and extract the full selector before the opening brace.
    const fixedRules = [...css.matchAll(/([^{}]*nuxt-studio[^{]*)\{[^}]*position:\s*fixed/g)]

    expect(fixedRules.length).toBeGreaterThan(0)

    for (const [, selector] of fixedRules) {
      expect(
        selector,
        'nuxt-studio fixed-position rule must be scoped to body[data-studio-active] — '
        + 'otherwise it blocks all clicks on mobile',
      ).toContain('data-studio-active')
    }
  })
})
