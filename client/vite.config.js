import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Load the environment variables from .env file
import dotenv from 'dotenv'

// Load the environment variables
dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API requests using the environment variable
      '/api': {
        target: process.env.VITE_API_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // Proxy API requests using another environment variable
      '/finalapi': {
        target: process.env.VITE_FINAL_API_URL,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/finalapi/, ''),
      },
    },
  },
})
