# CLAUDE.md — Fabric Build Guide

This document describes the architecture, conventions, and workflow for this repo. Read it before making any changes.

---

## Stack

| Layer | Tool |
|---|---|
| Static site generator | Eleventy 3.x (`@11ty/eleventy`) |
| Component system | WebC (`@11ty/eleventy-plugin-webc`) |
| CSS framework | Tailwind CSS v4 (`tailwindcss`) |
| Animations | GSAP (ScrollTrigger, SplitText, TextPlugin, ScrollToPlugin) |
| WebGL | Three.js, NouveauBloomWave, BinaryFadeCanvas |
| Package manager | npm |
| Module system | ESM (`"type": "module"` throughout) |

No TypeScript. No React/Vue/Svelte. No server-side runtime. Fully static output.

---

## Directory Structure

```
fabric/
├── eleventy.config.js     # Eleventy config (ESM)
├── package.json
├── src/
│   ├── index.webc         # Pages live here as .webc files
│   ├── manifest.webmanifest
│   ├── _data/
│   │   └── base.js        # Global data (url, domain, name, env, currentYear)
│   ├── _layouts/
│   │   └── main.webc      # Root HTML layout
│   ├── _components/       # Auto-registered WebC components
│   │   ├── buttons/
│   │   ├── foundation/
│   │   ├── navigation/
│   │   ├── placeholders/
│   │   ├── sail/
│   │   ├── sections/
│   │   └── svg/
│   │       ├── helm/      # UI icons (icon-*)
│   │       ├── logos/     # Brand logos (logo-*)
│   │       └── logo-icons/
│   └── assets/
│       ├── css/
│       │   ├── main.css        # Tailwind v4 + all design tokens
│       │   └── markdown.css    # Markdown/prose styles (Dracula highlight)
│       ├── fonts/              # Sohne variable font
│       ├── images/
│       └── js/                 # GSAP, Three.js, NouveauBloomWave, BinaryFadeCanvas
└── dist/                  # Build output — never edit manually
```

---

## Node Version

This project requires **Node.js 20**. The repo includes a `.node-version` file pinned to `20.20.1` for nodenv.

Before running any npm commands, ensure you are on Node 20:

```bash
nodenv local 20.20.1   # already committed in .node-version — sets it for this directory
node --version         # should print v20.x.x
```

Stripe machines use `nodenv`. If your shell is configured correctly, nodenv will pick up `.node-version` automatically when you `cd` into the project. If `npm` errors on startup, confirm you are not on a different Node version managed by nvm or another tool.

---

## Development Commands

```bash
npm i              # Install dependencies
npm start          # Clean → one-off CSS build → watch Eleventy + watch CSS in parallel
npm run build      # Clean → build Eleventy HTML → build minified CSS (Vercel uses this)
```

**How the dev server works:**
- Eleventy serves on `http://localhost:8080` with `--serve --incremental`
- Tailwind CLI watches `src/assets/css/main.css` → `dist/assets/css/main.css`
- Eleventy watches `dist/**/*.css` and triggers a browser reload when CSS changes
- The two watchers run in parallel via `watch:all`

Never run `watch:html` or `watch:css` in isolation — always use `npm start` which handles the initial CSS build first.

---

## Eleventy Config (`eleventy.config.js`)

Key behaviours to preserve:

- `dir.includes` = `_components` — all `.webc` files under `src/_components/**/*.webc` are auto-registered globally
- `dir.layouts` = `_layouts`
- `dir.data` = `_data`
- `htmlTemplateEngine: "webc"` — `.webc` files are the page template engine
- **Passthrough:** `assets/js`, `assets/images`, `assets/fonts`, `manifest.webmanifest`, `markdown.css` — these are copied verbatim, never processed by Eleventy
- **HTML minification** is only applied in production builds (not when `--serve` flag is present)
- **Quickstart collection** reads `src/quickstart/*.md`, pre-renders markdown via `markdown-it`, sorts by `data.order`
- `domDiff: true` on the dev server for fast in-place HTML patching

---

## WebC Components

### File Location and Auto-Registration

All components live in `src/_components/**/*.webc`. The filename becomes the tag name — `helm-container.webc` → `<helm-container>`.

### Component Naming Conventions

| Prefix | Purpose | Examples |
|---|---|---|
| `helm-` | Layout and navigation primitives | `helm-container`, `helm-section`, `helm-nav`, `helm-footer` |
| `icon-` | UI icons (SVG) | `icon-check`, `icon-add`, `icon-arrowanimate` |
| `logo-` | Brand/company logos (SVG) | `logo-vercel`, `logo-supabase`, `logo-neon` |
| `link-btn` | Button/CTA component | — |
| `stub-` | Placeholder/skeleton sections | `stub-docs`, `stub-dash`, `stub-com` |
| `sidebar-` | Sidebar panels (sail) | `sidebar-docs`, `sidebar-dash` |

Follow these prefixes when adding new components.

### WebC Patterns in Use

**Root override** — prevents a wrapper element from being emitted:
```html
<div webc:root="override">...</div>
<!-- or for SVG: -->
<svg webc:root="override" ...>
```

**Conditional rendering:**
```html
<element webc:if="size === '48' && color === 'primary'">...</element>
<element webc:elseif="size === '40'">...</element>
```

**Props** are passed as HTML attributes and accessed as JS expressions:
```html
<!-- Caller -->
<link-btn size="48" color="primary" href="/docs">
    <span slot="label">Read docs</span>
</link-btn>

<!-- Component uses `size`, `color`, `href` directly in expressions -->
<a webc:if="size === '48'" :href="href" ...>
```

**Slots:**
```html
<slot></slot>                    <!-- default slot -->
<slot name="label"></slot>       <!-- named slot -->
<span slot="label">Text</span>   <!-- usage -->
```

**Dynamic attributes** use `:` prefix:
```html
<a :href="href">
<meta :content="this.seoDesc">
```

**Dynamic content:**
```html
<div @html="this.content"></div>   <!-- inject HTML -->
<span @text="base.name"></span>    <!-- inject text -->
```

**webc:keep** — prevents WebC from stripping scripts/links that look unused:
```html
<script webc:keep src="/assets/js/gsap.min.js"></script>
<style @raw="getBundle('css')" webc:keep></style>
```

**Conditional by front matter data:**
```html
<link webc:if="markdown" rel="stylesheet" href="/assets/css/markdown.css" webc:keep/>
<script webc:if="wave !== false" type="module" webc:keep src="..."></script>
```

---

## Pages

Pages are `.webc` files in `src/`. Each page requires front matter:

```yaml
---
layout: "main.webc"
title: "Page Title"
seoTitle: "Full SEO title"
seoDesc: "Meta description"
ogTitle: "OG title"
ogDesc: "OG description"
ogImage: "/assets/images/og/default.jpg"
ogImageAlt: ""
changefreq: "weekly"
---
```

**Optional front matter flags:**

| Key | Default | Effect |
|---|---|---|
| `markdown` | `false` | Loads `markdown.css` in the layout |
| `wave` | `true` | Controls NouveauBloomWave WebGL — set `false` to disable |
| `binaryCanvas` | `false` | Loads BinaryFadeCanvas WebGL module |

---

## Global Data (`src/_data/base.js`)

```js
{
    url: process.env.URL || "http://localhost:8080",
    domain: "https://projects.dev/",
    name: "Stripe Projects",
    env: process.env.ENVIRONMENT || "local",
    currentYear() { ... }
}
```

- `base.env` is `"local"` in dev, used to gate Plausible analytics
- `base.url` is injected at build time from the `URL` environment variable — critical for canonical URLs and OG images in production

---

## Tailwind v4 Design System

Tailwind v4 uses `@theme` in CSS — there is no `tailwind.config.js`.

All design tokens are defined in `src/assets/css/main.css`.

### Spacing

The base spacing unit is `1px` (`--spacing: 0.0625rem`). All spacing utilities map pixel values directly:

```html
class="p-16"   <!-- padding: 1rem (16px) -->
class="mt-48"  <!-- margin-top: 3rem (48px) -->
class="h-40"   <!-- height: 2.5rem (40px) -->
```

### Typography

Font sizes use numeric px names that map to rem:

```html
class="text-14"   <!-- 0.875rem -->
class="text-16"   <!-- 1rem -->
class="text-64"   <!-- 4rem -->
```

Line heights follow the same pattern:

```html
class="text-16/150"   <!-- font-size: 1rem, line-height: 1.5 -->
class="text-18/130"
```

### Border Radius

Radius values also use px names:

```html
class="rounded-4"    <!-- 0.25rem -->
class="rounded-8"    <!-- 0.5rem -->
class="rounded-16"   <!-- 1rem -->
```

### Breakpoints

Custom breakpoints (default Tailwind breakpoints are reset):

| Token | Value |
|---|---|
| `sm` | 40rem (640px) |
| `md` | 58.75rem (940px) |
| `lg` | 79rem (1264px) |

### Color System

Two layers of color tokens:

**1. Raw hex values** in `:root` as `--hex-*` (never use directly in templates):
```css
--hex-brand-600: #533afd;
--hex-neutral-990: #061b31;
```

**2. Tailwind theme colors** in `@theme` as `--color-*` (use these in templates):
```html
class="text-brand-600"
class="bg-neutral-25"
```

**Semantic abstractions** (prefer these for text and UI states):
```html
class="text-headline"      <!-- primary text -->
class="text-subheadline"   <!-- secondary headings -->
class="text-content"       <!-- body copy -->
class="text-detail"        <!-- supporting/meta text -->
class="text-disclaimer"    <!-- fine print -->
class="text-primary"       <!-- brand action color -->
class="border-edge"        <!-- default border color -->
class="bg-highlight"       <!-- page background (white) -->
class="bg-foreground"      <!-- card/surface background -->
```

### Custom Utilities

| Class | Purpose |
|---|---|
| `gradient-text` | Clip background to text for gradient text effect |
| `no-scrollbar` | Hide scrollbar cross-browser |
| `dot-grid-8` | 8px dot grid background pattern |
| `mask-*` | Apply mask-image from `--mask-*` theme tokens |
| `animate-carat` | Blinking cursor animation |
| `animate-input-loading` | Conic gradient loading spinner |

---

## Layout Components

### `<helm-container>`

Max-width content wrapper (`max-w-1266` = `79.125rem`). Use inside every section:

```html
<helm-container class="flex items-center pt-48">
    <!-- content -->
</helm-container>
```

### `<helm-section>`

Section wrapper with flex centering. Wraps `helm-container`:

```html
<helm-section class="relative z-20">
    <helm-container>...</helm-container>
</helm-section>
```

---

## JavaScript Conventions

### No build step for JS

All JavaScript is either:
- Pre-built vendor files in `src/assets/js/` (GSAP, Three.js) — copied verbatim via passthrough
- Inline `<script>` blocks in `.webc` page files
- ES module files in `src/assets/js/` subdirectories (NouveauBloomWave, BinaryFadeCanvas)

### GSAP Setup

GSAP and plugins are loaded globally in `_layouts/main.webc`. They are registered in the bundle script:

```html
<script @raw="getBundle('js')" webc:keep>
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin, SplitText);
</script>
```

Use `gsap`, `ScrollTrigger`, `TextPlugin`, `SplitText`, `ScrollToPlugin` as globals in any page script.

### Mount Points

JS components mount via `data-js-target` attributes:

```html
<canvas data-js-target="nouveau-bloom-wave"></canvas>
<canvas data-js-target="binary-fade-canvas"></canvas>
```

### Data Attributes for JS

Use `data-*` attributes to connect JS behavior to HTML elements:

```html
data-hero="headline"          <!-- hero section roles -->
data-copy-install             <!-- copy-to-clipboard target -->
data-logo-wall="1"            <!-- logo carousel state -->
data-container-hover-follow   <!-- hover gradient container -->
data-hover-follow             <!-- hover gradient child -->
```

### Inline Scripts in Pages

Page-specific scripts go inside the `.webc` file as `<script>` blocks. They run after the DOM is ready (scripts are at end of body). Use GSAP for any animations rather than raw CSS transitions when sequencing is needed.

---

## Adding New Pages

1. Create `src/your-page.webc`
2. Add required front matter (`layout`, `seoTitle`, `seoDesc`, `ogTitle`, `ogDesc`, `ogImage`, `ogImageAlt`)
3. Write HTML using existing WebC components
4. The page outputs to `dist/your-page/index.html`

---

## Adding New Components

1. Create `src/_components/<category>/<component-name>.webc`
2. Name the file to match the tag you want to use — `my-widget.webc` → `<my-widget>`
3. Use `webc:root="override"` on the root element to avoid a wrapper div being emitted unless you actually want the wrapper
4. Accept props as plain HTML attributes, access them by name in expressions
5. Follow the naming prefix conventions (helm-, icon-, logo-, etc.)

---

## Adding New Sections to a Page

Model sections after the existing pattern in `src/index.webc`:

```html
<helm-section class="relative">
    <helm-container class="flex flex-col py-96">
        <!-- section content -->
    </helm-container>
</helm-section>
```

---

## Production Build & Deployment

### Environment Variables

| Variable | Purpose |
|---|---|
| `URL` | Canonical base URL (e.g. `https://projects.stripe.com`) |
| `ENVIRONMENT` | Set to anything other than `"local"` to enable Plausible analytics |

### Build Output

`npm run build` produces `dist/` with minified HTML and CSS. The `dist/` directory is the deployment artifact.

### Vercel

For Vercel deployment:
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Install command:** `npm install`
- Set `URL` environment variable to the production domain
- Set `ENVIRONMENT` to `production`

---

## What Not to Do

- Do not add a `tailwind.config.js` — Tailwind v4 config lives in `main.css` under `@theme`
- Do not edit files in `dist/` — it is always regenerated
- Do not use default Tailwind spacing values (e.g. `p-4` = 4px here, not 16px) — the spacing base is `0.0625rem`
- Do not use default Tailwind breakpoints (`sm`, `md`, `lg` are custom values here)
- Do not introduce TypeScript, a JS framework, or a bundler — this is intentionally vanilla
- Do not add `gray-matter` or `markdown-it` imports to page files — they are only used inside `eleventy.config.js` for the quickstart collection
- Do not edit `.projects/` or `.env` — managed by Stripe Projects CLI
