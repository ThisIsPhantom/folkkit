import { execFileSync } from 'node:child_process'
import { expect, test } from '@playwright/test'

const commit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
const sourceUrl = `https://github.com/ThisIsPhantom/folkkit/tree/${commit}`

test('publishes complete German and English privacy disclosures', async ({ page }) => {
  await page.goto('./privacy')

  await expect(page.getByRole('heading', { name: 'Datenschutz' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Lokale Dateiverarbeitung' })).toBeVisible()
  await expect(page.getByText(/IP-Adresse, Zeitpunkt, angeforderter Pfad, Referrer und User-Agent/)).toBeVisible()
  await expect(page.getByText(/lokale Inhaltschronik.*ausdrücklich aktivierst/i)).toBeVisible()
  await expect(page.getByText(/passive AdSense-Metadatum/i)).toBeVisible()
  await expect(page.getByText(/erheben keine Daten|sammeln keine Daten|null Daten/i)).toHaveCount(0)

  await page.getByRole('button', { name: 'English' }).click()
  await expect(page.getByRole('heading', { name: 'Privacy' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Local file processing' })).toBeVisible()
  await expect(page.getByText(/IP address, timestamp, requested path, referrer, and user agent/)).toBeVisible()
  await expect(page.getByText(/local content history.*explicitly enable/i)).toBeVisible()
  await expect(page.getByText(/passive AdSense ownership metadata/i)).toBeVisible()
  await expect(page.getByText(/collect no data|no data is collected|zero data/i)).toHaveCount(0)
})

test('keeps health and finance limitations localized and avoids a compliance guarantee', async ({ page }) => {
  await page.goto('./terms')

  await expect(page.getByText(/keine medizinische Beratung/i)).toBeVisible()
  await expect(page.getByText(/keine Finanzberatung/i)).toBeVisible()
  await expect(page.getByText(/keine Gewähr.*rechtlich/i)).toBeVisible()

  await page.getByRole('button', { name: 'English' }).click()
  await expect(page.getByText(/not medical advice/i)).toBeVisible()
  await expect(page.getByText(/not financial advice/i)).toBeVisible()
  await expect(page.getByText(/no guarantee.*legally/i)).toBeVisible()
})

test('links the exact build revision, preserves upstream attribution, and does not claim current public access', async ({ page }) => {
  await page.goto('./open-source')

  await expect(page.getByText(commit)).toBeVisible()
  await expect(page.getByRole('link', { name: /exakte Revision/i })).toHaveAttribute('href', sourceUrl)
  await expect(page.getByRole('link', { name: /MercuriusDream\/convert-everything/i })).toHaveAttribute(
    'href',
    'https://github.com/MercuriusDream/convert-everything',
  )
  await expect(page.getByText(/belegt für sich allein keinen öffentlichen Zugriff/i)).toBeVisible()

  await page.getByRole('button', { name: 'English' }).click()
  await expect(page.getByText(/does not by itself mean that the repository is publicly accessible/i)).toBeVisible()
})

test('exposes AGPL and deterministic FFmpeg GPL and LGPL notices', async ({ page }) => {
  await page.goto('./licenses')

  await expect(page.getByRole('link', { name: /GNU Affero General Public License/i })).toHaveAttribute(
    'href',
    'https://www.gnu.org/licenses/agpl-3.0.html',
  )
  const notices = page.locator('.legal-page__notices pre')
  await expect(notices).toContainText('FFmpeg / ffmpeg.wasm runtime assets')
  await expect(notices).toContainText('GPL-2.0-or-later')
  await expect(notices).toContainText('LGPL 2.1')
})

test('withholds unapproved operator values and localizes the footer navigation landmark', async ({ page }) => {
  await page.goto('./contact')

  await expect(page.getByText(/Betreiberangaben.*noch nicht freigegeben/i)).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Fussnavigation' })).toBeVisible()
  await expect(page.locator('a[href^="mailto:"]')).toHaveCount(0)

  await page.getByRole('button', { name: 'English' }).click()
  await expect(page.getByText(/public operator details.*not yet been approved/i)).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Footer navigation' })).toBeVisible()
})
