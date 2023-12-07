import { createAppApi } from '../api.js'
import apiTags from 'constants/apiTags'
import {
  createSuccessInvalidator,
  injectGetApiMiddleware,
  injectLazyGetApiMiddleware
} from 'utils/apiUtils.js'

export const subjectLineApi = createAppApi(
  'subjectLineReducer',
  {
    endpoints: builder => ({
      getSubjectLines: builder.query({
        query: params => ({
          url: '/subject_line',
          method: 'GET',
          params
        }),
        providesTags: [apiTags.subjectLine]
      }),
      addSubjectLine: builder.mutation({
        query: body => ({
          url: `/subject_line`,
          method: 'POST',
          body
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.subjectLine])
      }),
      getSubjectLineById: builder.query({
        query: id => `/subject_line/${id}`
      }),
      updateSubjectLine: builder.mutation({
        query: ({ id, ...body }) => ({
          url: `/subject_line/${id}`,
          method: 'PUT',
          body
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.subjectLine])
      }),
      deleteSubjectLine: builder.mutation({
        query: id => ({
          url: `/subject_line/${id}`,
          method: 'DELETE'
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.subjectLine])
      }),
      bulkDeleteSubjectLine: builder.mutation({
        queryFn: async (ids, _queryApi, _extraOptions, fetchWithBQ) => {
          const result = await Promise.all(
            ids.map(id =>
              fetchWithBQ({
                url: `/subject_line/${id}`,
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
        invalidatesTags: createSuccessInvalidator([apiTags.subjectLine])
      })
    })
  },
  {
    tagTypes: [apiTags.subjectLine]
  }
)

export const useGetSubjectLinesQuery = injectGetApiMiddleware(
  subjectLineApi.useGetSubjectLinesQuery
)
export const useLazyGetSubjectLinesQuery = injectLazyGetApiMiddleware(
  subjectLineApi.useLazyGetSubjectLinesQuery
)

export const {
  useAddSubjectLineMutation,
  useGetSubjectLineByIdQuery,
  useLazyGetSubjectLineByIdQuery,
  useUpdateSubjectLineMutation,
  useDeleteSubjectLineMutation,
  useBulkDeleteSubjectLineMutation
} = subjectLineApi
