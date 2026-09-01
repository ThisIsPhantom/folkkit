# Folkkit catalog audit

## Scope and rules

This audit covers every raw identifier exported by `src/converters/` and every format identifier in `src/formats.js`. `scripts/audit-catalog.mjs` compares the ID-only lazy-loading manifest with the real modules, rejects duplicates or omissions, and checks every released entry for bilingual metadata, category, tier, runtime class, input limit class, output naming, and an executable evidence ID. A hidden converter or format must carry a non-empty documented reason.

The audit does not treat inherited names or descriptions as release evidence. A converter is released only after a bounded fixture or browser journey exercises its real behavior. Hidden entries remain in source and retain their stable IDs.

## Format graph

The raw format graph contains 223 unique IDs in 34 groups. Eighteen IDs remain exposed through Convert because each maps to one independent literal registry entry with fixed `from`, `to`, `input`, `expected`, and input limit class. The contract executes the real edge, compares the exact literal output, and rejects error strings. The other 205 raw IDs remain preserved but hidden pending equivalent evidence. Base58 uses a 64 KiB text limit in both directions; the other released formats use the five MiB text limit.

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
| `imageFormat` | 22 | 2 | 20 | Released PNG-to-JPEG and JPEG-to-PNG with exact MIME/extension contracts, device-aware image limits, closed `ImageBitmap` instances, exact Blob results, and real Chromium download fixtures. Other Canvas operations remain hidden pending equivalent evidence. |
| `media` | 14 | 1 | 13 | Kept only `audio-to-mp3` experimental because it has a real WAV-to-MP3 browser fixture with non-trivial MP3 bytes, a valid ID3 or MPEG frame signature, same-origin FFmpeg JavaScript/WASM, no request leakage, and cancellation evidence. The other 13 IDs remain hidden. |
| `pdf` | 8 | 8 | 0 | Kept the Task 4 core PDF set with Task 6 PDF/image limits, signature checks, exact Blob results, and checked-in PDF/image fixtures. |

Current audited total: 499 raw converters, 50 released converters, 449 hidden converters, 18 released format IDs, and 205 hidden format IDs. The UI tool count is `releasedToolCount`, derived from the 50 non-hidden converter entries. Format graph choices are intentionally not added to that tool-card count.

## Lazy-loading boundary

`src/converters/index.js` contains IDs and categories only. It imports no converter implementation. `loadConverter(id)` first resolves a non-hidden audited ID, selects one fixed module loader from an internal map, and then uses an explicit module switch to read that module's converter array. Hidden, unknown, path-like, and prototype-like IDs return `null` before any module import.

## Image and media evidence

`tests/e2e/catalog.spec.js` checks the derived count, proves that selecting Base64 loads `text.js` without loading `data.js` or `media.js`, and verifies real PNG-to-JPEG and JPEG-to-PNG downloads by file signatures. `tests/e2e/network.spec.js` converts a generated valid PCM WAV fixture to MP3, verifies non-trivial output and an MP3 signature, observes both pinned same-origin FFmpeg assets, and rejects cross-origin or content-bearing requests. Its cancellation case delays the same-origin WASM request, cancels the active runtime, and verifies that the native file input is enabled and empty afterwards.

No other `image` or `imageFormat` entry is presented as released behavior. The remaining hidden entries retain their exact raw IDs and documented module reason.

## Executable evidence and bounds

`src/catalog/evidenceRegistry.js` is the independent source for 18 format fixtures and 50 tool evidence records. `src/catalog/evidenceRunner.js` executes every registered fixture or contract and records its assertion count. The auditor rejects fabricated references, duplicate or missing registry entries, missing executors, fixtures that do not run, and fixtures with zero assertions. It does not grep test source.

The released text utilities were reviewed for obvious input-driven loops. `loan-calc` now rejects non-finite values, principal above 1 trillion, annual rates outside 0 to 100, and integer terms outside 1 to 100 years before its amortization loop. Base58 rejects text above 64 KiB before either conversion function runs. Other released text operations are fixed-output or linear behind the five MiB text limit; no additional released entry required hiding in this bounded review. The percentage parser accepts both `15% of 200` and `15% von 200` with exact literal evidence.

## Final verification snapshot

The final local Task 7 gate produced these results on 2026-09-01:

- Portable Bun audit: 499 converters with 50 released and 449 hidden; 223 formats with 18 released and 205 hidden.
- Full Vitest run: 24 files and 224 tests passed.
- ESLint: exit 0 with no findings.
- Vite production build: 331 modules transformed; converter implementations emitted as separate lazy chunks.
- Runtime artifact check: same-origin paths only.
- Serial Playwright run on `FOLKKIT_E2E_PORT=4177`: 16 tests passed, including catalog count, owner-only lazy loading, Canvas downloads, PDF/QR journeys, media conversion, media cancellation, and network privacy.
- Port cleanup: no listener remained on port 4177. Port 4173 was not inspected, reused, or stopped.
