import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Login       from '../views/Login.vue'
import BoardList   from '../views/BoardList.vue'
import BoardDetail from '../views/BoardDetail.vue'
import BoardWrite  from '../views/BoardWrite.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/board' },
  { path: '/login',          name: 'Login',       component: Login,       meta: { guestOnly: true } },
  { path: '/board',          name: 'BoardList',   component: BoardList,   meta: { requiresAuth: true } },
  { path: '/board/write',    name: 'BoardWrite',  component: BoardWrite,  meta: { requiresAuth: true } },
  { path: '/board/:id',      name: 'BoardDetail', component: BoardDetail, meta: { requiresAuth: true } },
  { path: '/board/:id/edit', name: 'BoardEdit',   component: BoardWrite,  meta: { requiresAuth: true } }
]

const router = new VueRouter({ mode: 'history', base: process.env.BASE_URL, routes })

router.beforeEach((to, from, next) => {
  const loggedIn = store.getters['auth/isLoggedIn']
  if (to.meta.requiresAuth && !loggedIn) return next({ name: 'Login', query: { redirect: to.fullPath } })
  if (to.meta.guestOnly   && loggedIn)  return next({ name: 'BoardList' })
  next()
})

export default router
