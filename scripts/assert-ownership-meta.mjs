const ownershipMeta = /<meta\s+name=["']google-adsense-account["']\s+content=["']ca-pub-7877827162675091["']\s*\/?\s*>/g

export function assertPassiveAdsenseOwnershipMeta(html) {
  const count = (html.match(ownershipMeta) || []).length
  if (count !== 1) {
    throw new Error(`Built HTML must contain exactly one passive AdSense ownership meta tag; found ${count}.`)
  }
}
