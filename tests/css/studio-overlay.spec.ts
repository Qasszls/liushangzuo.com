import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

/**
 * Regression tests for mobile Studio overlay click-blocking bug.
 *
 * When Nuxt Studio is active on mobile, the `nuxt-studio` element becomes a
 * fixed full-viewport overlay at z-index 9999. Navigation elements (header,
 * HomeButton) must have a HIGHER z-index so they remain clickable above the
 * editor overlay.
 *
 * See: https://github.com/Qasszls/liushangzuo.com/pull/10
 */
describe('nuxt-studio mobile overlay CSS', () => {
  const css = readFileSync(
    resolve(__dirname, '../../app/assets/css/main.css'),
    'utf-8',
  )

  it('scopes the fixed-overlay rule to body[data-studio-active]', () => {
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

  it('raises header z-index above nuxt-studio (9999) when Studio is active', () => {
    // Extract the z-index value from the nuxt-studio rule
    const studioZMatch = css.match(/nuxt-studio[^{]*\{[^}]*z-index:\s*(\d+)/)
    expect(studioZMatch, 'nuxt-studio must have a z-index rule').toBeTruthy()
    const studioZ = Number(studioZMatch![1])

    // Extract the z-index for the header rule scoped to data-studio-active
    const headerZMatch = css.match(/body\[data-studio-active\]\s+header[^{]*\{[^}]*z-index:\s*(\d+)/)
    expect(
      headerZMatch,
      'header must have a z-index rule scoped to body[data-studio-active]',
    ).toBeTruthy()
    const headerZ = Number(headerZMatch![1])

    expect(
      headerZ,
      `header z-index (${headerZ}) must be greater than nuxt-studio z-index (${studioZ}) `
      + '— otherwise the hamburger menu is blocked by the Studio editor overlay',
    ).toBeGreaterThan(studioZ)
  })
})

describe('HomeButton z-index', () => {
  const homeButton = readFileSync(
    resolve(__dirname, '../../app/components/studio/HomeButton.vue'),
    'utf-8',
  )

  it('has z-index above the Studio editor overlay (9999)', () => {
    const zMatch = homeButton.match(/z-\[(\d+)\]/)
    expect(zMatch, 'HomeButton must have an explicit z-index utility class').toBeTruthy()
    const homeZ = Number(zMatch![1])

    expect(
      homeZ,
      `HomeButton z-index (${homeZ}) must be greater than 9999 `
      + '— otherwise it is blocked by the nuxt-studio editor overlay on mobile',
    ).toBeGreaterThan(9999)
  })
})
