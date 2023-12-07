import { createAppApi } from '../api.js'
import apiTags from 'constants/apiTags'
import {
  createSuccessInvalidator,
  injectGetApiMiddleware,
  injectLazyGetApiMiddleware
} from 'utils/apiUtils.js'

export const accountPartnershipApi = createAppApi(
  'accountPartnershipReducer',
  {
    endpoints: builder => ({
      getPartnership: builder.query({
        query: params => ({
          url: '/accountPartnership',
          method: 'GET',
          params
        }),
        providesTags: [apiTags.accountPartnership]
      }),
      addPartnership: builder.mutation({
        query: body => ({
          url: `/accountPartnership`,
          method: 'POST',
          body
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.accountPartnership])
      }),
      getPartnershipById: builder.query({
        query: id => `/accountPartnership/${id}`
      }),
      updatePartnership: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/accountPartnership/${id}`,
          method: 'PUT',
          body
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.accountPartnership])
      }),
      deletePartnership: builder.mutation({
        query: id => ({
          url: `/accountPartnership/${id}`,
          method: 'DELETE'
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.accountPartnership])
      }),
      bulkDeletePartnership: builder.mutation({
        queryFn: async (ids, _queryApi, _extraOptions, fetchWithBQ) => {
          const result = await Promise.all(
            ids.map(id =>
              fetchWithBQ({
                url: `/accountPartnership/${id}`,
                method: 'DELETE'
              })
            )
          )
          const isSuccess = result.find(({ error }) => !error)
          if (isSuccess) {
            return { data: {} }
          } else {
            return {
              error: result[0]?.error
            }
          }
        },
        invalidatesTags: createSuccessInvalidator([apiTags.accountPartnership])
      })
    })
  },
  {
    tagTypes: [apiTags.accountPartnership]
  }
)

export const useGetPartnershipQuery = injectGetApiMiddleware(
  accountPartnershipApi.useGetPartnershipQuery
)
export const useLazyGetPartnershipQuery = injectLazyGetApiMiddleware(
  accountPartnershipApi.useLazyGetPartnershipQuery
)

export const {
  useAddPartnershipMutation,
  useGetPartnershipByIdQuery,
  useLazyGetPartnershipByIdQuery,
  useUpdatePartnershipMutation,
  useDeletePartnershipMutation,
  useBulkDeletePartnershipMutation
} = accountPartnershipApi
