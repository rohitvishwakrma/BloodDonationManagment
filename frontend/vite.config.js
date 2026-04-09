import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:3000', changeOrigin: true },
      '/admin': { target: 'http://localhost:3000', changeOrigin: true },
      '/donor': { target: 'http://localhost:3000', changeOrigin: true },
      '/bank': { target: 'http://localhost:3000', changeOrigin: true },
      '/camp': { target: 'http://localhost:3000', changeOrigin: true },
      '/availability': { target: 'http://localhost:3000', changeOrigin: true }
    }
  }
})