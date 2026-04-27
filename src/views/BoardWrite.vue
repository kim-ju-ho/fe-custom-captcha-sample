<template>
  <div>
    <NavBar />
    <div class="container">
      <div class="write-card">
        <div class="write-header">
          <h2>{{ isEdit ? '게시글 수정' : '게시글 작성' }}</h2>
        </div>
        <form @submit.prevent="handleSubmit" class="write-form">
          <div class="field">
            <label for="title">제목</label>
            <input id="title" v-model="form.title" type="text"
              placeholder="제목을 입력하세요" maxlength="100"
              :disabled="loading" required />
          </div>
          <div class="field">
            <label for="content">내용</label>
            <textarea id="content" v-model="form.content"
              placeholder="내용을 입력하세요" rows="14"
              :disabled="loading" required></textarea>
          </div>
          <div v-if="error" class="error-msg">{{ error }}</div>
          <div class="form-actions">
            <router-link :to="isEdit ? '/board/' + $route.params.id : '/board'" class="btn-cancel">취소</router-link>
            <button type="submit" class="btn-submit" :disabled="loading">
              <span v-if="loading" class="spinner"></span>
              {{ loading ? '저장 중...' : (isEdit ? '수정 완료' : '작성 완료') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '../components/NavBar.vue'
import { boardAPI } from '../api/board'

export default {
  name: 'BoardWrite',
  components: { NavBar },
  data() { return { form: { title: '', content: '' }, loading: false, error: null } },
  computed: { isEdit() { return !!this.$route.params.id } },
  created() { if (this.isEdit) this.loadPost() },
  methods: {
    async loadPost() {
      this.loading = true
      try { const { data } = await boardAPI.getDetail(this.$route.params.id); this.form.title = data.title; this.form.content = data.content }
      catch { this.error = '게시글을 불러오지 못했습니다.' }
      finally { this.loading = false }
    },
    async handleSubmit() {
      this.loading = true; this.error = null
      try {
        if (this.isEdit) {
          await boardAPI.update(this.$route.params.id, this.form)
          this.$router.push('/board/' + this.$route.params.id)
        } else {
          const { data } = await boardAPI.create(this.form)
          this.$router.push('/board/' + data.id)
        }
      } catch (err) { this.error = err.response?.data?.message || '저장에 실패했습니다.' }
      finally { this.loading = false }
    }
  }
}
</script>

<style scoped>
.container { max-width: 800px; margin: 0 auto; padding: 2rem 1.5rem; }
.write-card { background: #fff; border-radius: 12px; box-shadow: var(--shadow); overflow: hidden; }
.write-header { padding: 1.5rem 2rem; border-bottom: 1px solid var(--gray-100); }
.write-header h2 { font-size: 1.2rem; font-weight: 700; color: var(--gray-900); }
.write-form { padding: 1.75rem 2rem; display: flex; flex-direction: column; gap: 1.25rem; }
.field { display: flex; flex-direction: column; gap: 0.4rem; }
.field label { font-size: 0.85rem; font-weight: 600; color: var(--gray-700); }
.field input, .field textarea { padding: 0.65rem 0.9rem; border: 1.5px solid var(--gray-200); border-radius: var(--radius); font-size: 0.95rem; transition: border-color 0.2s; outline: none; background: var(--gray-50); resize: vertical; }
.field input:focus, .field textarea:focus { border-color: var(--primary); background: #fff; }
.field input:disabled, .field textarea:disabled { opacity: 0.6; }
.error-msg { background: var(--danger-light); color: var(--danger); border-radius: var(--radius); padding: 0.6rem 0.9rem; font-size: 0.88rem; border: 1px solid #fecaca; }
.form-actions { display: flex; justify-content: flex-end; gap: 0.75rem; padding-top: 0.5rem; }
.btn-cancel { padding: 0.6rem 1.2rem; border: 1.5px solid var(--gray-300); border-radius: var(--radius); background: none; color: var(--gray-600); font-size: 0.92rem; font-weight: 500; display: inline-block; }
.btn-submit { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.4rem; background: var(--primary); color: #fff; border: none; border-radius: var(--radius); font-size: 0.92rem; font-weight: 600; transition: background 0.2s; }
.btn-submit:hover:not(:disabled) { background: var(--primary-dark); }
.btn-submit:disabled { opacity: 0.7; cursor: not-allowed; }
.spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
