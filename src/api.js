import { createApi } from '@reduxjs/toolkit/query/react'
import eventNames from 'constants/eventNames'
import axios from 'utils/axios'
import errorHandler from 'utils/errorHandler'

const handleUnauthorized = (result, args, api, extraOptions) => {
  if (extraOptions?.ignoreUnauthorized) {
    return
  }

  document.dispatchEvent(new Event(eventNames.logout))
}

const parseBaseQueryResult = (data, error, request, response) => ({
  data,
  error,
  meta: {
    request,
    response
  }
})

const appBaseQuery = async args => {
  try {
    const response = await axios(args)
    return parseBaseQueryResult(
      response.data,
      undefined,
      response.request,
      response
    )
  } catch (error) {
    const { response = {}, request } = error
    return parseBaseQueryResult(
      undefined,
      {
        data: response.data,
        status: response.status
      },
      request,
      response
    )
  }
}

const appFetchBaseQuery = async (args, api, extraOptions) => {
  if (typeof args === 'string') {
    args = {
      url: args
    }
  }
  const result = await appBaseQuery({
    ...args,
    ...(args.body ? { data: args.body } : {})
  })
  if (result.error && result.error.status === 401) {
    handleUnauthorized(result, args, api, extraOptions)
  }
  if (result.error) {
    result.error = errorHandler(result.error)
  }
  return result
}

export const createAppApi = (reducerPath, config = {}) =>
  createApi({
    reducerPath,
    baseQuery: appFetchBaseQuery,
    ...config
  })
