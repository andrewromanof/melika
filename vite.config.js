import { defineConfig } from 'vite'

const buildId = Date.now().toString()

export default defineConfig({
  base: './',
  define: {
    __BUILD_ID__: JSON.stringify(buildId),
  },
})
