# Folkkit Creative Tools Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Implement the approved image editor, six document conversion pairs and audio trimmer in Folkkit.
**Architecture:** Three separately reviewed feature modules extend the existing application. Root owns shared UI/routing, document queue integration, runtime dependencies/PWA, commits and release. One implementation subagent at a time; Root may work on disjoint integration files.
**Tech Stack:** React19, Vite7, plain CSS, Canvas, existing FFmpeg WASM and pinned pandoc-wasm1.1.0.
**Spec:** docs/superpowers/specs/2026-09-06-folkkit-creative-tools-design.md

## Global Constraints

- Work only in C:/Codex-Workspaces/folkkit/.worktrees/folkkit-creative, branch codex/folkkit-creative; base9a65c83b06a7d002e16ace9f3995e9cb2e49758e.
- Local-only, same-origin, self-hosted, DE/EN, existing Studio CSS/system fonts/Tabler, AGPL preserved. No Figma, external runtime/telemetry, content persistence or manual hosting action.
- Original files preserved; bounded metadata history30; explicit exports; pointer cancel/Escape rollback; keyboard alternatives; cancellation/late results and resource cleanup.
- Existing conversion/QR/PDF/calculator behavior and caps remain. New caps and behavior in the Spec are binding. Root alone changes package.json/bun.lock, notices, shared routing/i18n/PWA, catalog and existing converter intake/dispatch.
- No implementer subagents, commits/pushes or shared dist builds. Tests use Node Playwright CLI; Bun1.3.3 for dependencies/unit/build. Use isolated artifacts in this plan workspace. Root owns Git.
- Required total acceptance: existing tests plus feature regressions, meaningful independent exports, CSP/offline/network, DE/EN themes/mobile/keyboard, clean archive build and generated main/plesk publication.

## Task 1: Document engine and feasibility

**Files:** Create src/features/documents/{documentModel.js,documentEngine.js,documentWorker.js,documentSafety.js,messages.de.js,messages.en.js} and associated tests; tests/e2e/document-conversion.spec.js. Root handles existing converter files and dependency installation.
**Read:** Spec Document section; existing convert/detection.js, profiles.js, engine.js, queue.js, imageWorker.js and public/sw.template.js. No old plan progress.
**Interfaces:**
```js
// Does bounded preflight, returns null only for a non-document type.
export async function detectDocumentFile(file) // 'docx' | 'markdown' | 'html' | null
export async function convertDocumentFile(file, from, to, {signal, onProgress} = {})
// => [{name, blob, warnings?: ['external_resources_omitted'|'unsupported_images_omitted'|'layout_changed']}]
export const DOCUMENT_FORMATS = Object.freeze(['docx','markdown','html'])
```
Root adds six profiles with engine:'document' and awaits detectDocumentFile only for candidate document types. Function rejects stable content-free errors: invalid_document, document_too_large, document_timeout, unsafe_document, unsupported_type, cancelled, conversion_failed, document_runtime_unavailable. Return names use .docx/.md/.html or one .zip for Markdown plus images. Report actual assets/worker graph to Root.

- [ ] Prove pinned Pandoc in a disposable local worker under exact CSP: generated Markdown→DOCX→HTML and roundtrip text; include Unicode/table and local raster image. No production gate inferred from README. Record version, WASM size/hash and requests. If browser/runtime path fails, report concrete blocker and keep probe separate, do not substitute a server.
- [ ] Add red tests for DOCX ZIP structure/bomb/path limits, UTF-8/type preflight, static option allowlist and HTML/resource safety. Example contracts:
```js
await expect(detectDocumentFile(new File(['hello'], 'hello.md', {type:'text/markdown'}))).resolves.toBe('markdown')
await expect(detectDocumentFile(new File([new Uint8Array([0xff])], 'bad.md'))).rejects.toMatchObject({code:'invalid_document'})
expect(safeHtml).not.toMatch(/<script|onerror=|<iframe|<form|src="https:/i)
```
- [ ] Implement the terminating worker client and conservative virtual-file/HTML/media pipeline; no user-controlled options, paths or browser execution. Use reusable pure safety helpers rather than a large worker file. Do not expose raw warning text.
- [ ] Test six real format pairs and embedded resources independently. Test abort/timeout and late worker replies; validate no third-party request. Include production-compatible UI E2E after Root's queue integration is available; engine proof may use isolated harness.
- [ ] Write task report with commands/output, red/green, exact file list and required Root integration. Root commits and dispatches independent reviewer.

## Task 2: Image editor

**Files:** Create src/features/image/{ImageEditorPage.jsx,ImageCanvas.jsx,imageModel.js,imageRenderer.js,imageClient.js,imageEditorWorker.js,imageEditor.css,messages.de.js,messages.en.js} and focused helper/test files; tests/e2e/image-editor.spec.js. No existing shared files without Root coordination.
**Read:** Spec Image section; existing imageOperations.js, jpegOrientation.js, qrModel.js for bounded decode, PdfCanvas.jsx for pointer lifecycle, studio.css for controls.
**Interfaces:**
```jsx
<ImageEditorPage active={true} fileRequest={{id,file}} onFileRequestConsumed={id=>{}} />
```
Standalone no required props; Root routes /image, retains session in hidden+inert wrapper and acknowledges handoff. Page imports its locale dictionaries using existing feature pattern. Expose pure model/renderer helpers with consistent canvas pixel coordinates; rendering options may inject source/font/canvas for tests. Worker emitted prefix imageEditorWorker.

- [ ] Write pure red geometry/history tests for crop then rotate/mirror, transformed element bounds, strict limits and metadata-only 30-state history. Use deterministic non-square source and off-centre text/image, not only square smoke cases.
- [ ] Build original-based render pipeline and bounded preview, worker export and abort-safe fallback. Example invariant:
```js
// A 300x200 source cropped to {x:50,y:20,width:100,height:80}
// then rotated clockwise must export 80x100; source pixel (50,20)
// maps to (79,0), with overlay transform following the same operation.
```
- [ ] Build useful empty/upload state, crop aspect buttons/drag and numeric fields, rotation/mirror, text and watermark add/select/drag/resize/delete/centre, history/reset and format-specific export. No fake uploaded example image. Main targets48px; responsive inspector and preview.
- [ ] Test real mouse/touch/keyboard, outside-focus Escape, independent output pixels/text placement/alpha/EXIF and no grips in export; invalid files, undo/redo, abort, cleanup, DE/EN/dark/mobile/Axe and CSP.
- [ ] Report complete commands/results and files. Root integrates and commits; independent reviewer gates this task.

## Task 3: Audio editor

**Files:** Create src/features/audio/{AudioEditorPage.jsx,AudioWaveform.jsx,audioModel.js,audioEngine.js,audioPlayback.js,audioEditor.css,messages.de.js,messages.en.js} and focused helpers/tests; tests/e2e/audio-editor.spec.js. May add a browser runtime factory export to src/converters/media.js with covering media.test.js; preserve all old exports. May export probeMedia from convert/mediaEngine.js without behavior change, or isolate parsing into a shared helper after Root coordination.
**Read:** Spec Audio section, converters/media.js createFFmpegRuntime, convert/mediaEngine.js/profiles.js/detection.js, runtime/workBudgets.js.
**Interfaces:**
```jsx
<AudioEditorPage active={true} fileRequest={{id,file}} onFileRequestConsumed={id=>{}} />
```
```js
export async function prepareAudio(file, {signal,onProgress} = {})
// => {duration, peaks: boundedMinMaxBuckets, preview: Blob /*MP3*/}
export async function exportAudio(file, {from,to,start,end,fadeIn,fadeOut,bitrate}, {signal,onProgress} = {})
// => {name,blob}
```
Each operation owns a private existing-class FFmpeg runtime; cancellation cannot terminate unrelated legacy/converter tasks. Root retains page and gives active=false on navigation.

- [ ] Write red time-range/fade/history/wave bucket tests, strict 100MiB/1800s/cap/codec checks, safe fixed command construction and independent runtime cancellation tests.
- [ ] Implement local prep: bounded probe, mono2000Hz PCM→max2048 min/max buckets plus128k MP3 preview; release WASM/temp files after prep. Reject truncated/missing outputs. File data and logs never leave browser.
- [ ] Implement direct waveform selection and precise time fields, user-triggered selection playback with gain fades and end stop, presets whole/selection, undo/redo, export settings and reset. Abort/pause on inactive/reset/unmount; protect late play/prepare/export promises. Cap all buffers before allocation.
- [ ] Implement export from original with atrim/asetpts/afade and fixed encoder settings; validate true result duration and resource cap. Example filter for start2/end5 with fades0.2/0.3:
```text
atrim=start=2:end=5,asetpts=PTS-STARTPTS,afade=t=in:st=0:d=0.2,afade=t=out:st=2.7:d=0.3
```
- [ ] Real fixtures for four input types and four outputs, same-format edits, independent ffprobe duration and decoded fade amplitude. Playback/cancel/isolation/DEEN/themes/mobile/Axe/CSP/offline tests. Existing media format matrix remains intact.
- [ ] Report; Root commits; independent review gate.

## Task 4: Root integration and release

**Files:** src/App.jsx and session tests; routing/studioRoutes.*; pages/HomePage.jsx/CatalogPage.jsx/pages.css; i18n/messages.*; convert/{profiles,detection,engine,FileSettings,FileConverterPage,messages} and tests; package.json/bun.lock; runtime asset/notices/PWA scripts and tests; README/PROJECT_MEMORY; relevant E2E/workflows.
**Interfaces:** exact feature props/functions above; /image, /audio and new convert targets docx/markdown/html. New catalog keys image-editor, audio-trim, document-convert. Shared converter queue still sequential, one result budget, genuine types only.

- [ ] Install pandoc-wasm1.1.0 pinned after clean baseline, preserve QR UTF-8 patch; verify actual WASM3.9/source/hash. Promote safety dependencies only if needed and reviewed. Document all runtime license obligations.
- [ ] Add failing routing/session/intake/profile tests. Preserve files while hiding studios, but set inactive immediately enough to cancel/pause; optional handoffs exactly once under StrictMode. Add six document profiles and candidate-only validation; UI targets/extensions/format notes reflect true supported pairs.
- [ ] Add compact image/audio entries to home and convert, three catalog entries with existing search/favorites. Keep initial three studio cards above added entries. Existing header remains compact. Use ordinary field hints, no internal engine jargon in product UI.
- [ ] Extend initial-shell offline graph for new UI/image assets; heavy Pandoc/FFmpeg remain lazy, cache on explicit use, no automatic startpage download. Account for worker imports/WASM in runtime-origin validation and exact asset license manifest. No budget or CSP weakening.
- [ ] Run full lint/unit/build plus new real browser pairs, existing supported matrix and exact CSP; check old format counts intentionally update only for six real document pairs. Run secret/notices/high dependency/hosting contracts and fresh clean archive validation. Independently review Root diff, then entire branch. One consolidated final fix wave and one scoped re-review if necessary.
- [ ] Normal fast-forward source to main, push and run verified repository publishing workflow for plesk; confirm both GitHub workflows and all hosting files against prepared artifact. Preserve current/old previews and evidence; no manual Live-Hosting action. Report actual completed features and remaining limits.
