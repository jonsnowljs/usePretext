export interface FontObject {
  family: string
  size: string
  style?: string
  variant?: string
  weight?: string | number
  stretch?: string
}

export type FontInput = string | FontObject

const DEFAULT_VARIANT = 'normal'

export function toFontString(input: FontInput): string {
  if (typeof input === 'string') {
    return input
  }

  const parts = [
    input.style,
    input.variant === DEFAULT_VARIANT ? undefined : input.variant,
    input.weight,
    input.stretch,
    input.size,
    input.family,
  ]

  return parts
    .filter((part) => part !== undefined && `${part}`.trim().length > 0)
    .join(' ')
}
