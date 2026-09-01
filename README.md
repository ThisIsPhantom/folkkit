# Folkkit

Folkkit is a bilingual, local-first browser utility suite for everyday PDF, QR, and file conversion work. It is derived from [Convert Everything](https://github.com/MercuriusDream/convert-everything) and preserves its full Git history under AGPL-3.0-only.

## Current status

Folkkit V1 is under private pre-release development and has not been deployed. Runtime assets are same-origin, content history is opt-in, and the legal and source pages identify the exact build revision. A public release remains blocked until approved operator details and all remaining release gates are complete.

The canonical design is [docs/superpowers/specs/2026-08-31-folkkit-design.md](docs/superpowers/specs/2026-08-31-folkkit-design.md).

## Development

```bash
git clone https://github.com/ThisIsPhantom/folkkit.git
cd folkkit
bun install && bun run dev
```

Requires [Bun](https://bun.sh/) ≥ 1.3 or [Node.js](https://nodejs.org/) ≥ 18.

### Public release configuration

Copy `.env.example` to a local environment file and replace every example value with the approved public operator details:

```text
VITE_PUBLIC_OPERATOR_NAME=
VITE_PUBLIC_OPERATOR_ADDRESS=
VITE_PUBLIC_CONTACT_EMAIL=
```

Use `|` between postal-address lines. `bun run build:release` rejects missing or unchanged example values. It also requires an exact clean Git `HEAD` and a byte-current committed `THIRD_PARTY_NOTICES.md` before Vite starts. Do not commit real operator details to the repository.

`bun run generate:notices` regenerates `THIRD_PARTY_NOTICES.md` deterministically from the locked runtime dependency graph and `scripts/runtime-assets.json`. Commit that exact output before a release build. Normal development builds do not rewrite the tracked notice file.

## Stack

React 19 · Vite 7 · Vanilla CSS · pdf-lib · qrcode · FFmpeg WASM

## Documentation

Full docs live in [`docs/`](docs/): [product overview](docs/01-product-overview.md), [architecture](docs/02-architecture.md), [converter catalog](docs/03-converter-catalog.md), [security & privacy](docs/06-security-and-privacy.md), [developer guide](docs/09-developer-guide.md), [contributing](docs/10-governance-and-contributing.md), [FAQ](docs/11-faq.md), and more.

## Upstream and attribution

The `upstream` remote is `MercuriusDream/convert-everything`. Preserve upstream copyright notices, modification history, the AGPL license, and all applicable third-party notices.

## Contributing

See [Contributing](docs/10-governance-and-contributing.md) and [Developer Guide](docs/09-developer-guide.md).

## License

[AGPL-3.0-only](LICENSE)
