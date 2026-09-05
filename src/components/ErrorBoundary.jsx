import { Component } from 'react'
import { useI18n } from '../i18n'

class ErrorBoundaryCore extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="converter-view">
          <div className="error-msg" role="alert">
            {this.props.message}
            <br />
            <button
              className="pill-btn-sm error-retry"
              type="button"
              onClick={() => this.props.onRetry ? this.props.onRetry() : this.setState({ hasError: false, error: null })}
            >
              {this.props.retryLabel}
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default function ErrorBoundary(props) {
  const { t } = useI18n()
  return (
    <ErrorBoundaryCore
      {...props}
      message={t('errorBoundary.message')}
      retryLabel={t('errorBoundary.retry')}
    />
  )
}
