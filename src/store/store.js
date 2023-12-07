import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { registeredApi } from 'api/index'
import appReducer from 'slices/appSlice'
import filterReducer from 'slices/filterSlice'
import fontReducer from 'slices/fontSlice'

export const store = configureStore({
  reducer: {
    ...registeredApi.reduce(
      (acc, api) => ({ ...acc, [api.reducerPath]: api.reducer }),
      {}
    ),
    app: appReducer,
    filter: filterReducer,
    font: fontReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(...registeredApi.map(api => api.middleware))
})

setupListeners(store.dispatch)
