import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { setTitle } from 'utils/windowUtils'

function useWindowTitle() {
  const { pathname } = useLocation()
  const windowTitle = 'CRM Mvix'

  useEffect(() => {
    setTitle(pathname, windowTitle)
  }, [pathname, windowTitle])
}

export default useWindowTitle
