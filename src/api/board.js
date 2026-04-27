import api from './index'
export const boardAPI = {
  getList:   (params = {}) => api.get('/api/board', { params }),
  getDetail: (id)           => api.get('/api/board/' + id),
  create:    (data)         => api.post('/api/board', data),
  update:    (id, data)     => api.put('/api/board/' + id, data),
  delete:    (id)           => api.delete('/api/board/' + id)
}
