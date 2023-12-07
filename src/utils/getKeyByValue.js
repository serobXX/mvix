const getKeyByValue = (object, value, objs) => {
  if (!objs) objs = []

  for (const prop in object) {
    if (object.hasOwnProperty(prop)) {
      if (object[prop] === value) {
        return prop
      } else if (
        typeof object[prop] === 'object' &&
        objs.indexOf(object[prop]) === -1
      ) {
        objs.push(object[prop])
        const res = getKeyByValue(object[prop], value, objs)
        if (res) return prop + '.' + res
      }
    }
  }
}

export { getKeyByValue }
