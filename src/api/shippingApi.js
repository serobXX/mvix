import { createAppApi } from '../api.js'

export const shippingApi = createAppApi('shippingReducer', {
  endpoints: builder => ({
    calculateShipping: builder.mutation({
      query: body => ({
        url: `/shipping/calculate`,
        method: 'POST',
        body
      })
    }),
    addLabel: builder.mutation({
      query: body => ({
        url: `/shipping/label`,
        method: 'POST',
        body
      })
    }),
    getShippingGroupById: builder.query({
      query: id => ({
        url: `shipping_group/${id}`,
        method: 'GET'
      })
    }),
    updateShippingGroup: builder.mutation({
      query: ({ id, data }) => ({
        url: `shipping_group/${id}`,
        method: 'POST',
        body: data
      })
    })
  })
})

export const {
  useCalculateShippingMutation,
  useAddLabelMutation,
  useUpdateShippingGroupMutation,
  useGetShippingGroupByIdQuery
} = shippingApi
