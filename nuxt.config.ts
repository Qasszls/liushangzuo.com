import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-02-19',
  devtools: { enabled: true },

  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxt/content',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    'nuxt-studio',
  ],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  colorMode: {
    classSuffix: '',
  },

  nitro: {
    prerender: {
      crawlLinks: true,
    },
  },

  content: {},

  studio: {
    repository: {
      provider: 'github',
      owner: 'Qasszls',
      repo: 'liushangzuo.com',
      branch: 'main',
    },
  },

  image: {
    quality: 80,
    format: ['webp', 'jpg', 'png'],
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      htmlAttrs: { lang: 'zh-CN' },
    },
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  typescript: {
    strict: true,
  },
})
