<template>
  <div>
    <NavBar />
    <div class="container">
      <div class="page-header">
        <h2>게시글 목록</h2>
        <router-link to="/board/write" class="btn-primary">글쓰기</router-link>
      </div>

      <div v-if="loading" class="state-box"><div class="spinner-lg"></div><p>불러오는 중...</p></div>
      <div v-else-if="error" class="state-box error"><p>{{ error }}</p><button class="btn-outline" @click="fetchList">다시 시도</button></div>
      <div v-else-if="posts.length === 0" class="state-box">
        <p class="empty-icon">📝</p><p>아직 게시글이 없습니다.</p>
        <router-link to="/board/write" class="btn-primary" style="margin-top:0.5rem">첫 글 작성하기</router-link>
      </div>

      <div v-else class="table-wrap">
        <table class="board-table">
          <thead>
            <tr>
              <th class="col-num">번호</th>
              <th class="col-title">제목</th>
              <th class="col-author">작성자</th>
              <th class="col-date">날짜</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in posts" :key="post.id"
              @click="$router.push('/board/' + post.id)" class="board-row">
              <td class="col-num">{{ post.id }}</td>
              <td class="col-title"><span class="post-title">{{ post.title }}</span></td>
              <td class="col-author">{{ post.author }}</td>
              <td class="col-date">{{ formatDate(post.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
        <div class="pagination">
          <button class="page-btn" :disabled="page === 0" @click="changePage(page - 1)">&larr;</button>
          <span class="page-info">{{ page + 1 }} / {{ totalPages }}</span>
          <button class="page-btn" :disabled="page >= totalPages - 1" @click="changePage(page + 1)">&rarr;</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue'
import { boardAPI } from '../api/board'

export default {
  name: 'BoardList',
  components: { NavBar },
  data() {
    return { posts: [], page: 0, size: 10, totalPages: 1, loading: false, error: null }
  },
  created() { this.fetchList() },
  methods: {
    async fetchList() {
      this.loading = true; this.error = null
      try {
        const { data } = await boardAPI.getList({ page: this.page, size: this.size })
        this.posts = data.content
        this.totalPages = data.totalPages || 1
      } catch { this.error = '게시글을 불러오지 못했습니다.' }
      finally { this.loading = false }
    },
    changePage(p) { this.page = p; this.fetchList() },
    formatDate(d) { return d ? new Date(d).toLocaleDateString('ko-KR') : '-' }
  }
}
</script>

<style scoped>
.container { max-width: 960px; margin: 0 auto; padding: 2rem 1.5rem; }
.page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
.page-header h2 { font-size: 1.4rem; font-weight: 700; color: var(--gray-900); }
.btn-primary { padding: 0.5rem 1.1rem; background: var(--primary); color: #fff; border: none; border-radius: var(--radius); font-size: 0.9rem; font-weight: 600; transition: background 0.2s; display: inline-block; }
.btn-primary:hover { background: var(--primary-dark); }
.btn-outline { padding: 0.5rem 1.1rem; background: none; color: var(--primary); border: 1.5px solid var(--primary); border-radius: var(--radius); font-size: 0.9rem; font-weight: 600; }
.state-box { display: flex; flex-direction: column; align-items: center; gap: 0.75rem; padding: 4rem 2rem; background: #fff; border-radius: 12px; box-shadow: var(--shadow); color: var(--gray-500); text-align: center; }
.state-box.error { color: var(--danger); }
.empty-icon { font-size: 2.5rem; }
.spinner-lg { width: 36px; height: 36px; border: 3px solid var(--gray-200); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.table-wrap { background: #fff; border-radius: 12px; box-shadow: var(--shadow); overflow: hidden; }
.board-table { width: 100%; border-collapse: collapse; }
.board-table th { background: var(--gray-50); padding: 0.8rem 1rem; text-align: left; font-size: 0.82rem; font-weight: 600; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid var(--gray-200); }
.board-row { cursor: pointer; transition: background 0.15s; border-bottom: 1px solid var(--gray-100); }
.board-row:last-child { border-bottom: none; }
.board-row:hover { background: var(--primary-light); }
.board-table td { padding: 0.9rem 1rem; font-size: 0.92rem; color: var(--gray-700); }
.col-num { width: 70px; color: var(--gray-400); font-size: 0.85rem; }
.col-author { width: 110px; }
.col-date { width: 110px; }
.post-title { color: var(--gray-900); font-weight: 500; }
.pagination { display: flex; align-items: center; justify-content: center; gap: 1rem; padding: 1rem; border-top: 1px solid var(--gray-100); }
.page-btn { padding: 0.4rem 0.9rem; border: 1.5px solid var(--gray-200); border-radius: 6px; background: none; font-size: 0.9rem; color: var(--gray-600); transition: all 0.2s; }
.page-btn:hover:not(:disabled) { border-color: var(--primary); color: var(--primary); }
.page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.page-info { font-size: 0.88rem; color: var(--gray-500); min-width: 60px; text-align: center; }
</style>
