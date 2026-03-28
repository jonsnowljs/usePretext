<script setup lang="ts">
import { computed, ref } from 'vue'

import AccordionItem from '../components/AccordionItem.vue'
import AccordionItemDom from '../components/AccordionItemDom.vue'

type FontConfig = {
  family: string
  label: string
  lineHeight: number
  size: string
  weight: number
}

const props = defineProps<{
  bodyText: string
  fontConfig: FontConfig
  locale: string
  usePreWrap: boolean
}>()

const openId = ref('faq-1')
const openDomId = ref('faq-1')
const simulateDomDelay = ref(true)
const domDelayMs = ref(180)

const items = computed(() => [
  {
    id: 'faq-1',
    question: 'How do I animate an accordion without measuring DOM text on every toggle?',
    answer: props.bodyText,
  },
  {
    id: 'faq-2',
    question: 'Why use Pretext here instead of scrollHeight reads?',
    answer:
      'Pretext gives you the text height from the same font, width, and line-height inputs you already control. That means the animation target is ready before the browser performs a text measurement loop for the expanded state.',
  },
  {
    id: 'faq-3',
    question: 'What actually makes the transition feel smooth?',
    answer:
      'Animate the panel height, keep overflow hidden, and let the measured text block define the final open height. Because the target number is stable, the transition stays deterministic across responsive widths and translated copy.',
  },
])

function toggleItem(id: string): void {
  openId.value = openId.value === id ? '' : id
}

function toggleDomItem(id: string): void {
  openDomId.value = openDomId.value === id ? '' : id
}
</script>

<template>
  <article class="card">
    <header class="card__header">
      <div>
        <p class="card__label">Accordion</p>
        <h3>Smooth expand and collapse from <code>usePretext()</code></h3>
      </div>
      <div class="stats">
        <div>
          <span>Open item</span>
          <strong>{{ openId || 'None' }}</strong>
        </div>
        <div>
          <span>Font profile</span>
          <strong>{{ fontConfig.label }}</strong>
        </div>
        <div>
          <span>Whitespace</span>
          <strong>{{ usePreWrap ? 'pre-wrap' : 'normal' }}</strong>
        </div>
      </div>
    </header>

    <p class="lede small">
      The first list uses <code>usePretext()</code> to compute the target height from text layout inputs. The second
      list reaches the same visual effect with a standard DOM approach based on <code>scrollHeight</code> and
      <code>ResizeObserver</code>.
    </p>

    <div class="accordion-demo-bar">
      <label class="toggle">
        <input v-model="simulateDomDelay" type="checkbox" />
        <span>Simulate DOM measurement delay</span>
      </label>

      <label class="field accordion-demo-bar__delay">
        <span>DOM delay</span>
        <input v-model.number="domDelayMs" type="range" min="0" max="320" step="20" :disabled="!simulateDomDelay" />
        <strong>{{ simulateDomDelay ? `${domDelayMs}ms` : 'Off' }}</strong>
      </label>
    </div>

    <div class="accordion-compare">
      <section class="accordion-stack">
        <div class="accordion-stack__header">
          <p class="card__label">With usePretext</p>
          <p class="lede small">Predictive height from the same font and width inputs. Opens with the target ready.</p>
        </div>

        <div class="accordion-list">
          <AccordionItem
            v-for="item in items"
            :id="item.id"
            :key="item.id"
            :answer="item.answer"
            :font-config="fontConfig"
            :is-open="openId === item.id"
            :locale="locale"
            :question="item.question"
            :white-space="usePreWrap ? 'pre-wrap' : 'normal'"
            @toggle="toggleItem"
          />
        </div>
      </section>

      <section class="accordion-stack">
        <div class="accordion-stack__header">
          <p class="card__label">Without usePretext</p>
          <p class="lede small">
            Plain DOM measurement with <code>scrollHeight</code>. Turn the delay on to exaggerate the post-render
            measurement step.
          </p>
        </div>

        <div class="accordion-list">
          <AccordionItemDom
            v-for="item in items"
            :id="item.id"
            :key="`dom-${item.id}`"
            :answer="item.answer"
            :delay-ms="simulateDomDelay ? domDelayMs : 0"
            :font-config="fontConfig"
            :is-open="openDomId === item.id"
            :question="item.question"
            :white-space="usePreWrap ? 'pre-wrap' : 'normal'"
            @toggle="toggleDomItem"
          />
        </div>
      </section>
    </div>
  </article>
</template>
