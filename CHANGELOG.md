# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-10-26

### Added
- `watermark-detector` CLI: files, folders or stdin; text and JSON output; `--clean`, `--write`, `--fail`
- Detection of zero-width, space, bidi, tag, variation-selector, control and homoglyph characters
- Decoder for messages hidden with Unicode tag characters
- Emoji-aware rules (no false positives on ❤️ or ZWJ sequences)
- Library API (`detect`, `summarize`, `clean`, `decodeTags`) and GitHub Action

[1.0.0]: https://github.com/ksanyok/watermark-detector/releases/tag/v1.0.0
