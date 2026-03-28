<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

type FontConfig = {
  family: string
  lineHeight: number
  size: string
  weight: number
}

const props = defineProps<{
  answer: string
  delayMs: number
  fontConfig: FontConfig
  id: string
  isOpen: boolean
  question: string
  whiteSpace: 'normal' | 'pre-wrap'
}>()

defineEmits<{
  toggle: [id: string]
}>()

const answerTarget = ref<HTMLElement | null>(null)
const measuredHeight = ref(0)
const domReadCount = ref(0)
const resizeEventCount = ref(0)
const delayedMeasurementPending = ref(false)
let measurementTimer: ReturnType<typeof setTimeout> | null = null
let observer: ResizeObserver | null = null

function measure(): void {
  if (measurementTimer !== null) {
    clearTimeout(measurementTimer)
    measurementTimer = null
  }

  const element = answerTarget.value
  if (!element) {
    measuredHeight.value = 0
    return
  }

  const nextHeight = element.scrollHeight
  domReadCount.value += 1

  if (props.delayMs > 0) {
    delayedMeasurementPending.value = true
    if (measurementTimer !== null) {
      clearTimeout(measurementTimer)
    }

    measurementTimer = setTimeout(() => {
      measuredHeight.value = nextHeight
      delayedMeasurementPending.value = false
    }, props.delayMs)
    return
  }

  delayedMeasurementPending.value = false
  measuredHeight.value = nextHeight
}

watch(
  () => [props.answer, props.whiteSpace, props.fontConfig.family, props.fontConfig.size, props.fontConfig.weight, props.fontConfig.lineHeight, props.delayMs],
  async () => {
    await nextTick()
    measure()
  },
)

onMounted(async () => {
  await nextTick()
  measure()

  if (typeof ResizeObserver === 'undefined' || !answerTarget.value) {
    return
  }

  observer = new ResizeObserver(() => {
    resizeEventCount.value += 1
    measure()
  })

  observer.observe(answerTarget.value)
})

onBeforeUnmount(() => {
  if (measurementTimer !== null) {
    clearTimeout(measurementTimer)
  }
  observer?.disconnect()
})

const panelHeight = computed(() => (props.isOpen ? measuredHeight.value : 0))
</script>

<template>
  <article class="accordion-item" :class="{ 'accordion-item--open': isOpen }">
    <button
      class="accordion-trigger"
      type="button"
      :id="`dom-accordion-trigger-${id}`"
      :aria-controls="`dom-accordion-panel-${id}`"
      :aria-expanded="isOpen"
      @click="$emit('toggle', id)"
    >
      <span class="accordion-trigger__copy">
        <span class="card__label">FAQ item</span>
        <strong>{{ question }}</strong>
      </span>
      <span class="accordion-trigger__icon" aria-hidden="true">+</span>
    </button>

    <div class="accordion-metrics accordion-metrics--dom">
      <div>
        <span class="accordion-metrics__label">scrollHeight</span>
        <strong>{{ measuredHeight }}px</strong>
      </div>
      <div>
        <span class="accordion-metrics__label">DOM reads</span>
        <strong>{{ domReadCount }}</strong>
      </div>
      <div>
        <span class="accordion-metrics__label">Resize hits</span>
        <strong>{{ resizeEventCount }}</strong>
      </div>
      <div>
        <span class="accordion-metrics__label">Status</span>
        <strong>{{ delayedMeasurementPending ? `Waiting ${delayMs}ms` : 'Applied' }}</strong>
      </div>
    </div>

    <div
      :id="`dom-accordion-panel-${id}`"
      class="accordion-panel"
      :style="{ height: `${panelHeight}px` }"
      role="region"
      :aria-labelledby="`dom-accordion-trigger-${id}`"
    >
      <div
        ref="answerTarget"
        class="accordion-panel__copy"
        :style="{
          font: `${fontConfig.weight} ${fontConfig.size}/${fontConfig.lineHeight}px ${fontConfig.family}`,
          whiteSpace,
        }"
      >
        {{ answer }}
      </div>
    </div>
  </article>
</template>
