import { createSuccessInvalidator } from 'utils/apiUtils.js'
import { createAppApi } from '../api.js'
import apiTags from 'constants/apiTags.js'

export const configApi = createAppApi(
  'configReducer',
  {
    endpoints: builder => ({
      findLocation: builder.query({
        query: params => ({
          url: '/config/findLocation',
          params
        })
      }),
      getOauth: builder.query({
        query: service => ({
          url: '/oauth2',
          method: 'GET',
          params: { service }
        }),
        providesTags: [apiTags.oauth]
      }),
      oauthGmail: builder.mutation({
        query: code => ({
          url: '/oauth2/Gmail',
          method: 'POST',
          params: { code }
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.oauth])
      })
    })
  },
  {
    tagTypes: [apiTags.oauth]
  }
)

export const {
  useFindLocationQuery,
  useLazyFindLocationQuery,
  useOauthGmailMutation,
  useGetOauthQuery
} = configApi
