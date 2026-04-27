const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,

  // 운영 빌드 시 소스맵 비활성화 (보안)
  productionSourceMap: false,

  devServer: {
    proxy: {
      '/api':     { target: 'http://localhost:8080', changeOrigin: true },
      '/auth':    { target: 'http://localhost:8080', changeOrigin: true },
      '/captcha': { target: 'http://localhost:8080', changeOrigin: true }
    }
  }
})
