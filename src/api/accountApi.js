import { createAppApi } from '../api.js'
import apiTags from 'constants/apiTags'
import {
  createSuccessInvalidator,
  injectGetApiMiddleware,
  injectLazyGetApiMiddleware,
  parsedToPutData
} from 'utils/apiUtils.js'

export const accountApi = createAppApi(
  'accountReducer',
  {
    endpoints: builder => ({
      getAccounts: builder.query({
        query: params => ({
          url: '/account',
          method: 'GET',
          params
        })
      }),
      addAccount: builder.mutation({
        queryFn: async (body, _queryApi, _extraOptions, fetchWithBQ) => {
          const { activity, ...data } = body
          const accountResult = await fetchWithBQ({
            url: `/account`,
            method: 'POST',
            body: data
          })

          if (!accountResult.error) {
            await new Promise(async resolve => {
              if (activity.isActive) {
                const result = await fetchWithBQ({
                  url: `/activity`,
                  method: 'POST',
                  body: {
                    ...activity,
                    relatedToId: accountResult.data?.id
                  }
                })
                resolve(result)
              } else resolve()
            })

            return { data: accountResult.data }
          } else {
            return {
              error: accountResult.error
            }
          }
        }
      }),
      getAccountById: builder.query({
        query: id => `/account/${id}`,
        providesTags: [apiTags.account, apiTags.accountAttachment]
      }),
      updateAccount: builder.mutation({
        queryFn: async (body, _queryApi, _extraOptions, fetchWithBQ) => {
          const { id, data } = body
          const { activity, ...restData } = data
          const accountResult = await fetchWithBQ({
            url: `/account/${id}`,
            method: 'POST',
            body: parsedToPutData(restData)
          })

          if (!accountResult.error) {
            await new Promise(async resolve => {
              if (activity?.isActive) {
                const result = await fetchWithBQ({
                  url: `/activity`,
                  method: 'POST',
                  body: {
                    ...activity,
                    relatedToId: accountResult.data?.id
                  }
                })
                resolve(result)
              } else resolve()
            })

            return { data: accountResult.data }
          } else {
            return {
              error: accountResult.error
            }
          }
        },
        invalidatesTags: createSuccessInvalidator([apiTags.account])
      }),
      deleteAccount: builder.mutation({
        query: id => ({
          url: `/account/${id}`,
          method: 'DELETE'
        })
      }),
      bulkDeleteAccounts: builder.mutation({
        query: ({ ids }) => ({
          url: `/account/bulk`,
          method: 'DELETE',
          params: {
            ids: ids.join(',')
          }
        })
      }),
      bulkUpdateAccounts: builder.mutation({
        query: ({ ids, data }) => ({
          url: `/account/bulk`,
          method: 'PUT',
          params: {
            ids: ids.join(',')
          },
          body: data
        })
      }),
      restoreAccount: builder.mutation({
        query: id => ({
          url: `/account/${id}/restore`,
          method: 'POST'
        })
      }),
      addAttachment: builder.mutation({
        query: ({ parentId, data }) => ({
          url: `/account/${parentId}/attachment`,
          method: 'POST',
          body: data
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.accountAttachment])
      }),
      updateAttachment: builder.mutation({
        query: ({ parentId, id, ...body }) => ({
          url: `/account/${parentId}/attachment/${id}`,
          method: 'PUT',
          body
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.accountAttachment])
      }),
      deleteAttachment: builder.mutation({
        query: ({ parentId, id }) => ({
          url: `/account/${parentId}/attachment/${id}`,
          method: 'DELETE'
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.accountAttachment])
      }),
      // Device
      getDevices: builder.query({
        query: params => ({
          url: '/device',
          method: 'GET',
          params
        })
      }),
      getCategories: builder.query({
        query: params => ({
          url: '/category',
          method: 'GET',
          params
        })
      }),
      // Demo
      getDemo: builder.query({
        query: ({ accountId, params }) => ({
          url: `/account/${accountId}/demo`,
          method: 'GET',
          params
        }),
        providesTags: [apiTags.accountDemo]
      }),
      addDemo: builder.mutation({
        query: ({ accountId, data }) => ({
          url: `/account/${accountId}/demo`,
          method: 'POST',
          body: data
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.accountDemo])
      }),
      getDemoById: builder.query({
        query: ({ accountId, id }) => `/account/${accountId}/demo/${id}`
      }),
      updateDemo: builder.mutation({
        query: ({ accountId, id, data }) => ({
          url: `/account/${accountId}/demo/${id}`,
          method: 'PUT',
          body: data
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.accountDemo])
      }),
      deleteDemo: builder.mutation({
        query: ({ accountId, id }) => ({
          url: `/account/${accountId}/demo/${id}`,
          method: 'DELETE'
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.accountDemo])
      }),
      // Training
      getTraining: builder.query({
        query: ({ accountId, params }) => ({
          url: `/account/${accountId}/training`,
          method: 'GET',
          params
        }),
        providesTags: [apiTags.accountTraining]
      }),
      addTraining: builder.mutation({
        query: ({ accountId, data }) => ({
          url: `/account/${accountId}/training`,
          method: 'POST',
          body: data
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.accountTraining])
      }),
      getTrainingById: builder.query({
        query: ({ accountId, id }) => `/account/${accountId}/training/${id}`
      }),
      updateTraining: builder.mutation({
        query: ({ accountId, id, data }) => ({
          url: `/account/${accountId}/training/${id}`,
          method: 'PUT',
          body: data
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.accountTraining])
      }),
      deleteTraining: builder.mutation({
        query: ({ accountId, id }) => ({
          url: `/account/${accountId}/training/${id}`,
          method: 'DELETE'
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.accountTraining])
      })
    })
  },
  {
    tagTypes: [apiTags.account, apiTags.accountAttachment]
  }
)

export const useGetAccountsQuery = injectGetApiMiddleware(
  accountApi.useGetAccountsQuery
)
export const useLazyGetAccountsQuery = injectLazyGetApiMiddleware(
  accountApi.useLazyGetAccountsQuery
)

export const {
  useAddAccountMutation,
  useGetAccountByIdQuery,
  useLazyGetAccountByIdQuery,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
  useBulkDeleteAccountsMutation,
  useBulkUpdateAccountsMutation,
  useRestoreAccountMutation,
  useAddAttachmentMutation,
  useUpdateAttachmentMutation,
  useDeleteAttachmentMutation,
  // Demo
  useGetDemoQuery,
  useLazyGetDemoQuery,
  useAddDemoMutation,
  useGetDemoByIdQuery,
  useUpdateDemoMutation,
  useDeleteDemoMutation,
  // Training
  useGetTrainingQuery,
  useLazyGetTrainingQuery,
  useAddTrainingMutation,
  useGetTrainingByIdQuery,
  useUpdateTrainingMutation,
  useDeleteTrainingMutation
} = accountApi
