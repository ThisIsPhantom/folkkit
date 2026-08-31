# Folkkit Product and Architecture Design

- **Status:** Approved design, implementation not started
- **Approved:** 2026-08-31
- **Product:** Folkkit
- **Base:** `MercuriusDream/convert-everything` at `0d4b61ed89963e6ffab505d0ead757c5fa2f4a64`
- **License:** AGPL-3.0-only

## 1. Summary

Folkkit is a free, bilingual browser utility suite for ordinary people who need occasional PDF, QR, and file conversion tools without uploading private files to an application server. Version 1 is a static React/Vite application hosted on Hosttech. Conversion, editing, preview, and export occur locally in the browser.

Folkkit preserves and refactors the complete Convert Everything codebase rather than embedding it as a separate application or reimplementing its catalog. Three everyday entry points lead the homepage, while a separate advanced catalog retains released specialist tools.

## 2. Goals and non-goals

### Goals

- Make PDF, QR, and format conversion understandable to non-technical users.
- Keep user file contents on the device and make that behavior technically verifiable.
- Run as a static, low-cost Hosttech deployment with no application backend.
- Provide complete German and English interfaces from the first public release.
- Preserve the useful breadth of the inherited catalog without overwhelming the homepage.
- Remain installable and useful offline after required same-origin assets are cached.
- Meet AGPL and third-party licensing obligations as part of every release.

### Non-goals for version 1

- Accounts, authentication, subscriptions, checkout, payments, or cloud synchronization.
- Server-side file processing, persistent file storage, collaboration, or sharing links.
- A full image editor, full video editor, résumé builder, or general template system.
- Analytics, advertising, telemetry, behavioral profiling, or crash reporting.
- A customer portal, CMS, or administrative backend.

Existing image and media converters may remain in the advanced catalog after passing the same release gates, but they are not marketed as the later editor products.

## 3. Chosen architecture

Folkkit is a single static application built with React 19, Vite 7, and plain CSS. It keeps the inherited format graph and converter registry as the conversion engine, then introduces a Folkkit application shell around a hardened runtime boundary.

Rejected alternatives:

- A separate Folkkit shell embedding Convert Everything would duplicate navigation, PWA, localization, and privacy logic without avoiding AGPL obligations.
- A complete rewrite would delay the product and discard a large working converter catalog.

No runtime database, API, server function, or Node process is required on Hosttech. Node or Bun is used only during development and CI to produce static artifacts.

## 4. Information architecture and navigation

The default Swiss entry language is German, with a persistent but non-content-bearing English preference. Both languages expose the same product and legal structure.

Primary destinations:

- Home: privacy promise, three core entry points, and access to the advanced catalog.
- PDF: released PDF operations such as merge, extract, reorder, and rotate.
- QR: QR generation and released QR reading workflows.
- Convert: common file and format conversions organized by human intent.
- All tools: searchable, categorized advanced catalog with released tools only.
- Privacy, open source, licenses, terms, contact, and source revision.

Inherited stable tool IDs remain compatible. Core pages receive localized shareable routes; advanced tools may retain stable query-based deep links in version 1 to avoid a server rewrite dependency. Browser back/forward navigation must restore state correctly.

## 5. Component boundaries

### Application shell

Owns language, theme, navigation, PWA state, privacy explanations, and non-content preferences. It does not know converter internals.

### Home and discovery

Owns the three core entry points, search, categories, favorites, recent tool IDs, and release-tier filtering. It never stores converted content by default.

### Converter adapter

Normalizes the inherited format graph and converter registry into a shared tool contract. The contract adds localized metadata, release status, runtime requirements, privacy characteristics, file limits, and browser capability checks without rewriting every converter at once.

### Tool runtime

Owns input selection, validation, progress, cancellation, preview, download, cleanup, and consistent errors. Heavy parsers and media operations run behind dedicated Worker interfaces with an explicit command allowlist.

### Local preferences

May persist language, theme, favorites, recent tool IDs, PWA dismissals, and history consent. Converted content or previews are not persisted unless the user explicitly enables local content history. That history has a visible complete-delete action.

### Legal and source surface

Displays the deployed revision, AGPL source link, upstream attribution, third-party notices, privacy notice, terms, and contact details in German and English.

## 6. Data flow

1. Hosttech serves HTML, JavaScript, CSS, fonts, worker scripts, WASM, and legal assets from the Folkkit origin.
2. The user explicitly selects, drops, or pastes input into a tool.
3. The runtime validates file size, MIME information, extension, and lightweight file signatures where applicable.
4. Heavy input transfers to an isolated worker; simple deterministic text operations may remain on the UI thread.
5. The converter produces an in-memory result and local preview where supported.
6. The browser downloads the result through an object URL.
7. Completion, cancellation, reset, navigation, and teardown revoke object URLs, terminate obsolete workers, and release temporary buffers.

No file content, filename, preview, or converted result is sent to Hosttech, GitHub, analytics, or another origin.

## 7. Privacy and security design

- Remove Google Fonts and self-host approved font files with documented licenses.
- Replace the `unpkg.com` FFmpeg load with pinned same-origin assets and publish all required FFmpeg/GPL/LGPL notices and source references.
- Remove or isolate the inherited inline theme script so Content Security Policy does not require unrestricted inline scripts.
- Production permits only reviewed same-origin requests. Worker/WASM policy allows only the minimum `blob:` and WebAssembly capabilities required by the tested runtime; third-party origins remain blocked.
- Service-worker caching is restricted to application assets. Inputs, object URLs, outputs, previews, and content history never enter Cache Storage.
- Tool-specific limits fail before unsafe allocation. Limits are release configuration backed by stress tests, not unsupported marketing promises.
- Malformed and hostile files produce stable content-free errors. Raw payloads, filenames, stack traces, and document text are never logged.
- Version 1 has no telemetry and therefore no telemetry consent path.
- The production head contains exactly one passive ownership tag: `<meta name="google-adsense-account" content="ca-pub-7877827162675091">`. It causes no network request. AdSense scripts, ads, cookies, tracking, and Google-side verification remain outside version 1 without separate authorization.
- The privacy page distinguishes local file processing from unavoidable static-host access logs according to the actual Hosttech configuration.

## 8. Visual and interaction design

The approved direction is `Warm Shell / Dark Workbench`.

- Outer surfaces use warm off-white and sand tones with dark graphite typography.
- Work areas use calm graphite with restrained clay, amber, or sage accents.
- Do not use violet-blue AI glow, neon gradients, generic AI decoration, floating orbs, or ornamental glass effects.
- Explain privacy in ordinary language, with technical details one level deeper.
- Every tool follows: choose input, configure, process, download.
- Progress is determinate where supported and honestly indeterminate otherwise.
- Cancellation stops active work rather than merely hiding progress.
- Empty, loading, success, unsupported, cancelled, and error states are explicit.

## 9. Localization, responsive behavior, and accessibility

- German and English share stable localization keys. Missing production translations fail a release check rather than showing raw keys.
- Language preference is local and contains no user content.
- Core workflows are fully responsive. Large-file workflows show conservative limits and device-aware guidance.
- Support the current and previous stable Chrome, Edge, Firefox, and Safari releases, including current iOS Safari. Missing APIs are explained before input processing.
- Keyboard access, visible focus, correct landmarks, labels, live status, contrast, zoom resilience, touch target size, and reduced motion are release requirements.
- Motion communicates state and progress only; it is subtle, interruptible, and never blocks work.

## 10. Catalog governance

The inherited claim of more than 200 tools is not automatically a Folkkit release claim.

- Generate the displayed count from the released registry.
- Give each tool a release state such as core, advanced, experimental, or hidden.
- A released tool needs localized metadata, predictable empty-input behavior, privacy-safe errors, validation, output naming, keyboard operation, and automated smoke coverage.
- Experimental tools are clearly labeled and excluded from core marketing.
- Health and financial calculators include appropriate scope and non-advice notices.
- Stable published tool IDs are not renamed without compatibility mapping.

## 11. Open-source compliance

- Keep the complete covered work under AGPL-3.0-only.
- Preserve upstream Git history, `LICENSE`, authorship notices, and the `upstream` remote.
- Mark material Folkkit changes and dates where appropriate.
- Generate third-party notices from the locked dependency graph and manually verify assets/WASM not fully represented by the JavaScript lockfile.
- A visible source link points to the exact public commit or release corresponding to the deployed build.
- The repository remains private during pre-release development and becomes public before or with the first public deployment.
- Later paid access is compatible only while AGPL source obligations remain satisfied. Accounts and subscriptions require a separate approved architecture design.

## 12. Hosttech build and release design

- `main` is the authoritative full source branch.
- CI installs locked dependencies, runs release checks, builds static artifacts, and verifies the output allowlist.
- A repository-owned script generates `plesk` from a verified `main` commit. `plesk` contains only required static runtime files and hosting configuration.
- Source, tests, documentation, agent files, development tools, unneeded lockfiles, and secrets are excluded from `plesk`.
- `plesk` is never edited manually or force-pushed.
- Production headers and rewrite behavior are stored as reproducible source configuration and verified against the generated branch.
- Updating GitHub branches does not authorize a manual Hosttech/Plesk checkout, pull, upload, DNS change, or live deployment.

## 13. Error and recovery behavior

- Unsupported type: reject before parsing and explain accepted input.
- Oversized input: reject before expensive allocation and show the applicable local limit.
- Corrupt or malicious input: stop the worker, discard buffers, and show a content-free error.
- Out-of-memory or worker crash: clean up, preserve no content, and suggest a smaller file or desktop browser.
- Cancellation: terminate work, release temporary state, and return to reusable input.
- Offline missing asset: identify the required Folkkit module and offer retry when online; never use a third-party CDN fallback.
- Download failure: retain the result only for the current session and allow retry or explicit discard.

## 14. Verification and acceptance criteria

Before functional Folkkit work, resolve the inherited seven React lint failures without globally suppressing the relevant rules.

Required automated layers:

- Unit tests for converter logic and privacy-sensitive storage helpers.
- Registry contract tests that enumerate every released tool.
- Component tests for input, progress, cancellation, errors, history consent, and localization.
- Browser tests for the three core journeys in German and English.
- Accessibility automation plus manual keyboard and screen-reader smoke testing.
- Network tests that fail on unapproved origins and verify request bodies never contain selected file data.
- PWA tests for installability, cache versioning, offline core tools, and safe upgrades.
- Production build and hosting-tree tests, including forbidden paths for `plesk`.
- Dependency and static security review before public release.

Release acceptance requires:

- Lint, tests, and production build succeed without ignored failures.
- Core PDF, QR, and conversion fixtures produce correct downloads.
- Released-tool registry coverage is complete and displayed count matches it.
- German and English UI and legal routes are complete.
- Core workflows pass the supported desktop/mobile browser matrix.
- No external runtime request occurs from a clean session or during representative tool use.
- Local history is off by default, opt-in is explicit, and complete deletion is verified.
- The deployed source link resolves to the exact released commit and required notices are present.
- The generated `plesk` tree matches the verified build contract.

## 15. Rollout boundaries

Implementation phases are: foundation and test harness, privacy hardening, Folkkit shell and localization, core-tool UX, advanced catalog audit, PWA/performance, legal/source surfaces, and verified Hosttech branch generation.

No domain purchase, public visibility change, GitHub publication beyond the authorized initial private foundation, or live Hosttech deployment is part of this design-document step.
