import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { 
    proxy: {
      '/api': {
        target: 'http://localhost:5000', 
      },
    },
    watch: {
      ignored: [
        '**/node_modules/**',  // Ignore files inside the node_modules directory
        '**/dist/**',           // Ignore build output directory
        '**/public/**',         // Ignore files in the public folder
        '**/*.md',              // Ignore markdown files
        '**/*.log',             // Ignore log files
      ],
    },
  },
})
