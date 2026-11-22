import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/', // '/' y no './': con './' las rutas profundas (/blog/5, /admin/...) no encuentran los JS al recargar
  plugins: [react()],
  // base: 'https://github.com/niver01/lc-project-front-'
})
