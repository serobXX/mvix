import apiTags from 'constants/apiTags.js'
import { createAppApi } from '../api.js'
import {
  injectGetApiMiddleware,
  injectLazyGetApiMiddleware,
  parsedToPutData
} from 'utils/apiUtils.js'

export const ticketApi = createAppApi('ticketReducer', {
  endpoints: builder => ({
    getTickets: builder.query({
      query: params => ({
        url: 'assist/ticket',
        method: 'GET',
        params
      })
    }),
    addTicket: builder.mutation({
      query: body => ({
        url: `/assist/ticket`,
        method: 'POST',
        body
      })
    }),

    getTicketById: builder.query({
      query: id => `assist/ticket/${id}`,
      providesTags: [apiTags.ticket]
    }),
    updateTicket: builder.mutation({
      query: ({ id, data }) => ({
        url: `/assist/ticket/${id}`,
        method: 'PUT',
        body: parsedToPutData(data)
      })
    }),

    deleteTicket: builder.mutation({
      query: id => ({
        url: `assist/ticket/${id}`,
        method: 'DELETE'
      })
    }),
    bulkDeleteTickets: builder.mutation({
      query: ({ ids }) => ({
        url: `/assist/ticket/bulk`,
        method: 'DELETE',
        params: {
          ids: ids.join(',')
        }
      })
    }),
    bulkUpdateTickets: builder.mutation({
      query: ({ ids, data }) => ({
        url: `assist/ticket/bulk`,
        method: 'PUT',
        params: {
          ids: ids.join(',')
        },
        body: data
      })
    }),
    restoreTicket: builder.mutation({
      query: id => ({
        url: `/assist/ticket/${id}/restore`,
        method: 'POST'
      })
    })
  })
})

export const useGetTicketsQuery = injectGetApiMiddleware(
  ticketApi.useGetTicketsQuery
)
export const useLazyGetTicketsQuery = injectLazyGetApiMiddleware(
  ticketApi.useLazyGetTicketsQuery
)

export const {
  useGetTicketByIdQuery,
  useAddTicketMutation,
  useLazyGetTicketByIdQuery,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
  useBulkDeleteTicketsMutation,
  useBulkUpdateTicketsMutation,
  useRestoreTicketMutation
} = ticketApi
