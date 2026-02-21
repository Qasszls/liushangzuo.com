import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

/**
 * Regression tests for mobile Studio overlay click-blocking bug.
 *
 * The project must NOT force the `nuxt-studio` element into a fixed
 * full-viewport overlay on mobile — doing so blocks all touch events
 * on page content. The Studio module manages its own mobile layout.
 *
 * See: https://github.com/Qasszls/liushangzuo.com/pull/10
 */
describe('nuxt-studio mobile overlay CSS', () => {
  const css = readFileSync(
    resolve(__dirname, '../../app/assets/css/main.css'),
    'utf-8',
  )

  it('does not force nuxt-studio into a fixed full-viewport overlay', () => {
    // If there's any rule targeting nuxt-studio with position:fixed + inset:0,
    // it creates a full-screen overlay that blocks all clicks on mobile.
    const fullViewportRule = css.match(
      /nuxt-studio[^{]*\{[^}]*(position:\s*fixed[^}]*inset:\s*0|inset:\s*0[^}]*position:\s*fixed)/,
    )

    expect(
      fullViewportRule,
      'nuxt-studio must NOT be forced into a fixed full-viewport overlay — '
      + 'this blocks all touch events on page content. '
      + 'Let the Studio module manage its own mobile layout.',
    ).toBeNull()
  })
})

describe('HomeButton z-index', () => {
  const homeButton = readFileSync(
    resolve(__dirname, '../../app/components/studio/HomeButton.vue'),
    'utf-8',
  )

  it('has a high z-index so it stays above the Studio editor', () => {
    const zMatch = homeButton.match(/z-\[(\d+)\]/)
    expect(zMatch, 'HomeButton must have an explicit z-index utility class').toBeTruthy()
    const homeZ = Number(zMatch![1])

    expect(
      homeZ,
      `HomeButton z-index (${homeZ}) must be at least 9990 to stay above the Studio editor`,
    ).toBeGreaterThanOrEqual(9990)
  })
})
