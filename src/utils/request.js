import axios from 'axios'
import store from '@/store'
import router from '@/router'

export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'
const instance = axios.create({
  baseURL,
  timeout: 5000
})

// config默认参数，后面return就是通过处理修改后的
instance.interceptors.request.use(config => {
  const { profile } = store.state.user
  if (profile.token) {
    config.headers.Authorization = `Bearer ${profile.token}`
  }
  return config
}, err => {
  return Promise.reject(err)
})

// res拿到的后台响应信息response，即拿到res的时候返回res.data
instance.interceptors.response.use(res => res.data, err => {
  if (err.response && err.response.status === 401) {
    store.commit('user/setUser', {})
    const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
    router.push('/login?redirUrl=' + fullPath)
  }
  return Promise.reject(err)
})

export default (url, method, submitData) => {
  return instance({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
