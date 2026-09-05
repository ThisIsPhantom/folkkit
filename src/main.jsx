import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import './components/shell/shell.css'
import './pages/pages.css'
import './styles/studio.css'
import App from './App.jsx'
import { ToastProvider } from './components/Toast'
import { I18nProvider } from './i18n/I18nProvider'
import { initializeHistoryPrivacy } from './privacy/historyStore'

initializeHistoryPrivacy()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </I18nProvider>
  </StrictMode>,
)

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const baseUrl = import.meta.env.BASE_URL || '/'
    const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
    const swUrl = `${normalizedBaseUrl}sw.js`

    navigator.serviceWorker.register(swUrl).catch((error) => {
      console.warn('[SW] Service worker registration failed:', error)
    })
  })
}
