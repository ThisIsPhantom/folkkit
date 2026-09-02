import { readFile } from 'node:fs/promises'
import { join, relative, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(join(fileURLToPath(new URL('.', import.meta.url)), '..'))
const immutableUsePattern = /^\s*uses:\s*[^@\s]+@[0-9a-f]{40}(?:\s+#\s+\S.*)?$/i

function jobBlocks(text) {
  const matches = [...text.matchAll(/^  ([A-Za-z0-9_-]+):\s*$/gm)]
  return matches.map((match, index) => ({
    id: match[1],
    text: text.slice(match.index, matches[index + 1]?.index ?? text.length),
  }))
}

export function validateWorkflowText(name, text) {
  const errors = []
  const lines = text.split(/\r?\n/)
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    if (/^\s*uses:\s*/.test(line) && !immutableUsePattern.test(line)) {
      errors.push(`${name}:${index + 1} uses a mutable or invalid action reference`)
    }
    if (/uses:\s*actions\/checkout@/i.test(line)) {
      const following = lines.slice(index + 1, index + 12).join('\n')
      if (!/^\s*persist-credentials:\s*false\s*$/m.test(following)) {
        errors.push(`${name}:${index + 1} checkout must set persist-credentials: false`)
      }
    }
  }

  for (const job of jobBlocks(text)) {
    if (!/^\s+contents:\s*write\s*$/m.test(job.text)) continue
    if (/\b(?:bun|npm|pnpm|yarn)\b|\bbuild(?::|\s)/i.test(job.text)) {
      errors.push(`${name}:${job.id} may not install dependencies or run build code with contents: write`)
    }
  }

  if (name.replaceAll('\\', '/').endsWith('/publish-plesk.yml') || name === 'publish-plesk.yml') {
    const jobs = jobBlocks(text)
    const prepare = jobs.find(job => job.id === 'prepare-hosting')
    const publish = jobs.find(job => job.id === 'publish-hosting')
    if (!prepare || !publish) errors.push(`${name} must separate prepare-hosting and publish-hosting jobs`)
    if (publish && !/^\s{4}needs:\s*prepare-hosting\s*$/m.test(publish.text)) {
      errors.push(`${name}:publish-hosting must depend on prepare-hosting`)
    }
    if (publish && !/prepared-plesk-artifact\.mjs\s+push\b/.test(publish.text)) {
      errors.push(`${name}:publish-hosting must use the bounded prepared-artifact pusher`)
    }
    if (publish && !/uses:\s*actions\/checkout@[^\n]+\n(?:[ \t]+[^\n]*\n){0,10}?[ \t]+ref:\s*main\s*$/m.test(publish.text)) {
      errors.push(`${name}:publish-hosting must check out main before invoking the bounded pusher`)
    }
  }
  return errors
}

export async function validateWorkflowFiles(paths = []) {
  const selected = paths.length > 0 ? paths.map(path => resolve(path)) : [
    join(projectRoot, '.github', 'workflows', 'verify.yml'),
    join(projectRoot, '.github', 'workflows', 'publish-plesk.yml'),
  ]
  const failures = []
  for (const path of selected) {
    failures.push(...validateWorkflowText(relative(projectRoot, path), await readFile(path, 'utf8')))
  }
  if (failures.length > 0) throw new Error(`Workflow security validation failed:\n${failures.join('\n')}`)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  validateWorkflowFiles(process.argv.slice(2))
    .then(() => console.log('Workflow security validation passed.'))
    .catch(error => {
      console.error(error.message)
      process.exitCode = 1
    })
}
