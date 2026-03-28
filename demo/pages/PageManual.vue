<script setup lang="ts">
defineProps<{
  cssFont: string
  height: number
  lines: Array<{
    text: string
    width: number
    start: { segmentIndex: number; graphemeIndex: number }
    end: { segmentIndex: number; graphemeIndex: number }
  }>
  width: number
}>()
</script>

<template>
  <article class="card">
    <header class="card__header">
      <div>
        <p class="card__label">Custom renderer</p>
        <h3>Inspect the line objects from <code>usePretextLines()</code></h3>
      </div>
      <div class="stats">
        <div>
          <span>Width</span>
          <strong>{{ width }}px</strong>
        </div>
        <div>
          <span>Total lines</span>
          <strong>{{ lines.length }}</strong>
        </div>
        <div>
          <span>Total height</span>
          <strong>{{ height }}px</strong>
        </div>
      </div>
    </header>

    <p class="lede small">
      This is the manual layout case: canvas, SVG, shrink-wrap calculations, speculative width search, and other
      custom rendering pipelines.
    </p>

    <div class="manual-box" :style="{ width: `${width}px` }">
      <div
        v-for="(line, index) in lines"
        :key="`${index}-${line.start.segmentIndex}-${line.end.segmentIndex}`"
        class="manual-line"
        :style="{ font: cssFont }"
      >
        <span class="manual-line__index">{{ index + 1 }}</span>
        <span class="manual-line__text">{{ line.text || ' ' }}</span>
        <span class="manual-line__width">{{ line.width.toFixed(1) }}px</span>
      </div>
    </div>
  </article>
</template>
