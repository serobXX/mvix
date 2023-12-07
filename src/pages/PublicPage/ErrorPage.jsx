import { useEffect } from 'react'
import { EmptyPlaceholder } from 'components/placeholder'

const ErrorPage = () => {
  useEffect(() => {
    document.body.style.height = '100vh'
  }, [])

  return <EmptyPlaceholder text={'Invalid URL'} fullHeight />
}

export default ErrorPage
