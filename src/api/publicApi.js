import { createAppApi } from '../api.js'

export const publicApi = createAppApi(
  'publicReducer',
  {
    endpoints: builder => ({
      createPublicToken: builder.mutation({
        query: data => ({
          url: '/public',
          method: 'POST',
          body: data
        })
      }),
      getPublicProposal: builder.query({
        query: token => ({
          url: '/public/proposal/general',
          method: 'GET',
          params: {
            token,
            entity: 'Proposal'
          },
          headers: {
            noAuth: true
          }
        })
      }),
      getPublicInvoice: builder.query({
        query: token => ({
          url: '/public/invoice/general',
          method: 'GET',
          params: {
            token,
            entity: 'Invoice'
          },
          headers: {
            noAuth: true
          }
        })
      }),
      acceptPublicEntity: builder.mutation({
        query: data => ({
          url: '/public/accept',
          method: 'POST',
          body: data,
          headers: {
            noAuth: true
          }
        })
      }),
      requestChangesPublicEntity: builder.mutation({
        query: data => ({
          url: '/public/requestChanges',
          method: 'POST',
          body: data,
          headers: {
            noAuth: true
          }
        })
      }),
      getInvoiceStripeSecret: builder.query({
        query: id => ({
          url: `/invoice/${id}/stripe`,
          method: 'GET',
          headers: {
            noAuth: true
          }
        })
      }),
      createInvoiceAuthorizeNet: builder.mutation({
        query: ({ id, data }) => ({
          url: `/invoice/${id}/authorize_net`,
          method: 'POST',
          headers: {
            noAuth: true
          },
          body: data
        })
      })
    })
  },
  {
    tagTypes: []
  }
)

export const {
  useGetPublicProposalQuery,
  useLazyGetPublicProposalQuery,
  useGetPublicInvoiceQuery,
  useLazyGetPublicInvoiceQuery,
  useAcceptPublicEntityMutation,
  useRequestChangesPublicEntityMutation,
  useGetInvoiceStripeSecretQuery,
  useLazyGetInvoiceStripeSecretQuery,
  useCreatePublicTokenMutation,
  useCreateInvoiceAuthorizeNetMutation
} = publicApi
