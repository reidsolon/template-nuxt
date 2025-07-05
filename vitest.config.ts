import { defineVitestConfig } from '@nuxt/test-utils/config';
import Vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';

export default defineVitestConfig({
  plugins: [Vue, AutoImport({ imports: ['vue'] })],
  test: {
    environment: 'nuxt',
    globals: true,
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html'],
    },

    server: {
      deps: {
        inline: ['vuetify'],
      },
    },
  },
});
