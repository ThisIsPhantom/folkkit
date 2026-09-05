// @vitest-environment node
import { expect, test } from 'vitest'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { generateServiceWorker } from '../../scripts/generate-service-worker.mjs'

test('prepares the three studios, native PDF engine and worker imports for offline use', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'folkkit-studio-pwa-'))
  const assets = {
    'index.html': 'app', 'favicon.svg': 'icon', 'manifest.json': '{}', 'theme-init.js': 'theme',
    'assets/qr-preview-123456.svg': 'preview',
    'assets/app-123456.js': 'export {}',
    'assets/qr-123456.js': 'export {}', 'assets/pdf-123456.js': 'export {}',
    'assets/QrDesignerPage-123456.js': 'export {}', 'assets/qr-style-123456.js': 'export {}',
    'assets/PdfEditorPage-123456.js': 'export {}', 'assets/FileConverterPage-123456.js': 'export {}',
    'assets/pdfWorker-123456.js': 'self.onmessage=()=>{}',
    'assets/pdfStudioWorker-123456.js': 'const wasmUrl="/assets/pdfium-123456.wasm";',
    'assets/pdfium-123456.wasm': 'wasm-bytes',
    'assets/imageWorker-123456.js': 'import "./image-codec-123456.js"; async function pdf(){ return import("./pdf-encoder-123456.js") }',
    'assets/image-codec-123456.js': 'export {}',
    'assets/pdf-encoder-123456.js': 'export {}',
    'assets/WorkspacePage-123456.js': 'export {}',
    'assets/CalculatorPage-123456.js': 'export {}',
  }
  const manifest = {
    'index.html': { file: 'assets/app-123456.js', isEntry: true, assets: ['assets/qr-preview-123456.svg'] },
    'src/converters/qr.js': { file: 'assets/qr-123456.js' },
    'src/converters/pdf.js': { file: 'assets/pdf-123456.js' },
    'src/features/qr/QrDesignerPage.jsx': { file: 'assets/QrDesignerPage-123456.js', dynamicImports: ['_qr-style.js'] },
    '_qr-style.js': { file: 'assets/qr-style-123456.js' },
    'src/features/pdf/PdfEditorPage.jsx': { file: 'assets/PdfEditorPage-123456.js' },
    '_FileConverterPage-123456.js': { file: 'assets/FileConverterPage-123456.js', name: 'FileConverterPage', isDynamicEntry: true },
    'src/converters/media.js': { file: 'assets/media-123456.js' },
    'src/pages/WorkspacePage.jsx': { file: 'assets/WorkspacePage-123456.js' },
    'src/features/calculate/CalculatorPage.jsx': { file: 'assets/CalculatorPage-123456.js' },
  }
  try {
    for (const [file, content] of Object.entries({ ...assets, '.vite/manifest.json': JSON.stringify(manifest) })) {
      await mkdir(join(directory, file, '..'), { recursive: true })
      await writeFile(join(directory, file), content)
    }
    const result = await generateServiceWorker({ distDir: directory })
    for (const file of [
      'assets/qr-preview-123456.svg', 'assets/QrDesignerPage-123456.js', 'assets/qr-style-123456.js',
      'assets/PdfEditorPage-123456.js', 'assets/FileConverterPage-123456.js',
      'assets/pdfStudioWorker-123456.js', 'assets/pdfium-123456.wasm',
      'assets/imageWorker-123456.js', 'assets/image-codec-123456.js',
      'assets/pdf-encoder-123456.js',
      'assets/WorkspacePage-123456.js',
      'assets/CalculatorPage-123456.js',
    ]) expect(result.precacheUrls).toContain(`/${file}`)
    expect(result.precacheUrls).not.toContain('/assets/media-123456.js')
  } finally { await rm(directory, { recursive: true, force: true }) }
})
