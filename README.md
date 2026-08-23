# DAR Trading & Contracting — Website

A trilingual (English / Arabic / French) marketing website for **DAR Trading & Contracting**, a Beirut-based construction, finishing, and trades company.

## Live preview

Open [`index.html`](./index.html) directly in a browser, or host it on any static file host (GitHub Pages, Netlify, Vercel, cPanel, S3, etc.) — there is no build step.

## Stack

Plain HTML5, CSS3, and vanilla JavaScript — no framework, no build tools, no dependencies to install. The only external resource is Google Fonts (Inter + Cairo), loaded via a single `<link>` tag.

- **HTML5** — semantic structure; all three languages live in one file, toggled via the `hidden` attribute
- **CSS3** — custom properties (design tokens) drive both the color system and light/dark theming; CSS Grid and Flexbox for layout; media queries for responsive/mobile
- **Vanilla JavaScript** — language switching, dark/light mode toggle (persisted via `localStorage`), mobile navigation, and scroll-triggered reveal animations (via `IntersectionObserver`)
- **Inline SVG** — every icon, the circle-and-line brand pattern, and the sun/moon toggle icons are hand-authored SVG, not an icon library

## Features

- Full trilingual content (EN / AR / FR) with correct RTL layout mirroring for Arabic
- Light and dark mode, with a manual toggle and OS-preference default
- Built entirely on the client's own brand identity system (colors, typography, logo mark, icon set)
- Responsive, with a dedicated mobile navigation menu
- No backend, no database, no server-side code required

## Deploying to GitHub Pages

1. Repo Settings → Pages → Source: deploy from the `main` branch, root folder
2. The site will be live at `https://<username>.github.io/<repo-name>/`

## Contact / social links

The footer's social media icons (Facebook, X, Instagram, LinkedIn) currently point to placeholder (`#`) links — update `index.html` with the real profile URLs before final launch.
