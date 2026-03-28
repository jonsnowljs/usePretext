<script setup lang="ts">
type PresetId = 'product' | 'multilingual' | 'poetry'
type FontId = 'editorial' | 'ui' | 'dense'

defineProps<{
  bodyText: string
  canvasWidth: number
  composerWidth: number
  fontOptions: Array<{ id: FontId; label: string }>
  locale: string
  preset: PresetId
  presetOptions: Array<{ id: PresetId; label: string }>
  selectedFont: FontId
  threadWidth: number
  usePreWrap: boolean
}>()

defineEmits<{
  'update:body-text': [value: string]
  'update:canvas-width': [value: number]
  'update:composer-width': [value: number]
  'update:locale': [value: string]
  'update:preset': [value: PresetId]
  'update:selected-font': [value: FontId]
  'update:thread-width': [value: number]
  'update:use-pre-wrap': [value: boolean]
}>()
</script>

<template>
  <section class="controls card">
    <div class="stack">
      <span class="section-label">Content preset</span>
      <div class="chip-row">
        <button
          v-for="option in presetOptions"
          :key="option.id"
          class="chip"
          :class="{ 'chip--active': preset === option.id }"
          type="button"
          @click="$emit('update:preset', option.id)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <div class="stack">
      <span class="section-label">Font profile</span>
      <div class="chip-row">
        <button
          v-for="option in fontOptions"
          :key="option.id"
          class="chip"
          :class="{ 'chip--active': selectedFont === option.id }"
          type="button"
          @click="$emit('update:selected-font', option.id)"
        >
          {{ option.label }}
        </button>
      </div>
    </div>

    <label class="field">
      <span>Locale</span>
      <select :value="locale" @change="$emit('update:locale', ($event.target as HTMLSelectElement).value)">
        <option value="en">English</option>
        <option value="ar">Arabic</option>
        <option value="zh">Chinese</option>
        <option value="ja">Japanese</option>
      </select>
    </label>

    <label class="toggle">
      <input
        :checked="usePreWrap"
        type="checkbox"
        @change="$emit('update:use-pre-wrap', ($event.target as HTMLInputElement).checked)"
      />
      <span>Preserve tabs and line breaks</span>
    </label>

    <label class="field field--text">
      <span>Body copy</span>
      <textarea
        :value="bodyText"
        rows="7"
        @input="$emit('update:body-text', ($event.target as HTMLTextAreaElement).value)"
      />
    </label>

    <div class="slider-column">
      <label class="field">
        <span>Manual width</span>
        <input
          :value="composerWidth"
          type="range"
          min="180"
          max="560"
          step="1"
          @input="$emit('update:composer-width', Number(($event.target as HTMLInputElement).value))"
        />
        <strong>{{ composerWidth }}px</strong>
      </label>

      <label class="field">
        <span>Feed width</span>
        <input
          :value="threadWidth"
          type="range"
          min="260"
          max="520"
          step="1"
          @input="$emit('update:thread-width', Number(($event.target as HTMLInputElement).value))"
        />
        <strong>{{ threadWidth }}px</strong>
      </label>

      <label class="field">
        <span>Canvas width</span>
        <input
          :value="canvasWidth"
          type="range"
          min="260"
          max="620"
          step="1"
          @input="$emit('update:canvas-width', Number(($event.target as HTMLInputElement).value))"
        />
        <strong>{{ canvasWidth }}px</strong>
      </label>
    </div>
  </section>
</template>
