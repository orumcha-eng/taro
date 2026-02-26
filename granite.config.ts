import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'ai-secret-tarot',
  brand: {
    displayName: 'AI 시크릿 타로',
    primaryColor: '#ff4da6',
    // Brand logo shown in Toss mini-app navigation bar
    icon: 'https://taro-brown-kappa.vercel.app/images/master_1.png',
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite',
      build: 'vite build',
    },
  },
  permissions: [],
  outdir: 'dist',
});
