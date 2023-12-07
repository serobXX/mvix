import { createAppApi } from '../api.js'
import apiTags from 'constants/apiTags'
import {
  createSuccessInvalidator,
  injectGetApiMiddleware,
  injectLazyGetApiMiddleware
} from 'utils/apiUtils.js'

export const opportunityStageApi = createAppApi(
  'opportunityStageReducer',
  {
    endpoints: builder => ({
      getStages: builder.query({
        query: params => ({
          url: '/stage',
          method: 'GET',
          params
        }),
        providesTags: [apiTags.opportunityStage]
      }),
      addStage: builder.mutation({
        query: body => ({
          url: `/stage`,
          method: 'POST',
          body
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.opportunityStage])
      }),
      getStageById: builder.query({
        query: id => `/stage/${id}`
      }),
      updateStage: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/stage/${id}`,
          method: 'PUT',
          body
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.opportunityStage])
      }),
      deleteStage: builder.mutation({
        query: id => ({
          url: `/stage/${id}`,
          method: 'DELETE'
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.opportunityStage])
      }),
      bulkDeleteStages: builder.mutation({
        queryFn: async (ids, _queryApi, _extraOptions, fetchWithBQ) => {
          const result = await Promise.all(
            ids.map(id =>
              fetchWithBQ({
                url: `/stage/${id}`,
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
        invalidatesTags: createSuccessInvalidator([apiTags.opportunityStage])
      })
    })
  },
  {
    tagTypes: [apiTags.opportunityStage]
  }
)

export const useGetStagesQuery = injectGetApiMiddleware(
  opportunityStageApi.useGetStagesQuery
)
export const useLazyGetStagesQuery = injectLazyGetApiMiddleware(
  opportunityStageApi.useLazyGetStagesQuery
)

export const {
  useAddStageMutation,
  useGetStageByIdQuery,
  useLazyGetStageByIdQuery,
  useUpdateStageMutation,
  useDeleteStageMutation,
  useBulkDeleteStagesMutation
} = opportunityStageApi
