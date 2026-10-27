import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Bandari unayotumia kwa ajili ya frontend
    // Kama unataka kuunganisha moja kwa moja na backend yako ya port 5000, 
    // unaweza kuongeza proxy hapa chini kama utahitaji:
    /*
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
    */
  }
})
