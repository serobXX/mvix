import { createAppApi } from '../../api.js'
import apiTags from 'constants/apiTags'
import {
  createSuccessInvalidator,
  injectGetApiMiddleware,
  injectLazyGetApiMiddleware
} from 'utils/apiUtils.js'

export const leadSourceApi = createAppApi(
  'leadSourceReducer',
  {
    endpoints: builder => ({
      getLeadSources: builder.query({
        query: params => ({
          url: '/leadSource',
          method: 'GET',
          params
        }),
        providesTags: [apiTags.leadSource]
      }),
      addLeadSource: builder.mutation({
        query: body => ({
          url: `/leadSource`,
          method: 'POST',
          body
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.leadSource])
      }),
      getLeadSourceById: builder.query({
        query: id => `/leadSource/${id}`
      }),
      updateLeadSource: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/leadSource/${id}`,
          method: 'PUT',
          body
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.leadSource])
      }),
      deleteLeadSource: builder.mutation({
        query: id => ({
          url: `/leadSource/${id}`,
          method: 'DELETE'
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.leadSource])
      }),
      bulkDeleteLeadSources: builder.mutation({
        queryFn: async (ids, _queryApi, _extraOptions, fetchWithBQ) => {
          const result = await Promise.all(
            ids.map(id =>
              fetchWithBQ({
                url: `/leadSource/${id}`,
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
        invalidatesTags: createSuccessInvalidator([apiTags.leadSource])
      })
    })
  },
  {
    tagTypes: [apiTags.leadSource]
  }
)

export const useGetLeadSourcesQuery = injectGetApiMiddleware(
  leadSourceApi.useGetLeadSourcesQuery
)
export const useLazyGetLeadSourcesQuery = injectLazyGetApiMiddleware(
  leadSourceApi.useLazyGetLeadSourcesQuery
)

export const {
  useAddLeadSourceMutation,
  useGetLeadSourceByIdQuery,
  useLazyGetLeadSourceByIdQuery,
  useUpdateLeadSourceMutation,
  useDeleteLeadSourceMutation,
  useBulkDeleteLeadSourcesMutation
} = leadSourceApi
