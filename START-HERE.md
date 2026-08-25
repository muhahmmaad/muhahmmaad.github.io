# Ahmad — start here

This folder is your finished portfolio site. It just needs publishing.

**You do not need to install Ruby, Jekyll, or Node.** The site is built on
GitHub's own servers. All your laptop needs is `git`.

---

## 1. Check git is installed

Open **Terminal** and run:

```bash
git --version
```

If it prints a version, you're set. If macOS offers to install "command line
developer tools", accept it and wait, then try again.

## 2. Go into this folder

Move this folder somewhere sensible first (Documents is fine), then:

```bash
cd ~/Documents/muhahmmaad.github.io
```

Tip: type `cd ` (with the space) and then drag the folder onto the Terminal
window — it fills in the path for you.

## 3. Create the repository on GitHub

In a browser, signed in as **muhahmmaad**:

1. Go to <https://github.com/new>
2. **Repository name:** `muhahmmaad.github.io` — exactly this, it must match
   your username, that is what makes the web address work
3. Choose **Public**
4. Leave *"Add a README file"* **unticked** — this folder already has one
5. Click **Create repository**

## 4. Push it

Back in Terminal:

```bash
git remote add origin https://github.com/muhahmmaad/muhahmmaad.github.io.git
git push -u origin main
```

GitHub will ask you to sign in. A browser window opens — approve it there.

> If it asks for a password in the Terminal instead, don't type your GitHub
> password (it won't work). Install the GitHub CLI with
> `brew install gh`, run `gh auth login`, choose **Login with a web browser**,
> then run the `git push` again.

## 5. Turn on GitHub Pages

In the browser, on your new repository:

**Settings** → **Pages** → under *Build and deployment* set
**Source** to **GitHub Actions**.

## 6. Wait a minute

Go to the **Actions** tab. A workflow runs for about a minute. When it shows a
green tick, your site is live:

### https://muhahmmaad.github.io

---

## Then: the blog editor

Your site has a writing dashboard at `/admin/` — you can add blog posts with a
normal editor (title, cover image drag-and-drop, rich text), no code.

It needs one more setup step, about 10 minutes and free. Follow
**[docs/CMS-SETUP.md](docs/CMS-SETUP.md)**.

Until then you can still add posts by creating markdown files in the `_posts/`
folder directly on github.com.

---

## Before you share the link

The **Download CV** button serves `assets/pdf/Muhammad-Ahmad-CV.pdf` publicly.
That file contains your date of birth and both referees' phone numbers and
email addresses. Anyone visiting the site can download it.

Those details were removed from the web page itself, but not from the PDF.
Consider replacing that file with a trimmed version — keep the same filename
and the button keeps working.

---

## Something not working?

- **404 after deploying** — check the repo is named exactly
  `muhahmmaad.github.io` and is **Public**.
- **Actions tab shows a red X** — click the failed run to see why, and send me
  the message.
- **Site is live but looks unstyled** — wait two minutes and hard-refresh with
  **Cmd+Shift+R**.
