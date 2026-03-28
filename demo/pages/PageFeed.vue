<script setup lang="ts">
import type { Ref } from 'vue'

defineProps<{
  cssFont: string
  lineHeight: number
  messages: Array<{ id: string; author: string; tone: string; text: string }>
  textHeight: number
  textLineCount: number
  threadTarget: Ref<HTMLElement | null>
  threadWidth: number
  usePreWrap: boolean
  width: number
}>()
</script>

<template>
  <article class="card">
    <header class="card__header">
      <div>
        <p class="card__label">Responsive feed</p>
        <h3>Reserve card height before paint</h3>
      </div>
      <div class="stats">
        <div>
          <span>Tracked width</span>
          <strong>{{ width }}px</strong>
        </div>
        <div>
          <span>Measured height</span>
          <strong>{{ textHeight }}px</strong>
        </div>
        <div>
          <span>Line count</span>
          <strong>{{ textLineCount }}</strong>
        </div>
      </div>
    </header>

    <p class="lede small">
      The highlighted message reserves its text area using the height returned by <code>usePretext()</code>. This is
      the common virtualization and skeleton-loading case.
    </p>

    <div class="thread-shell" :style="{ width: `${threadWidth}px` }">
      <div class="thread-list">
        <article v-for="message in messages" :key="message.id" class="message" :class="`message--${message.tone}`">
          <div class="message__avatar">{{ message.author.slice(0, 1) }}</div>
          <div class="message__body">
            <p class="message__author">{{ message.author }}</p>
            <p
              v-if="message.id !== 'm2'"
              class="message__text"
              :style="{ font: cssFont, whiteSpace: usePreWrap ? 'pre-wrap' : 'normal' }"
            >
              {{ message.text }}
            </p>
            <div
              v-else
              :ref="threadTarget"
              class="message__text message__text--measured"
              :style="{
                font: cssFont,
                lineHeight: `${lineHeight}px`,
                minHeight: `${textHeight}px`,
                whiteSpace: usePreWrap ? 'pre-wrap' : 'normal',
              }"
            >
              {{ message.text }}
            </div>
          </div>
        </article>
      </div>
    </div>
  </article>
</template>
