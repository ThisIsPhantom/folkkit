# Folkkit

Folkkit is a planned bilingual, local-first browser utility suite for everyday PDF, QR, and file conversion work. It is derived from [Convert Everything](https://github.com/MercuriusDream/convert-everything) and preserves its full Git history under AGPL-3.0-only.

## Current status

The product design is approved, but Folkkit implementation has not started and nothing has been deployed. The inherited application still contains external Google Fonts and an external FFmpeg download; do not publish it under Folkkit's privacy promise until the approved release gates pass.

The canonical design is [docs/superpowers/specs/2026-08-31-folkkit-design.md](docs/superpowers/specs/2026-08-31-folkkit-design.md).

## Development

```bash
git clone https://github.com/ThisIsPhantom/folkkit.git
cd folkkit
bun install && bun run dev
```

Requires [Bun](https://bun.sh/) ≥ 1.3 or [Node.js](https://nodejs.org/) ≥ 18.

## Stack

React 19 · Vite 7 · Vanilla CSS · pdf-lib · qrcode · FFmpeg WASM

## Documentation

Full docs live in [`docs/`](docs/) — [product overview](docs/01-product-overview.md), [architecture](docs/02-architecture.md), [converter catalog](docs/03-converter-catalog.md), [security & privacy](docs/06-security-and-privacy.md), [developer guide](docs/09-developer-guide.md), [contributing](docs/10-governance-and-contributing.md), [FAQ](docs/11-faq.md), and more.

## Upstream and attribution

The `upstream` remote is `MercuriusDream/convert-everything`. Preserve upstream copyright notices, modification history, the AGPL license, and all applicable third-party notices.

## Contributing

See [Contributing](docs/10-governance-and-contributing.md) and [Developer Guide](docs/09-developer-guide.md).

## License

[AGPL-3.0-only](LICENSE)
