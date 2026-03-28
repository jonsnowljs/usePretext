<script setup lang="ts">
type DemoPageId = 'overview' | 'feed' | 'composer' | 'manual' | 'canvas'

defineProps<{
  canvasLineCount: number
  composerHeight: number
  manualLineCount: number
  threadHeight: number
}>()

defineEmits<{
  openPage: [page: DemoPageId]
}>()
</script>

<template>
  <section class="page-grid">
    <article class="card intro-card">
      <p class="card__label">Why pages</p>
      <h3>Each view isolates one reason you would reach for Pretext.</h3>
      <p class="lede small">
        Use the left navigation to jump between reserved DOM layout, autosize behavior, line inspection, and canvas
        rendering. The shared controls stay constant so you can compare behavior without relearning the UI.
      </p>
    </article>

    <article class="card quick-card">
      <p class="card__label">Feed Card</p>
      <h3>{{ threadHeight }}px reserved</h3>
      <p>Measure a paragraph height up front and apply it to a responsive card surface.</p>
      <button class="jump-button" type="button" @click="$emit('openPage', 'feed')">Open page</button>
    </article>

    <article class="card quick-card">
      <p class="card__label">Composer</p>
      <h3>{{ composerHeight }}px reserved</h3>
      <p>Drive a draft area or ghost textarea shell from Pretext height instead of DOM reads.</p>
      <button class="jump-button" type="button" @click="$emit('openPage', 'composer')">Open page</button>
    </article>

    <article class="card quick-card">
      <p class="card__label">Manual Lines</p>
      <h3>{{ manualLineCount }} lines</h3>
      <p>Inspect the wrapped line list for custom renderers, SVG, or speculative layouts.</p>
      <button class="jump-button" type="button" @click="$emit('openPage', 'manual')">Open page</button>
    </article>

    <article class="card quick-card">
      <p class="card__label">Canvas</p>
      <h3>{{ canvasLineCount }} drawn lines</h3>
      <p>Use line output directly in a canvas draw pass with deterministic positioning.</p>
      <button class="jump-button" type="button" @click="$emit('openPage', 'canvas')">Open page</button>
    </article>
  </section>
</template>
