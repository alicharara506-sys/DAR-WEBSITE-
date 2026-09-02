import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(import.meta.dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const errors = [];

if (!html.includes('<meta name="viewport" content="width=device-width, initial-scale=1.0">')) {
  errors.push('Required mobile viewport declaration is missing');
}

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicates.length) errors.push(`Duplicate IDs: ${[...new Set(duplicates)].join(', ')}`);

for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
  const reference = match[1];
  if (reference === '#') errors.push('Placeholder href="#" remains');
  if (/^(?:https?:|mailto:|tel:|#|data:)/.test(reference)) continue;
  const clean = reference.split(/[?#]/)[0];
  if (!fs.existsSync(path.join(root, clean))) errors.push(`Missing local asset: ${clean}`);
}

for (const match of html.matchAll(/<img\b[^>]*>/g)) {
  if (!/\balt="[^"]*"/.test(match[0])) errors.push(`Image missing alt: ${match[0]}`);
  if (!/\bwidth="\d+"/.test(match[0]) || !/\bheight="\d+"/.test(match[0])) {
    errors.push(`Image missing intrinsic dimensions: ${match[0]}`);
  }
}

for (const lang of ['en', 'ar', 'fr']) {
  if (!html.includes(`data-lang="${lang}"`)) errors.push(`Missing ${lang} page`);
  if (!html.includes(`hreflang="${lang}"`)) errors.push(`Missing ${lang} hreflang`);
}

const js = fs.readFileSync(path.join(root, 'assets/js/app.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'assets/css/styles.css'), 'utf8');
for (const requirement of ['font-size:16px', 'min-width:48px', 'min-height:48px', 'img{ width:100%; height:auto; }']) {
  if (!css.includes(requirement)) errors.push(`Mobile CSS requirement missing: ${requirement}`);
}
if (/https:\/\/cdn\./.test(js)) errors.push('JavaScript still imports a third-party CDN');
for (const requirement of ['aria-modal', 'modalClose.focus()', "e.key === 'Tab'", "e.key === 'Enter'"]) {
  if (!js.includes(requirement)) errors.push(`Accessible modal requirement missing: ${requirement}`);
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Validated ${ids.length} IDs, local references, image dimensions, locales, and modal accessibility.`);
