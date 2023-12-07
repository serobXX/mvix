import { createAppApi } from '../../api.js'
import apiTags from 'constants/apiTags'
import {
  createSuccessInvalidator,
  injectGetApiMiddleware,
  injectLazyGetApiMiddleware
} from 'utils/apiUtils.js'

export const leadTypeApi = createAppApi(
  'leadTypeReducer',
  {
    endpoints: builder => ({
      getLeadTypes: builder.query({
        query: params => ({
          url: '/leadType',
          method: 'GET',
          params
        }),
        providesTags: [apiTags.leadType]
      }),
      addLeadType: builder.mutation({
        query: body => ({
          url: `/leadType`,
          method: 'POST',
          body
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.leadType])
      }),
      getLeadTypeById: builder.query({
        query: id => `/leadType/${id}`
      }),
      updateLeadType: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/leadType/${id}`,
          method: 'PUT',
          body
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.leadType])
      }),
      deleteLeadType: builder.mutation({
        query: id => ({
          url: `/leadType/${id}`,
          method: 'DELETE'
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.leadType])
      }),
      bulkDeleteLeadTypes: builder.mutation({
        queryFn: async (ids, _queryApi, _extraOptions, fetchWithBQ) => {
          const result = await Promise.all(
            ids.map(id =>
              fetchWithBQ({
                url: `/leadType/${id}`,
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
        invalidatesTags: createSuccessInvalidator([apiTags.leadType])
      })
    })
  },
  {
    tagTypes: [apiTags.leadType]
  }
)

export const useGetLeadTypesQuery = injectGetApiMiddleware(
  leadTypeApi.useGetLeadTypesQuery
)
export const useLazyGetLeadTypesQuery = injectLazyGetApiMiddleware(
  leadTypeApi.useLazyGetLeadTypesQuery
)

export const {
  useAddLeadTypeMutation,
  useGetLeadTypeByIdQuery,
  useLazyGetLeadTypeByIdQuery,
  useUpdateLeadTypeMutation,
  useDeleteLeadTypeMutation,
  useBulkDeleteLeadTypesMutation
} = leadTypeApi
