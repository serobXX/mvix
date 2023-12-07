import { createAppApi } from '../api.js'
import apiTags from 'constants/apiTags'
import {
  createSuccessInvalidator,
  injectGetApiMiddleware,
  injectLazyGetApiMiddleware,
  parsedToPutData
} from 'utils/apiUtils.js'

export const invoiceApi = createAppApi(
  'invoiceReducer',
  {
    endpoints: builder => ({
      getInvoices: builder.query({
        query: params => ({
          url: '/invoice',
          method: 'GET',
          params
        }),
        providesTags: [apiTags.invoice]
      }),
      addInvoice: builder.mutation({
        query: body => ({
          url: `/invoice`,
          method: 'POST',
          body
        })
      }),
      getInvoiceById: builder.query({
        query: id => `/invoice/${id}`,
        providesTags: [apiTags.invoice, apiTags.invoiceAttachment]
      }),
      updateInvoice: builder.mutation({
        query: ({ id, data }) => ({
          url: `/invoice/${id}`,
          method: 'POST',
          body: parsedToPutData(data)
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.invoice])
      }),
      deleteInvoice: builder.mutation({
        query: id => ({
          url: `/invoice/${id}`,
          method: 'DELETE'
        })
      }),
      addAttachment: builder.mutation({
        query: ({ parentId, data }) => ({
          url: `/invoice/${parentId}/attachment`,
          method: 'POST',
          body: data
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.invoiceAttachment])
      }),
      deleteAttachment: builder.mutation({
        query: ({ parentId, id }) => ({
          url: `/invoice/${parentId}/attachment/${id}`,
          method: 'DELETE'
        }),
        invalidatesTags: createSuccessInvalidator([apiTags.invoiceAttachment])
      }),
      sendInvoice: builder.mutation({
        query: id => ({
          url: `/invoice/${id}/send`,
          method: 'POST'
        })
      }),
      bulkUpdateInvoices: builder.mutation({
        query: ({ ids, data }) => ({
          url: `/invoice/bulk`,
          method: 'PUT',
          params: {
            ids: ids.join(',')
          },
          body: data
        })
      })
    })
  },
  {
    tagTypes: [apiTags.invoice, apiTags.invoiceAttachment]
  }
)

export const useGetInvoicesQuery = injectGetApiMiddleware(
  invoiceApi.useGetInvoicesQuery
)
export const useLazyGetInvoicesQuery = injectLazyGetApiMiddleware(
  invoiceApi.useLazyGetInvoicesQuery
)

export const {
  useGetInvoiceByIdQuery,
  useLazyGetInvoiceByIdQuery,
  useAddInvoiceMutation,
  useUpdateInvoiceMutation,
  useDeleteInvoiceMutation,
  useAddAttachmentMutation,
  useDeleteAttachmentMutation,
  useSendInvoiceMutation,
  useBulkUpdateInvoicesMutation
} = invoiceApi
