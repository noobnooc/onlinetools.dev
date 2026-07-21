# onlinetools.dev — Brand Guide

## Concept

The mark is an **"o" ring with an online-status dot** — the "o" of
*onlinetools*, plus the green dot developers read instantly as "online /
running". Both sit on the dark app tile (`#0B0D10`), composed along the 45°
diagonal. It doubles as a lens/aperture: focused, precise, tool-like.

The wider identity follows the product's design language:

- **Dark-first.** The tile is always dark, even in light-theme contexts —
  it reads as an app icon, not a themed element.
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
tracking, no ligature tricks. On dark chrome the `.dev` suffix may be
dimmed (`dim` token).

## Mark geometry

Defined on a 64-unit grid (`static/favicon.svg`):

- Tile: 64×64, corner radius 14.5 (≈ 22.5%, iOS-like squircle feel)
- Ring: center (30, 34), radius 11.5, stroke 6, `accent`
- Dot: center (48, 16), radius 5.75, `ok`

The ring is offset down-left and the dot up-right so the pair balances on
the diagonal. The maskable variant (`static/icon-maskable.svg`) is
full-bleed with the same composition scaled into the 80% safe zone.

Don'ts: no gradients, no recoloring, no rotating the dot to another
corner, no placing the ring on light tiles.

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
