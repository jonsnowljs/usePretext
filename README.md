# use-pretext

Vue 3 composables for [`@chenglou/pretext`](https://github.com/chenglou/pretext).

## Install

```bash
npm install vue @chenglou/pretext use-pretext
```

## `usePretext`

Use this when you want the measured block height and line count for reactive text.

```ts
import { ref } from 'vue'
import { usePretext } from 'use-pretext'

const target = ref<HTMLElement | null>(null)
const text = ref('AGI 春天到了. بدأت الرحلة')

const layout = usePretext({
  target,
  text,
  lineHeight: 24,
  font: {
    size: '16px',
    family: 'Inter',
    weight: 500,
  },
})
```

```vue
<template>
  <div ref="target">
    Height: {{ layout.height }}
    Lines: {{ layout.lineCount }}
  </div>
</template>
```

You can also pass a reactive `width` directly instead of a `target`.

## `usePretextLines`

Use this when you also need the actual wrapped lines.

```ts
import { computed, ref } from 'vue'
import { usePretextLines } from 'use-pretext'

const width = ref(320)
const text = ref('Manual rendering is easier when you already know the line breaks.')

const layout = usePretextLines({
  width,
  text,
  lineHeight: 22,
  font: '16px "Helvetica Neue"',
})

const labels = computed(() => layout.lines.value.map((line) => line.text))
```

## Demo

This repo includes a small Vite demo app under `demo/`.

```bash
npm install
npm run demo
```

It shows:

- `usePretext(...)` with a real observed DOM container
- `usePretextLines(...)` with explicit width control and per-line output

## Options

- `text`: `string | Ref<string> | () => string`
- `font`: Pretext font string or an object with `size`, `family`, and optional `style`, `variant`, `weight`, `stretch`
- `lineHeight`: number used for `pretext.layout(...)`
- `width`: optional explicit width
- `target`: optional element ref to observe with `ResizeObserver`
- `whiteSpace`: `'normal' | 'pre-wrap'`
- `locale`: forwarded to `pretext.setLocale(...)`
- `observeResize`: defaults to `true`

## Notes

- If both `width` and `target` are provided, `width` wins.
- `locale` is global inside Pretext. Changing it clears Pretext's shared cache.
