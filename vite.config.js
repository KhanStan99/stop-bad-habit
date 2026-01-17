import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo64.png', 'logo192.png', 'logo512.png'],
      manifest: {
        short_name: 'Bad Habits',
        name: 'Cut down your bad habits!',
        icons: [
          {
            src: 'logo64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'logo192.png',
            type: 'image/png',
            sizes: '192x192',
          },
          {
            src: 'logo512.png',
            type: 'image/png',
            sizes: '512x512',
          },
        ],
        start_url: '.',
        display: 'standalone',
        theme_color: '#2F3B52',
        background_color: '#ffffff',
      },
    }),
  ],
});
