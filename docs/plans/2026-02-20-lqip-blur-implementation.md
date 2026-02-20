# LQIP 图片模糊占位优化 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add LQIP blur placeholder loading to all images — script generates tiny blur thumbnails, BlurImage component shows blur→sharp fade transition, ProseImg overrides Markdown inline images.

**Architecture:** A standalone Node script (`scripts/generate-blur.ts`) uses `sharp` to generate 20px-wide JPEG thumbnails (`xxx-blur.jpg`) alongside originals. A `BlurImage.vue` component auto-derives the blur path from the original `src`, shows the blur image with CSS `filter:blur(20px)` while the full image loads lazily, then fades in the sharp version. A `ProseImg.vue` component in `app/components/content/` overrides Nuxt Content's default `<img>` rendering so Markdown inline images also get the blur treatment.

**Tech Stack:** sharp (image processing), Vue 3 Composition API, Tailwind CSS, Nuxt Content MDC component override, Vitest + @vue/test-utils

---

### Task 1: Install sharp and add generate:blur script entry

**Files:**
- Modify: `package.json`

**Step 1: Install sharp as devDependency**

Run:
```bash
cd /root/work/liushangzuo.com/.worktrees/mvp-implementation
pnpm add -D sharp
```

**Step 2: Add generate:blur script to package.json**

Add to the `"scripts"` section:
```json
"generate:blur": "npx tsx scripts/generate-blur.ts"
```

Also add `tsx` as devDependency (to run TypeScript scripts directly):
```bash
pnpm add -D tsx
```

**Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add sharp and tsx for blur image generation"
```

---

### Task 2: Create the blur generation script

**Files:**
- Create: `scripts/generate-blur.ts`

**Step 1: Write the script**

```typescript
import { readdir, stat } from 'node:fs/promises'
import { join, extname, basename, dirname } from 'node:path'
import sharp from 'sharp'

const IMAGES_DIR = join(import.meta.dirname, '..', 'public', 'images')
const SUPPORTED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp'])
const BLUR_SUFFIX = '-blur'
const BLUR_WIDTH = 20
const BLUR_QUALITY = 50

async function findImages(dir: string): Promise<string[]> {
  const results: string[] = []
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...await findImages(fullPath))
    } else if (entry.isFile()) {
      const ext = extname(entry.name).toLowerCase()
      const name = basename(entry.name, ext)
      if (SUPPORTED_EXTENSIONS.has(ext) && !name.endsWith(BLUR_SUFFIX)) {
        results.push(fullPath)
      }
    }
  }

  return results
}

function getBlurPath(imagePath: string): string {
  const ext = extname(imagePath)
  const name = basename(imagePath, ext)
  const dir = dirname(imagePath)
  return join(dir, `${name}${BLUR_SUFFIX}.jpg`)
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

async function main() {
  console.log(`Scanning ${IMAGES_DIR} for images...`)

  const images = await findImages(IMAGES_DIR)
  let generated = 0
  let skipped = 0

  for (const imagePath of images) {
    const blurPath = getBlurPath(imagePath)

    if (await fileExists(blurPath)) {
      skipped++
      continue
    }

    await sharp(imagePath)
      .resize(BLUR_WIDTH)
      .jpeg({ quality: BLUR_QUALITY })
      .toFile(blurPath)

    generated++
    const rel = imagePath.replace(IMAGES_DIR, '')
    console.log(`  Generated: ${rel} → ${basename(blurPath)}`)
  }

  console.log(`\nDone. Generated: ${generated}, Skipped (already exist): ${skipped}`)
}

main().catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
```

**Step 2: Run it and verify**

Run:
```bash
pnpm run generate:blur
```

Expected output: `Generated: 24, Skipped: 0` (18 blog + 6 works images)

**Step 3: Verify blur files were created**

Run:
```bash
ls public/images/blog/*-blur.jpg | wc -l
ls public/images/works/*-blur.jpg | wc -l
file public/images/blog/beijing-autumn-gugong-cover-blur.jpg
```

Expected: 18 blog blur files, 6 works blur files, each a valid JPEG ~300-800 bytes.

**Step 4: Commit**

```bash
git add scripts/generate-blur.ts public/images/blog/*-blur.jpg public/images/works/*-blur.jpg
git commit -m "feat: add blur image generation script and generate blur thumbnails"
```

---

### Task 3: Create BlurImage component (TDD)

**Files:**
- Create: `app/components/ui/BlurImage.vue`
- Create: `tests/components/ui/BlurImage.spec.ts`

**@skill: vue-component-tdd**

**Step 1: Write failing tests**

```typescript
// tests/components/ui/BlurImage.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BlurImage from '~/components/ui/BlurImage.vue'

describe('BlurImage', () => {
  const defaultProps = {
    src: '/images/blog/beijing-autumn-gugong-cover.jpg',
    alt: 'Test image',
  }

  it('renders blur image with derived blur path', () => {
    const wrapper = mount(BlurImage, { props: defaultProps })
    const blurImg = wrapper.find('[data-blur]')
    expect(blurImg.exists()).toBe(true)
    expect(blurImg.attributes('src')).toBe('/images/blog/beijing-autumn-gugong-cover-blur.jpg')
  })

  it('renders main image with original src and lazy loading', () => {
    const wrapper = mount(BlurImage, { props: defaultProps })
    const mainImg = wrapper.find('[data-main]')
    expect(mainImg.exists()).toBe(true)
    expect(mainImg.attributes('src')).toBe('/images/blog/beijing-autumn-gugong-cover.jpg')
    expect(mainImg.attributes('loading')).toBe('lazy')
  })

  it('passes alt to both images', () => {
    const wrapper = mount(BlurImage, { props: defaultProps })
    expect(wrapper.find('[data-blur]').attributes('alt')).toBe('Test image')
    expect(wrapper.find('[data-main]').attributes('alt')).toBe('Test image')
  })

  it('main image starts with opacity-0', () => {
    const wrapper = mount(BlurImage, { props: defaultProps })
    const mainImg = wrapper.find('[data-main]')
    expect(mainImg.classes()).toContain('opacity-0')
  })

  it('transitions to opacity-100 after main image loads', async () => {
    const wrapper = mount(BlurImage, { props: defaultProps })
    const mainImg = wrapper.find('[data-main]')
    await mainImg.trigger('load')
    expect(mainImg.classes()).toContain('opacity-100')
  })

  it('derives blur path for various extensions', () => {
    const wrapper = mount(BlurImage, {
      props: { src: '/images/works/photo.png', alt: 'PNG test' },
    })
    // blur is always .jpg regardless of original extension
    expect(wrapper.find('[data-blur]').attributes('src')).toBe('/images/works/photo-blur.jpg')
  })

  it('applies custom class to wrapper', () => {
    const wrapper = mount(BlurImage, {
      props: { ...defaultProps, class: 'aspect-[4/3]' },
    })
    expect(wrapper.classes()).toContain('aspect-[4/3]')
  })
})
```

**Step 2: Run tests to verify they fail**

Run:
```bash
cd /root/work/liushangzuo.com/.worktrees/mvp-implementation
npx vitest run tests/components/ui/BlurImage.spec.ts
```

Expected: FAIL (component doesn't exist)

**Step 3: Write minimal implementation**

```vue
<!-- app/components/ui/BlurImage.vue -->
<template>
  <div class="relative overflow-hidden" :class="$attrs.class">
    <img
      data-blur
      :src="blurSrc"
      :alt="alt"
      class="absolute inset-0 w-full h-full object-cover blur-[20px] scale-110 transition-opacity duration-500"
      :class="loaded ? 'opacity-0' : 'opacity-100'"
      aria-hidden="true"
    />
    <img
      data-main
      :src="src"
      :alt="alt"
      class="w-full h-full object-cover transition-opacity duration-500"
      :class="loaded ? 'opacity-100' : 'opacity-0'"
      loading="lazy"
      @load="loaded = true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({ inheritAttrs: false })

const props = defineProps<{
  src: string
  alt: string
}>()

const loaded = ref(false)

const blurSrc = computed(() => {
  const dotIndex = props.src.lastIndexOf('.')
  if (dotIndex === -1) return `${props.src}-blur.jpg`
  const pathWithoutExt = props.src.substring(0, dotIndex)
  return `${pathWithoutExt}-blur.jpg`
})
</script>
```

**Step 4: Run tests to verify they pass**

Run:
```bash
npx vitest run tests/components/ui/BlurImage.spec.ts
```

Expected: 7 tests PASS

**Step 5: Commit**

```bash
git add app/components/ui/BlurImage.vue tests/components/ui/BlurImage.spec.ts
git commit -m "feat: add BlurImage component with LQIP blur loading"
```

---

### Task 4: Create ProseImg MDC override (TDD)

**Files:**
- Create: `app/components/content/ProseImg.vue`
- Create: `tests/components/content/ProseImg.spec.ts`

**@skill: vue-component-tdd**

**Step 1: Write failing test**

```typescript
// tests/components/content/ProseImg.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProseImg from '~/components/content/ProseImg.vue'
import BlurImage from '~/components/ui/BlurImage.vue'

describe('ProseImg', () => {
  it('renders BlurImage with src and alt from props', () => {
    const wrapper = mount(ProseImg, {
      props: {
        src: '/images/blog/hlj-winter-songhua-1.jpg',
        alt: '冰封的江面',
      },
      global: {
        components: { BlurImage },
      },
    })
    const blurImage = wrapper.findComponent(BlurImage)
    expect(blurImage.exists()).toBe(true)
    expect(blurImage.props('src')).toBe('/images/blog/hlj-winter-songhua-1.jpg')
    expect(blurImage.props('alt')).toBe('冰封的江面')
  })

  it('wraps BlurImage in a figure with rounded corners', () => {
    const wrapper = mount(ProseImg, {
      props: { src: '/images/test.jpg', alt: 'test' },
      global: { components: { BlurImage } },
    })
    const figure = wrapper.find('figure')
    expect(figure.exists()).toBe(true)
    expect(figure.classes()).toContain('rounded-xl')
    expect(figure.classes()).toContain('overflow-hidden')
  })

  it('renders alt text as figcaption when provided', () => {
    const wrapper = mount(ProseImg, {
      props: { src: '/images/test.jpg', alt: '图片说明' },
      global: { components: { BlurImage } },
    })
    const caption = wrapper.find('figcaption')
    expect(caption.exists()).toBe(true)
    expect(caption.text()).toBe('图片说明')
  })
})
```

**Step 2: Run tests to verify they fail**

Run:
```bash
npx vitest run tests/components/content/ProseImg.spec.ts
```

Expected: FAIL

**Step 3: Write minimal implementation**

```vue
<!-- app/components/content/ProseImg.vue -->
<template>
  <figure class="rounded-xl overflow-hidden my-8">
    <BlurImage
      :src="src"
      :alt="alt || ''"
      class="aspect-[3/2]"
    />
    <figcaption
      v-if="alt"
      class="text-center text-sm text-stone-500 dark:text-stone-400 mt-3"
    >
      {{ alt }}
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
defineProps<{
  src: string
  alt?: string
}>()
</script>
```

**Step 4: Run tests to verify they pass**

Run:
```bash
npx vitest run tests/components/content/ProseImg.spec.ts
```

Expected: 3 tests PASS

**Step 5: Commit**

```bash
git add app/components/content/ProseImg.vue tests/components/content/ProseImg.spec.ts
git commit -m "feat: add ProseImg MDC override for blur loading in Markdown"
```

---

### Task 5: Replace NuxtImg with BlurImage in existing pages

**Files:**
- Modify: `app/pages/index.vue:79-83` (featured photos NuxtImg → BlurImage)
- Modify: `app/components/ui/ArticleCard.vue:8-13` (cover NuxtImg → BlurImage)
- Modify: `app/pages/works/index.vue:38-44` (gallery NuxtImg → BlurImage)

**Step 1: Update index.vue featured photos section**

Replace lines 79-83:
```vue
<!-- Before -->
<NuxtImg
  :src="photo.image"
  :alt="photo.title"
  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
  loading="lazy"
/>

<!-- After -->
<BlurImage
  :src="photo.image"
  :alt="photo.title"
  class="w-full h-full"
/>
```

Note: The hover scale is handled by the parent `group` class already applied to the container. BlurImage renders `object-cover` by default.

**Step 2: Update ArticleCard.vue cover image**

Replace lines 8-13:
```vue
<!-- Before -->
<NuxtImg
  :src="post.cover"
  :alt="post.title"
  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
  loading="lazy"
/>

<!-- After -->
<BlurImage
  :src="post.cover"
  :alt="post.title"
  class="w-full h-full"
/>
```

**Step 3: Update works/index.vue gallery images**

Replace lines 38-44:
```vue
<!-- Before -->
<NuxtImg
  :src="photo.image"
  :alt="photo.title"
  class="w-full transition-transform duration-500 group-hover:scale-105"
  loading="lazy"
  sizes="sm:100vw md:50vw lg:33vw"
/>

<!-- After -->
<BlurImage
  :src="photo.image"
  :alt="photo.title"
  class="w-full"
/>
```

**Step 4: Run all tests to verify nothing broke**

Run:
```bash
npx vitest run
```

Expected: All tests PASS

**Step 5: Commit**

```bash
git add app/pages/index.vue app/components/ui/ArticleCard.vue app/pages/works/index.vue
git commit -m "feat: replace NuxtImg with BlurImage across homepage, cards, and gallery"
```

---

### Task 6: Full verification

**Step 1: Run all tests**

Run:
```bash
npx vitest run
```

Expected: All tests PASS (existing 29 + new BlurImage 7 + ProseImg 3 = ~39)

**Step 2: Verify blur files exist for all images**

Run:
```bash
# Count originals vs blur files
echo "Originals:" && ls public/images/blog/*.jpg public/images/works/*.jpg | grep -v blur | wc -l
echo "Blur files:" && ls public/images/blog/*-blur.jpg public/images/works/*-blur.jpg | wc -l
```

Expected: 24 originals, 24 blur files

**Step 3: Verify dev server works**

Run:
```bash
curl -s http://localhost:8080/ | grep -c 'blur'
```

Expected: Non-zero (blur image references appear in HTML)

**Step 4: Run static build**

Run:
```bash
pnpm generate
```

Expected: Build succeeds with no errors

**Step 5: Final commit if any fixes were needed**

```bash
git add -A && git commit -m "fix: address verification issues" || echo "Nothing to commit"
```
