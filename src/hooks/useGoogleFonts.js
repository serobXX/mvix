import { useCallback, useMemo } from 'react'

import { useGetGoogleFontsQuery } from 'api/fontApi'
import { combineFontName, getFontDescriptors } from 'utils/fontUtils'
import { _uniq } from 'utils/lodash'
import { useDispatch, useSelector } from 'react-redux'
import { loadedFontSelector } from 'selectors/fontSelectors'
import { addLoadedFont } from 'slices/fontSlice'

function getFirstFontFamily(declaration) {
  return declaration.split(',')[0].replace(/['"]+/g, '').trim()
}
const isFireFox = navigator.userAgent.includes('Firefox')

const useGoogleFonts = () => {
  const dispatch = useDispatch()
  const { data: fonts, isFetching } = useGetGoogleFontsQuery()
  const loadedFonts = useSelector(loadedFontSelector)

  const isLoaded = useCallback(
    combinedFontName => {
      return loadedFonts.includes(combinedFontName)
    },
    [loadedFonts]
  )

  const loadGoogleFont = useCallback(
    fontFamily => {
      const googleFont = fonts?.items
        ? fonts.items.find(font => {
            return font.family === fontFamily
          })
        : false

      if (googleFont) {
        const { variants, family, files } = googleFont
        variants.forEach(variant => {
          if (!isLoaded(combineFontName(family, variant))) {
            new FontFace(
              isFireFox ? `"${family}"` : family,
              `url(${files[variant]})`,
              getFontDescriptors(variant)
            )
              .load()
              .then(fontFace => {
                document.fonts.add(fontFace)
              })
              .catch(() => {})
              .finally(() => {
                dispatch(addLoadedFont(combineFontName(family, variant)))
              })
          }
        })
      }
    },
    [fonts, dispatch, isLoaded]
  )

  const loadFonts = useCallback(
    _fonts => {
      _uniq(_fonts).forEach(font => {
        const fontFamily = getFirstFontFamily(font)
        loadGoogleFont(fontFamily)
      })
    },
    [loadGoogleFont]
  )

  return useMemo(
    () => ({
      data: fonts?.items || [],
      isFetching,
      loadFonts
    }),
    [fonts, isFetching, loadFonts]
  )
}

export default useGoogleFonts
