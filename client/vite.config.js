import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests to tuserapi
      '/api': {
        target: 'https://tuserapi.vercel.app/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // Proxy API requests to finalbakend
      '/finalapi': {
        target: 'https://finalbakend.vercel.app/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/finalapi/, ''),
      },
    },
  },
})
