<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'

import { usePretext, usePretextLines } from 'use-pretext'

import DemoControls from './components/DemoControls.vue'
import PageAccordion from './pages/PageAccordion.vue'
import PageCanvas from './pages/PageCanvas.vue'
import PageComposer from './pages/PageComposer.vue'
import PageFeed from './pages/PageFeed.vue'
import PageManual from './pages/PageManual.vue'
import PageOverview from './pages/PageOverview.vue'

type PresetId = 'product' | 'multilingual' | 'poetry'
type DemoPageId = 'overview' | 'feed' | 'composer' | 'manual' | 'canvas' | 'accordion'

const COPY: Record<PresetId, string> = {
  product:
    'Pretext lets product surfaces measure text before layout becomes expensive. You can reserve space for cards, lists, and virtualized rows without forcing DOM reflow at every render.',
  multilingual:
    'Design systems rarely fail in English. They fail when the same component must carry Arabic, Chinese, emoji, and long German-style compounds in one responsive surface. 春天到了. بدأت الرحلة. Genau hier wird Layout ehrlich.',
  poetry:
    'We shape the line, then the line shapes the screen.\nTabs\tand breaks stay visible when pre-wrap is enabled.\nEach width becomes a different rhythm.',
}

const FONT_PRESETS = {
  editorial: {
    label: 'Editorial',
    family: 'Georgia, serif',
    size: '18px',
    weight: 400,
    lineHeight: 30,
  },
  ui: {
    label: 'UI Sans',
    family: 'Manrope, sans-serif',
    size: '18px',
    weight: 500,
    lineHeight: 28,
  },
  dense: {
    label: 'Dense',
    family: '"Helvetica Neue", Arial, sans-serif',
    size: '16px',
    weight: 500,
    lineHeight: 24,
  },
} as const

const PRESET_OPTIONS: Array<{ id: PresetId; label: string }> = [
  { id: 'product', label: 'Product copy' },
  { id: 'multilingual', label: 'Multilingual' },
  { id: 'poetry', label: 'Poetry / pre-wrap' },
]

const PAGE_OPTIONS: Array<{ id: DemoPageId; label: string; blurb: string }> = [
  { id: 'overview', label: 'Overview', blurb: 'See the available use cases.' },
  { id: 'feed', label: 'Feed Card', blurb: 'Reserve card height before paint.' },
  { id: 'composer', label: 'Composer', blurb: 'Drive autosize-like input shells.' },
  { id: 'manual', label: 'Manual Lines', blurb: 'Inspect the wrapped line output.' },
  { id: 'canvas', label: 'Canvas', blurb: 'Render text directly to a canvas.' },
  { id: 'accordion', label: 'Accordion', blurb: 'Animate open panels from measured text height.' },
]

function parsePageHash(hash: string): DemoPageId {
  const candidate = hash.replace(/^#/, '')
  return PAGE_OPTIONS.some((page) => page.id === candidate) ? (candidate as DemoPageId) : 'overview'
}

const activePage = ref<DemoPageId>(typeof window === 'undefined' ? 'overview' : parsePageHash(window.location.hash))
const preset = ref<PresetId>('multilingual')
const selectedFont = ref<keyof typeof FONT_PRESETS>('ui')
const locale = ref('en')
const usePreWrap = ref(false)
const composerWidth = ref(320)
const threadWidth = ref(360)
const canvasWidth = ref(420)
const bodyText = ref(COPY[preset.value])
const threadTarget = ref<HTMLElement | null>(null)
const composerTarget = ref<HTMLElement | null>(null)
const canvasTarget = ref<HTMLCanvasElement | null>(null)

const fontConfig = computed(() => FONT_PRESETS[selectedFont.value])
const fontOptions = computed(() =>
  Object.entries(FONT_PRESETS).map(([id, config]) => ({
    id: id as keyof typeof FONT_PRESETS,
    label: config.label,
  })),
)
const currentPage = computed(() => PAGE_OPTIONS.find((page) => page.id === activePage.value) ?? PAGE_OPTIONS[0]!)
const whiteSpaceMode = computed(() => (usePreWrap.value ? 'pre-wrap' : 'normal'))
const cssFont = computed(
  () =>
    `${fontConfig.value.weight} ${fontConfig.value.size}/${fontConfig.value.lineHeight}px ${fontConfig.value.family}`,
)

const threadMessages = computed(() => [
  {
    id: 'm1',
    author: 'Ops',
    tone: 'system',
    text: 'Shipping update: reserve vertical space before hydration so cards stop jumping when translated content arrives.',
  },
  {
    id: 'm2',
    author: 'Design',
    tone: 'accent',
    text: bodyText.value,
  },
  {
    id: 'm3',
    author: 'QA',
    tone: 'neutral',
    text: 'Edge cases: 🇯🇵 narrow columns, Arabic punctuation, and long tokens_with_no_breaks_that_still_need_overflow_wrap behavior.',
  },
])

const threadMeasurement = usePretext({
  target: threadTarget,
  text: bodyText,
  lineHeight: computed(() => fontConfig.value.lineHeight),
  font: computed(() => ({
    family: fontConfig.value.family,
    size: fontConfig.value.size,
    weight: fontConfig.value.weight,
  })),
  locale,
  whiteSpace: whiteSpaceMode,
})

const manualLayout = usePretextLines({
  width: composerWidth,
  text: bodyText,
  lineHeight: computed(() => fontConfig.value.lineHeight),
  font: computed(() => ({
    family: fontConfig.value.family,
    size: fontConfig.value.size,
    weight: fontConfig.value.weight,
  })),
  locale,
  whiteSpace: whiteSpaceMode,
})

const composerMeasurement = usePretext({
  target: composerTarget,
  text: bodyText,
  lineHeight: computed(() => fontConfig.value.lineHeight),
  font: computed(() => ({
    family: fontConfig.value.family,
    size: fontConfig.value.size,
    weight: fontConfig.value.weight,
  })),
  locale,
  whiteSpace: whiteSpaceMode,
})

const canvasPadding = 24
const canvasInnerWidth = computed(() => Math.max(canvasWidth.value - canvasPadding * 2, 80))
const canvasLayout = usePretextLines({
  width: canvasInnerWidth,
  text: bodyText,
  lineHeight: computed(() => fontConfig.value.lineHeight),
  font: computed(() => ({
    family: fontConfig.value.family,
    size: fontConfig.value.size,
    weight: fontConfig.value.weight,
  })),
  locale,
  whiteSpace: whiteSpaceMode,
})
const canvasHeight = computed(() => Math.max(canvasLayout.height.value + canvasPadding * 2, 180))

watchEffect(() => {
  const canvas = canvasTarget.value
  if (!canvas) {
    return
  }

  const dpr = window.devicePixelRatio || 1
  const width = canvasWidth.value
  const height = canvasHeight.value
  const context = canvas.getContext('2d')
  if (!context) {
    return
  }

  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  context.setTransform(1, 0, 0, 1, 0, 0)
  context.scale(dpr, dpr)
  context.clearRect(0, 0, width, height)

  const gradient = context.createLinearGradient(0, 0, 0, height)
  gradient.addColorStop(0, '#0f1728')
  gradient.addColorStop(1, '#1d3356')
  context.fillStyle = gradient
  context.fillRect(0, 0, width, height)

  context.strokeStyle = 'rgba(255,255,255,0.08)'
  context.lineWidth = 1
  context.strokeRect(0.5, 0.5, width - 1, height - 1)

  context.strokeStyle = 'rgba(139, 208, 255, 0.24)'
  context.beginPath()
  context.moveTo(canvasPadding + 0.5, 0)
  context.lineTo(canvasPadding + 0.5, height)
  context.moveTo(width - canvasPadding + 0.5, 0)
  context.lineTo(width - canvasPadding + 0.5, height)
  context.stroke()

  context.fillStyle = 'rgba(255,255,255,0.72)'
  context.font = '700 11px Manrope, sans-serif'
  context.textAlign = 'left'
  context.fillText(`Canvas width ${width}px`, canvasPadding, 16)
  context.textAlign = 'right'
  context.fillText(`Text box ${canvasInnerWidth.value}px`, width - canvasPadding, 16)

  context.font = `${fontConfig.value.weight} ${fontConfig.value.size} ${fontConfig.value.family}`
  context.textAlign = 'left'
  context.textBaseline = 'top'
  context.fillStyle = '#f6fbff'

  for (const [index, line] of canvasLayout.lines.value.entries()) {
    const y = canvasPadding + index * fontConfig.value.lineHeight
    context.fillText(line.text, canvasPadding, y)
  }
})

function handleHashChange(): void {
  activePage.value = parsePageHash(window.location.hash)
}

function selectPage(page: DemoPageId): void {
  activePage.value = page
  if (typeof window !== 'undefined') {
    window.location.hash = page
  }
}

function applyPreset(next: PresetId): void {
  preset.value = next
  bodyText.value = COPY[next]
  usePreWrap.value = next === 'poetry'
}

onMounted(() => {
  handleHashChange()
  window.addEventListener('hashchange', handleHashChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', handleHashChange)
})
</script>

<template>
  <main class="page-shell">
    <section class="hero card">
      <p class="eyebrow">Pretext Demo</p>
      <h1>Separate pages for each text-layout use case.</h1>
      <p class="lede">
        The controls stay shared, but each page isolates one pattern so it is easier to understand what Pretext is
        doing.
      </p>
    </section>

    <nav class="page-tabs card" aria-label="Demo pages">
      <div class="page-tabs__row" role="tablist">
        <button
          v-for="page in PAGE_OPTIONS"
          :key="page.id"
          class="page-tab"
          :class="{ 'page-tab--active': activePage === page.id }"
          type="button"
          role="tab"
          :aria-selected="activePage === page.id"
          @click="selectPage(page.id)"
        >
          {{ page.label }}
        </button>
      </div>
      <p class="page-tabs__blurb">{{ currentPage.blurb }}</p>
    </nav>

    <DemoControls
      :body-text="bodyText"
      :canvas-width="canvasWidth"
      :composer-width="composerWidth"
      :font-options="fontOptions"
      :locale="locale"
      :preset="preset"
      :preset-options="PRESET_OPTIONS"
      :selected-font="selectedFont"
      :thread-width="threadWidth"
      :use-pre-wrap="usePreWrap"
      @update:body-text="bodyText = $event"
      @update:canvas-width="canvasWidth = $event"
      @update:composer-width="composerWidth = $event"
      @update:locale="locale = $event"
      @update:preset="applyPreset($event)"
      @update:selected-font="selectedFont = $event"
      @update:thread-width="threadWidth = $event"
      @update:use-pre-wrap="usePreWrap = $event"
    />

    <section class="content">
      <header class="content-header card">
        <div>
          <p class="section-label">Current page</p>
          <h2>{{ currentPage.label }}</h2>
          <p class="content-header__blurb">{{ currentPage.blurb }}</p>
        </div>
        <div class="hero__metrics">
          <div>
            <span>Font</span>
            <strong>{{ fontConfig.label }}</strong>
          </div>
          <div>
            <span>Locale</span>
            <strong>{{ locale }}</strong>
          </div>
          <div>
            <span>Whitespace</span>
            <strong>{{ whiteSpaceMode }}</strong>
          </div>
        </div>
      </header>

      <PageOverview
        v-if="activePage === 'overview'"
        :canvas-line-count="canvasLayout.lineCount.value"
        :composer-height="composerMeasurement.height.value"
        :manual-line-count="manualLayout.lineCount.value"
        :thread-height="threadMeasurement.height.value"
        @open-page="selectPage"
      />

      <PageFeed
        v-else-if="activePage === 'feed'"
        :css-font="cssFont"
        :line-height="fontConfig.lineHeight"
        :messages="threadMessages"
        :text-height="threadMeasurement.height.value"
        :text-line-count="threadMeasurement.lineCount.value"
        :thread-target="threadTarget"
        :thread-width="threadWidth"
        :use-pre-wrap="usePreWrap"
        :width="Math.round(threadMeasurement.width.value)"
      />

      <PageComposer
        v-else-if="activePage === 'composer'"
        :body-text="bodyText"
        :css-font="cssFont"
        :line-height="fontConfig.lineHeight"
        :reserved-height="composerMeasurement.height.value"
        :target="composerTarget"
        :use-pre-wrap="usePreWrap"
        :width="Math.round(composerMeasurement.width.value)"
      />

      <PageManual
        v-else-if="activePage === 'manual'"
        :css-font="cssFont"
        :height="manualLayout.height.value"
        :lines="manualLayout.lines.value"
        :width="composerWidth"
      />

      <PageCanvas
        v-else-if="activePage === 'canvas'"
        :canvas-height="canvasHeight.value"
        :canvas-inner-width="canvasInnerWidth.value"
        :canvas-width="canvasWidth"
        :line-count="canvasLayout.lineCount.value"
        :target="canvasTarget"
      />

      <PageAccordion
        v-else
        :body-text="bodyText"
        :font-config="fontConfig"
        :locale="locale"
        :use-pre-wrap="usePreWrap"
      />
    </section>
  </main>
</template>
