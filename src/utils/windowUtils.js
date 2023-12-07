import { _capitalize } from './lodash'

const LibraryList = []
const otherList = {}
function parsePathname(pathname) {
  return pathname
    .replace('-library', '')
    .slice(1)
    .split('/')
    .slice(0, 1)[0]
    .split('-')
    .map(_capitalize)
    .join(' ')
}

function joinTitle(name, title) {
  return `${name} | ${title}`
}

export const setTitle = (pathname, windowTitle) => {
  try {
    if (LibraryList.includes(parsePathname(pathname))) {
      document.title = joinTitle(
        parsePathname(pathname) + ' Library',
        windowTitle
      )
    } else if (Object.keys(otherList).includes(parsePathname(pathname))) {
      document.title = joinTitle(
        otherList[parsePathname(pathname)],
        windowTitle
      )
    } else {
      document.title = joinTitle(parsePathname(pathname), windowTitle)
    }
  } catch (err) {
    console.error(err)
  }
}
