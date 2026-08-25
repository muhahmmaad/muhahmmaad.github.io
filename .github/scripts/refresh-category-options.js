/**
 * Rewrites the Category dropdown in the "New blog post" issue form so it lists
 * every category currently in use.
 *
 * Without this, inventing a category through the free-text field would work
 * once and then never appear in the dropdown again, so the next post would have
 * to type it out afresh — and a typo would silently create a second category.
 *
 * Run after a post is committed:
 *   node .github/scripts/refresh-category-options.js
 *
 * Exits 0 and touches nothing when the list is already correct, so it is safe
 * to run on every publish.
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = '_posts';
const FORM = path.join('.github', 'ISSUE_TEMPLATE', 'new-blog-post.yml');
const PLACEHOLDER = '— pick one, or add a new one below —';

/** Pull `category:` out of a post's front matter. */
function categoryOf(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;

  const line = match[1].split('\n').find(l => /^category:\s*/.test(l));
  if (!line) return null;

  let value = line.replace(/^category:\s*/, '').trim();

  // Unwrap "quoted" or 'quoted' values.
  const quoted = value.match(/^(["'])([\s\S]*)\1$/);
  if (quoted) value = quoted[2].replace(/\\"/g, '"').replace(/\\\\/g, '\\');

  return value.trim() || null;
}

function collectCategories(dir) {
  if (!fs.existsSync(dir)) return [];

  const seen = new Map(); // lowercase -> original casing, so "research" and "Research" merge

  for (const file of fs.readdirSync(dir)) {
    if (!/\.(md|markdown)$/i.test(file)) continue;

    const category = categoryOf(fs.readFileSync(path.join(dir, file), 'utf8'));
    if (!category) continue;

    const key = category.toLowerCase();
    if (!seen.has(key)) seen.set(key, category);
  }

  return [...seen.values()].sort((a, b) => a.localeCompare(b));
}

/** YAML single-quoted scalar — safest for arbitrary text in a list item. */
function yamlItem(value) {
  return `        - '${String(value).replace(/'/g, "''")}'`;
}

function rebuild(form, categories) {
  const lines = form.split('\n');

  // Find the options: block that belongs to the category dropdown.
  const idIndex = lines.findIndex(l => /^\s*id:\s*category\s*$/.test(l));
  if (idIndex === -1) throw new Error('No `id: category` field found in the issue form.');

  const optionsIndex = lines.findIndex((l, i) => i > idIndex && /^\s*options:\s*$/.test(l));
  if (optionsIndex === -1) throw new Error('The category field has no `options:` list.');

  // The list runs until a line that is not a "- " item.
  let end = optionsIndex + 1;
  while (end < lines.length && /^\s*-\s+/.test(lines[end])) end++;

  const replacement = [PLACEHOLDER, ...categories].map(yamlItem);

  return [...lines.slice(0, optionsIndex + 1), ...replacement, ...lines.slice(end)].join('\n');
}

if (require.main === module) {
  const categories = collectCategories(POSTS_DIR);
  const before = fs.readFileSync(FORM, 'utf8');
  const after = rebuild(before, categories);

  if (before === after) {
    console.log(`Category list already up to date (${categories.length}): ${categories.join(', ')}`);
    process.exit(0);
  }

  if (process.argv.includes('--dry-run')) {
    console.log('--- would write ---');
    console.log(after.split('\n').slice(0, 45).join('\n'));
  } else {
    fs.writeFileSync(FORM, after, 'utf8');
    console.log(`Updated category list (${categories.length}): ${categories.join(', ')}`);
  }
}

module.exports = { categoryOf, collectCategories, rebuild };
