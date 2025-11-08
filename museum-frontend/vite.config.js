import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ignorer les vérifications de version de Node.js
  optimizeDeps: {
    force: true
  },
  // Spécifier un port personnalisé
  server: {
    port: 3000,
    strictPort: false
  }
})
