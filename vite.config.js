import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    hmr: {
      overlay: false, // 禁用 HMR 错误覆盖层，这样控制台警告就不会显示在界面上
    },
  },
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
})
