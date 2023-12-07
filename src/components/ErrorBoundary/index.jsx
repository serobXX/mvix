import React from 'react'

import ChunkErrorPage from './ChunkErrorPage'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return {
      hasError:
        error.message.includes('Loading chunk') ||
        error.message.includes('Loading CSS chunk'),
      error
    }
  }

  render() {
    if (this.state.hasError) {
      return <ChunkErrorPage />
    }
    if (process.env.NODE_ENV === 'development') {
      return this.state.error ? this.state.error : this.props.children
    }
    return this.props.children
  }
}

export default ErrorBoundary
