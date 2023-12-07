const getOrExecute = (target, ...args) => {
  return typeof target === 'function' ? target(...args) : target
}

export default getOrExecute
