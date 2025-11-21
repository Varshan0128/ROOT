import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  publicDir: 'public',
  base: '/',
  server: {
    port: 0,
    open: false,         // <- changed to prevent automatic opening
    strictPort: false
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'public/early-access-form.html'),
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'main.js') return 'assets/js/main.js';
          return 'assets/[ext]/[name]-[hash][extname]';
        }
      }
    }
  },
  plugins: [{
    name: 'static-assets',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/assets/js/main.js') {
          req.url = '/main.js';
        }
        next();
      });
    }
  }]
});
