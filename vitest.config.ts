import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    include: [
      '__tests__/units/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    globals: true,
    setupFiles: [path.resolve(__dirname, './__tests__/vitest.setup.ts')],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@email': path.resolve(__dirname, './emails'),
      '@app': path.resolve(__dirname, './app'),
      '@tests': path.resolve(__dirname, './__tests__'),
    },
  },
})
