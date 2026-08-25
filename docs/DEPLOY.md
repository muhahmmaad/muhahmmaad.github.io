# Deploying the site

Everything is built and committed. What's left needs **Muhammad Ahmad's GitHub
account**, because the site lives at `muhahmmaad.github.io` — GitHub derives
that URL from the account name, so it can't be published from anyone else's.

Run these from the project folder:

```bash
cd /Users/zia/Documents/ahmad/muhahmmaad.github.io
```

---

## Step 1 — Sign in as muhahmmaad

If another account is already signed in, add this one alongside it:

```bash
gh auth login
```

Choose: **GitHub.com** → **HTTPS** → **Login with a web browser**, and complete
it as **muhahmmaad**. Then confirm the right account is active:

```bash
gh auth status
```

You should see `muhahmmaad` marked as the active account. If not:

```bash
gh auth switch --user muhahmmaad
```

## Step 2 — Create the repo and push

```bash
gh repo create muhahmmaad/muhahmmaad.github.io \
  --public --source=. --remote=origin --push
```

## Step 3 — Turn on Pages

This site builds with GitHub Actions (so the deployed Jekyll matches the
version it was tested on), which means Pages must be told to use Actions
rather than a branch:

```bash
gh api -X POST repos/muhahmmaad/muhahmmaad.github.io/pages \
  -f build_type=workflow
```

If that errors, do it by hand instead: **Settings → Pages → Build and
deployment → Source → GitHub Actions**.

## Step 4 — Watch it deploy

```bash
gh run watch
```

Takes about a minute. When it's green:

**https://muhahmmaad.github.io**

---

## Step 5 — Switch on the blog editor

The site is live at this point, but `/admin/` can't log in yet. That needs the
one-time OAuth setup in [CMS-SETUP.md](./CMS-SETUP.md) — about 10 minutes, no
cost, also done from Ahmad's account.

Until then, posts can still be added by editing markdown files in `_posts/`
directly on github.com, or locally with `npx decap-server` (see below).

---

## Previewing locally before you push

Two terminals, from the project folder:

```bash
# Terminal 1 — the site
bundle exec jekyll serve
# → http://127.0.0.1:4000

# Terminal 2 — the blog editor (optional)
npx decap-server
# → then open http://127.0.0.1:4000/admin/
```

Locally the editor needs no login at all — `local_backend: true` in
`admin/config.yml` points it at the proxy on port 8081. Posts written this way
are saved straight into `_posts/` as files, which you then commit and push.

If `bundle exec jekyll serve` complains that Jekyll isn't installed:

```bash
gem install jekyll bundler
bundle install
```
