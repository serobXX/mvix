import Color from 'color'

export const isDark = color => {
  if (!color) return color

  color = new Color(color)
  return color.isDark()
}

export const isLight = color => {
  if (!color) return color

  color = new Color(color)
  return color.isLight()
}
const getColorArrayFromRgb = (rgbString = 'rgb(255, 255, 255)') => {
  try {
    return Color(rgbString).rgb().array().slice(0, 3)
  } catch (e) {
    return [255, 255, 255]
  }
}

export const getLightenColorFromRgb = (rgbString, ratio = 0.2) => {
  const rgbArray = getColorArrayFromRgb(rgbString)
  return Color(rgbArray).lighten(ratio).string()
}

export const getDarkenColorFromRgb = (rgbString, ratio = 0.2) => {
  const rgbArray = getColorArrayFromRgb(rgbString)
  return Color(rgbArray).darken(ratio).string()
}

export const getRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}
