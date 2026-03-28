export type WhiteSpaceMode = 'normal' | 'pre-wrap'

export function coerceNumber(value: number | null | undefined): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return null
  }

  return value
}

export function normalizeWhiteSpace(value: WhiteSpaceMode | null | undefined): WhiteSpaceMode {
  return value === 'pre-wrap' ? 'pre-wrap' : 'normal'
}
