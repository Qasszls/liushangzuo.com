/**
 * Explicitly-opted-in `any` for cases where a type is genuinely open
 * (e.g. test mocks, generic wrappers, third-party callback signatures).
 *
 * Using `SafeAny` instead of raw `any` makes the intent clear and
 * keeps `@typescript-eslint/no-explicit-any` enforceable elsewhere.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SafeAny = any
