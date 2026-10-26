// Catalogue of characters that are invisible, look like ordinary spaces/letters,
// or are known to be inserted by text pipelines (copy-paste, chat UIs, "watermarking" tricks).
// category: zero-width | space | control | bidi | tag | variation | homoglyph | typography

const entries = [
  [0x200b, 'ZERO WIDTH SPACE', 'zero-width', ''],
  [0x200c, 'ZERO WIDTH NON-JOINER', 'zero-width', ''],
  [0x200d, 'ZERO WIDTH JOINER', 'zero-width', ''],
  [0x2060, 'WORD JOINER', 'zero-width', ''],
  [0xfeff, 'ZERO WIDTH NO-BREAK SPACE (BOM)', 'zero-width', ''],
  [0x180e, 'MONGOLIAN VOWEL SEPARATOR', 'zero-width', ''],
  [0x2061, 'FUNCTION APPLICATION', 'zero-width', ''],
  [0x2062, 'INVISIBLE TIMES', 'zero-width', ''],
  [0x2063, 'INVISIBLE SEPARATOR', 'zero-width', ''],
  [0x2064, 'INVISIBLE PLUS', 'zero-width', ''],
  [0x00ad, 'SOFT HYPHEN', 'zero-width', ''],
  [0x034f, 'COMBINING GRAPHEME JOINER', 'zero-width', ''],
  [0x115f, 'HANGUL CHOSEONG FILLER', 'zero-width', ''],
  [0x1160, 'HANGUL JUNGSEONG FILLER', 'zero-width', ''],
  [0x3164, 'HANGUL FILLER', 'zero-width', ''],
  [0x00a0, 'NO-BREAK SPACE', 'space', ' '],
  [0x202f, 'NARROW NO-BREAK SPACE', 'space', ' '],
  [0x2000, 'EN QUAD', 'space', ' '],
  [0x2001, 'EM QUAD', 'space', ' '],
  [0x2002, 'EN SPACE', 'space', ' '],
  [0x2003, 'EM SPACE', 'space', ' '],
  [0x2004, 'THREE-PER-EM SPACE', 'space', ' '],
  [0x2005, 'FOUR-PER-EM SPACE', 'space', ' '],
  [0x2006, 'SIX-PER-EM SPACE', 'space', ' '],
  [0x2007, 'FIGURE SPACE', 'space', ' '],
  [0x2008, 'PUNCTUATION SPACE', 'space', ' '],
  [0x2009, 'THIN SPACE', 'space', ' '],
  [0x200a, 'HAIR SPACE', 'space', ' '],
  [0x205f, 'MEDIUM MATHEMATICAL SPACE', 'space', ' '],
  [0x3000, 'IDEOGRAPHIC SPACE', 'space', ' '],
  [0x2028, 'LINE SEPARATOR', 'space', '\n'],
  [0x2029, 'PARAGRAPH SEPARATOR', 'space', '\n\n'],
  [0x200e, 'LEFT-TO-RIGHT MARK', 'bidi', ''],
  [0x200f, 'RIGHT-TO-LEFT MARK', 'bidi', ''],
  [0x061c, 'ARABIC LETTER MARK', 'bidi', ''],
  [0x202a, 'LEFT-TO-RIGHT EMBEDDING', 'bidi', ''],
  [0x202b, 'RIGHT-TO-LEFT EMBEDDING', 'bidi', ''],
  [0x202c, 'POP DIRECTIONAL FORMATTING', 'bidi', ''],
  [0x202d, 'LEFT-TO-RIGHT OVERRIDE', 'bidi', ''],
  [0x202e, 'RIGHT-TO-LEFT OVERRIDE', 'bidi', ''],
  [0x2066, 'LEFT-TO-RIGHT ISOLATE', 'bidi', ''],
  [0x2067, 'RIGHT-TO-LEFT ISOLATE', 'bidi', ''],
  [0x2068, 'FIRST STRONG ISOLATE', 'bidi', ''],
  [0x2069, 'POP DIRECTIONAL ISOLATE', 'bidi', ''],
  [0x2010, 'HYPHEN', 'typography', '-'],
  [0x2011, 'NON-BREAKING HYPHEN', 'typography', '-'],
  [0x2012, 'FIGURE DASH', 'typography', '-'],
  [0x2013, 'EN DASH', 'typography', '-'],
  [0x2014, 'EM DASH', 'typography', '-'],
  [0x2015, 'HORIZONTAL BAR', 'typography', '-'],
  [0x2212, 'MINUS SIGN', 'typography', '-'],
  [0x2018, 'LEFT SINGLE QUOTATION MARK', 'typography', "'"],
  [0x2019, 'RIGHT SINGLE QUOTATION MARK', 'typography', "'"],
  [0x201c, 'LEFT DOUBLE QUOTATION MARK', 'typography', '"'],
  [0x201d, 'RIGHT DOUBLE QUOTATION MARK', 'typography', '"'],
  [0x2026, 'HORIZONTAL ELLIPSIS', 'typography', '...'],
];

export const CHARS = new Map(entries.map(([cp, name, category, replacement]) => [cp, { cp, name, category, replacement }]));

// Cyrillic and Greek letters that render identically to Latin ones.
export const HOMOGLYPHS = new Map(Object.entries({
  'а': 'a', 'е': 'e', 'о': 'o', 'р': 'p', 'с': 'c', 'у': 'y', 'х': 'x', 'і': 'i', 'ј': 'j', 'ѕ': 's', 'һ': 'h', 'ԁ': 'd', 'ɡ': 'g',
  'А': 'A', 'В': 'B', 'Е': 'E', 'К': 'K', 'М': 'M', 'Н': 'H', 'О': 'O', 'Р': 'P', 'С': 'C', 'Т': 'T', 'Х': 'X', 'І': 'I', 'Ј': 'J', 'Ѕ': 'S',
  'ο': 'o', 'α': 'a', 'ν': 'v', 'ι': 'i', 'Α': 'A', 'Β': 'B', 'Ε': 'E', 'Ζ': 'Z', 'Η': 'H', 'Ι': 'I', 'Κ': 'K', 'Μ': 'M', 'Ν': 'N', 'Ο': 'O', 'Ρ': 'P', 'Τ': 'T', 'Χ': 'X', 'Υ': 'Y',
}));

/** Describe a code point that is not in CHARS but is still suspicious, or return null. */
export function classify(cp) {
  const known = CHARS.get(cp);
  if (known) return known;
  if (cp >= 0xe0000 && cp <= 0xe007f) {
    const ascii = cp >= 0xe0020 && cp <= 0xe007e ? String.fromCharCode(cp - 0xe0000) : null;
    return { cp, name: `TAG CHARACTER${ascii ? ` '${ascii}'` : ''}`, category: 'tag', replacement: '', hidden: ascii };
  }
  if ((cp >= 0xfe00 && cp <= 0xfe0f) || (cp >= 0xe0100 && cp <= 0xe01ef)) {
    return { cp, name: 'VARIATION SELECTOR', category: 'variation', replacement: '' };
  }
  if ((cp < 0x20 && cp !== 0x09 && cp !== 0x0a && cp !== 0x0d) || (cp >= 0x7f && cp <= 0x9f)) {
    return { cp, name: 'CONTROL CHARACTER', category: 'control', replacement: '' };
  }
  return null;
}
