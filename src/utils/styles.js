export function marginBottom(variant, spacing) {
  return {
    marginBottom: spacing(variant)
  }
}

export function paddingVert(variant, spacing) {
  return {
    paddingTop: spacing(variant),
    paddingBottom: spacing(variant)
  }
}

export function paddingHor(variant, spacing) {
  return {
    paddingLeft: spacing(variant),
    paddingRight: spacing(variant)
  }
}

export function height(variant) {
  return {
    height: variant
  }
}

export function paddingTop(variant, spacing) {
  return {
    paddingTop: spacing(variant)
  }
}

export function paddingBottom(variant, spacing) {
  return {
    paddingBottom: spacing(variant)
  }
}

export function paddingLeft(variant, spacing) {
  return {
    paddingLeft: spacing(variant)
  }
}

export function paddingRight(variant, spacing) {
  return {
    paddingRight: spacing(variant)
  }
}

export function position(variant) {
  return {
    position: variant
  }
}

export function wordBreak(variant) {
  return {
    wordBreak: variant
  }
}

export function border(variant, color) {
  return {
    borderWidth: variant,
    borderColor: color,
    borderStyle: 'solid'
  }
}

export function borderBottom(variant, color) {
  return {
    borderBottomWidth: variant,
    borderBottomColor: color,
    borderBottomStyle: 'solid'
  }
}

export function borderTop(variant, color) {
  return {
    borderTopWidth: variant,
    borderTopColor: color,
    borderTopStyle: 'solid'
  }
}

export function borderLeft(variant, color) {
  return {
    borderLeftWidth: variant,
    borderLeftColor: color,
    borderLeftStyle: 'solid'
  }
}

export function borderRight(variant, color) {
  return {
    borderRightWidth: variant,
    borderRightColor: color,
    borderRightStyle: 'solid'
  }
}

export function background(variant) {
  return {
    backgroundColor: variant
  }
}

export function fontSize(variant) {
  return {
    fontSize: variant
  }
}

export function color(variant) {
  return {
    color: variant
  }
}

export function whiteSpace(variant) {
  return {
    whiteSpace: variant
  }
}

export function flexGrow(variant) {
  return {
    flexGrow: variant
  }
}

export const paddingLeftClasses = spacing => ({
  'padding-left-0': paddingLeft(0, spacing),
  'padding-left-1': paddingLeft(1, spacing),
  'padding-left-1.5': paddingLeft(1.5, spacing),
  'padding-left-2': paddingLeft(2, spacing),
  'padding-left-3': paddingLeft(3, spacing),
  'padding-left-4': paddingLeft(4, spacing),
  'padding-left-4.5': paddingLeft(4.5, spacing),
  'padding-left-5': paddingLeft(5, spacing)
})

export const paddingRightClasses = spacing => ({
  'padding-right-0': paddingRight(0, spacing),
  'padding-right-1': paddingRight(1, spacing),
  'padding-right-1.5': paddingRight(1.5, spacing),
  'padding-right-2': paddingRight(2, spacing),
  'padding-right-3': paddingRight(3, spacing),
  'padding-right-4': paddingRight(4, spacing),
  'padding-right-4.5': paddingRight(4.5, spacing),
  'padding-right-5': paddingRight(5, spacing)
})
