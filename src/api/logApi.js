import {
  injectGetApiMiddleware,
  injectLazyGetApiMiddleware
} from 'utils/apiUtils.js'
import { createAppApi } from '../api.js'
import apiTags from 'constants/apiTags.js'

export const logApi = createAppApi(
  'logReducer',
  {
    endpoints: builder => ({
      getLogs: builder.query({
        query: ({ entity, entityId, params }) => ({
          url: `/log/${entity}/${entityId}`,
          params
        }),
        providesTags: [apiTags.log]
      })
    })
  },
  {
    tagTypes: [apiTags.log]
  }
)

export const useGetLogsQuery = injectGetApiMiddleware(logApi.useGetLogsQuery)
export const useLazyGetLogsQuery = injectLazyGetApiMiddleware(
  logApi.useLazyGetLogsQuery
)
