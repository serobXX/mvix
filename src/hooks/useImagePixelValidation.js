import { useEffect, useState } from 'react'

const useImagePixelValidation = ({
  files,
  url,
  setFieldError,
  path,
  isFetchAllowed,
  maxWidth = 2000,
  maxHeight = 2000
}) => {
  const [isValid, setValid] = useState(true)

  useEffect(() => {
    if (isFetchAllowed && files?.length) {
      const reader = new FileReader()
      setValid(false)
      reader.readAsDataURL(files[0])
      reader.onload = function (e) {
        const image = new Image()
        image.src = e.target.result
        image.onload = function () {
          const height = this.height
          const width = this.width
          if (height > maxHeight || width > maxWidth) {
            setFieldError(
              path,
              `Width and Height must not exceed ${maxWidth}px x ${maxHeight}px`
            )
            setValid(false)
            return false
          }
          setValid(true)
          return true
        }
      }
    }
    //eslint-disable-next-line
  }, [files])

  useEffect(() => {
    if (isFetchAllowed && typeof url === 'string' && url) {
      setValid(false)
      const image = new Image()
      image.src = url
      image.onload = function () {
        const height = this.height
        const width = this.width
        if (height > maxHeight || width > maxWidth) {
          setFieldError(
            path,
            `Width and Height must not exceed ${maxWidth}px x ${maxHeight}px`
          )
          setValid(false)
          return false
        }
        setValid(true)
        return true
      }
    }
    //eslint-disable-next-line
  }, [url])

  return isValid
}

export default useImagePixelValidation
