import { useCallback } from 'react'

import useWindowDimensions from 'hooks/useWindowDimensions'
import { ADDITIONAL_SIZE } from 'constants/previewModal'

const portraitMultiplier = 16 / 9
const landscapeMultiplier = 9 / 16

const usePreviewModalFeatures = () => {
  const windowDimensions = useWindowDimensions()

  const getNewDimensions = useCallback(
    (dimensions, orientChangeAllowed = false) => {
      const { width: windowWidth, height: windowHeight } = windowDimensions

      if (dimensions.width > windowWidth || dimensions.height > windowHeight) {
        let width = dimensions.width
        let height = dimensions.height
        const { width: windowWidth, height: windowHeight } = windowDimensions
        let multiplier = landscapeMultiplier
        if (orientChangeAllowed && height > width) {
          multiplier = portraitMultiplier
        }
        const containerWidth = (windowWidth * 90) / 100
        const innerFrameWidth = containerWidth - ADDITIONAL_SIZE
        const innerFrameHeight = innerFrameWidth * multiplier

        width = containerWidth
        height = innerFrameHeight + ADDITIONAL_SIZE

        if (height + 20 > windowHeight) {
          const reducedHeight = (windowHeight * 80) / 100
          height = reducedHeight
          const newInnerFrameHeight = reducedHeight - ADDITIONAL_SIZE
          const newInnerFrameWidth = newInnerFrameHeight / multiplier
          width = newInnerFrameWidth + ADDITIONAL_SIZE
        }

        return { width, height }
      }

      return dimensions
    },
    [windowDimensions]
  )

  return {
    getNewDimensions
  }
}

export default usePreviewModalFeatures
