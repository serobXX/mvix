import { createAppApi } from '../api.js'
import apiTags from 'constants/apiTags'
import {
  createSuccessInvalidator,
  injectGetApiMiddleware,
  injectLazyGetApiMiddleware
} from 'utils/apiUtils.js'

export const solutionSetApi = createAppApi(
  'solutionSetReducer',
  {
    endpoints: builder => ({
      getSolutionSets: builder.query({
        query: params => ({
          url: '/solution_set',
          method: 'GET',
          params
        }),
        providesTags: [apiTags.solutionSet]
      }),
      addSolutionSet: builder.mutation({
        query: body => ({
          url: `/solution_set`,
          method: 'POST',
          body
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.solutionSet])
      }),
      getSolutionSetById: builder.query({
        query: id => `/solution_set/${id}`
      }),
      updateSolutionSet: builder.mutation({
        query: ({ id, data }) => ({
          url: `/solution_set/${id}`,
          method: 'PUT',
          body: data
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.solutionSet])
      }),
      deleteSolutionSet: builder.mutation({
        query: id => ({
          url: `/solution_set/${id}`,
          method: 'DELETE'
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.solutionSet])
      })
    })
  },
  {
    tagTypes: [apiTags.solutionSet]
  }
)

export const useGetSolutionSetsQuery = injectGetApiMiddleware(
  solutionSetApi.useGetSolutionSetsQuery
)
export const useLazyGetSolutionSetsQuery = injectLazyGetApiMiddleware(
  solutionSetApi.useLazyGetSolutionSetsQuery
)

export const {
  useAddSolutionSetMutation,
  useGetSolutionSetByIdQuery,
  useLazyGetSolutionSetByIdQuery,
  useUpdateSolutionSetMutation,
  useDeleteSolutionSetMutation
} = solutionSetApi
