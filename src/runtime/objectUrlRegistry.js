export function createObjectUrlRegistry(urlApi = URL) {
  const activeUrls = new Set()

  return Object.freeze({
    create(blob) {
      const url = urlApi.createObjectURL(blob)
      activeUrls.add(url)
      return url
    },
    revoke(url) {
      if (!activeUrls.delete(url)) return
      urlApi.revokeObjectURL(url)
    },
    revokeAll() {
      for (const url of activeUrls) urlApi.revokeObjectURL(url)
      activeUrls.clear()
    },
  })
}
