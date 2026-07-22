# onlinetools.dev — Brand Guide

## Concept

The mark is a **green "online" core centered inside the blue "o" ring** —
the "o" of *onlinetools* wrapped around the green dot developers read
instantly as "online / running". Concentric, it doubles as a lens/aperture
or a live-status indicator: focused, precise, tool-like.

The wider identity follows the product's design language:

- **Backgrounds fit the context.** The SVG favicon is transparent (ring +
  dot only) so it reads on any tab bar; its colors swap with the viewer's
  scheme for contrast. The in-app mark (mobile top bar) is tile-less,
  inheriting the active theme via `--accent`/`--ok`. Fixed app-tile rasters
  (PWA/apple-touch icons) and the OG/Twitter card keep the dark tile
  (`#0B0D10`). The desktop sidebar leads with the wordmark alone, no mark.
- **One accent.** Blue (`#4C8DFF`) is the only brand color; green
  (`#3ECF8E`) appears solely as the status dot / "runs locally" signal.
- **Borders separate, not shadows.** Cards are outlined (`#262B33`) on a
  recessed canvas (`#060709`), with technical-drawing "+" registration
  marks at the corners (see `PlusCorners.svelte`).

## Palette

| Token   | Dark      | Light     | Use                              |
| ------- | --------- | --------- | -------------------------------- |
| bg      | `#0B0D10` | `#FAFBFC` | App surface; the icon tile       |
| canvas  | `#060709` | `#ECEEF2` | Recessed backdrop (OG image bg)  |
| surface | `#12151A` | `#FFFFFF` | Cards, chips                     |
| border  | `#262B33` | `#E4E7EC` | Primary separation device        |
| text    | `#E6E9EE` | `#101114` | Foreground                       |
| dim     | `#8A919E` | `#667085` | Secondary text, eyebrows         |
| accent  | `#4C8DFF` | `#3672F0` | The single brand accent          |
| ok      | `#3ECF8E` | `#16A06B` | Status dot, "runs locally"       |

Canonical source: `src/app.css`. The generator script mirrors the dark
values in `scripts/generate-brand-assets.mjs` — keep them in sync.

## Typography

- **Inter** — UI and headlines (600 for wordmark, 700 for display).
- **JetBrains Mono** — code, chips, eyebrows, the "+" corner marks.

The wordmark is plain text: `onlinetools.dev`, Inter SemiBold, tight
tracking, no ligature tricks. It is colored to echo the mark:
`online` in `accent` blue (the ring), `tools` in the default `text`
color, the `.` in `ok` green (the core), and `dev` in a faded `dim`
(≈60% opacity) so the suffix recedes. The two brand colors land only on
the two segments that map to the icon, so the wordmark stays legible
rather than rainbow.

## Mark geometry

Defined on a 64-unit grid (`static/favicon.svg`):

- Ring: center (32, 32), radius 13, stroke 6, `accent`
- Dot: center (32, 32), radius 5.5, `ok`
- Tile (raster app icons only): 64×64, corner radius 14.5 (≈ 22.5%,
  iOS-like squircle feel), `bg`

The ring and dot share a center so the green core reads as "online"
inside the blue "o". `favicon.svg` is transparent and carries a
`prefers-color-scheme` `<style>` block that swaps the light-tuned
accent/ok with the viewer's theme; `favicon.ico` mirrors it (transparent,
fixed brand colors). In-app the mark is rendered tile-less with the
`--accent`/`--ok` CSS variables, so it inherits the active theme. The
maskable variant (`static/icon-maskable.svg`) is full-bleed dark with the
same concentric composition inside the 80% safe zone.

Don'ts: no gradients, no recoloring the ring/dot, no de-centering the
core, no placing the OG or raster app-tile marks on a light tile.

## Asset inventory

| File                            | Purpose                                    |
| ------------------------------- | ------------------------------------------ |
| `static/favicon.svg`            | Master mark; SVG favicon (all sizes)       |
| `static/favicon.ico`            | 16/32/48 ICO for legacy consumers          |
| `static/icon-192.png` / `-512`  | PWA icons (`purpose: any`)                 |
| `static/icon-maskable.svg`      | Maskable source                            |
| `static/icon-maskable-512.png`  | PWA icon (`purpose: maskable`)             |
| `static/apple-touch-icon.png`   | 180×180 full-bleed (iOS applies its mask)  |
| `static/og.png`                 | 1200×630 Open Graph / Twitter card         |

## Regenerating

All raster assets are rendered from the SVG sources + the OG template in
one step:

```sh
pnpm brand:assets
```

Fonts are fetched once into `scripts/.fonts/` (gitignored) and cached.
Edit the OG copy/chips in `scripts/generate-brand-assets.mjs`; if the tool
count changes, update the eyebrow and "+ N more" chip there.
