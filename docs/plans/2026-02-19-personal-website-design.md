# Personal Website Design

## MVP Scope

First version includes: Homepage, Blog (list + detail), Photography Gallery, About page.
Travel and Tech modules deferred to later iterations.

## Decisions

| Item | Decision |
|------|----------|
| MVP scope | Homepage + Blog (list/detail) + Photography + About |
| Content version | @nuxt/content v3 (collections API) |
| Photography layout | Masonry (CSS columns) |
| Lightbox | PhotoSwipe (third-party) |
| Accent colors | All four Morandi colors, switchable: Mist Blue / Bean Green / Lotus Pink / Desert Camel |
| Title fonts | All three options, switchable: Noto Serif SC / LXGW WenKai / System fonts |
| Theme switching | Settings drawer panel (accent color + font + light/dark mode) |
| Photography data | One .md file per photo, via Content v3 collection |
| Package manager | pnpm |
| Personal info | Placeholders for now |
| Testing | Strict TDD (vue-component-tdd) |
| Project init | Content Wind template as starting point |

## Architecture

### Directory Structure

```
pages/
  index.vue              # Homepage: Hero + Latest posts + Featured photos + About preview
  about.vue              # About page
  blog/
    index.vue            # Blog list: cards + tag filter + load more
    [...slug].vue        # Blog detail: Markdown rendering + TOC + related posts
  works/
    index.vue            # Photography gallery: masonry + category filter + lightbox
components/
  layout/                # AppHeader, AppFooter, SettingsDrawer
  ui/                    # ArticleCard, TagFilter, PhotoLightbox
  content/               # Prose component overrides (optional)
composables/
  useTheme.ts            # Accent color + font switching, persisted to localStorage
layouts/
  default.vue            # Navigation + footer + settings drawer
  blog.vue               # Narrow content + sidebar TOC
content/
  blog/                  # Blog .md files
  works/                 # Photography .md files (one per photo)
content.config.ts        # Content v3 collections definition
```

### Dependencies

- `@nuxt/content` v3 (collections API)
- `@nuxt/image` (image optimization)
- `@nuxt/icon` (Phosphor Icons)
- `@nuxtjs/color-mode` (light/dark toggle)
- `@nuxtjs/google-fonts` (Noto Serif SC, LXGW WenKai on-demand loading)
- `photoswipe` (lightbox)

## Theme System

### Three dimensions managed by `useTheme` composable

```
Theme dimensions:
├── Color mode: light / dark (managed by @nuxtjs/color-mode)
├── Accent color: Mist Blue / Bean Green / Lotus Pink / Desert Camel
└── Title font: Noto Serif SC / LXGW WenKai / System fonts
```

### Accent colors via CSS custom properties

```
Mist Blue:    --accent-500: #7C9CB5; --accent-600: #5A7A93
Bean Green:   --accent-500: #8FA395; --accent-600: #6B826F
Lotus Pink:   --accent-500: #B8A9A1; --accent-600: #9A8B83
Desert Camel: --accent-500: #A89F91; --accent-600: #8A8173
```

Each accent color provides a full 50-950 scale derived from the primary value. Tailwind references these via `accent` color token.

### Font switching via CSS variable `--font-title`

Three font sets loaded on-demand via `@nuxtjs/google-fonts`. Switching dynamically loads the corresponding font file.

### Settings Drawer UI

- Gear icon button in bottom-right corner triggers it
- Slides in from right, 320px wide, semi-transparent overlay
- Three sections separated by dividers:
  - Color mode: light/dark icon buttons (sun/moon)
  - Accent color: four color dots, selected state has ring border
  - Title font: three text buttons rendered in their own font as preview
- Instant preview on selection, persists on close

## Page Designs

### Homepage `index.vue`

Four vertical sections:

1. **Hero** — 80vh, centered large title (serif) + subtitle + two CTA buttons ("Read Blog", "Browse Works"), background with subtle gradient (stone gray + accent color hint)
2. **Latest Posts** — Title + "View all" link, 3-column card grid (single column on mobile), latest 3 non-draft blog posts
3. **Featured Photos** — Title + "View all" link, `featured: true` works, horizontal scroll or 3-column grid
4. **About Preview** — Light gray background section, avatar + intro + social icons

### Blog List `blog/index.vue`

- Page title + description
- Tag filter bar (pill buttons, toggle on click, single select)
- Article card grid (3 → 2 → 1 columns responsive)
- Each card: cover image (optional) + date + tags + title + description (2-line clamp)
- "Load more" button at bottom, 9 posts per batch

### Blog Detail `blog/[...slug].vue`

- Uses `blog` layout (narrow content + sidebar)
- Header: date, reading time, title (large serif), description, tags
- Cover image (optional)
- Markdown body (prose typography)
- Sidebar: TOC navigation (scroll-highlighted)
- Footer: related posts (2 posts with same tag) + back to list link

### Photography Gallery `works/index.vue`

- Page title + description
- Category filter (All / Landscape / Portrait / Street / Architecture)
- Masonry layout (CSS columns, 3 → 2 → 1 columns)
- Each image hover shows gradient overlay + title + location
- Click opens lightbox with left/right navigation, keyboard support, ESC close

### About `about.vue`

- Avatar + name + intro paragraph
- Social link icon group
- Static content with placeholder text

## Content v3 Data Model

### `content.config.ts`

```typescript
import { defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string(),
        updated: z.string().optional(),
        tags: z.array(z.string()).default([]),
        cover: z.string().optional(),
        draft: z.boolean().default(false),
        featured: z.boolean().default(false),
        readingTime: z.number().optional(),
      })
    }),
    works: defineCollection({
      type: 'page',
      source: 'works/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string(),
        category: z.enum(['风光', '人文', '街头', '建筑']),
        series: z.string().optional(),
        image: z.string(),
        camera: z.string().optional(),
        lens: z.string().optional(),
        settings: z.object({
          aperture: z.string(),
          shutter: z.string(),
          iso: z.number(),
        }).optional(),
        location: z.string().optional(),
        featured: z.boolean().default(false),
      })
    }),
  }
})
```

## Components & Interaction Details

### AppHeader

- Fixed top, frosted glass on scroll (`backdrop-blur-md bg-white/90`)
- Left: Logo (serif site name), Right: nav links (Home, Blog, Works, About)
- Link hover: underline expand animation (`background-size` transition)
- Mobile: hamburger menu → dropdown drawer
- Gear icon opens settings drawer

### SettingsDrawer

- Slides in from right, 320px wide, semi-transparent overlay
- Three sections with dividers:
  - Color mode: light/dark icon buttons (sun/moon)
  - Accent color: four color dots, selected has ring border
  - Title font: three text buttons rendered in their own font

### ArticleCard

- Cover image hover: slight zoom (`scale-105`, 500ms)
- Date + tags (accent color) + title (hover to accent color) + description
- Entire card clickable

### PhotoLightbox (PhotoSwipe)

- Fullscreen dark background, centered responsive image
- Bottom: title + EXIF info (camera/lens/settings)
- Supports: arrow key navigation, ESC close, pinch zoom (mobile)

### Page Transitions

- Global fade (`opacity 0.2s ease`), `out-in` mode
- `scroll-behavior: smooth`

### Responsive Breakpoints

```
default    < 640px   Single column, navigation collapsed
sm:        640px+    Two-column cards
md:        768px+    Full navigation, blog detail shows sidebar
lg:        1024px+   Three-column cards, masonry three columns
xl:        1280px+   Max-width centered
```
