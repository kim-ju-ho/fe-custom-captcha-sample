import api from './index'
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials)
}
