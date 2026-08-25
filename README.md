# muhahmmaad.github.io

Personal portfolio site for **Muhammad Ahmad** — Influencer Marketing Manager & SMME.

Live at: https://muhahmmaad.github.io

Built on the [Responsive Portfolio Website (Alexa)](https://github.com/bedimcode/responsive-portfolio-website-Alexa)
design by Bedimcode, rebuilt and populated with real CV content.

## Structure

```
index.html                     all sections in one page
assets/css/styles.css          theme, layout, dark mode, media queries
assets/css/swiper-bundle.min.css
assets/js/main.js              nav, accordion, tabs, modals, sliders, theme toggle
assets/js/swiper-bundle.min.js Swiper 6.5.8
assets/img/                    profile photo, cutout, research cards, favicon
assets/pdf/Muhammad-Ahmad-CV.pdf
```

## Sections

Home · About · Skills · Qualification (education / experience) · Services ·
Research & Publications · References · Contact

## Running locally

No build step — it's static HTML/CSS/JS. Serve the folder over HTTP:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly via `file://` mostly works, but a local server
is closer to how GitHub Pages serves it.

## Editing

- **Text and sections** — `index.html`.
- **Accent colour** — change `--hue-color` in `assets/css/styles.css`
  (250 purple · 142 green · 230 blue · 340 pink).
- **CV** — replace `assets/pdf/Muhammad-Ahmad-CV.pdf`, keeping the filename.
- **Contact form** — posts to [FormSubmit](https://formsubmit.co). The first
  submission triggers a one-time confirmation email to activate the address.

## Deploying

See **[docs/DEPLOY.md](docs/DEPLOY.md)** — must be done from the `muhahmmaad`
GitHub account, since the URL is derived from the account name.

The site builds with GitHub Actions (`.github/workflows/pages.yml`) so the
deployed Jekyll matches the pinned version in the `Gemfile`, rather than the
older Jekyll that GitHub Pages ships by default.

## Writing blog posts

Posts are markdown files in `_posts/`, named `YYYY-MM-DD-slug.md`.

There is a no-code editor at **`/admin/`** (Decap CMS) with fields for title,
date, category, cover image and a rich-text body. Turning it on requires a
one-time OAuth setup — see **[docs/CMS-SETUP.md](docs/CMS-SETUP.md)**.

To trial the editor locally without any of that:

```bash
npx decap-server          # terminal 1
bundle exec jekyll serve  # terminal 2
# open http://127.0.0.1:4000/admin/
```

Front matter a post understands:

```yaml
---
title: "Post title"
description: "One or two sentences, used on the card and in search results."
category: Influencer Marketing   # or Social Media, Research, Marketing Strategy
image: /assets/img/uploads/cover.jpg   # optional
---
```

Leave `image` out and the card falls back to one of the generated covers.
