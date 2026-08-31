import { render } from '@testing-library/react'
import { ToastProvider } from '../components/Toast'

export function renderWithProviders(ui, { locale = 'de' } = {}) {
  function Providers({ children }) {
    return (
      <div lang={locale}>
        <ToastProvider>{children}</ToastProvider>
      </div>
    )
  }

  return render(ui, { wrapper: Providers })
}
