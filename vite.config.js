import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    strictPort: true, // Fail if 5173 is busy instead of bumping to 5174
    watch: {
      ignored: ['**/server/**', '**/uploads/**', '**/dist/**']
    }
  },
})



