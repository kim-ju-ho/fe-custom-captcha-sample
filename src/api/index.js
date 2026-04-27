import axios from 'axios'
import store from '../store'
import router from '../router'

const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || '/',
  timeout: 10000,
  withCredentials: true
})

api.interceptors.request.use(
  config => {
    const token = store.getters['auth/token']
    if (token) config.headers.Authorization = 'Bearer ' + token
    return config
  },
  error => Promise.reject(error)
)

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      store.dispatch('auth/logout')
      // 이미 /login이면 push 안 함 (NavigationDuplicated 방지)
      if (router.currentRoute.path !== '/login') {
        router.push('/login').catch(() => {})
      }
    }
    if (process.env.VUE_APP_ENV !== 'production') {
      console.error('[API Error]', error)
    }
    return Promise.reject(error)
  }
)

export default api
