import axios from 'axios'

function renderCSSForSelector(css, selector) {
  return (css + '' || '')
    .replace(/\n|\t/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\s*\/\*.*?\*\/\s*/g, ' ')
    .replace(/(^|\})(.*?)(\{)/g, function ($0, $1, $2, $3) {
      const collector = [],
        parts = $2.split(',')
      for (let i in parts) {
        const p = parts[i].replace(/^\s*|\s*$/, '')
        if (!['@', ':', '}'].includes(p.trim().charAt(0)) && !!p.trim()) {
          collector.push(selector + ' ' + parts[i].replace(/^\s*|\s*$/, ''))
        } else if (p.trim().startsWith('}')) {
          const split = p.trim().split(' ')
          if (!['@', ':', '}'].includes(split[1].trim().charAt(0))) {
            collector.push(
              split[0] + ' ' + selector + ' ' + split.slice(1).join(' ')
            )
          } else {
            collector.push(p)
          }
        } else {
          collector.push(p)
        }
      }
      return $1 + ' ' + collector.join(', ') + ' ' + $3
    })
}

function applyCSSToElement(css, elementSelector, cssName) {
  const styleEle = document.createElement('style')
  styleEle.setAttribute('type', 'text/css')
  styleEle.setAttribute('data-name', cssName)
  styleEle.innerHTML = renderCSSForSelector(css, elementSelector)
  document.head.append(styleEle)
}

export function applyCSSFileToElement(
  cssUrl,
  elementSelector,
  cssName,
  callbackSuccess,
  callbackError
) {
  callbackSuccess = callbackSuccess || function () {}
  callbackError = callbackError || function () {}
  if (document.head.querySelector(`[data-name="${cssName}"]`)) {
    callbackSuccess()
  } else {
    axios({
      url: cssUrl,
      headers: {
        'Content-Type': 'text/css'
      }
    })
      .then(({ data }) => {
        applyCSSToElement(
          data.replaceAll(`@charset "UTF-8";`, ''),
          elementSelector,
          cssName
        )
        callbackSuccess()
      })
      .catch(() => {
        callbackError()
      })
  }
}
