import {
  clearCache,
  layout,
  layoutWithLines,
  prepare,
  prepareWithSegments,
  setLocale,
  type LayoutLine,
  type PreparedText,
  type PreparedTextWithSegments,
} from '@chenglou/pretext'
import {
  computed,
  readonly,
  ref,
  shallowRef,
  toValue,
  watchEffect,
  type ComputedRef,
  type MaybeRefOrGetter,
  type Ref,
  type ShallowRef,
} from 'vue'

import { type FontInput, toFontString } from './font'
import { coerceNumber, normalizeWhiteSpace, type WhiteSpaceMode } from './shared'

type MaybeElement = Element | SVGElement | null | undefined
type PreparedValue = PreparedText | PreparedTextWithSegments

export interface UsePretextOptions {
  text: MaybeRefOrGetter<string>
  font: MaybeRefOrGetter<FontInput>
  lineHeight: MaybeRefOrGetter<number>
  width?: MaybeRefOrGetter<number | null | undefined>
  target?: MaybeRefOrGetter<MaybeElement>
  whiteSpace?: MaybeRefOrGetter<WhiteSpaceMode | null | undefined>
  locale?: MaybeRefOrGetter<string | null | undefined>
  observeResize?: MaybeRefOrGetter<boolean | undefined>
  withLines?: MaybeRefOrGetter<boolean | undefined>
}

export interface UsePretextResult<WithLines extends boolean = boolean> {
  width: Readonly<Ref<number>>
  prepared: Readonly<ShallowRef<PreparedValue | null>>
  font: ComputedRef<string>
  height: ComputedRef<number>
  lineCount: ComputedRef<number>
  lines: ComputedRef<WithLines extends true ? LayoutLine[] : LayoutLine[] | []>
  refresh: () => void
  clear: typeof clearCache
}

function readWidth(
  explicitWidth: number | null | undefined,
  element: MaybeElement,
): number {
  const preferred = coerceNumber(explicitWidth)

  if (preferred !== null) {
    return preferred
  }

  if (!element) {
    return 0
  }

  return element.getBoundingClientRect().width
}

export function usePretext<WithLines extends boolean = false>(
  options: UsePretextOptions,
): UsePretextResult<WithLines> {
  const width = ref(0)
  const prepared = shallowRef<PreparedValue | null>(null)
  const preparedWithLines = ref(false)
  const refreshTick = ref(0)
  let previousLocale: string | undefined

  const font = computed(() => toFontString(toValue(options.font)))
  const wantsLines = computed(() => Boolean(toValue(options.withLines)))

  watchEffect((onCleanup) => {
    const explicitWidth = toValue(options.width)
    const element = toValue(options.target)

    width.value = readWidth(explicitWidth, element)

    if (coerceNumber(explicitWidth) !== null) {
      return
    }

    if (!element || toValue(options.observeResize) === false || typeof ResizeObserver === 'undefined') {
      return
    }

    const observer = new ResizeObserver((entries) => {
      const next = entries[0]
      if (!next) {
        return
      }

      width.value = next.contentRect.width
    })

    observer.observe(element)
    onCleanup(() => observer.disconnect())
  })

  watchEffect(() => {
    refreshTick.value

    const locale = toValue(options.locale) ?? undefined
    if (locale !== previousLocale) {
      setLocale(locale)
      previousLocale = locale
    }

    const text = toValue(options.text)
    const whiteSpace = normalizeWhiteSpace(toValue(options.whiteSpace))
    const nextWithLines = wantsLines.value

    preparedWithLines.value = nextWithLines
    prepared.value = nextWithLines
      ? prepareWithSegments(text, font.value, { whiteSpace })
      : prepare(text, font.value, { whiteSpace })
  })

  const layoutState = computed(() => {
    const currentPrepared = prepared.value
    const currentWidth = width.value
    const currentLineHeight = coerceNumber(toValue(options.lineHeight))

    if (currentPrepared === null || currentWidth <= 0 || currentLineHeight === null || currentLineHeight <= 0) {
      return {
        height: 0,
        lineCount: 0,
        lines: [] as LayoutLine[],
      }
    }

    if (preparedWithLines.value) {
      return layoutWithLines(
        currentPrepared as PreparedTextWithSegments,
        currentWidth,
        currentLineHeight,
      )
    }

    const result = layout(currentPrepared as PreparedText, currentWidth, currentLineHeight)
    return {
      ...result,
      lines: [] as LayoutLine[],
    }
  })

  const refresh = () => {
    refreshTick.value += 1
  }

  return {
    width: readonly(width),
    prepared: readonly(prepared),
    font,
    height: computed(() => layoutState.value.height),
    lineCount: computed(() => layoutState.value.lineCount),
    lines: computed(() => layoutState.value.lines) as UsePretextResult<WithLines>['lines'],
    refresh,
    clear: clearCache,
  }
}

export interface UsePretextLinesOptions extends Omit<UsePretextOptions, 'withLines'> {}

export function usePretextLines(
  options: UsePretextLinesOptions,
): UsePretextResult<true> {
  return usePretext<true>({
    ...options,
    withLines: true,
  })
}
