export const getFontDescriptors = variant => {
  return {
    style: variant.includes('italic') ? 'italic' : 'normal',
    weight: parseInt(variant) || 400
  }
}

export const combineFontName = (fontFamily, variant) =>
  `${fontFamily}${variant}`
