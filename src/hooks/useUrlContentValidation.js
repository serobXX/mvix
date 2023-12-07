import { useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'

import { unableToGetData, invalidDataType } from 'constants/validationMessages'
import {
  getFileExtensionFromUrl,
  extensionToMimeMap,
  validateFileExtension
} from 'utils/fileUpload'
import { _debounce, _get } from 'utils/lodash'

export const noCacheHeaders = {
  Pragma: 'no-cache',
  'Cache-Control': 'no-cache'
}

export default function useUrlContentValidation({
  url,
  path = 'url',
  errors,
  isFetchAllowed = true,
  setFieldError,
  allowedDataMimeTypes = [],
  disabled = true // disabled due CORS errors
}) {
  const [error, setError] = useState('')

  const handleFetchData = useCallback(
    async url => {
      try {
        const initialGetter = axios.head
        const initialRequestSettings = { headers: noCacheHeaders }

        await initialGetter(url, initialRequestSettings).then(
          ({ status, headers }) => {
            if (status !== 200) {
              setError(unableToGetData)
            } else {
              if (allowedDataMimeTypes.length) {
                const type = _get(
                  headers,
                  'content-type',
                  extensionToMimeMap(getFileExtensionFromUrl(url))
                )
                if (
                  type &&
                  allowedDataMimeTypes.some(mime => type.includes(mime))
                ) {
                  setError('')
                } else {
                  setError(invalidDataType)
                }
              } else {
                setError('')
              }
            }
          }
        )
      } catch (e) {
        setError(unableToGetData)
      }
    },
    // eslint-disable-next-line
    []
  )

  const debounceFetcher = useMemo(
    () => _debounce(handleFetchData, 500),
    [handleFetchData]
  )

  const handleDebouncedFetchData = useCallback(debounceFetcher, [
    debounceFetcher
  ])

  useEffect(
    () => {
      if (!disabled && isFetchAllowed) {
        handleDebouncedFetchData(url)
      } else {
        if (validateFileExtension(url, allowedDataMimeTypes)) {
          setError('')
        } else {
          setError(invalidDataType)
        }
      }
    },
    // eslint-disable-next-line
    [url]
  )

  useEffect(
    () => {
      if (disabled) {
        return
      }
      const formikError = _get(errors, path)
      if (error && !formikError) {
        setFieldError(path, error)
      } else if (!error && formikError === unableToGetData) {
        setFieldError(path, '', false)
      }
    },
    // eslint-disable-next-line
    [errors, error, disabled]
  )

  return useMemo(() => !error, [error])
}
