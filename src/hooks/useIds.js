import { useMemo } from 'react'

const useIds = array => useMemo(() => array.map(({ id }) => id), [array])

export default useIds
