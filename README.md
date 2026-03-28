# use-pretext

Vue 3 composables for [`@chenglou/pretext`](https://github.com/chenglou/pretext), focused on one main job:

- use `usePretext(...)` to measure multiline text from a reactive width or DOM target
- use `usePretextLines(...)` when you also need the wrapped line output

## Why

`@chenglou/pretext` gives you fast text preparation and layout primitives.

This package turns those primitives into Vue-friendly reactive composables, so you can:

- reserve text height before paint
- drive autosize-like UI without DOM text measurement loops
- render wrapped text in canvas or other custom surfaces
- share the same layout logic across DOM and non-DOM rendering paths

## Install

```bash
npm install use-pretext
```

## Main composable: `usePretext`

This is the default composable for most app use cases.

Pass either:

- `target`: a Vue ref to an element whose width should be observed
- `width`: an explicit reactive width if you already know the layout width

### Example with an observed DOM target

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
    <p>{{ text }}</p>
    <small>height: {{ layout.height }}</small>
    <small>lines: {{ layout.lineCount }}</small>
  </div>
</template>
```

### Example with an explicit width

```ts
import { ref } from 'vue'
import { usePretext } from 'use-pretext'

const width = ref(320)
const text = ref('Reserve space for a card before the DOM lays out the final content.')

const layout = usePretext({
  width,
  text,
  lineHeight: 24,
  font: '16px Inter',
})
```

## Secondary composable: `usePretextLines`

Use this when height alone is not enough and you need the wrapped lines themselves.

This is useful for:

- canvas rendering
- SVG text rendering
- custom text overlays
- debugging layout behavior

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

## API

### `usePretext(options)`

Options:

- `text`: `string | Ref<string> | () => string`
- `font`: Pretext font string or an object with `size`, `family`, and optional `style`, `variant`, `weight`, `stretch`
- `lineHeight`: line height used for layout
- `width`: optional explicit width
- `target`: optional element ref to observe with `ResizeObserver`
- `whiteSpace`: `'normal' | 'pre-wrap'`
- `locale`: forwarded to `pretext.setLocale(...)`
- `observeResize`: defaults to `true`

Returns:

- `width`: reactive resolved width
- `prepared`: prepared Pretext handle
- `font`: normalized canvas font string
- `height`: computed laid out height
- `lineCount`: computed number of lines
- `lines`: empty array for `usePretext(...)`
- `refresh()`: force re-prepare
- `clear()`: clear Pretext cache

### `usePretextLines(options)`

Same options as `usePretext(...)`.

Returns the same shape, except `lines` contains the wrapped line objects from Pretext.

## Notes

- If both `width` and `target` are provided, `width` wins.
- `locale` is global inside Pretext. Changing it affects Pretext's shared cache behavior.
- `usePretext(...)` is the main API. `usePretextLines(...)` is for advanced rendering cases.

## Demo

The repo includes a Vite demo under `demo/` with separate pages for:

- feed card height reservation
- autosize-style composer layout
- manual line inspection
- canvas rendering

Run it with:

```bash
npm install
npm run demo
```

## Development

```bash
npm install
npm run test
npm run check
npm run build
```

## License

[MIT](/Users/jiasheng/Projects/use-pretext/LICENSE)
