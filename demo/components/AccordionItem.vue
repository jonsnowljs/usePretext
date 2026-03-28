<script setup lang="ts">
import { computed, ref, watch, type MaybeRefOrGetter } from 'vue'

import { usePretext } from 'use-pretext'

type FontConfig = {
  family: string
  lineHeight: number
  size: string
  weight: number
}

const props = defineProps<{
  answer: string
  fontConfig: FontConfig
  id: string
  isOpen: boolean
  locale: string
  question: string
  whiteSpace: MaybeRefOrGetter<'normal' | 'pre-wrap'>
}>()

defineEmits<{
  toggle: [id: string]
}>()

const answerTarget = ref<HTMLElement | null>(null)
const recalculationCount = ref(0)

const answerLayout = usePretext({
  target: answerTarget,
  text: computed(() => props.answer),
  lineHeight: computed(() => props.fontConfig.lineHeight),
  font: computed(() => ({
    family: props.fontConfig.family,
    size: props.fontConfig.size,
    weight: props.fontConfig.weight,
  })),
  locale: computed(() => props.locale),
  whiteSpace: computed(() => props.whiteSpace),
})

const panelHeight = computed(() => (props.isOpen ? answerLayout.height.value + 24 : 0))

watch(
  () => [answerLayout.width.value, answerLayout.height.value, answerLayout.lineCount.value, props.answer],
  () => {
    recalculationCount.value += 1
  },
  { immediate: true },
)
</script>

<template>
  <article class="accordion-item" :class="{ 'accordion-item--open': isOpen }">
    <button class="accordion-trigger" type="button" :id="`accordion-trigger-${id}`" :aria-controls="`accordion-panel-${id}`" :aria-expanded="isOpen" @click="$emit('toggle', id)">
      <span class="accordion-trigger__copy">
        <span class="card__label">FAQ item</span>
        <strong>{{ question }}</strong>
      </span>
      <span class="accordion-trigger__icon" aria-hidden="true">+</span>
    </button>

    <div class="accordion-metrics accordion-metrics--pretext">
      <div>
        <span class="accordion-metrics__label">Width</span>
        <strong>{{ Math.round(answerLayout.width.value) }}px</strong>
      </div>
      <div>
        <span class="accordion-metrics__label">Lines</span>
        <strong>{{ answerLayout.lineCount.value }}</strong>
      </div>
      <div>
        <span class="accordion-metrics__label">Target</span>
        <strong>{{ answerLayout.height.value }}px</strong>
      </div>
      <div>
        <span class="accordion-metrics__label">Layout recalcs</span>
        <strong>{{ recalculationCount }}</strong>
      </div>
    </div>

    <div :id="`accordion-panel-${id}`" class="accordion-panel" :style="{ height: `${panelHeight}px` }" role="region" :aria-labelledby="`accordion-trigger-${id}`">
      <div
        :id="`accordion-answer-copy-${id}`"
        class="accordion-panel__copy"
        ref="answerTarget"
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
