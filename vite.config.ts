import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { quizApi } from './server/quizApi'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const port = Number(process.env.PORT || 8443)

export default defineConfig({
  plugins: [react(), tailwindcss(), quizApi()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: { fs: { deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**', '**/data/**'] }, host: '0.0.0.0', port, strictPort: true },
  preview: { host: '0.0.0.0', port },
})
