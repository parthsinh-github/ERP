import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
    base: './',  // ✅ ADD THIS LINE HERE
  plugins: [
    react(),
    compression({
      ext: '.gz',
      algorithm: 'gzip',
      filter: /\.(js|mjs|json|css|html|svg)$/i,
    }),
        visualizer({ open: true }) // ✅ moved here
  ],
  
    css: {
    postcss: './postcss.config.js', // optional but explicit
  },
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  build: {
    sourcemap: true,
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      mangle: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-redux', '@reduxjs/toolkit'],
          router: ['react-router-dom'],
        },
      },
    },
  },
});

