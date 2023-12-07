//for react-custom-scrollbars
export default function handleBottomScroll(callback, pad = 50, updateCallback) {
  let bottomReached = true
  return (e = {}) => {
    const { scrollTop, scrollHeight, clientHeight } = e
    if ((scrollTop + pad) / (scrollHeight - clientHeight) > 1) {
      if (!bottomReached) {
        callback(e)
        bottomReached = true
      }
    } else {
      bottomReached = false
    }
    if (updateCallback) {
      updateCallback(e)
    }
  }
}
