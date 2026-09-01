export function runtimeAssetUrl(path) {
  const configuredBaseUrl = import.meta.env?.BASE_URL || '/'
  const baseUrl = configuredBaseUrl.endsWith('/')
    ? configuredBaseUrl
    : `${configuredBaseUrl}/`
  return `${baseUrl}${path.replace(/^\/+/, '')}`
}
