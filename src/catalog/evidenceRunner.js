import { getConvertFn } from '../formats'
import { loadConverter } from '../converters/loadConverter'
import { catalogEvidenceRegistry } from './evidenceRegistry'
import { browserEvidenceLinkErrors } from './browserEvidence'

function assertion(state, condition, message, { behavior = false } = {}) {
  state.assertions += 1
  if (behavior) state.behaviorAssertions += 1
  if (!condition) throw new Error(message)
}

function textFromResult(state, result, evidenceId) {
  assertion(state, result?.kind === 'text', `${evidenceId} did not return a text ToolResult`)
  assertion(state, typeof result?.text === 'string', `${evidenceId} returned no text`)
  return result.text
}

const evidenceExecutors = Object.freeze({
  'format-exact': async (evidence, state, dependencies) => {
    const fixtures = [evidence, ...(evidence.additionalCases || [])]
    for (const fixture of fixtures) {
      const convert = dependencies.getConvertFn(fixture.from, fixture.to)
      assertion(state, typeof convert === 'function', `${evidence.evidenceId} has no real edge`)
      const output = String(await convert(fixture.input))
      assertion(state, output === fixture.expected, `${evidence.evidenceId} literal output mismatch`, { behavior: true })
      assertion(state, !/^\([^\n]*\)$/.test(output), `${evidence.evidenceId} returned an error string`, { behavior: true })
    }
  },
  'tool-text-cases': async (evidence, state, dependencies) => {
    const converter = await dependencies.loadConverter(evidence.subjectId)
    assertion(state, converter?.id === evidence.subjectId, `${evidence.evidenceId} did not load its subject`)
    assertion(state, typeof converter?.convert === 'function', `${evidence.evidenceId} has no text converter`)
    for (const fixture of evidence.cases || []) {
      const output = textFromResult(state, await converter.convert(fixture.input), evidence.evidenceId)
      if (fixture.match === 'contains') {
        assertion(state, output.includes(fixture.expected), `${evidence.evidenceId} literal fragment mismatch`, { behavior: true })
      } else {
        assertion(state, output === fixture.expected, `${evidence.evidenceId} literal output mismatch`, { behavior: true })
      }
    }
  },
  'tool-contract': async (evidence, state, dependencies) => {
    const converter = await dependencies.loadConverter(evidence.subjectId)
    assertion(state, converter?.id === evidence.subjectId, `${evidence.evidenceId} did not load its subject`)
    assertion(state, typeof converter?.[evidence.expectedMethod] === 'function', `${evidence.evidenceId} is missing ${evidence.expectedMethod}`)
  },
  'tool-qr-generate': async (evidence, state, dependencies) => {
    const converter = await dependencies.loadConverter(evidence.subjectId)
    assertion(state, converter?.id === evidence.subjectId, `${evidence.evidenceId} did not load its subject`)
    const hadDocument = Object.hasOwn(globalThis, 'document')
    const previousDocument = globalThis.document
    if (!globalThis.document) globalThis.document = { documentElement: { getAttribute: () => null } }
    try {
      const result = await converter.convert(evidence.input)
      assertion(state, result?.kind === 'image', `${evidence.evidenceId} did not return an image`, { behavior: true })
      assertion(state, result?.filename === evidence.expectedFilename, `${evidence.evidenceId} filename mismatch`, { behavior: true })
      const svg = await result.blob.text()
      assertion(state, svg.includes('<svg'), `${evidence.evidenceId} returned no SVG`, { behavior: true })
    } finally {
      if (hadDocument) globalThis.document = previousDocument
      else delete globalThis.document
    }
  },
  'tool-pdf-behavior': async (evidence, state, dependencies) => {
    const { PDFDocument } = await import('pdf-lib')
    const source = await PDFDocument.create()
    source.addPage([200, 300])
    source.setTitle('Evidence PDF')
    const sourceBytes = await source.save()
    const file = () => new File([sourceBytes], 'evidence.pdf', { type: 'application/pdf' })
    const converter = await dependencies.loadConverter(evidence.subjectId)
    assertion(state, converter?.id === evidence.subjectId, `${evidence.evidenceId} did not load its subject`)

    if (evidence.operation === 'merge') {
      const result = await converter.fileConvert([file(), file()])
      const pdf = await PDFDocument.load(await result.blob.arrayBuffer())
      assertion(state, result.filename === 'merged.pdf', `${evidence.evidenceId} filename mismatch`, { behavior: true })
      assertion(state, pdf.getPageCount() === 2, `${evidence.evidenceId} page count mismatch`, { behavior: true })
    } else if (evidence.operation === 'page-count') {
      const result = await converter.fileConvert(file())
      assertion(state, result?.kind === 'text', `${evidence.evidenceId} did not return text`, { behavior: true })
      assertion(state, result?.text === 'evidence.pdf: 1 page', `${evidence.evidenceId} literal output mismatch`, { behavior: true })
    } else if (evidence.operation === 'split') {
      const result = await converter.fileConvert(file(), '1')
      const pdf = await PDFDocument.load(await result.blob.arrayBuffer())
      assertion(state, result.filename === 'evidence_page1.pdf', `${evidence.evidenceId} filename mismatch`, { behavior: true })
      assertion(state, pdf.getPageCount() === 1, `${evidence.evidenceId} page count mismatch`, { behavior: true })
    } else if (evidence.operation === 'extract-range') {
      const result = await converter.fileConvert(file(), '1-1')
      const pdf = await PDFDocument.load(await result.blob.arrayBuffer())
      assertion(state, result.filename === 'evidence_pages.pdf', `${evidence.evidenceId} filename mismatch`, { behavior: true })
      assertion(state, pdf.getPageCount() === 1, `${evidence.evidenceId} page count mismatch`, { behavior: true })
    } else if (evidence.operation === 'text-to-pdf') {
      const result = await converter.convert('Folkkit PDF evidence')
      const pdf = await PDFDocument.load(await result.blob.arrayBuffer())
      assertion(state, result.filename === 'folkkit-text.pdf', `${evidence.evidenceId} filename mismatch`, { behavior: true })
      assertion(state, pdf.getPageCount() === 1, `${evidence.evidenceId} page count mismatch`, { behavior: true })
    } else if (evidence.operation === 'metadata') {
      const result = await converter.fileConvert(file())
      assertion(state, result.text.includes('Pages: 1'), `${evidence.evidenceId} missing page count`, { behavior: true })
      assertion(state, result.text.includes('Title: Evidence PDF'), `${evidence.evidenceId} missing title`, { behavior: true })
      assertion(state, result.text.includes('Page 1 size: 200 x 300 pts'), `${evidence.evidenceId} missing page size`, { behavior: true })
    } else if (evidence.operation === 'rotate') {
      const result = await converter.fileConvert(file(), '90')
      const pdf = await PDFDocument.load(await result.blob.arrayBuffer())
      assertion(state, result.filename === 'evidence_rotated90.pdf', `${evidence.evidenceId} filename mismatch`, { behavior: true })
      assertion(state, pdf.getPage(0).getRotation().angle === 90, `${evidence.evidenceId} rotation mismatch`, { behavior: true })
    } else {
      throw new Error(`${evidence.evidenceId} has no PDF operation`)
    }
  },
  'browser-e2e': async (evidence, state) => {
    const errors = browserEvidenceLinkErrors([evidence])
    assertion(state, errors.length === 0, errors[0] || `${evidence.evidenceId} browser runner missing`)
  },
})

export async function runEvidenceRegistry(
  registry = catalogEvidenceRegistry,
  dependencies = { getConvertFn, loadConverter },
) {
  const results = []
  for (const evidence of registry) {
    const state = { evidenceId: evidence.evidenceId, executed: true, assertions: 0, behaviorAssertions: 0 }
    const executor = evidenceExecutors[evidence.executor]
    if (!executor) {
      results.push({ ...state, error: `Missing evidence executor: ${evidence.executor}` })
      continue
    }
    try {
      await executor(evidence, state, dependencies)
      results.push(state)
    } catch (error) {
      results.push({ ...state, error: String(error?.message || error) })
    }
  }
  return results
}

export function evidenceRunErrors(registry, results) {
  const errors = []
  const resultById = new Map(results.map(result => [result.evidenceId, result]))
  for (const evidence of registry) {
    const result = resultById.get(evidence.evidenceId)
    if (!result || !result.executed) {
      errors.push(`Evidence fixture did not run: ${evidence.evidenceId}`)
      continue
    }
    if (result.error) {
      errors.push(`Unexecutable evidence fixture: ${evidence.evidenceId}`)
      continue
    }
    if (!Number.isInteger(result.assertions) || result.assertions < 1) {
      errors.push(`Evidence fixture has no assertions: ${evidence.evidenceId}`)
      continue
    }
    if (evidence.executor !== 'browser-e2e' && (!Number.isInteger(result.behaviorAssertions) || result.behaviorAssertions < 1)) {
      errors.push(`Evidence fixture has no behavioral assertions: ${evidence.evidenceId}`)
    }
  }
  return errors
}
