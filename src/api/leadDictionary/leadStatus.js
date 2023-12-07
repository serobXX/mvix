import { createAppApi } from '../../api.js'
import apiTags from 'constants/apiTags'
import {
  createSuccessInvalidator,
  injectGetApiMiddleware,
  injectLazyGetApiMiddleware
} from 'utils/apiUtils.js'

export const leadStatusApi = createAppApi(
  'leadStatusReducer',
  {
    endpoints: builder => ({
      getLeadStatus: builder.query({
        query: params => ({
          url: '/leadStatus',
          method: 'GET',
          params
        }),
        providesTags: [apiTags.leadStatus]
      }),
      addLeadStatus: builder.mutation({
        query: body => ({
          url: `/leadStatus`,
          method: 'POST',
          body
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.leadStatus])
      }),
      getLeadStatusById: builder.query({
        query: id => `/leadStatus/${id}`
      }),
      updateLeadStatus: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/leadStatus/${id}`,
          method: 'PUT',
          body
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.leadStatus])
      }),
      deleteLeadStatus: builder.mutation({
        query: id => ({
          url: `/leadStatus/${id}`,
          method: 'DELETE'
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.leadStatus])
      }),
      bulkDeleteLeadStatus: builder.mutation({
        queryFn: async (ids, _queryApi, _extraOptions, fetchWithBQ) => {
          const result = await Promise.all(
            ids.map(id =>
              fetchWithBQ({
                url: `/leadStatus/${id}`,
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
        invalidatesTags: createSuccessInvalidator([apiTags.leadStatus])
      })
    })
  },
  {
    tagTypes: [apiTags.leadStatus]
  }
)

export const useGetLeadStatusQuery = injectGetApiMiddleware(
  leadStatusApi.useGetLeadStatusQuery
)
export const useLazyGetLeadStatusQuery = injectLazyGetApiMiddleware(
  leadStatusApi.useLazyGetLeadStatusQuery
)

export const {
  useAddLeadStatusMutation,
  useGetLeadStatusByIdQuery,
  useLazyGetLeadStatusByIdQuery,
  useUpdateLeadStatusMutation,
  useDeleteLeadStatusMutation,
  useBulkDeleteLeadStatusMutation
} = leadStatusApi
