import { getConvertFn } from '../formats'
import { loadConverter } from '../converters/loadConverter'
import { catalogEvidenceRegistry } from './evidenceRegistry'

function assertion(state, condition, message) {
  state.assertions += 1
  if (!condition) throw new Error(message)
}

function textFromResult(state, result, evidenceId) {
  assertion(state, result?.kind === 'text', `${evidenceId} did not return a text ToolResult`)
  assertion(state, typeof result?.text === 'string', `${evidenceId} returned no text`)
  return result.text
}

const evidenceExecutors = Object.freeze({
  'format-exact': async (evidence, state, dependencies) => {
    const convert = dependencies.getConvertFn(evidence.from, evidence.to)
    assertion(state, typeof convert === 'function', `${evidence.evidenceId} has no real edge`)
    const output = String(await convert(evidence.input))
    assertion(state, output === evidence.expected, `${evidence.evidenceId} literal output mismatch`)
    assertion(state, !/^\([^\n]*\)$/.test(output), `${evidence.evidenceId} returned an error string`)
  },
  'tool-text-cases': async (evidence, state, dependencies) => {
    const converter = await dependencies.loadConverter(evidence.subjectId)
    assertion(state, converter?.id === evidence.subjectId, `${evidence.evidenceId} did not load its subject`)
    assertion(state, typeof converter?.convert === 'function', `${evidence.evidenceId} has no text converter`)
    for (const fixture of evidence.cases || []) {
      const output = textFromResult(state, await converter.convert(fixture.input), evidence.evidenceId)
      if (fixture.match === 'contains') {
        assertion(state, output.includes(fixture.expected), `${evidence.evidenceId} literal fragment mismatch`)
      } else {
        assertion(state, output === fixture.expected, `${evidence.evidenceId} literal output mismatch`)
      }
    }
  },
  'tool-contract': async (evidence, state, dependencies) => {
    const converter = await dependencies.loadConverter(evidence.subjectId)
    assertion(state, converter?.id === evidence.subjectId, `${evidence.evidenceId} did not load its subject`)
    assertion(state, typeof converter?.[evidence.expectedMethod] === 'function', `${evidence.evidenceId} is missing ${evidence.expectedMethod}`)
  },
  'browser-download-contract': async (evidence, state, dependencies) => {
    const converter = await dependencies.loadConverter(evidence.subjectId)
    assertion(state, converter?.id === evidence.subjectId, `${evidence.evidenceId} did not load its subject`)
    assertion(state, typeof converter?.[evidence.expectedMethod] === 'function', `${evidence.evidenceId} is missing ${evidence.expectedMethod}`)
    assertion(state, typeof evidence.expectedFilename === 'string' && evidence.expectedFilename.length > 0, `${evidence.evidenceId} has no literal filename`)
    assertion(state, ['jpeg', 'png', 'mp3'].includes(evidence.expectedSignature), `${evidence.evidenceId} has no supported signature assertion`)
  },
})

export async function runEvidenceRegistry(
  registry = catalogEvidenceRegistry,
  dependencies = { getConvertFn, loadConverter },
) {
  const results = []
  for (const evidence of registry) {
    const state = { evidenceId: evidence.evidenceId, executed: true, assertions: 0 }
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
    }
  }
  return errors
}
