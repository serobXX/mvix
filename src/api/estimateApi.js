import { createAppApi } from '../api.js'
import apiTags from 'constants/apiTags'
import {
  createSuccessInvalidator,
  injectGetApiMiddleware,
  injectLazyGetApiMiddleware,
  parsedToPutData
} from 'utils/apiUtils.js'

export const estimateApi = createAppApi(
  'estimateReducer',
  {
    endpoints: builder => ({
      getEstimates: builder.query({
        query: params => ({
          url: '/estimate',
          method: 'GET',
          params
        })
      }),
      addEstimate: builder.mutation({
        query: body => ({
          url: `/estimate`,
          method: 'POST',
          body
        })
      }),
      getEstimateById: builder.query({
        query: id => `/estimate/${id}`,
        providesTags: [apiTags.estimate, apiTags.estimateAttachment]
      }),
      updateEstimate: builder.mutation({
        query: ({ id, data }) => ({
          url: `/estimate/${id}`,
          method: 'PUT',
          body: parsedToPutData(data)
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.estimate])
      }),
      deleteEstimate: builder.mutation({
        query: id => ({
          url: `/estimate/${id}`,
          method: 'DELETE'
        })
      }),
      bulkDeleteEstimates: builder.mutation({
        query: ({ ids }) => ({
          url: `/estimate/bulk`,
          method: 'DELETE',
          params: {
            ids: ids.join(',')
          }
        })
      }),
      bulkUpdateEstimates: builder.mutation({
        query: ({ ids, data }) => ({
          url: `/estimate/bulk`,
          method: 'PUT',
          params: {
            ids: ids.join(',')
          },
          body: data
        })
      }),
      addAttachment: builder.mutation({
        query: ({ parentId, data }) => ({
          url: `/estimate/${parentId}/attachment`,
          method: 'POST',
          body: data
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.estimateAttachment])
      }),
      deleteAttachment: builder.mutation({
        query: ({ parentId, id }) => ({
          url: `/estimate/${parentId}/attachment/${id}`,
          method: 'DELETE'
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.estimateAttachment])
      }),
      createPreview: builder.mutation({
        query: ({ id }) => ({
          url: `/estimate/${id}/preview`,
          method: 'POST'
        })
      }),
      createInvoice: builder.mutation({
        query: ({ id }) => ({
          url: `/estimate/${id}/invoice`,
          method: 'POST'
        })
      }),
      createPdf: builder.mutation({
        query: ({ id }) => ({
          url: `/estimate/${id}/pdf`,
          method: 'POST'
        })
      })
    })
  },
  {
    tagTypes: [apiTags.estimate, apiTags.estimateAttachment]
  }
)

export const useGetEstimatesQuery = injectGetApiMiddleware(
  estimateApi.useGetEstimatesQuery
)
export const useLazyGetEstimatesQuery = injectLazyGetApiMiddleware(
  estimateApi.useLazyGetEstimatesQuery
)

export const {
  useAddEstimateMutation,
  useGetEstimateByIdQuery,
  useLazyGetEstimateByIdQuery,
  useUpdateEstimateMutation,
  useDeleteEstimateMutation,
  useBulkDeleteEstimatesMutation,
  useBulkUpdateEstimatesMutation,
  useAddAttachmentMutation,
  useDeleteAttachmentMutation,
  useCreatePreviewMutation,
  useCreateInvoiceMutation,
  useCreatePdfMutation
} = estimateApi
