# Folkkit catalog audit

## Scope and rules

This audit covers every raw identifier exported by `src/converters/` and every format identifier in `src/formats.js`. `scripts/audit-catalog.mjs` compares the ID-only lazy-loading manifest with the real modules, rejects duplicates or omissions, and checks every released entry for bilingual metadata, category, tier, runtime class, input limit class, output naming, and named test evidence. A hidden converter must inherit a non-empty documented reason.

The audit does not treat inherited names or descriptions as release evidence. A converter is released only after a bounded fixture or browser journey exercises its real behavior. Hidden entries remain in source and retain their stable IDs.

## Format graph

The format graph contains 223 unique IDs in 34 groups. All 223 remain available through the existing Convert entry point. Each has at least one incoming or outgoing conversion edge and one named `format graph fixture: <id>` case in `src/catalog/allReleasedTools.test.js`. Format operations run on the main thread behind the five MiB text limit and return inline text. Their audit metadata supplies separate German and English name and description fields. The current technical format names are shared where the unit or notation is language-neutral.

## Module decisions

| Module | Raw | Released now | Hidden now | Decision and evidence |
| --- | ---: | ---: | ---: | --- |
| `text` | 55 | 14 | 41 | Released linear Base64, URL, HTML entity, hex, binary, Unicode, ROT13, and Atbash operations after literal fixtures. Other tools remain hidden pending bounded-output fixtures and localized copy. |
| `qr` | 2 | 2 | 0 | Kept the Task 4 core generator and experimental reader. Existing Blob, capability, and browser fixture tests remain the release evidence. |
| `image` | 3 | 0 | 3 | Hidden pending exact PNG/JPEG signatures, Blob result normalization, and image fixtures. |
| `hash` | 6 | 1 | 5 | Released SHA-256 as a checksum with a literal digest fixture and copy that does not claim password or security validation. Other hashes remain hidden pending the same review. |
| `crypto` | 13 | 0 | 13 | Hidden because password, randomness, HMAC, XOR, and cryptographic claims require a separate security review. |
| `data` | 42 | 4 | 38 | Released JSON formatting, JSON minification, JSON string escaping, and bounded CSV-to-JSON after literal fixtures. Generators, statistics, merges, and broader schema operations remain hidden pending limits and dedicated fixtures. |
| `web` | 149 | 5 | 144 | Released local CSS minification, JSON syntax parsing, Base64URL encode/decode, and slug generation after literal fixtures. Live-looking checks, external lookup implications, and unverified generators remain hidden. |
| `number` | 44 | 6 | 38 | Released the six fixed base conversions after literal fixtures. Expansion-oriented sequences, combinatorics, and unverified calculators remain hidden. |
| `color` | 22 | 1 | 21 | Released deterministic HEX/RGB/HSL conversion after a literal fixture. Accessibility claims, extraction, random generation, and unverified palette operations remain hidden. |
| `utility` | 119 | 6 | 113 | Released character count, text reversal, percentage, aspect ratio, loan calculation, and BMI calculation after fixtures. Loan and BMI metadata displays localized non-advice. Dated data, professional guidance, and unverified calculators remain hidden. |
| `imageFormat` | 22 | 0 | 22 | Hidden pending exact PNG/JPEG validation, Canvas cleanup, Blob result fixtures, and URL ownership. |
| `media` | 14 | 0 | 14 | Hidden pending the Task 7 same-origin FFmpeg network journey and cancellation evidence. |
| `pdf` | 8 | 8 | 0 | Kept the Task 4 core PDF set with Task 6 PDF/image limits, signature checks, exact Blob results, and checked-in PDF/image fixtures. |

Current audited total: 499 raw converters, 47 released converters, 452 hidden converters, and 223 released format IDs. The UI tool count is `releasedToolCount`, derived from the 47 non-hidden converter entries. Format graph choices are intentionally not added to that tool-card count.

## Lazy-loading boundary

`src/converters/index.js` contains IDs and categories only. It imports no converter implementation. `loadConverter(id)` first resolves a non-hidden audited ID, selects one fixed module loader from an internal map, and then uses an explicit module switch to read that module's converter array. Hidden, unknown, path-like, and prototype-like IDs return `null` before any module import.

## Remaining image and media gate

Image-format and media release decisions remain open in this document until their Task 7 browser evidence is complete. No hidden entry is presented as released behavior.
