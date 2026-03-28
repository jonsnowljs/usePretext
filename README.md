# use-pretext

Vue 3 composables for [`@chenglou/pretext`](https://github.com/chenglou/pretext).

This package wraps Pretext with Vue 3 composables for:

- measuring multiline text height from a reactive width or DOM target
- reading wrapped line output for custom renderers
- using the same text layout logic in DOM and canvas flows

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

Each use case is split into its own page in the demo so you can inspect them independently.

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

## Publishing

This repo is set up to be published as an npm package.

Before publishing:

1. Confirm that the package name `use-pretext` is available on npm, or change `"name"` in [package.json](/Users/jiasheng/Projects/use-pretext/package.json) to a scoped name such as `@your-scope/use-pretext`.
2. Install dependencies and run:

```bash
npm install
npm run test
npm run check
npm run build
```

3. Log in to npm:

```bash
npm login
```

4. Publish:

```bash
npm publish
```

If you switch to a scoped package name and want it public, publish with:

```bash
npm publish --access public
```
