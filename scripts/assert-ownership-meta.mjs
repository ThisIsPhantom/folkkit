const adsenseRuntimeMarker = /\badsbygoogle\b|(?:https?:)?\/\/[^"'\s>]*googlesyndication\.com\b/i

function readAttribute(element, attributeName) {
  const expression = new RegExp(`\\s${attributeName}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'=<>]+))`, 'i')
  const match = element.match(expression)
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? null
}

export function assertPassiveAdsenseOwnershipMeta(html) {
  const ownershipMetaElements = (html.match(/<meta\b[^>]*>/gi) || []).filter((element) => (
    readAttribute(element, 'name')?.toLowerCase() === 'google-adsense-account'
  ))

  if (ownershipMetaElements.length !== 1) {
    throw new Error(`Built HTML must contain exactly one passive AdSense ownership meta tag; found ${ownershipMetaElements.length}.`)
  }

  if (readAttribute(ownershipMetaElements[0], 'content') !== 'ca-pub-7877827162675091') {
    throw new Error('The passive AdSense ownership meta tag must contain ca-pub-7877827162675091.')
  }

  if (adsenseRuntimeMarker.test(html)) {
    throw new Error('Built HTML must not contain an AdSense runtime marker or loader.')
  }
}
