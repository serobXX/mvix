import { colorPalette, defaultTag } from 'constants/chipsColorPalette'

const paletteBackgroundToTextColor = colorPalette.reduce(
  (acc, { base, light }) => ({ ...acc, [base]: light }),
  {}
)

const getTextColor = ({ textColor, backgroundColor }) => {
  if (!textColor) {
    return paletteBackgroundToTextColor[backgroundColor] || defaultTag.textColor
  }
  return textColor
}

export const prepareTagData = (data = {}) => {
  const { tag, backgroundColor, entityType } = data

  return {
    tag,
    textColor: getTextColor(data),
    backgroundColor,
    entityType
  }
}
