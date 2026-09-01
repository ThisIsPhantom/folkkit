import { expect, test, vi } from 'vitest'
import { runPdfWorkerTask } from './pdfWorkerClient'

function fakeWorkerFactory({ response, neverRespond = false } = {}) {
  const workers = []
  class FakeWorker {
    constructor() {
      this.terminate = vi.fn()
      workers.push(this)
    }
    postMessage(message) {
      this.message = message
      if (!neverRespond) queueMicrotask(() => this.onmessage?.({ data: response }))
    }
  }
  return { FakeWorker, workers }
}

test('PDF worker transfers bounded input and returns a download before terminating', async () => {
  const { FakeWorker, workers } = fakeWorkerFactory({
    response: { ok: true, result: { kind: 'download', bytes: new Uint8Array([1, 2, 3]), mimeType: 'application/pdf', filename: 'merged.pdf' } },
  })
  const result = await runPdfWorkerTask({
    operation: 'merge',
    files: [new File(['%PDF-fixture'], 'private.pdf', { type: 'application/pdf' })],
    WorkerCtor: FakeWorker,
    maxElapsedMs: 1000,
  })

  expect(result).toMatchObject({ kind: 'download', filename: 'merged.pdf' })
  expect(result.blob).toBeInstanceOf(Blob)
  expect(workers[0].message).toMatchObject({ operation: 'merge' })
  expect(workers[0].terminate).toHaveBeenCalledTimes(1)
})

test('PDF cancellation hard-terminates the active worker', async () => {
  const { FakeWorker, workers } = fakeWorkerFactory({ neverRespond: true })
  const controller = new AbortController()
  const pending = runPdfWorkerTask({
    operation: 'page-count',
    files: [new File(['%PDF-fixture'], 'private.pdf', { type: 'application/pdf' })],
    signal: controller.signal,
    WorkerCtor: FakeWorker,
    maxElapsedMs: 1000,
  })
  for (let attempt = 0; attempt < 20 && workers.length === 0; attempt += 1) await Promise.resolve()
  expect(workers).toHaveLength(1)
  controller.abort()

  await expect(pending).rejects.toMatchObject({ code: 'cancelled' })
  expect(workers[0].terminate).toHaveBeenCalledTimes(1)
})

test('PDF elapsed-time budget hard-terminates a stalled worker', async () => {
  const { FakeWorker, workers } = fakeWorkerFactory({ neverRespond: true })
  await expect(runPdfWorkerTask({
    operation: 'metadata',
    files: [new File(['%PDF-fixture'], 'private.pdf', { type: 'application/pdf' })],
    WorkerCtor: FakeWorker,
    maxElapsedMs: 5,
  })).rejects.toMatchObject({ code: 'resource_limit' })
  expect(workers[0].terminate).toHaveBeenCalledTimes(1)
})
