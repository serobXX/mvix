import { createAppApi } from '../api.js'
import apiTags from 'constants/apiTags'
import {
  createSuccessInvalidator,
  injectGetApiMiddleware,
  injectLazyGetApiMiddleware
} from 'utils/apiUtils.js'

export const siteConfigApi = createAppApi(
  'siteConfigReducer',
  {
    endpoints: builder => ({
      getSiteConfigs: builder.query({
        query: params => ({
          url: '/site_config',
          method: 'GET',
          params
        }),
        providesTags: [apiTags.siteConfig]
      }),
      getSiteConfigById: builder.query({
        query: id => `/site_config/${id}`
      }),
      updateSiteConfig: builder.mutation({
        query: ({ id, data }) => ({
          url: `/site_config/${id}`,
          method: 'PUT',
          body: data
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.siteConfig])
      })
    })
  },
  {
    tagTypes: [apiTags.siteConfig]
  }
)

export const useGetSiteConfigsQuery = injectGetApiMiddleware(
  siteConfigApi.useGetSiteConfigsQuery
)
export const useLazyGetSiteConfigsQuery = injectLazyGetApiMiddleware(
  siteConfigApi.useLazyGetSiteConfigsQuery
)

export const {
  useGetSiteConfigByIdQuery,
  useLazyGetSiteConfigByIdQuery,
  useUpdateSiteConfigMutation
} = siteConfigApi
