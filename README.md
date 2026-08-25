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

Pushing to the `main` branch of the `muhahmmaad/muhahmmaad.github.io`
repository publishes to https://muhahmmaad.github.io (Settings → Pages →
Source: *Deploy from a branch* → `main` / `root`).
