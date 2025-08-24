import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { glob } from 'glob';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    outDir: 'dist/client',
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: Object.fromEntries(
        glob.sync('src/pages/**/client.tsx').map(file => [
          // This will produce an entry name like 'home' or 'about' from 'src/pages/home/client.tsx'
          path.relative('src/pages', file.slice(0, file.length - path.extname(file).length)).replace('/client', ''),
          // This resolves the absolute path to the entry file
          path.resolve(__dirname, file)
        ])
      ),
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
});
