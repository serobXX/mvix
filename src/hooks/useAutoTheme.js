import { useEffect, useMemo } from 'react'
import update from 'immutability-helper'
import { createTheme } from '@material-ui/core'

import { themeTypes } from 'constants/ui'
import localStorageItems from 'constants/localStorageItems'
import theme from '../theme'
import { useDispatch, useSelector } from 'react-redux'
import { themeSelector } from '../selectors/appSelectors'
import { setTheme } from 'slices/appSlice'
import { useLocation } from 'react-router-dom'

export default function useAutoTheme() {
  const dispatch = useDispatch()
  const location = useLocation()

  const themeType = useSelector(themeSelector)
  const currentHour = new Date().getHours()

  useEffect(() => {
    const loadedThemeType = localStorage.getItem(localStorageItems.theme)

    if (
      loadedThemeType &&
      theme !== loadedThemeType &&
      Object.values(themeTypes).includes(loadedThemeType)
    ) {
      dispatch(setTheme(loadedThemeType))
    }
    //eslint-disable-next-line
  }, [])

  return useMemo(() => {
    if (location?.pathname && location.pathname.includes('public-page')) {
      return createTheme(update(theme, { type: { $set: themeTypes.light } }))
    }
    if (themeType === themeTypes.auto) {
      return createTheme(
        update(theme, {
          type: {
            $set:
              currentHour >= 7 && currentHour < 19
                ? themeTypes.light
                : themeTypes.dark
          }
        })
      )
    }
    return createTheme(update(theme, { type: { $set: themeType } }))
  }, [currentHour, themeType, location?.pathname])
}
