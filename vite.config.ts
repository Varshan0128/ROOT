import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Simple path resolution
const root = process.cwd();

export default defineConfig({
  publicDir: 'public',
  base: '/',
  resolve: {
    alias: {
      '@': resolve(root, 'src')
    }
  },
  server: {
    port: 3000,
    open: '/', // Open the root path
    strictPort: true,
    fs: {
      strict: true,
      allow: ['..']
    }
  },
  plugins: [
    react(),
    {
      name: 'prevent-early-access-form',
      configureServer(server) {
        return () => {
          server.middlewares.use((req: any, res: any, next: () => void) => {
            // Redirect any direct access to early-access-form.html to the root
            if (req.url === '/early-access-form.html') {
              res.writeHead(302, { 'Location': '/' });
              res.end();
              return;
            }
            next();
          });
        };
      }
    }
  ],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo: { name: string | undefined }) => {
          if (assetInfo.name === 'main.js') return 'assets/js/main.js';
          return 'assets/[ext]/[name]-[hash][extname]';
        }
      }
    }
  }
});
