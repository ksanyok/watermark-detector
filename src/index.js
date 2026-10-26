import { classify, HOMOGLYPHS } from './chars.js';

export { CHARS, HOMOGLYPHS, classify } from './chars.js';

const hex = (cp) => `U+${cp.toString(16).toUpperCase().padStart(4, '0')}`;
const LATIN = /[A-Za-z]/;
const VARIATION_EMOJI = /\p{Extended_Pictographic}/u;

function lineCol(text, index) {
  let line = 1;
  let last = -1;
  for (let i = text.indexOf('\n'); i !== -1 && i < index; i = text.indexOf('\n', i + 1)) { line++; last = i; }
  return { line, column: index - last };
}

/**
 * Scan text for hidden and look-alike characters.
 * @param {string} text
 * @param {{typography?: boolean, homoglyphs?: boolean}} [options]
 *   typography: also report curly quotes, dashes and ellipses (off by default — they are normal in edited prose)
 */
export function detect(text, options = {}) {
  const { typography = false, homoglyphs = true } = options;
  const findings = [];
  const chars = [...text];
  let index = 0;
  for (let k = 0; k < chars.length; k++) {
    const ch = chars[k];
    const cp = ch.codePointAt(0);
    const info = classify(cp);
    if (info && (info.category !== 'typography' || typography)) {
      // Variation selector right after an emoji is legitimate (e.g. ❤️) — skip it.
      const prev = chars[k - 1];
      const legitVs = info.category === 'variation' && cp === 0xfe0f && prev && VARIATION_EMOJI.test(prev);
      const legitZwj = cp === 0x200d && prev && VARIATION_EMOJI.test(prev);
      if (!legitVs && !legitZwj) {
        findings.push({ index, ...lineCol(text, index), char: ch, code: hex(cp), name: info.name, category: info.category, ...(info.hidden ? { hidden: info.hidden } : {}) });
      }
    } else if (homoglyphs && HOMOGLYPHS.has(ch)) {
      // Only a homoglyph when it sits inside an otherwise Latin word.
      const before = chars[k - 1] || '';
      const after = chars[k + 1] || '';
      if (LATIN.test(before) || LATIN.test(after)) {
        findings.push({ index, ...lineCol(text, index), char: ch, code: hex(cp), name: `HOMOGLYPH of '${HOMOGLYPHS.get(ch)}'`, category: 'homoglyph' });
      }
    }
    index += ch.length;
  }
  return findings;
}

/** Decode text smuggled with Unicode tag characters (U+E0020–U+E007E), if any. */
export function decodeTags(text) {
  let out = '';
  for (const ch of text) {
    const cp = ch.codePointAt(0);
    if (cp >= 0xe0020 && cp <= 0xe007e) out += String.fromCharCode(cp - 0xe0000);
  }
  return out;
}

/**
 * Summarise findings into counts per category and a verdict.
 * @returns {{total: number, byCategory: Record<string, number>, byCode: Record<string, {name: string, count: number}>, verdict: 'clean'|'suspicious'|'marked', hiddenMessage: string}}
 */
export function summarize(text, findings = detect(text)) {
  const byCategory = {};
  const byCode = {};
  for (const f of findings) {
    byCategory[f.category] = (byCategory[f.category] || 0) + 1;
    byCode[f.code] = byCode[f.code] || { name: f.name, count: 0 };
    byCode[f.code].count++;
  }
  const strong = (byCategory['zero-width'] || 0) + (byCategory.tag || 0) + (byCategory.bidi || 0) + (byCategory.homoglyph || 0) + (byCategory.variation || 0) + (byCategory.control || 0);
  const verdict = strong > 0 ? 'marked' : findings.length > 0 ? 'suspicious' : 'clean';
  return { total: findings.length, byCategory, byCode, verdict, hiddenMessage: decodeTags(text) };
}

/**
 * Remove or normalise every character `detect` would report.
 * Spaces become a regular space, homoglyphs become their Latin twin, the rest is dropped.
 */
export function clean(text, options = {}) {
  const findings = detect(text, options);
  if (!findings.length) return text;
  const at = new Map(findings.map((f) => [f.index, f]));
  let out = '';
  let index = 0;
  for (const ch of text) {
    const f = at.get(index);
    if (!f) out += ch;
    else if (f.category === 'homoglyph') out += HOMOGLYPHS.get(ch);
    else out += classify(ch.codePointAt(0)).replacement;
    index += ch.length;
  }
  return out;
}
