import baseAxios from 'axios'
import { config } from 'constants/app'
import { getToken } from './storage'

let cancelTokenSource
const BaseAxiosInstance = baseAxios.create({
  baseURL: config.API_URL,
  responseType: 'json'
})

let requestPending = 0

BaseAxiosInstance.interceptors.request.use(req => {
  if (!req.silent) {
    requestPending++
  }
  //   if (requestPending === 1) {
  //     store.dispatch(setPendingStatus(true))
  //   }
  const headers = { ...req.headers }

  if (!headers.Authorization && getToken() && !headers.noAuth) {
    headers.Authorization = getToken()
  }

  let baseURL = req.baseURL

  return {
    ...req,
    headers,
    baseURL
  }
})

BaseAxiosInstance.interceptors.response.use(
  config => {
    requestPending = Math.max(0, --requestPending)
    // if (requestPending === 0) store.dispatch(setPendingStatus(false))

    return config
  },
  err => {
    requestPending = Math.max(0, --requestPending)
    // if (requestPending === 0) store.dispatch(setPendingStatus(false))
    return Promise.reject(err)
  }
)

const Cache = {}
const GroupRequests = {}

export default function axios({ useCache, useGroup, ...params }) {
  const cancelable = params?.params?.cancelable || false

  if (cancelable && cancelTokenSource) {
    cancelTokenSource.cancel('Operation canceled due to new request.')
  }

  if (cancelable) {
    delete params.params.cancelable
    const source = baseAxios.CancelToken.source()
    cancelTokenSource = source
    params.cancelToken = source.token
  }

  return new Promise((resolve, reject) => {
    const cacheKey = JSON.stringify(params)

    const handleSuccess = res => {
      if (useCache) {
        Cache[cacheKey] = res
      }
      resolve(res)
    }

    const handleError = error => {
      if (baseAxios.isCancel(error)) {
        return
      }
      reject(error)
    }

    if (useCache && cacheKey in Cache) {
      return resolve(Cache[cacheKey])
    }

    if (useGroup && cacheKey in GroupRequests) {
      GroupRequests[cacheKey].then(handleSuccess).catch(handleError)
      return
    }

    if (useGroup) {
      GroupRequests[cacheKey] = BaseAxiosInstance(params)
      GroupRequests[cacheKey]
        .then(handleSuccess)
        .catch(handleError)
        .finally(() => {
          delete GroupRequests[cacheKey]
        })
      return
    }

    BaseAxiosInstance(params).then(handleSuccess).catch(handleError)
  })
}
