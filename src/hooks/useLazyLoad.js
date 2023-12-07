import { useCallback, useEffect, useMemo, useState } from 'react'

export default function useLazyLoad({
  response,
  meta,
  isFetching,
  fetcher,
  onClear,
  responseParser,
  initialFetch = true,
  queryParams
}) {
  const [data, setData] = useState([])

  const handleLoadMore = useCallback(() => {
    if (!isFetching && meta?.currentPage < meta?.lastPage) {
      fetcher({
        ...queryParams,
        page: meta.currentPage + 1
      })
    } else if (!isFetching && meta.nextPage) {
      fetcher({
        ...queryParams,
        page: meta.nextPage
      })
    }
  }, [fetcher, meta, isFetching, queryParams])

  useEffect(() => {
    if (initialFetch) {
      fetcher()
    }

    return () => {
      if (onClear) {
        onClear()
      }
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (!isFetching) {
      if (meta.hasOwnProperty('nextPage')) {
        setData(prevSate => [...(prevSate || []), ...(response || [])])
      } else {
        setData(prevSate =>
          !meta.currentPage || meta.currentPage === 1
            ? responseParser
              ? responseParser([], response)
              : response
            : responseParser
            ? responseParser(prevSate, response)
            : [...prevSate, ...response]
        )
      }
    }
    // eslint-disable-next-line
  }, [response, isFetching])

  return useMemo(
    () => ({
      data,
      handleLoadMore,
      setData
    }),
    [data, handleLoadMore]
  )
}
