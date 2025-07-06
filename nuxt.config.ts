// https://nuxt.com/docs/api/configuration/nuxt-config
export default {
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  modules: ['@nuxt/eslint', '@nuxt/icon', '@nuxt/image', '@nuxt/test-utils', '@nuxtjs/tailwindcss', '@pinia/nuxt'],

  pinia: {
    storesDirs: ['./stores/**', './modules/*/_stores/**'],
  },

  tailwindcss: {
    config: {
      content: [
        './components/**/*.{js,vue,ts}',
        './modules/**/_components/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './app.vue',
        './error.vue',
      ],
      theme: {
        extend: {
          colors: {
            ring: '#3b82f6',
            background: '#ffffff',
          },
        },
      },
      plugins: [],
    },
  },
  
  plugins: [
    '~/plugins/vue-query.ts',
  ],

  imports: {
    dirs: ['composables', 'modules/*/_composables', 'stores'],
  },

  components: ['~/components', '~/components/ui', '~/modules/todo/_components'],
};
