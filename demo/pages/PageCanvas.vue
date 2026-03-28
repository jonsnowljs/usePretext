<script setup lang="ts">
import type { Ref } from 'vue'

defineProps<{
  canvasHeight: number
  canvasInnerWidth: number
  canvasWidth: number
  lineCount: number
  target: Ref<HTMLCanvasElement | null>
}>()
</script>

<template>
  <article class="card">
    <header class="card__header">
      <div>
        <p class="card__label">Canvas rendering</p>
        <h3>Use Pretext lines to draw into <code>&lt;canvas&gt;</code></h3>
      </div>
      <div class="stats">
        <div>
          <span>Canvas width</span>
          <strong>{{ canvasWidth }}px</strong>
        </div>
        <div>
          <span>Text box</span>
          <strong>{{ canvasInnerWidth }}px</strong>
        </div>
        <div>
          <span>Lines drawn</span>
          <strong>{{ lineCount }}</strong>
        </div>
      </div>
    </header>

    <p class="lede small">
      This panel never asks the DOM to measure text. <code>usePretextLines()</code> computes wrapped lines, then a
      canvas draw loop renders them at deterministic y positions.
    </p>

    <div class="canvas-stage">
      <canvas :ref="target" class="canvas-output" :style="{ height: `${canvasHeight}px` }" />
    </div>
  </article>
</template>
