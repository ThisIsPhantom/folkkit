# Folkkit Repository Rules

## Purpose and current phase

- Folkkit is an AGPL-3.0-only, local-first browser utility suite derived from `MercuriusDream/convert-everything`.
- The approved product and architecture design is canonical in `docs/superpowers/specs/2026-08-31-folkkit-design.md`.
- The repository is in planning/foundation status. Do not present Folkkit as deployed or production-ready until the approved release gates pass.

## Required context order

1. Read `CONTEXT.md`.
2. Read `PROJECT_MEMORY.md`.
3. Read the approved design specification.
4. Load only the upstream documents under `docs/` that are relevant to the current task.

## Product invariants

- User file contents must not leave the browser for conversion, editing, preview, history, diagnostics, or analytics.
- Production runtime assets must be same-origin and self-hosted. Do not add external CDNs, remote fonts, telemetry, advertising, crash reporting, or hidden network fallbacks.
- The passive Google AdSense ownership meta tag for account `ca-pub-7877827162675091` is allowed. It must not be accompanied by AdSense scripts, ads, cookies, tracking, or a verification claim without separate authorization.
- Session memory is the default for content. A content-bearing local history may exist only after explicit opt-in and must have a complete delete action.
- German and English are first-class. New user-visible strings must use the shared localization system.
- The homepage prioritizes PDF, QR, and everyday conversion. The advanced catalog exposes only tools that pass their release gate.
- Derive marketing tool counts from the released catalog; never hard-code them.

## Design contract

- Use `Warm Shell / Dark Workbench`: warm, calm outer surfaces and a focused dark work area.
- Do not use violet or blue AI glows, neon gradients, generic AI/SaaS decoration, floating orbs, or ornamental glass effects.
- Typography and visual assets must be self-hosted and legally documented.
- Responsive, keyboard, reduced-motion, contrast, and screen-reader behavior are release requirements.

## Open-source and attribution contract

- Preserve the upstream Git history, `LICENSE`, copyright notices, and the `upstream` remote.
- Mark material Folkkit modifications and maintain a visible source link to the exact deployed revision.
- Keep third-party notices complete, including FFmpeg core obligations when media tools ship.
- Folkkit may be monetized later, but covered source remains available under AGPL-3.0-only.

## Development and release contract

- Use test-driven development for implementation changes and keep converter logic isolated from the application shell.
- Before claiming completion, run lint, unit/contract tests, production build, browser tests, accessibility checks, and network privacy checks appropriate to the change.
- `main` contains the complete project and source history.
- `plesk` is hosting-only and must be generated from a verified `main` commit by a repository-owned allowlist workflow. Never edit or force-push it manually.
- `Publish-PleskBranch.ps1 -ValidateOnly` may inspect any clean local source ref through an isolated archive and must not change branches, refs, or the worktree. `-Push` is restricted to a clean, synchronized `main` tracking `origin/main` and must use the operator-gated release build.
- Updating `plesk` publishes static GitHub branch contents only. It does not authorize or perform a Hosttech login, checkout, upload, DNS change, or live deployment.
- GitHub publication after the initial private foundation, public visibility changes, domain registration, and live Hosttech deployment require explicit user authorization.
