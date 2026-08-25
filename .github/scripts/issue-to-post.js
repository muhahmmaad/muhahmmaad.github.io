/**
 * Turns a "New blog post" issue form into a Jekyll post file.
 *
 * GitHub renders issue forms into markdown shaped like:
 *
 *   ### Title
 *
 *   My post title
 *
 *   ### Category
 *
 *   Research
 *
 * ...so parsing is a matter of splitting on the "### " headings.
 *
 * Kept in its own file rather than inline in the workflow so it can be run and
 * tested locally:
 *   node .github/scripts/issue-to-post.js --dry-run < sample-issue.txt
 */

const fs = require('fs');
const path = require('path');

/** Split issue-form markdown into { fieldLabel: value }. */
function parseIssueForm(body) {
  const fields = {};
  // Normalise Windows line endings so the split below is predictable.
  const text = String(body || '').replace(/\r\n/g, '\n');

  const parts = text.split(/^### +/m).slice(1); // drop anything before the first heading
  for (const part of parts) {
    const newline = part.indexOf('\n');
    if (newline === -1) continue;

    const label = part.slice(0, newline).trim();
    const value = part.slice(newline + 1).trim();

    // GitHub writes this placeholder when an optional field is left empty.
    fields[label] = value === '_No response_' ? '' : value;
  }
  return fields;
}

/** "What Makes an Influencer Campaign Work" -> "what-makes-an-influencer-campaign-work" */
function slugify(title) {
  return String(title)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')  // strip accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/g, '') || 'post';
}

/** YAML double-quoted scalar: escape backslashes and quotes. */
function yamlString(value) {
  return '"' + String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
}

/** Placeholder the dropdown shows when nothing has been chosen. */
const CATEGORY_PLACEHOLDER = /^[—-]\s*pick one/i;

/**
 * A typed-in category wins over the dropdown, so a new one can be invented
 * without waiting for the dropdown to catch up.
 */
function resolveCategory(fields) {
  const typed = (fields['Or a new category'] || '').trim();
  const picked = (fields['Category'] || '').trim();

  const chosen = typed || (CATEGORY_PLACEHOLDER.test(picked) ? '' : picked);
  if (!chosen) return '';

  // Free text lands in YAML front matter, so keep it to something tame:
  // one line, no control characters, reasonable length.
  const cleaned = chosen
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/["'`\\]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 40)
    .trim();

  return cleaned;
}

function isValidDate(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s + 'T00:00:00Z');
  return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

function buildPost(fields, today) {
  const title = (fields['Title'] || '').trim();
  if (!title) throw new Error('The Title field was empty.');

  const body = (fields['Post'] || '').trim();
  if (!body) throw new Error('The Post field was empty.');

  const rawDate = (fields['Publish date'] || '').trim();
  if (rawDate && !isValidDate(rawDate)) {
    throw new Error(`Publish date "${rawDate}" is not a real date in YYYY-MM-DD form.`);
  }
  const date = rawDate || today;

  const front = [
    '---',
    `title: ${yamlString(title)}`,
  ];

  const description = (fields['Short description'] || '').trim();
  if (description) front.push(`description: ${yamlString(description)}`);

  const category = resolveCategory(fields);
  if (category) front.push(`category: ${yamlString(category)}`);

  const cover = (fields['Cover image link'] || '').trim();
  // Only accept a plain http(s) URL or a site-relative path — never arbitrary
  // text, which would break the front matter.
  if (cover && /^(https?:\/\/|\/)[^\s"']+$/.test(cover)) {
    front.push(`image: ${yamlString(cover)}`);
  }

  const video = (fields['Video link'] || '').trim();
  // Same guard as the cover: a URL or nothing, so stray text cannot break YAML.
  if (video && /^https?:\/\/[^\s"']+$/.test(video)) {
    front.push(`video: ${yamlString(video)}`);
  }

  front.push('---');

  return {
    filename: `${date}-${slugify(title)}.md`,
    contents: front.join('\n') + '\n\n' + body + '\n',
  };
}

module.exports = { parseIssueForm, slugify, buildPost, yamlString, isValidDate, resolveCategory };

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
if (require.main === module) {
  const dryRun = process.argv.includes('--dry-run');

  const body = process.env.ISSUE_BODY || fs.readFileSync(0, 'utf8');
  const today = process.env.POST_DATE || new Date().toISOString().slice(0, 10);

  let post;
  try {
    post = buildPost(parseIssueForm(body), today);
  } catch (err) {
    console.error(`::error::${err.message}`);
    process.exit(1);
  }

  const target = path.join('_posts', post.filename);

  if (dryRun) {
    console.log(`--- would write ${target} ---`);
    console.log(post.contents);
  } else {
    fs.mkdirSync('_posts', { recursive: true });
    fs.writeFileSync(target, post.contents, 'utf8');
    console.log(`Wrote ${target}`);
  }

  // Hand the path back to the workflow.
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `path=${target}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `slug=${post.filename.replace(/\.md$/, '')}\n`);
  }
}
