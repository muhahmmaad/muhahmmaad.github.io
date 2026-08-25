# Instructions for an AI assistant (Grok, or any other)

You are helping **Muhammad Ahmad** publish this portfolio site. Read this
whole file before running anything — it contains the specific traps in this
project, and several of them will waste your time if you discover them the
hard way.

---

## 1. What this is

A personal portfolio and blog for Muhammad Ahmad (GitHub: `muhahmmaad`),
built on **Jekyll 4**. It is a static site: no database, no server, no paid
services anywhere.

It was built from the Bedimcode "Alexa" portfolio design, then extended.
Everything is committed already — there is nothing to write from scratch.

```
index.html                     one-page portfolio (Home, About, Skills,
                               Qualification, Services, Research, References,
                               Contact, latest blog posts)
blog.html                      /blog/ with Instagram-style tabs
_posts/                        blog posts, as markdown
_layouts/  _includes/  _data/  templates and the research list
admin/                         Decap CMS dashboard (see section 6)
.github/workflows/pages.yml    builds and deploys on every push
.github/workflows/publish-post.yml   turns an issue into a blog post
.github/scripts/               the two Node scripts those workflows call
docs/                          deployment and CMS setup guides
assets/                        css, js, images, the CV pdf
```

## 2. The single most important constraint

The site must live at **`https://muhahmmaad.github.io`**.

GitHub derives that address from the account name, so the repository *must* be
created under the **`muhahmmaad`** account and *must* be named exactly
`muhahmmaad.github.io`. No other account can publish to that URL. If you are
signed in as somebody else, stop and fix that first.

Check with:

```bash
gh auth status
```

If it does not show `muhahmmaad` as the active account:

```bash
gh auth login          # choose GitHub.com -> HTTPS -> Login with a web browser
# or, if the account is already added:
gh auth switch --user muhahmmaad
```

> When the browser opens, make sure GitHub itself is signed in as
> `muhahmmaad`. If another account is already signed in there, it will
> silently authorise the wrong one. Use a private window if unsure.

**Do not ask the user to paste a password or a token into the chat.** The
browser flow above is the correct route, and it never exposes credentials to
you.

## 3. Deploy

```bash
cd <this folder>

gh repo create muhahmmaad/muhahmmaad.github.io \
  --public --source=. --remote=origin --push

gh run watch
```

That is normally all. The workflow calls `actions/configure-pages` with
`enablement: true`, so it switches GitHub Pages on by itself — you should
**not** need to visit Settings.

**If the run fails** saying Pages is not enabled (some accounts restrict it):

```bash
gh api -X POST repos/muhahmmaad/muhahmmaad.github.io/pages -f build_type=workflow
gh run rerun --failed
```

The Pages source must end up as **GitHub Actions**, not "Deploy from a
branch". This matters: the branch builder uses Jekyll 3.9, while this site is
pinned to Jekyll 4.4 in the `Gemfile` and was only ever tested on that.

Verify when the run is green:

```bash
curl -sI https://muhahmmaad.github.io | head -1        # expect 200
curl -s https://muhahmmaad.github.io/blog/ | grep -c gram-tab   # expect > 0
```

## 4. Running it locally

Only needed if you are changing something. **Use `serve`, not `build`:**

```bash
bundle exec jekyll serve      # http://127.0.0.1:4000
```

`jekyll serve` watches for changes and rebuilds. If you instead build once and
serve the `_site/` folder with something like `python -m http.server`, new
posts will not appear and you will waste time hunting a bug that does not
exist. This cannot happen on the deployed site, where every commit rebuilds.

If Jekyll is missing:

```bash
gem install jekyll bundler
bundle install
```

## 5. How Ahmad publishes a blog post

He is a marketer, not a developer. Two routes exist; **the first needs no
setup at all** and should be your default recommendation.

### Route A — GitHub issue form (works the moment the site is deployed)

Issues tab → **New issue** → **New blog post** → fill in the form → **Create**.

`publish-post.yml` converts the issue into a file in `_posts/`, commits it,
refreshes the category dropdown, and closes the issue with a link. If a field
is wrong, the issue stays open with an explanation.

That workflow only runs for the repository owner. This is deliberate: without
that check, anyone able to open an issue could commit content to the site. Do
not relax it.

### Route B — the `/admin/` dashboard (nicer, needs a one-time setup)

Decap CMS with a rich-text editor and drag-and-drop images. It needs a GitHub
OAuth app plus a small free Cloudflare Worker, because GitHub Pages cannot run
the token exchange itself. The full walkthrough is in
**`docs/CMS-SETUP.md`**, and the Worker source is **`docs/oauth-worker.js`**.

After deploying that Worker, set `base_url` in `admin/config.yml` to the
Worker's URL. Until then `/admin/` loads but cannot log in — that is expected,
not a bug.

## 6. Things that will bite you

**Categories are free text and self-maintaining.** Do not hardcode a category
list anywhere. `.github/scripts/refresh-category-options.js` rewrites the
dropdown in the issue template from the categories actually present in
`_posts/`. Run it after adding or removing posts by hand.

**Posts use `category:` (singular), not `categories:`.** Jekyll treats
`categories` as special and splits it on whitespace, which would turn
"Influencer Marketing" into two separate categories. Do not switch it back.

**Videos are links, never uploads.** A post can carry `video: <url>`
(YouTube, Vimeo, or anything else). It then appears under the Videos tab with
a play badge, and the post page embeds a player. GitHub Pages has a **1 GB
hard limit** on the published site; a handful of video files would consume it.
Never add a video file to this repository.

**Cover images are optional.** Without `image:`, a card falls back to one of
the generated SVGs in `assets/img/`, rotating by position.

**Post front matter** looks like this:

```yaml
---
title: "Post title"
description: "One or two sentences, used on the card and in search results."
category: Influencer Marketing
image: /assets/img/uploads/cover.jpg      # optional
video: https://www.youtube.com/watch?v=…  # optional
---
```

Filenames must be `YYYY-MM-DD-slug.md` — Jekyll requires the date prefix.

**Do not commit secrets.** The OAuth client secret belongs in the Cloudflare
Worker's settings, never in this repository.

## 7. Two things the user should decide before sharing the link

Raise both; do not silently act on either.

1. **`_posts/2026-08-24-video-graphy.md`** is a test post with placeholder
   text. It will appear on the live site. Ask whether to delete it.

2. **`assets/pdf/Muhammad-Ahmad-CV.pdf`** is downloadable by anyone, and it
   contains Ahmad's date of birth and both referees' phone numbers and email
   addresses. Those details were removed from the web pages, but not from the
   PDF. Suggest replacing it with a trimmed version, keeping the same filename
   so the Download CV button keeps working.

## 8. If you get stuck

- **404 after deploying** — repo must be named exactly `muhahmmaad.github.io`
  and be Public.
- **Workflow red X** — open the run log; the error is usually stated plainly.
- **Site live but unstyled** — wait two minutes, then hard-refresh.
- **A post is missing** — check its date is not in the future, which hides it
  until then.

Report honestly what worked and what did not. If a step failed, say so and
show the output rather than assuming it succeeded.
