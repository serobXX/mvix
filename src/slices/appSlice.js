import { createSlice } from '@reduxjs/toolkit'
import update from 'immutability-helper'

import { buildGlobalResetReducer } from 'utils/storeUtils'
import { themeTypes } from 'constants/ui'

const initialState = {
  isConfirmationRequired: false,
  isAuthorized: false,
  theme: themeTypes.light,
  openedTooltips: [],
  storedOptions: {},
  profileOpened: false
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setConfirmationRequired: (state, action) => {
      state.isConfirmationRequired = action.payload
    },
    setAuthorized: (state, action) => {
      state.isAuthorized = action.payload
    },
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    addOpenedTooltip: (state, action) => {
      if (!state.openedTooltips.includes(action.payload)) {
        state.openedTooltips.push(action.payload)
      }
    },
    removeOpenedTooltip: (state, action) => {
      state.openedTooltips = state.openedTooltips.filter(
        id => id !== action.payload
      )
    },
    setStoredOptions: (state, action) => {
      return update(state, {
        storedOptions: { $merge: action.payload }
      })
    },
    setProfileOpened: (state, action) => {
      return update(state, {
        profileOpened: { $set: action.payload }
      })
    }
  },
  extraReducers: builder => buildGlobalResetReducer(builder, initialState)
})

export const {
  setConfirmationRequired,
  setAuthorized,
  setTheme,
  addOpenedTooltip,
  removeOpenedTooltip,
  setStoredOptions,
  setProfileOpened
} = appSlice.actions

export default appSlice.reducer
