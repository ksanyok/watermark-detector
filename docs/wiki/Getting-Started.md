# Getting started

## Requirements

Node.js 18 or newer. Nothing else — the package has no dependencies.

## Install

```bash
# run straight from GitHub, nothing to install
npx github:ksanyok/watermark-detector article.txt

# or install the CLI globally
npm install -g github:ksanyok/watermark-detector
watermark-detector article.txt
```

## First run

### Scan one or more files

```bash
watermark-detector article.txt docs/
```

### Scan text from the clipboard (macOS) or another command

```bash
pbpaste | watermark-detector
```

### Clean a file in place (spaces normalised, invisible characters removed)

```bash
watermark-detector draft.md --clean --write
```

### Block hidden characters in CI or a pre-commit hook

```bash
watermark-detector content/ --fail
```

## Reading the result

For each input you get a verdict and a table of character types with counts, followed by the first 20 positions as `line:column`. If tag characters spell out text, the decoded hidden message is printed in red.

- **clean** — nothing found.
- **suspicious** — only spacing anomalies such as no-break spaces. Often harmless (French typography uses them), but unusual in English copy.
- **hidden characters found** — zero-width, tag, bidi, homoglyph or control characters. Worth removing.

## Exit codes

| Code | Meaning |
|---|---|
| 0 | Scan finished (findings are reported but do not fail unless `--fail`) |
| 1 | Something was found and `--fail` was given |
| 2 | No input (run with a file or pipe text in) |

Use them in scripts and CI to fail a build when something breaks.

---
[Home](Home) · [Getting started](Getting-Started) · [FAQ](FAQ) · [Troubleshooting](Troubleshooting) · [Online tool](https://promopilot.link/en/tools/watermark-detector.php?utm_source=github&utm_medium=repo&utm_campaign=tools&utm_content=watermark-detector)
