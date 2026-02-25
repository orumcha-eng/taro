import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'ai-secret-tarot',
  brand: {
    displayName: 'AI 시크릿 타로',
    primaryColor: '#ff4da6',
    icon: '', // TODO: 앱 아이콘 이미지 URL 등록
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
