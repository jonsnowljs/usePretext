import { describe, expect, it } from 'vitest'

import { coerceNumber, normalizeWhiteSpace } from './shared'

describe('coerceNumber', () => {
  it('returns finite numbers', () => {
    expect(coerceNumber(120)).toBe(120)
  })

  it('returns null for invalid numbers', () => {
    expect(coerceNumber(Number.NaN)).toBeNull()
    expect(coerceNumber(Number.POSITIVE_INFINITY)).toBeNull()
  })
})

describe('normalizeWhiteSpace', () => {
  it('defaults to normal', () => {
    expect(normalizeWhiteSpace(undefined)).toBe('normal')
  })

  it('preserves pre-wrap', () => {
    expect(normalizeWhiteSpace('pre-wrap')).toBe('pre-wrap')
  })
})
