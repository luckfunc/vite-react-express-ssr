// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist/client',
    manifest: true, // 生产环境生成 manifest.json
    rollupOptions: {
      input: {
        home: path.resolve(__dirname, 'src/pages/home/index.tsx'),
        about: path.resolve(__dirname, 'src/pages/about/index.tsx'),
        contact: path.resolve(__dirname, 'src/pages/contact/index.tsx'),
      },
      output: {
        entryFileNames: 'assets/[name].js', // 可以带 hash 也可以固定
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  resolve: {
    alias: {
      '@pages': path.resolve(__dirname, './src/pages'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  ssr: {
    noExternal: ['react', 'react-dom', 'react-router-dom'],
  },
});
