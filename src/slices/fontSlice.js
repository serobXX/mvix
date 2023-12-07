import { createSlice } from '@reduxjs/toolkit'
import update from 'immutability-helper'

import { buildGlobalResetReducer } from 'utils/storeUtils'

const initialState = {
  loadedFont: []
}

export const fontSlice = createSlice({
  name: 'font',
  initialState,
  reducers: {
    addLoadedFont: (state, action) => {
      return update(state, {
        loadedFont: { $push: [action.payload] }
      })
    },
    resetLoadedFont: state => {
      return update(state, {
        loadedFont: []
      })
    }
  },
  extraReducers: builder => buildGlobalResetReducer(builder, initialState)
})

export const { addLoadedFont, resetLoadedFont } = fontSlice.actions

export default fontSlice.reducer
