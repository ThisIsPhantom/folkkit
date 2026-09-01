export function createPdfWorker() {
  return new Worker(new URL('../workers/pdfWorker.js', import.meta.url), { type: 'module', name: 'folkkit-pdf' })
}
