# DAR Trading & Contracting — Website

A trilingual (English / Arabic / French) marketing website for **DAR Trading & Contracting**, a Beirut-based construction, finishing, and trades company.

## Live preview

Open [`index.html`](./index.html) directly in a browser, or host the repository root on any static file host (GitHub Pages, Netlify, Vercel, cPanel, S3, etc.). There is no production build step.

## Stack

Plain HTML5, CSS3, and vanilla JavaScript — no framework and no production dependencies. Google Fonts is the only runtime third-party request; the pinned Three.js module is self-hosted.

- **HTML5** — semantic structure and localized SEO metadata; all three languages live in one file, toggled via the `hidden` attribute
- **CSS3** — maintained in `assets/css/styles.css`; custom properties drive the color system and light/dark theming
- **Vanilla JavaScript** — maintained in `assets/js/app.js`; language switching, accessible dialogs, theming, navigation and progressive visual effects
- **Inline SVG** — every icon, the circle-and-line brand pattern, and the sun/moon toggle icons are hand-authored SVG, not an icon library
- **Optimized media** — dimensioned WebP trade photography to reduce transfer size and layout movement

## Editing the site

- Update visible placeholder copy and links in `index.html`. English, Arabic, and French are grouped into clearly marked `<main data-lang="…">` sections.
- Update brand colors and layout tokens in the `:root` block at the top of `assets/css/styles.css`.
- Phone-specific layout rules are grouped under `MOBILE-FIRST SAFETY LAYER` at the bottom of that stylesheet.
- Interaction behavior lives in `assets/js/app.js`; routine text or color changes do not require JavaScript edits.

## Features

- Full trilingual content (EN / AR / FR) with correct RTL layout mirroring for Arabic
- Light and dark mode, with a manual toggle and OS-preference default
- Built entirely on the client's own brand identity system (colors, typography, logo mark, icon set)
- Responsive, with a dedicated mobile navigation menu
- No backend, no database, no server-side code required
- Localized `?lang=en`, `?lang=ar`, and `?lang=fr` URLs with matching metadata and `hreflang`
- Click-to-call, email, and prefilled WhatsApp quote actions
- Content Security Policy and a self-hosted, pinned Three.js runtime

## Quality checks

Install the development-only validator and run the local checks:

```sh
npm ci
npm test
```

The GitHub Actions workflow additionally checks internal links and runs Lighthouse against all three language variants. Accessibility and SEO scores below 95 fail CI; performance below 80 produces a warning.

## Deploying to GitHub Pages

1. Repo Settings → Pages → Source: deploy from the `main` branch, root folder
2. The site will be live at `https://<username>.github.io/<repo-name>/`

## Contact

The production contact actions use the company phone number, email address, and WhatsApp. Add social profiles only after official URLs are available; the site intentionally contains no placeholder links.
