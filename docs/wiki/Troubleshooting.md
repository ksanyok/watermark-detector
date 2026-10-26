# Troubleshooting

## The tool waits and prints nothing

Without file arguments it reads standard input. Pipe text in (`cat file | watermark-detector`) or pass a file name.

## Lots of `NO-BREAK SPACE` findings in French or Polish text

Those languages use no-break spaces before punctuation or after short words on purpose. Treat them as style, not as hidden marks.

## Homoglyphs reported in a technical term

Mixed-script words are rare but real (e.g. product names). Use `--no-homoglyphs` to skip that check.

## `npx github:...` is slow the first time

npx downloads the repository once and caches it. Install globally with `npm install -g` to avoid the delay.

## `SyntaxError: Cannot use import statement`

Your Node.js is too old. Run `node -v`; version 18 or newer is required.

Still stuck? [Open an issue](https://github.com/ksanyok/watermark-detector/issues/new/choose) or try the [online version](https://promopilot.link/en/tools/watermark-detector.php?utm_source=github&utm_medium=repo&utm_campaign=tools&utm_content=watermark-detector).

---
[Home](Home) · [Getting started](Getting-Started) · [FAQ](FAQ) · [Troubleshooting](Troubleshooting) · [Online tool](https://promopilot.link/en/tools/watermark-detector.php?utm_source=github&utm_medium=repo&utm_campaign=tools&utm_content=watermark-detector)
