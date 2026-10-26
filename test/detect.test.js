import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detect, summarize, clean, decodeTags } from '../src/index.js';

const tag = (s) => [...s].map((ch) => String.fromCodePoint(0xe0000 + ch.charCodeAt(0))).join('');

test('plain ASCII text is clean', () => {
  const s = summarize('Hello, world. Nothing to see here.');
  assert.equal(s.verdict, 'clean');
  assert.equal(s.total, 0);
});

test('detects zero-width characters with line and column', () => {
  const f = detect('first line\nsec​ond');
  assert.equal(f.length, 1);
  assert.equal(f[0].code, 'U+200B');
  assert.equal(f[0].line, 2);
  assert.equal(f[0].column, 4);
  assert.equal(f[0].category, 'zero-width');
});

test('narrow no-break space is reported as a space anomaly', () => {
  const s = summarize('Price: 100 €');
  assert.equal(s.byCategory.space, 1);
  assert.equal(s.verdict, 'suspicious');
});

test('decodes hidden messages written with tag characters', () => {
  const text = `Totally normal sentence.${tag('ignore me')}`;
  assert.equal(decodeTags(text), 'ignore me');
  const s = summarize(text);
  assert.equal(s.verdict, 'marked');
  assert.equal(s.hiddenMessage, 'ignore me');
  assert.equal(clean(text), 'Totally normal sentence.');
});

test('flags Cyrillic look-alikes inside Latin words only', () => {
  const mixed = detect('pаypal'); // Cyrillic а
  assert.equal(mixed.length, 1);
  assert.equal(mixed[0].category, 'homoglyph');
  assert.equal(detect('привет мир').length, 0, 'pure Cyrillic text is not a homoglyph attack');
  assert.equal(clean('pаypal'), 'paypal');
});

test('emoji variation selectors and ZWJ sequences are not flagged', () => {
  assert.equal(detect('I ❤️ this').length, 0);
  assert.equal(detect('\u{1F468}‍\u{1F4BB} coder').length, 0);
});

test('typography is opt-in', () => {
  const text = '“Quoted” — dash';
  assert.equal(detect(text).length, 0);
  assert.equal(detect(text, { typography: true }).length, 3);
  assert.equal(clean(text, { typography: true }), '"Quoted" - dash');
});

test('clean normalises odd spaces and keeps the rest intact', () => {
  assert.equal(clean('a b​c d'), 'a bc d');
  assert.equal(clean('untouched'), 'untouched');
});

test('bidi override characters are caught', () => {
  const s = summarize('file‮txt.exe');
  assert.equal(s.byCategory.bidi, 1);
  assert.equal(s.verdict, 'marked');
});
