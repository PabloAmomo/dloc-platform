import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  publicDir: 'public',
  plugins: [react()],
  resolve: {
    alias: {
      components: '/src/components',
      config: '/src/config',
      enums: '/src/enums',
      functions: '/src/functions',
      hooks: '/src/hooks',
      languages: '/src/languages',
      models: '/src/models',
      pages: '/src/pages',
      providers: '/src/providers',
      routesApp: '/src/routesApp',
      services: '/src/services',
      styles: '/src/styles',
      webWorkers: '/src/webWorkers',
    },
  },
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
  },
  preview: {
    port: 3000,
    strictPort: true,
   },
   server: {
    port: 3000,
    strictPort: true,
    host: true,
    origin: "http://0.0.0.0:3000",
   },
});
