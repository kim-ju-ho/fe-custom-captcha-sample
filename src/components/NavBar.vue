<template>
  <header class="navbar">
    <div class="navbar-inner">
      <router-link to="/board" class="nav-logo">📋 게시판</router-link>
      <nav class="nav-right">
        <span class="nav-user">👤 {{ user && user.username }}</span>
        <button class="btn-logout" @click="handleLogout">로그아웃</button>
      </nav>
    </div>
  </header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'NavBar',
  computed: { ...mapGetters('auth', ['user']) },
  methods: {
    ...mapActions('auth', ['logout']),
    handleLogout() { this.logout(); this.$router.push('/login') }
  }
}
</script>

<style scoped>
.navbar { background: #fff; border-bottom: 1px solid var(--gray-200); box-shadow: var(--shadow); position: sticky; top: 0; z-index: 100; }
.navbar-inner { max-width: 960px; margin: 0 auto; padding: 0 1.5rem; height: 56px; display: flex; align-items: center; justify-content: space-between; }
.nav-logo { font-size: 1.1rem; font-weight: 700; color: var(--primary); }
.nav-right { display: flex; align-items: center; gap: 1rem; }
.nav-user { font-size: 0.9rem; color: var(--gray-600); }
.btn-logout { padding: 0.35rem 0.8rem; background: none; border: 1.5px solid var(--gray-300); border-radius: 6px; font-size: 0.85rem; color: var(--gray-600); transition: all 0.2s; }
.btn-logout:hover { border-color: var(--danger); color: var(--danger); }
</style>
