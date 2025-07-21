import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  optimizeDeps: {
    exclude: ['lucide-react'],
  },

  base: '/',

  // Tüm build ayarları bu blok altında birleştirildi
  build: {
    outDir: 'dist',
    
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Resim dosyalarını 'assets/images' klasörüne, diğerlerini 'assets' klasörüne ayırır
          const info = assetInfo.name.split('.');
          const extType = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },

    // 4kb'dan küçük resimleri doğrudan koda gömer
    assetsInlineLimit: 4096,
  },

  // Vite'ın hangi dosya türlerini asset olarak tanıması gerektiğini belirtir
  assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.svg', '**/*.webp'],
});