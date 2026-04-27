import { authAPI } from '../../api/auth'
const TOKEN_KEY = 'access_token'
const USER_KEY  = 'user_info'

export default {
  namespaced: true,
  state: () => ({
    token: localStorage.getItem(TOKEN_KEY) || null,
    user:  JSON.parse(localStorage.getItem(USER_KEY)) || null
  }),
  getters: {
    token:     s => s.token,
    user:      s => s.user,
    isLoggedIn: s => !!s.token
  },
  mutations: {
    SET_TOKEN(s, t) { s.token = t; t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY) },
    SET_USER(s, u)  { s.user  = u; u ? localStorage.setItem(USER_KEY, JSON.stringify(u)) : localStorage.removeItem(USER_KEY) }
  },
  actions: {
    async login({ commit }, credentials) {
      const { data } = await authAPI.login(credentials)
      commit('SET_TOKEN', data.token)
      commit('SET_USER', data.user)
      return data
    },
    logout({ commit }) {
      commit('SET_TOKEN', null)
      commit('SET_USER', null)
    }
  }
}
