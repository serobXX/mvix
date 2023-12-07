import { useCallback } from 'react'
import useEventListener from 'hooks/useEventListener'

function useEscKeyDownListener(callback) {
  const keypressHandler = useCallback(
    e => {
      if (e.key === 'Escape') {
        callback()
      }
    },
    [callback]
  )

  useEventListener('keydown', keypressHandler)
}
export default useEscKeyDownListener
