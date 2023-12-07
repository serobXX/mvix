import { defaultTag } from 'constants/chipsColorPalette'
import { _isArray } from './lodash'

export const tagToChipObj = tagData => {
  const { tag, title, id, textColor, backgroundColor } = tagData

  return {
    label: tag || title || '',
    value: id,
    color: textColor || defaultTag.textColor,
    background: backgroundColor || defaultTag.backgroundColor,
    border: backgroundColor || defaultTag.backgroundColor
  }
}

export const convertInput = input => (_isArray(input) ? input : [input])

export const convertArr = (arr, converter) =>
  arr ? convertInput(arr).map(converter) : []

export const fromChipObj = obj => ({ id: obj.value })

export const chipObjToTag = tagData => {
  const { label, value, color, background } = tagData

  return {
    tag: label,
    id: value,
    textColor: color,
    backgroundColor: background
  }
}
