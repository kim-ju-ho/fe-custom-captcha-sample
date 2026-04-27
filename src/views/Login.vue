<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <div class="logo">📋</div>
        <h1>게시판</h1>
        <p>계속하려면 로그인하세요</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form" autocomplete="off">
        <div class="field">
          <label for="username">아이디</label>
          <input id="username" v-model="form.username" type="text"
            placeholder="아이디를 입력하세요" autocomplete="username"
            :disabled="loading" required />
        </div>

        <div class="field">
          <label for="password">비밀번호</label>
          <input id="password" v-model="form.password" type="password"
            placeholder="비밀번호를 입력하세요" autocomplete="current-password"
            :disabled="loading" required />
        </div>

        <div class="field">
          <label>보안 문자</label>
          <div class="captcha-row">
            <!-- img src에 직접 URL 사용 (blob 불필요) -->
            <img
              v-if="captchaUrl"
              :src="captchaUrl"
              alt="캡챠 이미지"
              class="captcha-img"
              @click="refreshCaptcha"
              title="클릭하면 새로고침"
            />
            <div v-else class="captcha-placeholder">로딩 중...</div>
            <button type="button" class="btn-refresh" @click="refreshCaptcha" :disabled="captchaLoading">
              🔄
            </button>
          </div>
          <input v-model="form.captcha" type="text"
            placeholder="위 문자를 입력하세요 (대소문자 무관)"
            maxlength="6" autocomplete="off"
            :disabled="loading" required />
        </div>

        <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
        <div v-if="isRateLimited" class="warn-msg">너무 많은 시도가 감지됐습니다. 잠시 후 다시 시도하세요.</div>

        <button type="submit" class="btn-login" :disabled="loading || isRateLimited || !form.captchaToken">
          <span v-if="loading" class="spinner"></span>
          {{ loading ? '로그인 중...' : '로그인' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import axios from 'axios'

export default {
  name: 'LoginPage',
  data() {
    return {
      form: {
        username: '',
        password: '',
        captcha: '',
        captchaToken: ''
      },
      captchaUrl: '',
      captchaLoading: false,
      loading: false,
      errorMsg: '',
      isRateLimited: false
    }
  },
  created() {
    this.refreshCaptcha()
  },
  methods: {
    ...mapActions('auth', ['login']),

    async refreshCaptcha() {
      this.captchaLoading = true
      this.form.captcha = ''
      this.form.captchaToken = ''
      this.captchaUrl = ''
      try {
        // 1. 토큰 먼저 발급
        const { data } = await axios.get('/captcha/token')
        this.form.captchaToken = data.tokenKey

        // 2. 토큰으로 img src 직접 설정 (blob 불필요)
        this.captchaUrl = `/captcha/image?token=${data.tokenKey}&t=${Date.now()}`
      } catch {
        this.errorMsg = '캡챠 이미지를 불러오지 못했습니다.'
      } finally {
        this.captchaLoading = false
      }
    },

    async handleLogin() {
      this.errorMsg = ''
      this.isRateLimited = false
      this.loading = true
      try {
        await this.login(this.form)
        const redirect = this.$route.query.redirect || '/board'
        this.$router.push(redirect)
      } catch (err) {
        const status = err.response?.status
        const message = err.response?.data?.message
        if (status === 429) {
          this.isRateLimited = true
        } else {
          this.errorMsg = message || '로그인에 실패했습니다.'
        }
        this.refreshCaptcha()
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%); padding: 1rem; }
.login-card { background: #fff; border-radius: 16px; box-shadow: var(--shadow-lg); padding: 2.5rem 2rem; width: 100%; max-width: 400px; }
.login-header { text-align: center; margin-bottom: 2rem; }
.logo { font-size: 3rem; margin-bottom: 0.75rem; }
.login-header h1 { font-size: 1.5rem; font-weight: 700; color: var(--gray-900); margin-bottom: 0.25rem; }
.login-header p { color: var(--gray-500); font-size: 0.9rem; }
.login-form { display: flex; flex-direction: column; gap: 1rem; }
.field { display: flex; flex-direction: column; gap: 0.4rem; }
.field label { font-size: 0.85rem; font-weight: 600; color: var(--gray-700); }
.field input { padding: 0.65rem 0.9rem; border: 1.5px solid var(--gray-200); border-radius: var(--radius); font-size: 0.95rem; transition: border-color 0.2s; outline: none; background: var(--gray-50); }
.field input:focus { border-color: var(--primary); background: #fff; }
.field input:disabled { opacity: 0.6; }
.captcha-row { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem; }
.captcha-img { border: 1.5px solid var(--gray-200); border-radius: var(--radius); cursor: pointer; display: block; height: 70px; transition: opacity 0.2s; }
.captcha-img:hover { opacity: 0.85; }
.captcha-placeholder { height: 70px; flex: 1; border: 1.5px solid var(--gray-200); border-radius: var(--radius); display: flex; align-items: center; justify-content: center; font-size: 0.85rem; color: var(--gray-400); }
.btn-refresh { background: none; border: 1.5px solid var(--gray-200); border-radius: var(--radius); padding: 0.4rem 0.6rem; font-size: 1rem; cursor: pointer; transition: border-color 0.2s; }
.btn-refresh:hover:not(:disabled) { border-color: var(--primary); }
.btn-refresh:disabled { opacity: 0.5; cursor: not-allowed; }
.error-msg { background: var(--danger-light); color: var(--danger); border-radius: var(--radius); padding: 0.6rem 0.9rem; font-size: 0.88rem; border: 1px solid #fecaca; }
.warn-msg { background: #fffbeb; color: #92400e; border-radius: var(--radius); padding: 0.6rem 0.9rem; font-size: 0.88rem; border: 1px solid #fde68a; }
.btn-login { display: flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 0.75rem; background: var(--primary); color: #fff; border: none; border-radius: var(--radius); font-size: 1rem; font-weight: 600; transition: background 0.2s; margin-top: 0.5rem; }
.btn-login:hover:not(:disabled) { background: var(--primary-dark); }
.btn-login:disabled { opacity: 0.7; cursor: not-allowed; }
.spinner { width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
