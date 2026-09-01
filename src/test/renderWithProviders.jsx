import { render } from '@testing-library/react'
import { ToastProvider } from '../components/Toast'
import { I18nProvider } from '../i18n/I18nProvider'

export function renderWithProviders(ui, { locale = 'de' } = {}) {
  function Providers({ children }) {
    return (
      <div lang={locale}>
        <I18nProvider initialLocale={locale}>
          <ToastProvider>{children}</ToastProvider>
        </I18nProvider>
      </div>
    )
  }

  return render(ui, { wrapper: Providers })
}
