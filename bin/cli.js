#!/usr/bin/env node
import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { detect, summarize, clean } from '../src/index.js';

const HELP = `Usage: watermark-detector [file|folder ...] [options]
       cat text.txt | watermark-detector

Finds hidden characters in text: zero-width spaces, unusual spaces, bidi controls,
Unicode tag characters (hidden messages), variation selectors and Latin look-alikes.

Options:
  --clean           Print the cleaned text instead of a report
  --write           With --clean: overwrite the input files in place
  --typography      Also report curly quotes, long dashes and ellipses
  --no-homoglyphs   Do not report Cyrillic/Greek look-alike letters
  --json            Print findings as JSON
  --fail            Exit with code 1 when anything is found (for CI / pre-commit)
  -h, --help        Show this help

Online version (no install): https://promopilot.link/en/tools/watermark-detector.php
`;

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
if (flag('-h') || flag('--help')) { process.stdout.write(HELP); process.exit(0); }

const files = args.filter((a) => !a.startsWith('-'));
const opts = { typography: flag('--typography'), homoglyphs: !flag('--no-homoglyphs') };
const color = process.stdout.isTTY && !process.env.NO_COLOR;
const c = (code, s) => (color ? `\x1b[${code}m${s}\x1b[0m` : s);

async function readStdin() {
  if (process.stdin.isTTY) { process.stdout.write(HELP); process.exit(2); }
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

const TEXT_EXT = /\.(txt|md|mdx|markdown|html?|xml|json|ya?ml|csv|tsv|po|srt|vtt|rst|tex|js|mjs|cjs|ts|tsx|jsx|css|php|py|rb|go|java|cs|swift|kt|sql)$/i;

// Expand directories recursively into text files; skip dot-folders and node_modules.
async function expand(path) {
  const info = await stat(path);
  if (!info.isDirectory()) return [path];
  const out = [];
  for (const entry of await readdir(path, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const full = join(path, entry.name);
    if (entry.isDirectory()) out.push(...(await expand(full)));
    else if (TEXT_EXT.test(entry.name)) out.push(full);
  }
  return out;
}

const paths = (await Promise.all(files.map(expand))).flat();
const inputs = files.length
  ? await Promise.all(paths.map(async (f) => ({ name: f, text: await readFile(f, 'utf8') })))
  : [{ name: '<stdin>', text: await readStdin() }];

let found = 0;
const json = [];
for (const { name, text } of inputs) {
  if (flag('--clean')) {
    const out = clean(text, opts);
    if (flag('--write') && name !== '<stdin>') await writeFile(name, out);
    else process.stdout.write(out);
    continue;
  }
  const findings = detect(text, opts);
  const summary = summarize(text, findings);
  found += findings.length;
  if (flag('--json')) { json.push({ file: name, ...summary, findings }); continue; }
  const label = { clean: c(32, 'clean'), suspicious: c(33, 'suspicious'), marked: c(31, 'hidden characters found') }[summary.verdict];
  console.log(`${c(1, name)}: ${label} (${findings.length})`);
  for (const [code, { name: n, count }] of Object.entries(summary.byCode)) console.log(`  ${code.padEnd(8)} ×${String(count).padEnd(4)} ${n}`);
  for (const f of findings.slice(0, 20)) console.log(c(2, `    ${f.line}:${f.column}  ${f.code} ${f.name}`));
  if (findings.length > 20) console.log(c(2, `    … ${findings.length - 20} more`));
  if (summary.hiddenMessage) console.log(c(31, `  Hidden tag-character message: "${summary.hiddenMessage}"`));
}
if (flag('--json')) console.log(JSON.stringify(json.length === 1 ? json[0] : json, null, 2));
process.exit(flag('--fail') && found ? 1 : 0);
