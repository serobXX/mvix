import { createAppApi } from '../../api.js'
import apiTags from 'constants/apiTags'
import {
  createSuccessInvalidator,
  injectGetApiMiddleware,
  injectLazyGetApiMiddleware
} from 'utils/apiUtils.js'

export const solutionApi = createAppApi(
  'solutionReducer',
  {
    endpoints: builder => ({
      getSolutions: builder.query({
        query: params => ({
          url: '/solution',
          method: 'GET',
          params
        }),
        providesTags: [apiTags.leadSolution]
      }),
      addSolution: builder.mutation({
        query: body => ({
          url: `/solution`,
          method: 'POST',
          body
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.leadSolution])
      }),
      getSolutionById: builder.query({
        query: id => `/solution/${id}`
      }),
      updateSolution: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/solution/${id}`,
          method: 'PUT',
          body
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.leadSolution])
      }),
      deleteSolution: builder.mutation({
        query: id => ({
          url: `/solution/${id}`,
          method: 'DELETE'
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.leadSolution])
      }),
      bulkDeleteSolutions: builder.mutation({
        queryFn: async (ids, _queryApi, _extraOptions, fetchWithBQ) => {
          const result = await Promise.all(
            ids.map(id =>
              fetchWithBQ({
                url: `/solution/${id}`,
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
        invalidatesTags: createSuccessInvalidator([apiTags.leadSolution])
      })
    })
  },
  {
    tagTypes: [apiTags.leadSolution]
  }
)

export const useGetSolutionsQuery = injectGetApiMiddleware(
  solutionApi.useGetSolutionsQuery
)
export const useLazyGetSolutionsQuery = injectLazyGetApiMiddleware(
  solutionApi.useLazyGetSolutionsQuery
)

export const {
  useAddSolutionMutation,
  useGetSolutionByIdQuery,
  useLazyGetSolutionByIdQuery,
  useUpdateSolutionMutation,
  useDeleteSolutionMutation,
  useBulkDeleteSolutionsMutation
} = solutionApi
