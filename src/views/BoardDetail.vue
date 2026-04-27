<template>
  <div>
    <NavBar />
    <div class="container">
      <div v-if="loading" class="state-box"><div class="spinner-lg"></div></div>
      <div v-else-if="error" class="state-box error">
        <p>{{ error }}</p>
        <router-link to="/board" class="btn-outline">목록으로</router-link>
      </div>
      <div v-else-if="post" class="detail-card">
        <div class="detail-header">
          <h2 class="detail-title">{{ post.title }}</h2>
          <div class="detail-meta">
            <span>👤 {{ post.author }}</span>
            <span>🕒 {{ formatDate(post.createdAt) }}</span>
          </div>
        </div>
        <div class="detail-body"><p>{{ post.content }}</p></div>
        <div class="detail-actions">
          <router-link to="/board" class="btn-outline">목록</router-link>
          <div class="right-actions" v-if="isOwner">
            <router-link :to="'/board/' + post.id + '/edit'" class="btn-secondary">수정</router-link>
            <button class="btn-danger" @click="handleDelete">삭제</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue'
import { boardAPI } from '../api/board'
import { mapGetters } from 'vuex'

export default {
  name: 'BoardDetail',
  components: { NavBar },
  data() { return { post: null, loading: false, error: null } },
  computed: {
    ...mapGetters('auth', ['user']),
    isOwner() { return this.post && this.user && this.post.author === this.user.username }
  },
  created() { this.fetchDetail() },
  methods: {
    async fetchDetail() {
      this.loading = true; this.error = null
      try { const { data } = await boardAPI.getDetail(this.$route.params.id); this.post = data }
      catch { this.error = '게시글을 불러오지 못했습니다.' }
      finally { this.loading = false }
    },
    async handleDelete() {
      if (!confirm('정말 삭제하시겠습니까?')) return
      try { await boardAPI.delete(this.post.id); this.$router.push('/board') }
      catch { alert('삭제에 실패했습니다.') }
    },
    formatDate(d) { return d ? new Date(d).toLocaleString('ko-KR') : '-' }
  }
}
</script>

<style scoped>
.container { max-width: 960px; margin: 0 auto; padding: 2rem 1.5rem; }
.state-box { display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 4rem; background: #fff; border-radius: 12px; box-shadow: var(--shadow); }
.state-box.error { color: var(--danger); }
.spinner-lg { width: 36px; height: 36px; border: 3px solid var(--gray-200); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.detail-card { background: #fff; border-radius: 12px; box-shadow: var(--shadow); overflow: hidden; }
.detail-header { padding: 1.75rem 2rem 1.25rem; border-bottom: 1px solid var(--gray-100); }
.detail-title { font-size: 1.4rem; font-weight: 700; color: var(--gray-900); margin-bottom: 0.75rem; }
.detail-meta { display: flex; gap: 1.25rem; font-size: 0.88rem; color: var(--gray-500); }
.detail-body { padding: 2rem; min-height: 240px; font-size: 0.97rem; line-height: 1.8; color: var(--gray-700); white-space: pre-wrap; word-break: break-word; }
.detail-actions { display: flex; align-items: center; justify-content: space-between; padding: 1.25rem 2rem; border-top: 1px solid var(--gray-100); background: var(--gray-50); }
.right-actions { display: flex; gap: 0.5rem; }
.btn-outline { padding: 0.45rem 1rem; border: 1.5px solid var(--gray-300); border-radius: var(--radius); background: none; color: var(--gray-600); font-size: 0.9rem; font-weight: 500; display: inline-block; }
.btn-secondary { padding: 0.45rem 1rem; border: 1.5px solid var(--primary); border-radius: var(--radius); background: none; color: var(--primary); font-size: 0.9rem; font-weight: 500; display: inline-block; }
.btn-danger { padding: 0.45rem 1rem; background: var(--danger); color: #fff; border: none; border-radius: var(--radius); font-size: 0.9rem; font-weight: 500; }
.btn-danger:hover { background: #b91c1c; }
</style>
