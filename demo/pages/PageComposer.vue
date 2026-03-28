<script setup lang="ts">
import type { Ref } from 'vue'

defineProps<{
  bodyText: string
  cssFont: string
  lineHeight: number
  reservedHeight: number
  target: Ref<HTMLElement | null>
  usePreWrap: boolean
  width: number
}>()
</script>

<template>
  <article class="card">
    <header class="card__header">
      <div>
        <p class="card__label">Autosize composer</p>
        <h3>Drive a live input shell from measured height</h3>
      </div>
      <div class="stats">
        <div>
          <span>Observed width</span>
          <strong>{{ width }}px</strong>
        </div>
        <div>
          <span>Reserved height</span>
          <strong>{{ reservedHeight }}px</strong>
        </div>
      </div>
    </header>

    <p class="lede small">
      This pattern works well when you need a stable draft surface or you want to predict textarea growth before the
      browser lays out the final content.
    </p>

    <div class="composer-frame">
      <div class="composer-shell" :ref="target">
        <div class="composer-input" :style="{ minHeight: `${Math.max(reservedHeight, lineHeight * 2)}px` }">
          <div class="composer-placeholder">Reply draft</div>
          <div class="composer-body" :style="{ font: cssFont, whiteSpace: usePreWrap ? 'pre-wrap' : 'normal' }">
            {{ bodyText }}
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
