import { describe, expect, it } from 'vitest'

import { toFontString } from './font'

describe('toFontString', () => {
  it('passes string inputs through unchanged', () => {
    expect(toFontString('16px Inter')).toBe('16px Inter')
  })

  it('builds a canvas font string from object input', () => {
    expect(
      toFontString({
        style: 'italic',
        weight: 600,
        size: '18px',
        family: '"Helvetica Neue", sans-serif',
      }),
    ).toBe('italic 600 18px "Helvetica Neue", sans-serif')
  })

  it('omits blank optional fields', () => {
    expect(
      toFontString({
        style: '',
        variant: 'normal',
        size: '14px',
        family: 'Inter',
      }),
    ).toBe('14px Inter')
  })
})
