# Turning on the blog editor

The site has a writing dashboard at **`/admin/`**. Once it's switched on, adding
a blog post looks like this:

1. Go to `https://muhahmmaad.github.io/admin/`
2. Click **Login with GitHub**
3. Click **New Blog post**
4. Fill in Title, Date, Category, drag in a Cover image, write the Body
5. Click **Publish**

That's it — no code, no terminal, no markdown knowledge. The site rebuilds
itself and the post is live in a minute or two. Images are drag-and-drop.

The catch: GitHub Pages only serves files, it can't run server code, and a
"Login with GitHub" button needs a server to complete the handshake. So one
tiny free helper has to be deployed once. Below is that setup.

---

## One-time setup (about 10 minutes, no cost)

Do this from **Ahmad's** GitHub account, since the posts are committed as him.

### Step 1 — Create a GitHub OAuth App

1. Go to <https://github.com/settings/developers> → **OAuth Apps** → **New OAuth App**
2. Fill in:
   - **Application name:** `Portfolio CMS`
   - **Homepage URL:** `https://muhahmmaad.github.io`
   - **Authorization callback URL:** `https://portfolio-cms-auth.<your-subdomain>.workers.dev/callback`
     (leave a placeholder for now — you'll correct it in Step 3)
3. Click **Register application**
4. Copy the **Client ID**
5. Click **Generate a new client secret** and copy that too

Keep both somewhere safe for the next step. The secret is shown once.

### Step 2 — Deploy the auth helper

Cloudflare Workers has a free tier that covers this comfortably.

1. Sign up at <https://dash.cloudflare.com> (free)
2. Go to **Workers & Pages** → **Create** → **Create Worker**
3. Name it `portfolio-cms-auth`, click **Deploy**
4. Click **Edit code**, delete what's there, and paste the contents of
   [`oauth-worker.js`](./oauth-worker.js) from this folder
5. Click **Deploy**
6. Go to the worker's **Settings** → **Variables and Secrets** and add two
   secrets:
   - `GITHUB_CLIENT_ID` → the Client ID from Step 1
   - `GITHUB_CLIENT_SECRET` → the client secret from Step 1
7. Click **Deploy** once more so the secrets take effect
8. Copy the worker's URL — it looks like
   `https://portfolio-cms-auth.<your-subdomain>.workers.dev`

### Step 3 — Point everything at the worker

1. Back in the GitHub OAuth App from Step 1, set the
   **Authorization callback URL** to your real worker URL plus `/callback`:
   `https://portfolio-cms-auth.<your-subdomain>.workers.dev/callback`
   and click **Update application**
2. In this repo, open `admin/config.yml` and replace the `base_url` line:
   ```yaml
   base_url: https://portfolio-cms-auth.<your-subdomain>.workers.dev
   ```
3. Commit that change (the CMS itself can do this later, but this first edit
   has to happen outside it)

### Step 4 — Log in

Visit `https://muhahmmaad.github.io/admin/` and click **Login with GitHub**.
GitHub asks for authorisation once; after that you go straight to the dashboard.

---

## Day-to-day use

**Writing a post.** *New Blog post* → fill the fields → **Publish**.

Because `publish_mode: editorial_workflow` is on, posts move through
**Draft → In review → Ready** before going live. Drag a card to *Ready* and hit
publish when you want it public. If that's more ceremony than you want, delete
the `publish_mode: editorial_workflow` line from `admin/config.yml` and posts
publish immediately.

**Images.** Drag them into the Cover image field or straight into the body.
They're stored in `assets/img/uploads/`.

**Editing or deleting.** Open any existing post from the dashboard list, change
it, and publish again. The trash icon deletes it.

**Where posts actually live.** Each post is a markdown file in `_posts/`. The
CMS is a friendly front end over those files — anyone comfortable with markdown
can also just edit them directly, and both routes work at the same time.

---

## If something goes wrong

**"Login with GitHub" does nothing, or the popup closes immediately**
The `base_url` in `admin/config.yml` is wrong, or the worker's secrets weren't
saved. Re-check Steps 2.6 and 3.2.

**"Error: Failed to load config.yml"**
The file must be reachable at `https://muhahmmaad.github.io/admin/config.yml`.
If it 404s, the deploy didn't include the `admin/` folder.

**Post published but not showing on the site**
Give it two minutes — the site rebuilds after each commit. Then check the
post's date isn't in the future, which hides it until that date arrives.

**Repo says "not found" after login**
The `repo:` line in `admin/config.yml` must match the real repository, and the
logged-in account needs write access to it.
