import { createAppApi } from '../api.js'
import { config } from 'constants/app'

export const fontApi = createAppApi('fontReducer', {
  endpoints: builder => ({
    getGoogleFonts: builder.query({
      query: params => ({
        url: config.GOOGLE_FONTS_URL,
        params: {
          ...params,
          key: config.GOOGLE_API_KEY
        }
      })
    })
  })
})

export const { useGetGoogleFontsQuery, useLazyGetGoogleFontsQuery } = fontApi
