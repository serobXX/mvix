import { exceedWords } from 'constants/validationMessages'
import * as Yup from 'yup'

Yup.addMethod(Yup.string, 'maxWords', function maxWords(max, message) {
  return this.test(
    'maxWords',
    message
      ? typeof message === 'function'
        ? message({ max })
        : message
      : exceedWords('Field')({ max }),
    value => {
      if (!value) {
        return true
      }
      if (typeof value !== 'string') {
        return false
      }
      return value.trim().split(' ').length <= max
    }
  )
})

export default Yup
