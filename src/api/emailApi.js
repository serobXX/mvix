import { createAppApi } from '../api.js'
import apiTags from 'constants/apiTags'
import {
  injectGetApiMiddleware,
  injectLazyGetApiMiddleware
} from 'utils/apiUtils.js'

export const emailApi = createAppApi(
  'emailReducer',
  {
    endpoints: builder => ({
      getEmails: builder.query({
        query: params => ({
          url: '/emails',
          method: 'GET',
          params
        }),
        providesTags: [apiTags.email]
      }),
      getEmailById: builder.query({
        query: id => `/emails/${id}`
      }),
      sendEmail: builder.mutation({
        query: body => ({
          url: `/emails`,
          method: 'POST',
          body
        })
      })
    })
  },
  {
    tagTypes: [apiTags.email]
  }
)

export const useGetEmailsQuery = injectGetApiMiddleware(
  emailApi.useGetEmailsQuery
)
export const useLazyGetEmailsQuery = injectLazyGetApiMiddleware(
  emailApi.useLazyGetEmailsQuery
)

export const {
  useGetEmailByIdQuery,
  useLazyGetEmailByIdQuery,
  useSendEmailMutation
} = emailApi
