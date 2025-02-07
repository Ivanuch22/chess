import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  // build: {
  //   target: 'esnext',
  //   lib: {
  //     entry: resolve(__dirname, 'src/index.ts'),
  //     name: 'TheChessboard',
  //     formats: ['es'],
  //   },
  //   rollupOptions: {
  //     external: ['vue'],
  //     output: {
  //       globals: {
  //         vue: 'Vue',
  //       },
  //     },
  //   },
  // },
  build: {
    target: 'esnext',
    outDir: 'dist',
    emptyOutDir: true,
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
