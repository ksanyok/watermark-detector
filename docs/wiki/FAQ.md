# FAQ

## Does ChatGPT put watermarks in its text?

OpenAI has said it does not add a hidden watermark to ChatGPT text. Still, text copied from chat interfaces often contains narrow no-break spaces (U+202F), non-breaking spaces and other formatting characters introduced by rendering and copy-paste. They are not a reliable AI signal on their own, but they are worth cleaning before publishing.

## Can this tool tell me whether a text was written by AI?

No. It finds characters, not writing style. Removing invisible characters does not make text "human", and a clean result does not prove a human wrote it. For a style-based estimate use an AI detector; PromoPilot has a free one.

## What are Unicode tag characters and why do they matter?

Characters U+E0020–U+E007E mirror printable ASCII but render as nothing. They can carry a whole sentence inside seemingly normal text — a technique used for prompt injection against LLMs ("ASCII smuggling"). The detector decodes and shows that hidden text.

## Will cleaning break my text?

It removes characters that are invisible and replaces odd spaces with a regular space. Typography (curly quotes, dashes) is only touched with `--typography`. Emoji sequences are preserved. Languages that legitimately use ZWJ/ZWNJ (Persian, Hindi and others) may need `--clean` to be reviewed before writing.

## Does any text leave my computer?

No. The package has no network code at all.

## Is there a version without installing anything?

Yes — the [online Watermark Detector](https://promopilot.link/en/tools/watermark-detector.php?utm_source=github&utm_medium=repo&utm_campaign=tools&utm_content=watermark-detector) highlights hidden characters right in the text and cleans it in one click.

---
[Home](Home) · [Getting started](Getting-Started) · [FAQ](FAQ) · [Troubleshooting](Troubleshooting) · [Online tool](https://promopilot.link/en/tools/watermark-detector.php?utm_source=github&utm_medium=repo&utm_campaign=tools&utm_content=watermark-detector)
