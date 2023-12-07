import { createAppApi } from '../../api.js'
import apiTags from 'constants/apiTags'
import {
  createSuccessInvalidator,
  injectGetApiMiddleware,
  injectLazyGetApiMiddleware
} from 'utils/apiUtils.js'

export const industryApi = createAppApi(
  'leadIndustryReducer',
  {
    endpoints: builder => ({
      getIndustries: builder.query({
        query: params => ({
          url: '/industry',
          method: 'GET',
          params
        }),
        providesTags: [apiTags.leadIndustry]
      }),
      addIndustry: builder.mutation({
        query: body => ({
          url: `/industry`,
          method: 'POST',
          body
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.leadIndustry])
      }),
      getIndustryById: builder.query({
        query: id => `/industry/${id}`
      }),
      updateIndustry: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/industry/${id}`,
          method: 'PUT',
          body
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.leadIndustry])
      }),
      deleteIndustry: builder.mutation({
        query: id => ({
          url: `/industry/${id}`,
          method: 'DELETE'
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.leadIndustry])
      }),
      bulkDeleteIndustries: builder.mutation({
        queryFn: async (ids, _queryApi, _extraOptions, fetchWithBQ) => {
          const result = await Promise.all(
            ids.map(id =>
              fetchWithBQ({
                url: `/industry/${id}`,
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
        invalidatesTags: createSuccessInvalidator([apiTags.leadIndustry])
      })
    })
  },
  {
    tagTypes: [apiTags.leadIndustry]
  }
)

export const useGetIndustriesQuery = injectGetApiMiddleware(
  industryApi.useGetIndustriesQuery
)
export const useLazyGetIndustriesQuery = injectLazyGetApiMiddleware(
  industryApi.useLazyGetIndustriesQuery
)

export const {
  useAddIndustryMutation,
  useGetIndustryByIdQuery,
  useLazyGetIndustryByIdQuery,
  useUpdateIndustryMutation,
  useDeleteIndustryMutation,
  useBulkDeleteIndustriesMutation
} = industryApi
