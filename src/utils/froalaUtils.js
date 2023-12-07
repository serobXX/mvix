export function beforeUploadImage(files, arg1, arg2) {
  const editor = this
  if (files.length) {
    if (files[0].size / 1000 > 255) {
      alert('Image file size exceeded the limit')
      return false
    } else {
      const reader = new FileReader()
      reader.onload = e => {
        const result = e.target.result
        editor.image.insert(result, null, null, editor.image.get())
      }
      reader.readAsDataURL(files[0])
    }
  }
  editor.popups.hideAll()
  return false
}

export const getPageColor = html => {
  const doc = new DOMParser().parseFromString(`${html}`, 'text/html')
  const colorElement = doc.body.querySelector('#page-color')
  if (colorElement) {
    return colorElement.getAttribute('data-color') || '#FFFFFF'
  }
  return '#FFFFFF'
}

export const getDeleteEstimateIcon = () =>
  document.querySelector('.delete-estimate-icon')

export const getDeleteProductItemIcon = () =>
  document.querySelector('.delete-product-item-icon')

export const parseLinkToAction = link => `@${link}`

export const getLinkActionSelectors = (callback = f => f) => {
  const selectors = document.querySelectorAll(`a`)
  selectors.forEach(selector => {
    if (
      selector.getAttribute('href').startsWith('@') ||
      selector.getAttribute('href').startsWith('http://@') ||
      selector.getAttribute('href').startsWith('https://@')
    ) {
      callback(selector)
    }
  })
}
