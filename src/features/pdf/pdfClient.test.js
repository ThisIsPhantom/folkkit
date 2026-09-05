import { expect, test } from 'vitest'
import { PdfWorkerClient } from './pdfClient.js'

class WorkerStub {
  postMessage(data) { this.message = data }
  terminate() { this.terminated = true }
}
test('cancellation terminates the PDF worker and rejects all queued requests without document content', async () => {
  const client = new PdfWorkerClient({ WorkerCtor: WorkerStub })
  const first = client.metadata()
  const second = client.render(0)
  client.dispose()
  await expect(first).rejects.toMatchObject({ code: 'cancelled', message: 'cancelled' })
  await expect(second).rejects.toMatchObject({ code: 'cancelled' })
  expect(client.worker.terminated).toBe(true)
  expect(client.pending.size).toBe(0)
})
test('raw worker errors are converted into content-free stable error codes', async () => {
  const client = new PdfWorkerClient({ WorkerCtor: WorkerStub })
  const request = client.metadata()
  client.worker.onmessage({ data: { id: client.worker.message.id, ok: false, code: 'PRIVATE DOCUMENT CONTENT' } })
  await expect(request).rejects.toMatchObject({ message: 'invalid_file' })
  client.dispose()
})
