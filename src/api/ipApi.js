import { createAppApi } from '../api.js'
import { config } from 'constants/app'

export const ipApi = createAppApi('ipReducer', {
  endpoints: builder => ({
    getIp: builder.query({
      query: () => ({
        url: config.IP_API_URL,
        params: {
          format: 'json'
        }
      })
    })
  })
})

export const { useGetIpQuery } = ipApi
