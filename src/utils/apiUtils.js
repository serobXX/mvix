const emptyArr = []
export const parseGetData = _data => {
  if (!_data) return {}
  const { data, ...rest } = _data
  let extra = {
    data
  }
  if (data && data.meta) {
    extra = data
  } else if (!data) {
    extra = {
      data: emptyArr
    }
  }
  return {
    ...rest,
    ...extra
  }
}

export const injectGetApiMiddleware =
  useHook =>
  (...args) => {
    const reducer = useHook(...args)
    return parseGetData(reducer)
  }

export const injectLazyGetApiMiddleware =
  useHook =>
  (...args) => {
    const [trigger, reducer] = useHook(...args)
    return [trigger, parseGetData(reducer)]
  }

export const createSuccessInvalidator = tags => (response, error) =>
  !error && tags

export const parsedToPutData = data => {
  if (data instanceof FormData) {
    data.append('_method', 'PUT')
    return data
  }

  return {
    _method: 'PUT',
    ...data
  }
}

export const convertToFormData = data => {
  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      if (typeof value[0] === 'object') {
        value.forEach(val => {
          Object.entries(val).forEach(([objKey, objValue]) => {
            formData.append(`${key}[][${objKey}]`, objValue)
          })
        })
      } else {
        value.forEach(val => {
          formData.append(`${key}[]`, val)
        })
      }
    } else formData.append(key, value)
  })
  return formData
}

export const getInitiate = path => params => {
  return path.initiate(params, { forceRefetch: true })
}
